from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id
from utils import delete_uploaded_file

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("")
def list_testimonials():
    rows = store.testimonials.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


class TestimonialBody(BaseModel):
    kind: str = "review"
    customerName: str
    reviewText: str | None = None
    location: str | None = None
    rating: int | None = None
    response: str | None = None
    videoUrl: str | None = None
    thumbnail: str | None = None


@router.post("")
def create_testimonial(body: TestimonialBody, _user: dict = Depends(require_admin)):
    customer_name = body.customerName.strip()
    if not customer_name:
        return JSONResponse({"error": "Customer name is required"}, status_code=400)

    record = {
        "id": gen_id(),
        "kind": body.kind or "review",
        "customerName": customer_name,
        "reviewText": body.reviewText or None,
        "location": body.location or None,
        "rating": body.rating,
        "response": body.response or None,
        "videoUrl": body.videoUrl or None,
        "thumbnail": body.thumbnail or None,
        "order": store.testimonials.next_order(),
        "published": True,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    store.testimonials.insert(record)
    return record


@router.put("/{testimonial_id}")
def update_testimonial(testimonial_id: str, body: TestimonialBody, _user: dict = Depends(require_admin)):
    customer_name = body.customerName.strip()
    if not customer_name:
        return JSONResponse({"error": "Customer name is required"}, status_code=400)

    updated = store.testimonials.update(
        testimonial_id,
        {
            "kind": body.kind or "review",
            "customerName": customer_name,
            "reviewText": body.reviewText or None,
            "location": body.location or None,
            "rating": body.rating,
            "response": body.response or None,
            "videoUrl": body.videoUrl or None,
            "thumbnail": body.thumbnail or None,
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: str, _user: dict = Depends(require_admin)):
    removed = store.testimonials.delete(testimonial_id)
    if removed:
        if removed.get("videoUrl"):
            delete_uploaded_file(removed["videoUrl"])
        if removed.get("thumbnail"):
            delete_uploaded_file(removed["thumbnail"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{testimonial_id}/publish")
def toggle_published(testimonial_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.testimonials.update(testimonial_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{testimonial_id}/reorder")
def reorder(testimonial_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.testimonials.reorder(testimonial_id, body.direction)
    return {"ok": True}
