import uuid
from sqlmodel import SQLModel, Field, Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, timezone

class Blog(SQLModel, table=True):
    __tablename__ = "blogs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    content: dict = Field(sa_column=Column(JSONB))  # Rich Text JSON
    featured_image: str | None = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False, onupdate=lambda: datetime.now(timezone.utc))
    )
