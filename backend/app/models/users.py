from app.models.timestamp import TimestampMixin
from sqlmodel import SQLModel, Field, Column, String, Boolean, Relationship
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.models.authorization import Role, UserRole
from typing import List, Optional, TYPE_CHECKING


if TYPE_CHECKING:
    from app.models.lead import Lead 

class User(SQLModel, TimestampMixin, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, sa_column=Column(UUID(as_uuid=True), primary_key=True))
    username: str = Field(sa_column=Column(String(50), nullable=False, unique=True, index=True))
    email: str = Field(sa_column=Column(String(100), nullable=False, unique=True, index=True))
    password_hash: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    is_active: bool = Field(default=True, sa_column=Column(Boolean, nullable=False, default=True))
    google_sub: Optional[str] = Field(default=None, sa_column=Column(String, unique=True, index=True))
    profile_pic: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))

    # Multi-role support
    roles: List[Role] = Relationship(back_populates="users", link_model=UserRole)
    leads: List["Lead"] = Relationship(back_populates="user")

