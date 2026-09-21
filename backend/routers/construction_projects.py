from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from nested_images import add_image, delete_image, reorder_image, set_featured
from store import gen_id
from utils import delete_uploaded_file, slugify

router = APIRouter(prefix="/api/construction-projects", tags=["construction-projects"])


@router.get("")
def list_projects():
    rows = store.construction_projects.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


@router.get("/slug/{slug}")
def get_by_slug(slug: str):
    row = store.construction_projects.find_one(slug=slug)
    if not row:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return row


@router.get("/{project_id}")
def get_project(project_id: str):
    row = store.construction_projects.get(project_id)
    if not row:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return row


class ProjectBody(BaseModel):
    title: str
    categoryLabel: str | None = None
    location: str | None = None
    description: str | None = None
    featuredImage: str | None = None


@router.post("")
def create_project(body: ProjectBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": gen_id(),
        "title": title,
        "slug": slugify(title),
        "categoryLabel": body.categoryLabel or None,
        "location": body.location or None,
        "description": body.description or None,
        "featuredImage": body.featuredImage or None,
        "order": store.construction_projects.next_order(),
        "published": True,
        "createdAt": now,
        "updatedAt": now,
        "images": [],
    }
    store.construction_projects.insert(record)
    return record


@router.put("/{project_id}")
def update_project(project_id: str, body: ProjectBody, _user: dict = Depends(require_admin)):
    title = body.title.strip()
    if not title:
        return JSONResponse({"error": "Title is required"}, status_code=400)

    updated = store.construction_projects.update(
        project_id,
        {
            "title": title,
            "slug": slugify(title),
            "categoryLabel": body.categoryLabel or None,
            "location": body.location or None,
            "description": body.description or None,
            "featuredImage": body.featuredImage or None,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{project_id}")
def delete_project(project_id: str, _user: dict = Depends(require_admin)):
    removed = store.construction_projects.delete(project_id)
    if removed:
        if removed.get("featuredImage"):
            delete_uploaded_file(removed["featuredImage"])
        for image in removed.get("images", []):
            delete_uploaded_file(image["url"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{project_id}/publish")
def toggle_published(project_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.construction_projects.update(project_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{project_id}/reorder")
def reorder(project_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.construction_projects.reorder(project_id, body.direction)
    return {"ok": True}


class AddImageBody(BaseModel):
    url: str
    mediaType: str = "image"


@router.post("/{project_id}/images")
def add_gallery_image(project_id: str, body: AddImageBody, _user: dict = Depends(require_admin)):
    updated = add_image(store.construction_projects, project_id, body.url, media_type=body.mediaType)
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/images/{image_id}")
def delete_gallery_image(image_id: str, _user: dict = Depends(require_admin)):
    delete_image(store.construction_projects, image_id)
    return {"ok": True}


@router.post("/images/{image_id}/reorder")
def reorder_gallery_image(image_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    reorder_image(store.construction_projects, image_id, body.direction)
    return {"ok": True}


class FeaturedImageBody(BaseModel):
    url: str


@router.put("/{project_id}/featured-image")
def set_featured_image(project_id: str, body: FeaturedImageBody, _user: dict = Depends(require_admin)):
    updated = set_featured(store.construction_projects, project_id, body.url)
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated
