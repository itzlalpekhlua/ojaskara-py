from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from deps import require_admin
from store import gen_id
from utils import delete_uploaded_file

router = APIRouter(prefix="/api/team", tags=["team"])


@router.get("")
def list_team():
    rows = store.team.all()
    rows.sort(key=lambda r: r.get("order", 0))
    return rows


class TeamMemberBody(BaseModel):
    name: str
    role: str = ""
    description: str | None = None
    image: str | None = None


@router.post("")
def create_member(body: TeamMemberBody, _user: dict = Depends(require_admin)):
    name = body.name.strip()
    if not name:
        return JSONResponse({"error": "Name is required"}, status_code=400)

    if len(store.team.all()) >= 2:
        return JSONResponse(
            {"error": "Only two team profiles are allowed — Chairman and Managing Director. Delete one first."},
            status_code=400,
        )

    record = {
        "id": gen_id(),
        "name": name,
        "role": body.role.strip(),
        "description": body.description or None,
        "image": body.image or None,
        "order": store.team.next_order(),
        "published": True,
    }
    store.team.insert(record)
    return record


@router.put("/{member_id}")
def update_member(member_id: str, body: TeamMemberBody, _user: dict = Depends(require_admin)):
    name = body.name.strip()
    if not name:
        return JSONResponse({"error": "Name is required"}, status_code=400)

    updated = store.team.update(
        member_id,
        {
            "name": name,
            "role": body.role.strip(),
            "description": body.description or None,
            "image": body.image or None,
        },
    )
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


@router.delete("/{member_id}")
def delete_member(member_id: str, _user: dict = Depends(require_admin)):
    removed = store.team.delete(member_id)
    if removed and removed.get("image"):
        delete_uploaded_file(removed["image"])
    return {"ok": True}


class PublishBody(BaseModel):
    published: bool


@router.post("/{member_id}/publish")
def toggle_published(member_id: str, body: PublishBody, _user: dict = Depends(require_admin)):
    updated = store.team.update(member_id, {"published": body.published})
    if not updated:
        return JSONResponse({"error": "Not found"}, status_code=404)
    return updated


class DirectionBody(BaseModel):
    direction: str


@router.post("/{member_id}/reorder")
def reorder(member_id: str, body: DirectionBody, _user: dict = Depends(require_admin)):
    store.team.reorder(member_id, body.direction)
    return {"ok": True}
