from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from nested_images import add_image, delete_image, reorder_image, set_featured
from store import gen_id
from utils import delete_uploaded_file, slugify

router = APIRouter(prefix="/api/design-works", tags=["design-portfolio"])


@router.get("")
def list_design_works():
    rows = store.design_works.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


@router.get("/lookup/{kind}/{scope}/{slug}")
def lookup(kind: str, scope: str, slug: str):
    row = store.design_works.find_one(kind=kind, scope=scope, slug=slug)
    if not row:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return row


@router.get("/{work_id}")
def get_work(work_id: str):
    row = store.design_works.get(work_id)
    if not row:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return row


class DesignWorkBody(BaseModel):
    title: str
    kind: str = "interior"
    scope: str = "residential"
    roomType: str | None = None
    description: str | None = None
    featuredImage: str | None = None


@router.post("")
def create_work(body: DesignWorkBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": gen_id(),
        "title": title,
        "slug": slugify(title),
        "kind": body.kind,
        "scope": body.scope,
        "roomType": body.roomType or None,
        "description": body.description or None,
        "featuredImage": body.featuredImage or None,
        "order": store.design_works.next_order(kind=body.kind, scope=body.scope),
        "published": True,
        "createdAt": now,
        "updatedAt": now,
        "images": [],
    }
    store.design_works.insert(record)
    return record


@router.put("/{work_id}")
def update_work(work_id: str, body: DesignWorkBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    updated = store.design_works.update(
        work_id,
        {
            "title": title,
            "slug": slugify(title),
            "kind": body.kind,
            "scope": body.scope,
            "roomType": body.roomType or None,
            "description": body.description or None,
            "featuredImage": body.featuredImage or None,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{work_id}")
def delete_work(work_id: str, _user: dict = Depends(require_admin)):
    removed = store.design_works.delete(work_id)
    if removed:
        if removed.get("featuredImage"):
            delete_uploaded_file(removed["featuredImage"])
        for image in removed.get("images", []):
            delete_uploaded_file(image["url"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{work_id}/publish")
def toggle_published(work_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.design_works.update(work_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{work_id}/reorder")
def reorder(work_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    # Scoped to the same kind+scope group — mirrors the four sections shown on
    # both the public /design pages and the admin Design Portfolio list.
    store.design_works.reorder(work_id, body.direction, group_by=["kind", "scope"])
    return {"ok": True}


class AddImageBody(BaseModel):
    url: str


@router.post("/{work_id}/images")
def add_gallery_image(work_id: str, body: AddImageBody, _user: dict = Depends(require_admin)):
    updated = add_image(store.design_works, work_id, body.url)
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/images/{image_id}")
def delete_gallery_image(image_id: str, _user: dict = Depends(require_admin)):
    delete_image(store.design_works, image_id)
    return {"ok": True}


@router.post("/images/{image_id}/reorder")
def reorder_gallery_image(image_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    reorder_image(store.design_works, image_id, body.direction)
    return {"ok": True}


class FeaturedImageBody(BaseModel):
    url: str


@router.put("/{work_id}/featured-image")
def set_featured_image(work_id: str, body: FeaturedImageBody, _user: dict = Depends(require_admin)):
    updated = set_featured(store.design_works, work_id, body.url)
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated
