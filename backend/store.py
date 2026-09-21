"""Tiny JSON-file "database". Every resource lives in its own
database/<name>.json file — a list of dict records for collections, or a
single dict for singleton documents (settings, cost estimator rates).

No SQL, no ORM, no external database — just atomic read/write of JSON files,
which is all this site's admin panel actually needs.
"""
import json
import os
import tempfile
import threading
import uuid
from pathlib import Path
from typing import Any

from config import DATABASE_DIR

_locks: dict[str, threading.Lock] = {}
_locks_guard = threading.Lock()


def _lock_for(name: str) -> threading.Lock:
    with _locks_guard:
        if name not in _locks:
            _locks[name] = threading.Lock()
        return _locks[name]


def _path(name: str) -> Path:
    return DATABASE_DIR / f"{name}.json"


def gen_id() -> str:
    return uuid.uuid4().hex


def _atomic_write(path: Path, data: Any) -> None:
    fd, tmp_path = tempfile.mkstemp(dir=str(path.parent), prefix=f".{path.stem}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        os.replace(tmp_path, path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


class Collection:
    """A JSON-file-backed list of dict records, keyed by `id`."""

    def __init__(self, name: str):
        self.name = name

    def _read(self) -> list[dict]:
        path = _path(self.name)
        if not path.exists():
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _write(self, records: list[dict]) -> None:
        _atomic_write(_path(self.name), records)

    def all(self) -> list[dict]:
        with _lock_for(self.name):
            return self._read()

    def get(self, record_id: str) -> dict | None:
        for r in self.all():
            if r["id"] == record_id:
                return r
        return None

    def find_one(self, **filters) -> dict | None:
        for r in self.all():
            if all(r.get(k) == v for k, v in filters.items()):
                return r
        return None

    def find(self, **filters) -> list[dict]:
        return [r for r in self.all() if all(r.get(k) == v for k, v in filters.items())]

    def insert(self, record: dict) -> dict:
        with _lock_for(self.name):
            records = self._read()
            records.append(record)
            self._write(records)
        return record

    def update(self, record_id: str, patch: dict) -> dict | None:
        with _lock_for(self.name):
            records = self._read()
            updated = None
            for r in records:
                if r["id"] == record_id:
                    r.update(patch)
                    updated = r
                    break
            if updated is not None:
                self._write(records)
            return updated

    def delete(self, record_id: str) -> dict | None:
        with _lock_for(self.name):
            records = self._read()
            removed = None
            kept = []
            for r in records:
                if r["id"] == record_id and removed is None:
                    removed = r
                else:
                    kept.append(r)
            if removed is not None:
                self._write(kept)
            return removed

    def delete_many(self, **filters) -> list[dict]:
        with _lock_for(self.name):
            records = self._read()
            removed = [r for r in records if all(r.get(k) == v for k, v in filters.items())]
            if removed:
                kept = [r for r in records if r not in removed]
                self._write(kept)
            return removed

    def next_order(self, **filters) -> int:
        matching = self.find(**filters) if filters else self.all()
        if not matching:
            return 0
        return max(r.get("order", 0) for r in matching) + 1

    def reorder(self, record_id: str, direction: str, *, group_by: list[str] | None = None) -> bool:
        """Swap `order` with the previous/next sibling within the same group."""
        with _lock_for(self.name):
            records = self._read()
            target = next((r for r in records if r["id"] == record_id), None)
            if target is None:
                return False

            group_by = group_by or []
            siblings = [
                r for r in records if all(r.get(k) == target.get(k) for k in group_by)
            ]
            siblings.sort(key=lambda r: r.get("order", 0))
            index = next(i for i, r in enumerate(siblings) if r["id"] == record_id)
            swap_index = index - 1 if direction == "up" else index + 1
            if swap_index < 0 or swap_index >= len(siblings):
                return False

            a, b = siblings[index], siblings[swap_index]
            a["order"], b["order"] = b["order"], a["order"]
            self._write(records)
            return True

    def save_all(self, records: list[dict]) -> None:
        with _lock_for(self.name):
            self._write(records)


class Document:
    """A JSON-file-backed singleton dict document."""

    def __init__(self, name: str):
        self.name = name

    def get(self) -> dict:
        with _lock_for(self.name):
            path = _path(self.name)
            if not path.exists():
                return {}
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)

    def update(self, patch: dict) -> dict:
        with _lock_for(self.name):
            path = _path(self.name)
            current = {}
            if path.exists():
                with open(path, "r", encoding="utf-8") as f:
                    current = json.load(f)
            current.update(patch)
            _atomic_write(path, current)
            return current


admin_users = Collection("admin_users")
projects = Collection("projects")
construction_projects = Collection("construction_projects")
design_works = Collection("design_works")
services = Collection("services")
team = Collection("team")
testimonials = Collection("testimonials")
social_posts = Collection("social_posts")
media_features = Collection("media_features")
enquiries = Collection("enquiries")
settings = Document("settings")
cost_estimator = Document("cost_estimator")
