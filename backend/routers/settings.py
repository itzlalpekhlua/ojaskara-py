from fastapi import APIRouter, Depends
from pydantic import BaseModel

import store
from deps import require_admin
from utils import delete_uploaded_file

router = APIRouter(prefix="/api/settings", tags=["settings"])

SETTINGS_FIELDS = [
    "tagline",
    "introTitle",
    "introBody",
    "finalCtaTitle",
    "finalCtaBody",
    "phone",
    "phoneSecondary",
    "email",
    "address",
    "locationPrimaryName",
    "locationPrimaryLabel",
    "locationSecondaryName",
    "locationSecondaryLabel",
    "instagramUrl",
    "facebookUrl",
    "tiktokUrl",
    "whatsappUrl",
]


@router.get("")
def get_settings():
    return store.settings.get()


class SettingsBody(BaseModel):
    tagline: str | None = None
    introTitle: str | None = None
    introBody: str | None = None
    finalCtaTitle: str | None = None
    finalCtaBody: str | None = None
    phone: str | None = None
    phoneSecondary: str | None = None
    email: str | None = None
    address: str | None = None
    locationPrimaryName: str | None = None
    locationPrimaryLabel: str | None = None
    locationSecondaryName: str | None = None
    locationSecondaryLabel: str | None = None
    instagramUrl: str | None = None
    facebookUrl: str | None = None
    tiktokUrl: str | None = None
    whatsappUrl: str | None = None


@router.put("")
def update_settings(body: SettingsBody, _user: dict = Depends(require_admin)):
    patch = {}
    for field in SETTINGS_FIELDS:
        value = getattr(body, field)
        patch[field] = value.strip() if isinstance(value, str) and value.strip() != "" else None
    return store.settings.update(patch)


class HeroVideoBody(BaseModel):
    url: str


@router.put("/hero-video")
def set_hero_video(body: HeroVideoBody, _user: dict = Depends(require_admin)):
    previous = store.settings.get()
    updated = store.settings.update({"heroVideoUrl": body.url})
    prev_url = previous.get("heroVideoUrl")
    if prev_url and prev_url != body.url:
        delete_uploaded_file(prev_url)
    return updated


@router.delete("/hero-video")
def reset_hero_video(_user: dict = Depends(require_admin)):
    previous = store.settings.get()
    updated = store.settings.update({"heroVideoUrl": None})
    if previous.get("heroVideoUrl"):
        delete_uploaded_file(previous["heroVideoUrl"])
    return updated
