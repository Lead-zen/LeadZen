from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_session
from app.services.chat_service import chat
from app.schemas.chat import ChatRequest

router = APIRouter()

@router.post("/chat")
async def chat_leads(payload: ChatRequest, db: AsyncSession = Depends(get_session)):
    response = await chat(user_id=payload.user_id, message=payload.message, db=db)
    return response
