from sqlmodel import SQLModel
from typing import Optional
import uuid
from datetime import datetime

class BlogBase(SQLModel):
    title: str
    content: dict
    featured_image: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(SQLModel):
    title: Optional[str] = None
    content: Optional[dict] = None
    featured_image: Optional[str] = None

class BlogRead(BlogBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
