from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id
from utils import delete_uploaded_file

router = APIRouter(prefix="/api/media-features", tags=["media-coverage"])


@router.get("")
def list_features():
    rows = store.media_features.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


class MediaFeatureBody(BaseModel):
    title: str
    outlet: str
    type: str = "article"
    url: str
    thumbnail: str | None = None


@router.post("")
def create_feature(body: MediaFeatureBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    outlet = body.outlet.strip()
    url = body.url.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)
    if not outlet:
        return JSONResponse({"error": "Outlet / channel is required"}, status_code=400)
    if not url:
        return JSONResponse({"error": "Link is required"}, status_code=400)

    record = {
        "id": gen_id(),
        "title": title,
        "outlet": outlet,
        "url": url,
        "type": body.type or "article",
        "thumbnail": body.thumbnail or None,
        "order": store.media_features.next_order(),
        "published": True,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    store.media_features.insert(record)
    return record


@router.put("/{feature_id}")
def update_feature(feature_id: str, body: MediaFeatureBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    outlet = body.outlet.strip()
    url = body.url.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)
    if not outlet:
        return JSONResponse({"error": "Outlet / channel is required"}, status_code=400)
    if not url:
        return JSONResponse({"error": "Link is required"}, status_code=400)

    updated = store.media_features.update(
        feature_id,
        {
            "title": title,
            "outlet": outlet,
            "url": url,
            "type": body.type or "article",
            "thumbnail": body.thumbnail or None,
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{feature_id}")
def delete_feature(feature_id: str, _user: dict = Depends(require_admin)):
    removed = store.media_features.delete(feature_id)
    if removed and removed.get("thumbnail"):
        delete_uploaded_file(removed["thumbnail"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{feature_id}/publish")
def toggle_published(feature_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.media_features.update(feature_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{feature_id}/reorder")
def reorder(feature_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.media_features.reorder(feature_id, body.direction)
    return {"ok": True}
