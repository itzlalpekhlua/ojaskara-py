# Deploying

Two ways to host this, pick one:

- **[Option A — VPS, single server](#option-a-vps-single-server-recommended)**
  (e.g. with CloudPanel). One process, one port, everything in one place.
  This is how the app was built and is the most tested, most reliable path.
- **[Option B — Vercel (frontend) + a separate backend host](#option-b-vercel-frontend--separate-backend)**.
  Splits the two halves across two hosts. Works, but has real constraints
  (below) that Option A doesn't have — read that section before choosing it.

Either way, the backend's `database/` folder (plain JSON files + uploaded
images — see [README.md](README.md)) needs to live on a host with a real,
persistent disk. **It cannot run on Vercel itself** — Vercel's Python/Node
functions are stateless and don't keep local files between requests. Vercel
can only ever host the *frontend* half of this app.

---

## Option A: VPS, single server (recommended)

This app is one process (FastAPI, managing Next.js internally). The most
reliable way to run "one process" under CloudPanel is to **not** use
CloudPanel's built-in Python or Node.js site types — they each assume a
single, simple app and don't expect that app to spawn another server as a
child process. Instead:

- Use a **Reverse Proxy** site in CloudPanel (just Nginx + free SSL, pointed
  at a local port) — this part of CloudPanel is generic and version-stable.
- Run the actual app yourself as a plain **systemd service** — full control,
  auto-restart on crash/reboot, standard on every Linux box.

This sidesteps any CloudPanel-version-specific quirks around Python/Node app
handling entirely, and is the standard pattern for "custom" apps on VPS
control panels in general. (Not using CloudPanel? Skip straight to step 2 —
everything from there on is plain Linux/systemd/Nginx, no CloudPanel needed.)

### 0. Prerequisites

- A VPS with CloudPanel already installed. If not: follow the one-line
  installer at [cloudpanel.io](https://www.cloudpanel.io/docs/v2/getting-started/installation/)
  (Ubuntu 22.04/24.04 or Debian 11/12 recommended).
- Your domain's DNS **A record** pointed at the VPS's IP address (do this
  first — SSL issuance later needs it to have already propagated).
- SSH access to the VPS (CloudPanel gives you a non-root sudo user).

### 1. Create the site in CloudPanel

CloudPanel admin UI (usually `https://YOUR_SERVER_IP:8443`) →
**Sites → Add Site → Reverse Proxy**:

- **Domain**: `yourdomain.com`
- **Reverse Proxy URL**: `http://127.0.0.1:8000` (matches `PORT=8000` below —
  use a different port here and in the systemd file if 8000 is already
  taken on your server)

Create the site, then go to that site's **SSL/TLS** tab and issue a free
Let's Encrypt certificate (only works once DNS has propagated).

Note the **site user** CloudPanel created (shown on the site's Overview tab,
something like `yourdomain-com`) — you'll use it below. CloudPanel also
created `/home/<site-user>/htdocs/yourdomain.com/`, which is where the code
goes.

### 2. Install Node.js and confirm Python on the server

SSH into the VPS as root or a sudo user:

```bash
# Node.js 20 LTS (needed to run Next.js) — system-wide, so it's on PATH
# for any user/service, not tied to CloudPanel's own Node site tooling.
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

node -v     # should print v20.x
python3 -V  # CloudPanel ships Python 3.10+ already; 3.10 or newer is fine
```

### 3. Upload the code

As the site user (or root, then `chown -R <site-user>:<site-user>` after):

```bash
su - <site-user>
cd ~/htdocs/yourdomain.com

# Option A — git (recommended if your code is in a repo)
git clone <your-repo-url> .

# Option B — from your own machine, rsync the ojpython folder over instead:
#   rsync -avz --exclude node_modules --exclude venv --exclude .next \
#     "ojpython/" user@your-vps:~/htdocs/yourdomain.com/
```

You should now have `~/htdocs/yourdomain.com/backend/` and `.../frontend/`.

#### Bring your real content over

`backend/database/*.json` and `backend/database/images/` are gitignored on
purpose (they're your live data, not sample code). If you're migrating from
a local dev copy that already has real projects/testimonials/photos in it,
copy that folder over separately — don't start from an empty database on a
fresh clone unless you mean to:

```bash
# from your own machine
rsync -avz backend/database/ user@your-vps:~/htdocs/yourdomain.com/backend/database/
```

### 4. Set up the backend (Python)

```bash
cd ~/htdocs/yourdomain.com/backend
python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt
cp .env.example .env   # then edit it — see step 6
```

### 5. Set up the frontend (Next.js) — build it now, not on first boot

```bash
cd ~/htdocs/yourdomain.com/frontend
npm install
npm run build
```

Pre-building avoids a slow (and systemd-timeout-risking) first request; the
app will still auto-build on startup if `.next/BUILD_ID` is ever missing, but
don't rely on that in production.

### 6. Generate a real production secret

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Copy the output — you'll paste it into the systemd file next. **Don't reuse
a secret from local development.**

### 7. Install the systemd service

Copy [`deploy/ojaskaraa.service`](deploy/ojaskaraa.service) to the server and
fill in the three placeholders (`REPLACE_WITH_CLOUDPANEL_SITE_USER`,
`REPLACE_WITH_DOMAIN`, `REPLACE_WITH_A_LONG_RANDOM_SECRET`):

```bash
sudo cp ojaskaraa.service /etc/systemd/system/ojaskaraa.service
sudo nano /etc/systemd/system/ojaskaraa.service   # fill in the placeholders
sudo systemctl daemon-reload
sudo systemctl enable --now ojaskaraa
sudo systemctl status ojaskaraa                   # should say "active (running)"
journalctl -u ojaskaraa -f                        # tail logs live
```

You should see the same startup output as local dev: Next.js readying up,
then `[nextjs] Next.js is ready` and Uvicorn's "Application startup
complete."

Verify locally on the server before touching DNS/Nginx:

```bash
curl -I http://127.0.0.1:8000/api/health
curl -I http://127.0.0.1:8000/
```

Both should return `200`.

### 8. Raise the upload size limit

The admin panel accepts uploads up to 200MB, but Nginx defaults to 1MB.
In CloudPanel, open the site → **Vhost** tab and add inside the `server {}`
block (or use the "Additional Nginx directives" field if offered):

```nginx
client_max_body_size 200M;
```

Save — CloudPanel reloads Nginx automatically.

### 9. Visit the site

`https://yourdomain.com` should now show the homepage, and
`https://yourdomain.com/admin/login` the admin panel. Log in, and from
**Site Settings** or wherever you manage content, everything writes straight
to `backend/database/` on the VPS.

### Updating the app later

```bash
cd ~/htdocs/yourdomain.com
git pull                              # or re-rsync your changed files

cd backend && venv/bin/pip install -r requirements.txt
cd ../frontend && npm install && npm run build

sudo systemctl restart ojaskaraa
```

### Backups

`backend/database/*.json` and `backend/database/images/` are the entire
database — back that one folder up regularly (CloudPanel has a built-in
backup feature you can point at it, or a simple cron `rsync`/`tar` job):

```bash
tar -czf ojaskaraa-backup-$(date +%F).tar.gz -C ~/htdocs/yourdomain.com/backend database
```

### Troubleshooting

- **`journalctl -u ojaskaraa -f` shows `[nextjs] Next.js not installed`** —
  `npm install` wasn't run in `frontend/`, or `WorkingDirectory`/paths in the
  systemd file are wrong.
- **`node: command not found` in the logs** — Node.js isn't on the `PATH`
  the systemd service sees. Check the `Environment=PATH=...` line in the
  service file matches where `which node` actually points on your server.
- **Site loads but images/videos 404** — check `backend/database/images/`
  actually made it to the server (see step 3) and that the site user can
  read it (`chown -R <site-user>:<site-user> backend/database`).
- **502 from Nginx** — the app isn't listening on the port the Reverse Proxy
  site points at. Confirm with `curl 127.0.0.1:8000/api/health` on the
  server and that `PORT` in the systemd file matches the Reverse Proxy URL.
- **Login works locally on the server but not through the domain** — the
  `ADMIN_SESSION_SECRET` in the systemd file doesn't match what the browser's
  cookie was signed with (e.g. you changed it and didn't restart the
  service, or a stale cookie from before a secret rotation). Log out and
  back in.

---

## Option B: Vercel (frontend) + separate backend

**Read this before choosing it.** The public marketing pages work great this
way — they're plain server-rendered fetches, no different from any other
Next.js-on-Vercel site. The **admin panel is the part with real caveats**:

- The login cookie is scoped to a domain. For the frontend (on Vercel) and
  the backend (hosted elsewhere) to share that cookie, **both must be on the
  same parent domain** — e.g. frontend at `app.example.com`, backend at
  `api.example.com`, cookie scoped to `.example.com`. A default
  `*.vercel.app` URL can never work for the admin panel (you don't control
  that domain's DNS zone), only a custom domain does.
- File uploads (the admin panel accepts video up to 200MB) go **directly
  from the browser to the backend's own URL**, bypassing Vercel entirely —
  by design, since Vercel's serverless functions cap request bodies at
  4.5MB, far under what a video upload needs. This already works out of the
  box (see `NEXT_PUBLIC_BACKEND_URL` below); just don't be surprised that
  uploads don't "go through" your Vercel deployment at all.

If that's acceptable, here's the setup:

### 1. Host the backend somewhere with a persistent disk

Any of: the VPS steps in Option A (skip the CloudPanel Reverse Proxy site
and Nginx-specific steps — you just need the systemd service + a domain
pointed at it, e.g. via any reverse proxy or even directly if you're
comfortable exposing the port), or a PaaS with persistent volumes such as
Railway, Render, or Fly.io. Whatever you choose, you need:

- A public URL for it, e.g. `https://api.example.com`.
- `backend/database/` persisted across restarts/redeploys (check your host's
  docs for "persistent volume" / "disk" — without one, all your content and
  uploads vanish on every redeploy).
- Environment variables set on that host:
  ```
  ADMIN_SESSION_SECRET=<a long random string>
  MANAGE_FRONTEND=false
  COOKIE_DOMAIN=.example.com
  PORT=<whatever your host expects — often provided automatically>
  ```
  `MANAGE_FRONTEND=false` tells this backend not to bother building/spawning
  a Next.js process next to itself (there won't be one) — see `main.py`.

### 2. Deploy the frontend to Vercel

- [vercel.com/new](https://vercel.com/new) → import this repo.
- **Root Directory**: `frontend` (Vercel auto-detects Next.js from there;
  no `vercel.json` needed).
- **Environment Variables**:
  ```
  ADMIN_SESSION_SECRET=<the exact same value as the backend's>
  BACKEND_URL=https://api.example.com
  NEXT_PUBLIC_BACKEND_URL=https://api.example.com
  ```
- Deploy. Then in **Settings → Domains**, add `app.example.com` (or whatever
  subdomain you chose) — this is what makes the shared-cookie-domain setup
  above actually work; skip it and you're stuck on a `*.vercel.app` URL.

### 3. Verify

- `https://app.example.com` — public site loads.
- `https://app.example.com/admin/login` — log in. If it silently fails,
  double-check `ADMIN_SESSION_SECRET` matches on both hosts, and that
  `COOKIE_DOMAIN` / your Vercel domain actually share a parent domain.
- Try a file upload from the admin panel — confirm it's reaching
  `https://api.example.com/api/admin/upload` directly (check your browser's
  Network tab), not going through Vercel.
