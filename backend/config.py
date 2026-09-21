import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env")
DATABASE_DIR = BACKEND_DIR / "database"
IMAGES_DIR = DATABASE_DIR / "images"

ADMIN_SESSION_SECRET = os.environ.get("ADMIN_SESSION_SECRET", "dev-only-insecure-secret-change-me")
SESSION_COOKIE_NAME = "admin_session"
SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60  # 7 days

# Only needed for a split deployment (frontend on Vercel, this backend hosted
# separately) on a shared parent domain — e.g. "app.example.com" for the
# frontend and "api.example.com" for this backend. Set to ".example.com" so
# the login cookie is sent to both. Leave unset for single-server hosting
# (frontend and backend on the exact same origin — the default cookie scope
# already covers that).
COOKIE_DOMAIN = os.environ.get("COOKIE_DOMAIN") or None

ALLOWED_UPLOAD_SECTIONS = {
    "hero",
    "categories",
    "designs",
    "design-portfolio",
    "construction-projects",
    "projects",
    "media-coverage",
    "services",
    "team",
    "testimonials",
    "social",
}

MAX_UPLOAD_SIZE_BYTES = 200 * 1024 * 1024  # 200MB

EXT_BY_MIME = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
}

DATABASE_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
