"""Manages the Next.js frontend as a child process, so this one FastAPI/uvicorn
process is the only server anyone has to start. FastAPI serves /api/*, /docs
and /uploads/* directly and reverse-proxies everything else (pages, /_next/*
static assets) to Next.js, running privately on FRONTEND_PORT.

Runs the frontend as a production build (`next build` once, then `next
start`) rather than `next dev` — no HMR/dev-websocket for this proxy to
support, and it's what a finished, single-process deployment should run.
"""
import os
import shutil
import socket
import subprocess
import time
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BACKEND_DIR.parent / "frontend"
FRONTEND_PORT = int(os.environ.get("FRONTEND_INTERNAL_PORT", "4000"))
FRONTEND_BASE_URL = f"http://127.0.0.1:{FRONTEND_PORT}"

# The port THIS FastAPI process is actually bound to. There's no way to ask
# uvicorn for this after the fact, so it must come from the same PORT env var
# used to launch it (see main.py's __main__ block, or set PORT explicitly
# before `uvicorn main:app --port $PORT`). Passed into the Next.js child's
# own environment below so its server-side fetches always reach the right
# place — frontend/.env.local's BACKEND_URL is only a fallback for when this
# process is started with its default port.
BACKEND_PORT = os.environ.get("PORT", "8000")
BACKEND_URL = f"http://127.0.0.1:{BACKEND_PORT}"

_process: subprocess.Popen | None = None


def _port_open(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.5)
        try:
            return sock.connect_ex((host, port)) == 0
        except OSError:
            return False


def _next_bin() -> Path:
    return FRONTEND_DIR / "node_modules" / "next" / "dist" / "bin" / "next"


def _build_if_needed(node: str) -> bool:
    build_marker = FRONTEND_DIR / ".next" / "BUILD_ID"
    if build_marker.exists():
        return True

    print("[nextjs] no production build found — running `next build` (first run only, this can take a minute)...")
    result = subprocess.run(
        [node, str(_next_bin()), "build"],
        cwd=str(FRONTEND_DIR),
        env={**os.environ, "NODE_ENV": "production"},
    )
    if result.returncode != 0:
        print("[nextjs] build failed — see output above. Not starting the frontend.")
        return False
    print("[nextjs] build complete.")
    return True


def start() -> None:
    global _process
    if not FRONTEND_DIR.exists():
        print(f"[nextjs] {FRONTEND_DIR} not found — frontend will not be served")
        return

    next_bin = _next_bin()
    if not next_bin.exists():
        print(f"[nextjs] Next.js not installed ({next_bin} missing) — run `npm install` in frontend/")
        return

    if _port_open(FRONTEND_PORT):
        print(f"[nextjs] something is already listening on {FRONTEND_PORT} — assuming it's Next.js, not starting another")
        return

    node = shutil.which("node") or "node"
    if not _build_if_needed(node):
        return

    env = {
        **os.environ,
        "PORT": str(FRONTEND_PORT),
        "NODE_ENV": "production",
        # Overrides frontend/.env.local's BACKEND_URL — this is the actual
        # port this FastAPI process is bound to, whatever it turned out to be.
        "BACKEND_URL": BACKEND_URL,
    }
    _process = subprocess.Popen(
        [node, str(next_bin), "start", "--hostname", "127.0.0.1", "--port", str(FRONTEND_PORT)],
        cwd=str(FRONTEND_DIR),
        env=env,
        start_new_session=os.name != "nt",  # own process group on POSIX, for clean group-kill in stop()
    )
    print(f"[nextjs] started Next.js production server (pid {_process.pid}) on port {FRONTEND_PORT}, talking to backend at {BACKEND_URL}")

    for _ in range(60):
        if _port_open(FRONTEND_PORT):
            print("[nextjs] Next.js is ready")
            return
        time.sleep(0.5)
    print("[nextjs] warning: Next.js did not come up within 30s")


def stop() -> None:
    global _process
    if _process is None or _process.poll() is not None:
        return
    print("[nextjs] stopping Next.js...")
    try:
        if os.name == "nt":
            # Next spawns its own child processes on Windows; terminate() alone
            # only kills the wrapper and leaves node running.
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(_process.pid)],
                capture_output=True,
            )
        else:
            import signal

            # Kill the whole process group (see start_new_session above) —
            # `next start` can spawn its own worker processes too.
            try:
                os.killpg(os.getpgid(_process.pid), signal.SIGTERM)
                _process.wait(timeout=10)
            except (ProcessLookupError, subprocess.TimeoutExpired):
                try:
                    os.killpg(os.getpgid(_process.pid), signal.SIGKILL)
                except ProcessLookupError:
                    pass
    except Exception as exc:  # best-effort cleanup
        print(f"[nextjs] error while stopping: {exc}")
    _process = None
