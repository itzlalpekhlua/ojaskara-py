import os

from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import store
from config import COOKIE_DOMAIN, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS
from deps import get_session_user
from security import sign_session, verify_password

router = APIRouter(prefix="/api/admin/auth", tags=["auth"])


class LoginBody(BaseModel):
    email: str = ""
    password: str = ""


@router.post("/login")
def login(body: LoginBody, response: Response):
    email = body.email.strip().lower()
    password = body.password

    if not email or not password:
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)

    user = store.admin_users.find_one(email=email)
    if not user or not verify_password(password, user["passwordHash"]):
        return JSONResponse({"error": "Invalid credentials"}, status_code=401)

    token = sign_session(user["id"])
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        path="/",
        domain=COOKIE_DOMAIN,
        httponly=True,
        samesite="lax",
        secure=os.environ.get("NODE_ENV") == "production",
    )
    return {"ok": True}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/", domain=COOKIE_DOMAIN)
    return {"ok": True}


@router.get("/me")
def me(request: Request):
    user = get_session_user(request)
    if not user:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)
    return {"id": user["id"], "email": user["email"], "role": user["role"]}
