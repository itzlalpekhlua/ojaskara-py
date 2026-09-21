from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id
from utils import delete_uploaded_file

router = APIRouter(prefix="/api/social-posts", tags=["social"])


@router.get("")
def list_posts():
    rows = store.social_posts.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


class SocialPostBody(BaseModel):
    platform: str = "instagram"
    embedUrl: str
    caption: str | None = None
    thumbnail: str | None = None


@router.post("")
def create_post(body: SocialPostBody, _user: dict = Depends(require_admin)):
    embed_url = body.embedUrl.strip()
    if not embed_url:
        return JSONResponse({"error": "Link is required"}, status_code=400)

    record = {
        "id": gen_id(),
        "platform": body.platform or "instagram",
        "embedUrl": embed_url,
        "caption": body.caption or None,
        "thumbnail": body.thumbnail or None,
        "order": store.social_posts.next_order(),
        "published": True,
    }
    store.social_posts.insert(record)
    return record


@router.put("/{post_id}")
def update_post(post_id: str, body: SocialPostBody, _user: dict = Depends(require_admin)):
    embed_url = body.embedUrl.strip()
    if not embed_url:
        return JSONResponse({"error": "Link is required"}, status_code=400)

    updated = store.social_posts.update(
        post_id,
        {
            "platform": body.platform or "instagram",
            "embedUrl": embed_url,
            "caption": body.caption or None,
            "thumbnail": body.thumbnail or None,
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{post_id}")
def delete_post(post_id: str, _user: dict = Depends(require_admin)):
    removed = store.social_posts.delete(post_id)
    if removed and removed.get("thumbnail"):
        delete_uploaded_file(removed["thumbnail"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{post_id}/publish")
def toggle_published(post_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.social_posts.update(post_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{post_id}/reorder")
def reorder(post_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.social_posts.reorder(post_id, body.direction)
    return {"ok": True}
