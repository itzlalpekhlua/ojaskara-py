from fastapi import HTTPException, Request

import store
from config import SESSION_COOKIE_NAME
from security import verify_session


def get_session_user(request: Request) -> dict | None:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    payload = verify_session(token)
    if not payload:
        return None
    user = store.admin_users.get(payload["uid"])
    return user


def require_admin(request: Request) -> dict:
    user = get_session_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user
