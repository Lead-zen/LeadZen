from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.schemas.chat import ChatRequest
from app.services.chat_service import chat
from app.core.config import get_settings  # your settings loader
from langchain_google_genai import ChatGoogleGenerativeAI
from app.models.users import User
from app.dependencies.dependencies import get_user_or_none , get_current_user # optional user dependency

settings = get_settings()

router = APIRouter(prefix="/chat", tags=["chat"])

# Shared LLM instance
llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    google_api_key=settings.GEMINI_API_KEY,
)

@router.post("/")
async def chat_leads(
    payload: ChatRequest,
    db: AsyncSession = Depends(get_session),
    user: User | None = Depends(get_user_or_none),
):
    response = await chat(
        message=payload.message,
        db=db,
        llm=llm,
        user=user
    )
    return response
