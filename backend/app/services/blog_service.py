from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from fastapi import HTTPException
from typing import List
import uuid
from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogUpdate

class BlogService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_blogs(self) -> List[dict]:
        result = await self.session.exec(select(Blog))
        return [b.model_dump() for b in result.all()]

    async def get_blog(self, blog_id: uuid.UUID) -> dict:
        blog = await self.session.get(Blog, blog_id)
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        return blog.model_dump()

    async def create_blog(self, data: BlogCreate) -> dict:
        blog = Blog(**data.model_dump())
        self.session.add(blog)
        await self.session.commit()
        await self.session.refresh(blog)
        return blog.model_dump()

    async def update_blog(self, blog_id: uuid.UUID, data: BlogUpdate) -> dict:
        blog = await self.session.get(Blog, blog_id)
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(blog, key, value)
        self.session.add(blog)
        await self.session.commit()
        await self.session.refresh(blog)
        return blog.model_dump()

    async def delete_blog(self, blog_id: uuid.UUID) -> bool:
        blog = await self.session.get(Blog, blog_id)
        if not blog:
            return False
        await self.session.delete(blog)
        await self.session.commit()
        return True
