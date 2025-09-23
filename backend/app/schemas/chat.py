from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    user_id: str
    message: Optional[str] = None