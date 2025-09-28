from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from app.models.authorization import Role, Permission
from app.models.users import User
from app.db.session import get_session
from app.utils.jwt import verify_token

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


async def get_user_or_none(
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> User | None:
    """
    Return the current user if logged in, else None (guest).
    """
    # 🔹 Try Authorization header
    auth_header = request.headers.get("Authorization")
    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]

    # 🔹 Fallback to cookie
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        return None  # guest

    # 🔹 Verify JWT
    user_id = verify_token(token)
    if not user_id:
        return None  # invalid token → treat as guest

    # 🔹 Load user with roles + permissions
    result = await session.exec(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.roles).selectinload(Role.permissions))
    )
    user = result.one_or_none()
    return user 


# --------------------------
# Get current user dependency
# --------------------------
async def get_current_user(
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> User:
    """
    Get currently logged-in user.
    Works with:
    1. Bearer token in Authorization header
    2. access_token cookie (for browser)
    """
    # 1️⃣ Try Authorization header
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]

    # 2️⃣ Fallback to access_token cookie
    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    # 3️⃣ Verify JWT
    user_id_from_token = verify_token(token)
    if not user_id_from_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    # 4️⃣ Ensure UUID type
    try:
        user_id = UUID(str(user_id_from_token))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user ID in token")

    # 5️⃣ Load user with roles & permissions
    result = await session.exec(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.roles).selectinload(Role.permissions))
    )
    user = result.one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

# --------------------------
# Permission check dependency
# --------------------------
def require_permission(module: str, action: str):
    """
    Dependency that checks if the current user has the given permission (module + action).
    Example: require_permission("user", "create")
    """

    async def dependency(current_user: User = Depends(get_current_user)):
        # Build the full permission code: e.g. "user:create"
        required_code = f"{module}:{action}"

        # roles and permissions are already loaded on current_user
        user_permissions = {
            f"{perm.module}:{perm.name}"
            for role in current_user.roles
            for perm in role.permissions
        }

        if required_code not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {required_code}",
            )

        return True
 
    return dependency