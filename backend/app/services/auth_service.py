from fastapi import HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from datetime import datetime, timedelta, timezone
from app.models.users import User
from app.models.authorization import Role
from app.models.refresh_token import RefreshToken
from app.core.security import hash_password, verify_password
from app.utils.jwt import create_refresh_token
from app.schemas.users import UserRead
from sqlalchemy.orm import selectinload


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def register_user(
        self,
        username: str,
        email: str,
        password: str | None = None,   #  CHANGE: allow None for OAuth users
        profile_pic: str | None = None,  #  CHANGE: allow saving Google avatar
        google_sub: str | None = None,   #  CHANGE: allow saving Google sub

    ) -> UserRead:
        # Check if user exists
        existing = await self.session.exec(
            select(User).where((User.email == email) | (User.username == username))
        )
        if existing.one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already registered"
            )

        # Fetch default role with permissions
        default_role_result = await self.session.exec(
            select(Role).options(selectinload(Role.permissions)).where(Role.name == "user")
        )
        default_role = default_role_result.one_or_none()
        if not default_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Default role not found"
            )

        # Create user
        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password) if password else None,
            profile_pic=profile_pic,
            google_sub=google_sub,
            roles=[default_role],
        )

        try:
            self.session.add(user)
            await self.session.commit()
            await self.session.refresh(user)

            # Load roles & permissions relationship
            result = await self.session.exec(
                select(User)
                .options(selectinload(User.roles).selectinload(Role.permissions))
                .where(User.id == user.id)
            )
            user = result.one()
        except Exception as e:
            await self.session.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"DB Error: cannot register user ({e})"
            )

        # Return validated Pydantic model
        return UserRead.model_validate(user)

    async def authenticate_user(self, email: str, password: str) -> User | None:
        result = await self.session.exec(select(User).where(User.email == email))
        user = result.one_or_none()
        if not user or not user.password_hash:
            return None

        if verify_password(password, user.password_hash):
            return user
        
        return None

    async def create_and_store_refresh_token(
        self, user: User, revoke_old: bool = False
    ) -> str:
        """
        revoke_old: if True, old refresh tokens are revoked (single-session)
        """
        if revoke_old:
            result = await self.session.exec(
                select(RefreshToken).where(RefreshToken.user_id == user.id, RefreshToken.revoked == False)
            )
            for old_token in result.all():
                old_token.revoked = True

        token_str = create_refresh_token(user.id)
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        refresh_token = RefreshToken(
            user_id=user.id,
            token=token_str,
            expires_at=expires_at
        )
        try:
            self.session.add(refresh_token)
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise HTTPException(status_code=500, detail="DB Error: cannot store refresh token")
        return token_str

    async def revoke_refresh_token(self, token_str: str):
        result = await self.session.exec(select(RefreshToken).where(RefreshToken.token == token_str))
        db_token = result.one_or_none()
        if db_token:
            db_token.revoked = True
            try:
                await self.session.commit()
            except Exception:
                await self.session.rollback()
                raise HTTPException(status_code=500, detail="DB Error: cannot revoke refresh token")
            
    async def logout(self, token_str: str):
        """
        Revoke a specific refresh token (logout from one session)
        """
        result = await self.session.exec(select(RefreshToken).where(RefreshToken.token == token_str))
        db_token = result.one_or_none()
        if not db_token:
            raise HTTPException(status_code=404, detail="Refresh token not found")
        db_token.revoked = True
        try:
            await self.session.commit()
        except Exception:
            await self.session.rollback()
            raise HTTPException(status_code=500, detail="DB error: cannot revoke refresh token")
