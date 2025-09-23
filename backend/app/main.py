from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import engine
from app.seed.roles_permission import seed_roles_permissions, seed_default_superadmin
from app.api.v1.auth import router as authentication_router
from app.api.v1.user import router as user_router
from app.api.v1.authorization import router as authorization_router
from app.api.v1.chat import router as chat_router
from app.api.v1.lead import router as lead_router
from app.api.v1.blog import router as blog_router
from fastapi.staticfiles import StaticFiles

# @asynccontextmanager
# async def lifespan(app: FastAPI):

#     async with engine.begin() as conn:
#         await conn.run_sync(SQLModel.metadata.create_all)

#     # Seed roles, permissions, and default superadmin
#     async with AsyncSession(engine) as session:
#         await seed_roles_permissions(session)
#         await seed_default_superadmin(session)

#     yield

# app = FastAPI(title="RBAC App", lifespan=lifespan)
app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication_router)
app.include_router(user_router)
app.include_router(authorization_router)
app.include_router(chat_router)
app.include_router(lead_router)
app.include_router(blog_router)