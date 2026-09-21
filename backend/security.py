"""Session cookie signing/verification (HMAC-SHA256, same scheme the previous
Next.js app used, so the Next.js frontend's own middleware can keep verifying
the cookie locally without calling the backend) and password hashing.
"""
import base64
import hashlib
import hmac
import json
import time

import bcrypt

from config import ADMIN_SESSION_SECRET, SESSION_MAX_AGE_SECONDS


def _to_b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _from_b64url(s: str) -> bytes:
    padding = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding)


def sign_session(uid: str) -> str:
    exp = int(time.time() * 1000) + SESSION_MAX_AGE_SECONDS * 1000
    payload = {"uid": uid, "exp": exp}
    encoded_payload = _to_b64url(json.dumps(payload, separators=(",", ":")).encode())
    signature = hmac.new(ADMIN_SESSION_SECRET.encode(), encoded_payload.encode(), hashlib.sha256).digest()
    return f"{encoded_payload}.{_to_b64url(signature)}"


def verify_session(token: str | None) -> dict | None:
    if not token or "." not in token:
        return None
    encoded_payload, _, encoded_signature = token.partition(".")
    if not encoded_payload or not encoded_signature:
        return None

    try:
        expected_sig = hmac.new(ADMIN_SESSION_SECRET.encode(), encoded_payload.encode(), hashlib.sha256).digest()
        actual_sig = _from_b64url(encoded_signature)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        payload = json.loads(_from_b64url(encoded_payload))
    except Exception:
        return None

    exp = payload.get("exp")
    uid = payload.get("uid")
    if not isinstance(exp, (int, float)) or exp < time.time() * 1000:
        return None
    if not isinstance(uid, str) or not uid:
        return None
    return payload


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=10)).decode()


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), password_hash.encode())
    except ValueError:
        return False
