"""Shared helpers for resources that embed a gallery of images directly inside
the parent record (Project, ConstructionProject, DesignWork) — mirrors what
were separate join tables (ProjectGalleryImage, ProjectImage, DesignWorkImage)
in the old Prisma schema, just nested instead of relational.
"""
from store import Collection, gen_id
from utils import delete_uploaded_file


def _find_parent(collection: Collection, image_id: str) -> dict | None:
    for parent in collection.all():
        for img in parent.get("images", []):
            if img["id"] == image_id:
                return parent
    return None


def add_image(collection: Collection, parent_id: str, url: str, media_type: str | None = None, alt: str | None = None) -> dict | None:
    parent = collection.get(parent_id)
    if not parent:
        return None
    images = parent.get("images", [])
    order = (max((i.get("order", 0) for i in images), default=-1)) + 1
    image = {"id": gen_id(), "url": url, "alt": alt, "order": order}
    if media_type is not None:
        image["mediaType"] = media_type
    images.append(image)
    return collection.update(parent_id, {"images": images})


def delete_image(collection: Collection, image_id: str) -> dict | None:
    parent = _find_parent(collection, image_id)
    if not parent:
        return None
    images = parent.get("images", [])
    target = next(i for i in images if i["id"] == image_id)
    images = [i for i in images if i["id"] != image_id]
    delete_uploaded_file(target["url"])
    return collection.update(parent["id"], {"images": images})


def reorder_image(collection: Collection, image_id: str, direction: str) -> dict | None:
    parent = _find_parent(collection, image_id)
    if not parent:
        return None
    images = sorted(parent.get("images", []), key=lambda i: i.get("order", 0))
    index = next(idx for idx, i in enumerate(images) if i["id"] == image_id)
    swap_index = index - 1 if direction == "up" else index + 1
    if swap_index < 0 or swap_index >= len(images):
        return parent
    images[index]["order"], images[swap_index]["order"] = images[swap_index]["order"], images[index]["order"]
    return collection.update(parent["id"], {"images": images})


def set_featured(collection: Collection, parent_id: str, url: str) -> dict | None:
    return collection.update(parent_id, {"featuredImage": url})
