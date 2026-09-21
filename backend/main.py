import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import nextjs
from config import IMAGES_DIR
from routers import (
    auth,
    construction_projects,
    cost_estimator,
    design_portfolio,
    enquiries,
    media_coverage,
    projects,
    services,
    settings,
    social,
    team,
    testimonials,
    upload,
)

# Set to "false" when this backend is deployed on its own — e.g. as a
# standalone API service (Railway/Render/Fly/a bare VPS) with the Next.js
# frontend deployed separately on Vercel. In that split setup there's no
# frontend/ folder alongside this one for it to build/run, and nothing
# should be proxied to it. Defaults to on (the single-process, one-port
# mode this app was originally built to run as) — see README.md.
MANAGE_FRONTEND = os.environ.get("MANAGE_FRONTEND", "true").lower() not in ("false", "0", "")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if MANAGE_FRONTEND:
        nextjs.start()
    yield
    if MANAGE_FRONTEND:
        nextjs.stop()


app = FastAPI(title="Ojaskaraa Builders API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Every uploaded file (images/videos saved by the admin panel) lives under
# database/images/<section>/... and is served at /uploads/... — the exact
# same URL shape the original app used for public/uploads/..., so none of
# the frontend's <img>/<video> src values had to change.
app.mount("/uploads", StaticFiles(directory=str(IMAGES_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(enquiries.router)
app.include_router(settings.router)
app.include_router(cost_estimator.router)
app.include_router(projects.router)
app.include_router(construction_projects.router)
app.include_router(design_portfolio.router)
app.include_router(services.router)
app.include_router(team.router)
app.include_router(testimonials.router)
app.include_router(social.router)
app.include_router(media_coverage.router)


@app.get("/api/health")
def health():
    return {"ok": True, "manages_frontend": MANAGE_FRONTEND}


if MANAGE_FRONTEND:
    # Registered LAST: anything above (an /api/* route, /uploads/*, /docs,
    # etc.) is matched first. Everything else — every page, and Next's own
    # /_next/* static assets — falls through to here and is reverse-proxied
    # to the Next.js server this process manages (see nextjs.py). This is
    # what makes running `python main.py` the only command needed on a VPS:
    # one process, one port, serving both the API and the rendered site.
    #
    # With MANAGE_FRONTEND=false (split deployment — frontend on Vercel,
    # this backend hosted on its own), this route is skipped entirely: no
    # unmatched-path proxy, just a plain 404 for anything that isn't /api/*
    # or /uploads/*, which is exactly right for an API-only service.
    from proxy import router as proxy_router

    app.include_router(proxy_router)


if __name__ == "__main__":
    # `python main.py` — the port here and nextjs.BACKEND_PORT both come from
    # the same PORT env var, so they can never drift out of sync. Prefer this
    # over `uvicorn main:app --port X`, which has no way to tell nextjs.py
    # what port it picked; if you do use the uvicorn CLI directly, set PORT
    # to the same value first (e.g. `$env:PORT=8000` on PowerShell).
    import uvicorn

    # HOST defaults to 0.0.0.0 (listen on every interface — fine behind a
    # firewall, and required by most PaaS hosts). Behind a reverse proxy on
    # the same box (CloudPanel/Nginx), set HOST=127.0.0.1 so this port is
    # never reachable directly.
    # proxy_headers + forwarded_allow_ips make uvicorn trust the
    # X-Forwarded-Proto/For that the edge reverse proxy sets, so on the custom
    # domain request.url.scheme is "https" rather than the plain-HTTP hop.
    # FORWARDED_ALLOW_IPS defaults to the loopback address (an Nginx on the
    # same box); set it to the edge's IP, or "*" when only the edge can reach
    # this port at all.
    uvicorn.run(
        "main:app",
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", "8000")),
        proxy_headers=True,
        forwarded_allow_ips=os.environ.get("FORWARDED_ALLOW_IPS", "127.0.0.1"),
    )
