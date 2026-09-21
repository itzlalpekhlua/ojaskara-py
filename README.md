# Ojaskaraa Builders — FastAPI + Next.js, one server

Same site, same admin panel, completely different backend: no Prisma, no
SQLite, no ORM. All data lives in plain JSON files under `backend/database/`,
and all uploaded photos/videos live under `backend/database/images/`.

**One process, one port.** FastAPI is the only thing you start. It serves its
own `/api/*` routes and `/uploads/*` files directly, and internally manages
the Next.js frontend as a child process, reverse-proxying every other request
(pages, `/_next/*` assets) to it. You never run `npm run dev` yourself.

```
ojpython/
  backend/     FastAPI app — routers, JSON "database", uploaded media,
               and the Next.js process manager + reverse proxy
  frontend/    Next.js app — same UI as before, now fetches from the backend
  deploy/      systemd service template for production
```

Deploying? See [DEPLOYMENT.md](DEPLOYMENT.md) — a VPS (e.g. CloudPanel) as one
server, or the frontend on Vercel with the backend hosted separately.

## Running it

```bash
cd backend
python -m venv venv                                # first time only
venv\Scripts\pip install -r requirements.txt        # first time only (Windows)
venv\Scripts\python main.py
```

That's it — visit `http://localhost:8000`. The admin panel is at
`http://localhost:8000/admin/login`.

On first start, if `frontend/` has never been built, it runs `next build`
automatically (takes ~30–60s, one time only) before starting the Next.js
production server on an internal port. Every request to the frontend or its
static assets is proxied through FastAPI, so the browser only ever talks to
port 8000.

**Changing the port:** set `PORT` before starting — e.g. `$env:PORT=1234` on
PowerShell, then `python main.py`. Use `python main.py`, not
`uvicorn main:app --port 1234`: the frontend's server-side code needs to know
which port to call FastAPI back on, and `python main.py` is what keeps that
in sync automatically (it reads the same `PORT` var and passes it into the
Next.js child process). The plain `uvicorn` CLI has no way to tell it that,
so the frontend would try the default (8000) and fail with
`ECONNREFUSED` if FastAPI is actually on a different port.

Or just double-click `backend/start-server.cmd`.

Set `ADMIN_SESSION_SECRET` in `backend/.env` (a long random string — already
generated for you). `frontend/.env.local` needs the exact same value, since
both sides verify the same admin login cookie — the frontend's own
`middleware.ts` checks it locally (no network round-trip) to gate `/admin/*`
pages, and the backend checks it again on every write.

## Logging in

Your existing admin email carries over (`sharmaprashantb321@gmail.com`), but
since passwords can't be migrated (they're one-way hashes), a password has
been set for you:

- Email: `sharmaprashantb321@gmail.com`
- Password: `Ojaskaraa2026`

Change it any time with:

```bash
cd backend
venv\Scripts\python create_admin.py --email=you@example.com --password=your-new-password
```

## Where everything lives

- `backend/database/*.json` — one file per content type (projects, services,
  team, testimonials, social posts, media coverage, enquiries, site settings,
  cost-estimator rates, admin users). Each is just a list (or, for settings,
  a single object) of plain dictionaries — open any of them in a text editor.
- `backend/database/images/<section>/<file>` — every photo and video ever
  uploaded through the admin panel, organized by section exactly like the old
  `public/uploads/<section>/` folder was.
- `backend/routers/` — one FastAPI router per resource, each with the
  create/update/delete/publish/reorder endpoints the admin panel needs.
- `backend/store.py` — the tiny "database engine": atomic JSON read/write,
  ID generation, ordering/reordering helpers. No SQL anywhere.
- `backend/nextjs.py` — starts/stops the Next.js child process (builds it
  once if needed, then `next start`).
- `backend/proxy.py` — the reverse proxy that makes everything answer on one
  port: any request not claimed by an `/api/*` router or the `/uploads`
  mount falls through to here and is forwarded to Next.js.

## How the pieces fit together

- **Public pages** (`frontend/app/(site)/**/page.tsx`) fetch straight from
  the backend's public GET endpoints — no auth needed.
- **Admin pages and Server Actions** (`frontend/app/admin/**`) forward the
  `admin_session` cookie to the backend on every request, so the backend is
  the one actually enforcing who's allowed to write data.
- **Login** (`/api/admin/auth/login`) and **file uploads**
  (`/api/admin/upload`) are handled by FastAPI directly — the browser calls
  them at those exact paths, and since FastAPI's own routes take priority
  over the catch-all proxy, they never even reach Next.js. FastAPI sets the
  session cookie itself on a successful login.
- Every `<img>`/`<video>` in the UI still uses the same `/uploads/...` URL
  shape as before — FastAPI serves those files directly (no proxy hop).

## A note on dev mode

This setup runs the frontend as a **production build** (`next build` +
`next start`), not `next dev`. That's deliberate: the reverse proxy is
HTTP-only, so it can't carry Next's hot-reload WebSocket, and a production
build sidesteps that entirely (faster, and no dev-only overhead). If you're
actively editing frontend code, it's easier to run `npm run dev` in
`frontend/` directly on its own port while iterating, then let this
single-server setup pick up your changes on the next `next build`.
