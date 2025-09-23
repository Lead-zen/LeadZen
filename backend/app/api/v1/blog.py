from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
import uuid, os, json
from app.db.session import get_session
from app.services.blog_service import BlogService
from app.schemas.blog import BlogRead, BlogCreate, BlogUpdate
from app.utils.blog_utils import generate_toc

UPLOAD_DIR = "uploads/blogs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/blogs", tags=["Blogs"])

# Save file utility
async def save_file(file: UploadFile) -> str:
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return f"/{file_path}"

# Process inline images in content JSON
async def handle_content_images(content_json: dict) -> dict:
    for block in content_json.get("blocks", []):
        if block.get("type") == "image" and "file" in block:
            block["url"] = await save_file(block["file"])
            del block["file"]
    return content_json

# List blogs
@router.get("/", response_model=List[BlogRead])
async def list_blogs(session: AsyncSession = Depends(get_session)):
    service = BlogService(session)
    blogs = await service.list_blogs()
    return [BlogRead.model_validate(b) for b in blogs]

# Get blog by ID
@router.get("/{blog_id}", response_model=BlogRead)
async def get_blog(blog_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    service = BlogService(session)
    blog = await service.get_blog(blog_id)
    
    # Generate ToC
    toc = generate_toc(blog["content"])
    blog["toc"] = toc
    
    return BlogRead.model_validate(blog)

# Create blog
@router.post("/", response_model=BlogRead)
async def create_blog(
    title: str = Form(...),
    content: str = Form(...),  # JSON string from editor
    featured_image: UploadFile | None = File(None),
    session: AsyncSession = Depends(get_session)
):
    content_json = json.loads(content)
    content_json = await handle_content_images(content_json)
    featured_url = await save_file(featured_image) if featured_image else None
    service = BlogService(session)
    blog = await service.create_blog(BlogCreate(title=title, content=content_json, featured_image=featured_url))
    return BlogRead.model_validate(blog)

# Update blog
@router.put("/{blog_id}", response_model=BlogRead)
async def update_blog(
    blog_id: uuid.UUID,
    title: str | None = Form(None),
    content: str | None = Form(None),
    featured_image: UploadFile | None = File(None),
    session: AsyncSession = Depends(get_session)
):
    content_json = json.loads(content) if content else None
    if content_json:
        content_json = await handle_content_images(content_json)
    featured_url = await save_file(featured_image) if featured_image else None
    service = BlogService(session)
    blog = await service.update_blog(blog_id, BlogUpdate(title=title, content=content_json, featured_image=featured_url))
    return BlogRead.model_validate(blog)

# Delete blog
@router.delete("/{blog_id}")
async def delete_blog(blog_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    service = BlogService(session)
    ok = await service.delete_blog(blog_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}
