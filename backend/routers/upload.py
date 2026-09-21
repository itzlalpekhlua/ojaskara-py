import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import JSONResponse

from config import ALLOWED_UPLOAD_SECTIONS, EXT_BY_MIME, IMAGES_DIR, MAX_UPLOAD_SIZE_BYTES
from deps import require_admin
from utils import slugify

router = APIRouter(prefix="/api/admin/upload", tags=["upload"])


@router.post("")
async def upload(file: UploadFile = File(...), section: str = Form(...), _user: dict = Depends(require_admin)):
    if section not in ALLOWED_UPLOAD_SECTIONS:
        return JSONResponse({"error": "Invalid section"}, status_code=400)

    content_type = file.content_type or ""
    is_image = content_type.startswith("image/")
    is_video = content_type.startswith("video/")
    if not is_image and not is_video:
        return JSONResponse({"error": "File must be an image or video"}, status_code=400)

    ext = EXT_BY_MIME.get(content_type)
    if not ext:
        return JSONResponse({"error": f"Unsupported file type: {content_type}"}, status_code=400)

    data = await file.read()
    if len(data) > MAX_UPLOAD_SIZE_BYTES:
        return JSONResponse({"error": "File is too large (max 200MB)"}, status_code=413)

    base_name = slugify((file.filename or "file").rsplit(".", 1)[0]) or "file"
    filename = f"{base_name}-{uuid.uuid4().hex}.{ext}"

    section_dir = IMAGES_DIR / section
    section_dir.mkdir(parents=True, exist_ok=True)
    (section_dir / filename).write_bytes(data)

    return {"url": f"/uploads/{section}/{filename}", "mediaType": "video" if is_video else "image"}
