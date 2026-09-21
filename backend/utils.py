import re
from pathlib import Path

from config import IMAGES_DIR

UPLOADS_PREFIX = "/uploads/"


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def delete_uploaded_file(url: str | None) -> None:
    """Best-effort delete of a file previously written by the upload route.
    No-ops on anything not under /uploads/ (seeded external URLs, etc)."""
    if not url or not url.startswith(UPLOADS_PREFIX):
        return
    relative = url[len(UPLOADS_PREFIX):]
    resolved = IMAGES_DIR / relative
    try:
        resolved.unlink(missing_ok=True)
    except OSError:
        pass
