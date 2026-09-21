from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id
from utils import delete_uploaded_file, slugify

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("")
def list_services():
    rows = store.services.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


class ServiceBody(BaseModel):
    title: str
    description: str | None = None
    image: str | None = None
    mediaType: str = "image"
    parentId: str | None = None


@router.post("")
def create_service(body: ServiceBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    record = {
        "id": gen_id(),
        "title": title,
        "slug": slugify(title),
        "description": body.description or None,
        "image": body.image or None,
        "mediaType": body.mediaType or "image",
        "order": store.services.next_order(parentId=body.parentId),
        "published": True,
        "parentId": body.parentId or None,
    }
    store.services.insert(record)
    return record


class ServiceUpdateBody(BaseModel):
    title: str
    description: str | None = None
    image: str | None = None
    mediaType: str = "image"


@router.put("/{service_id}")
def update_service(service_id: str, body: ServiceUpdateBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    updated = store.services.update(
        service_id,
        {
            "title": title,
            "slug": slugify(title),
            "description": body.description or None,
            "image": body.image or None,
            "mediaType": body.mediaType or "image",
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{service_id}")
def delete_service(service_id: str, _user: dict = Depends(require_admin)):
    children = store.services.find(parentId=service_id)
    removed = store.services.delete(service_id)
    if removed:
        if removed.get("image"):
            delete_uploaded_file(removed["image"])
        for child in children:
            store.services.delete(child["id"])
            if child.get("image"):
                delete_uploaded_file(child["image"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{service_id}/publish")
def toggle_published(service_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.services.update(service_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{service_id}/reorder")
def reorder(service_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.services.reorder(service_id, body.direction, group_by=["parentId"])
    return {"ok": True}
