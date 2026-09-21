from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id

router = APIRouter(tags=["enquiries"])


class ContactBody(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    message: str = ""


@router.post("/api/contact")
def submit_contact(body: ContactBody):
    name = body.name.strip()
    email = body.email.strip()
    phone = body.phone.strip()
    message = body.message.strip()

    if not name or not email or not message:
        return JSONResponse({"error": "Name, email and message are required"}, status_code=400)

    store.enquiries.insert(
        {
            "id": gen_id(),
            "name": name,
            "email": email,
            "phone": phone or None,
            "message": message,
            "status": "new",
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }
    )
    return {"ok": True}


@router.get("/api/admin/enquiries")
def list_enquiries(_user: dict = Depends(require_admin)):
    all_rows = store.enquiries.all()
    all_rows.sort(key=lambda r: r["createdAt"], reverse=True)
    return all_rows


class StatusBody(BaseModel):
    status: str


@router.patch("/api/admin/enquiries/{enquiry_id}")
def update_status(enquiry_id: str, body: StatusBody, _user: dict = Depends(require_admin)):
    if body.status not in ("new", "read", "handled"):
        return JSONResponse({"error": "Invalid status"}, status_code=400)
    updated = store.enquiries.update(enquiry_id, {"status": body.status})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/api/admin/enquiries/{enquiry_id}")
def delete_enquiry(enquiry_id: str, _user: dict = Depends(require_admin)):
    store.enquiries.delete(enquiry_id)
    return {"ok": True}
