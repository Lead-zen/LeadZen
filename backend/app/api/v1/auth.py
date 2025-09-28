from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime, timezone
from typing import Optional

from app.db.session import get_session
from app.models.users import User
from app.models.refresh_token import RefreshToken
from app.schemas.users import UserRegister, UserLogin, UserRead, Token, TokenRefresh
from app.utils.jwt import create_access_token, verify_refresh_token
from app.dependencies.dependencies import get_current_user, get_user_or_none
from app.services.auth_service import AuthService

router = APIRouter(prefix="/authenticate", tags=["Authentication"])

# --------------------------
# Register
# --------------------------
@router.post("/register", response_model=UserRead)
async def register(user: UserRegister, session: AsyncSession = Depends(get_session)):
    auth = AuthService(session)
    new_user = await auth.register_user(user.username, user.email, user.password)
    return new_user

# --------------------------
# Login
# --------------------------
@router.post("/login", response_model=Token)
async def login(
    user: UserLogin,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    auth = AuthService(session)
    db_user = await auth.authenticate_user(user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    access_token = create_access_token(db_user.id)
    refresh_token = await auth.create_and_store_refresh_token(db_user, revoke_old=True)

    # 🔹 Cookie settings (adjust for production)
    cookie_settings = {
        "httponly": True,
        "secure": False,     # ✅ set to True in production (HTTPS only)
        "samesite": "Lax",   # ✅ use "None" with HTTPS if frontend & backend are on different domains
        "path": "/"          # ✅ ensures cookie is sent to ALL endpoints, not just /authenticate/*
    }

    # Access token (short-lived)
    response.set_cookie(
        "access_token",
        access_token,
        max_age=60 * 15,  # 15 minutes
        **cookie_settings
    )

    # Refresh token (long-lived)
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=60 * 60 * 24 * 7,  # 7 days
        **cookie_settings
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# --------------------------
# Refresh
# --------------------------
@router.post("/refresh", response_model=Token)
async def refresh(request: Request, response: Response, body: Optional[TokenRefresh] = Body(default=None),
                  session: AsyncSession = Depends(get_session)):
    auth = AuthService(session)

    token_str = request.cookies.get("refresh_token") or (body.refresh_token if body else None)
    if not token_str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token provided")

    user_id = verify_refresh_token(token_str)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    # Revoke old token
    await auth.revoke_refresh_token(token_str)

    # Fetch user
    result = await session.exec(select(User).where(User.id == user_id))
    user = result.one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    new_access = create_access_token(user.id)
    new_refresh = await auth.create_and_store_refresh_token(user)

    # Set cookies
    cookie_settings = {"httponly": True, "secure": False, "samesite": "Lax", "path": "/"}
    # cookie_settings = {"httponly": True, "secure": True, "samesite": "None", "path": "/"}  # production HTTPS
    response.set_cookie("access_token", new_access, max_age=60*15, **cookie_settings)
    response.set_cookie("refresh_token", new_refresh, max_age=60*60*24*7, **cookie_settings)

    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

# --------------------------
# Me
# --------------------------
@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)):
    return current_user

# --------------------------
# Logout
# --------------------------
@router.post("/logout")
async def logout(request: Request, response: Response, body: Optional[TokenRefresh] = None,
                 session: AsyncSession = Depends(get_session)):
    auth = AuthService(session)
    token_str = request.cookies.get("refresh_token") or (body.refresh_token if body else None)
    if not token_str:
        raise HTTPException(status_code=401, detail="No refresh token provided")

    await auth.logout(token_str)

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "Logged out successfully"}
