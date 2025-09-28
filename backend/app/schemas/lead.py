from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import uuid
from sqlmodel import SQLModel, Field
from datetime import datetime

class LeadPreview(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    business_name: str
    industry: Optional[str] = None
    country: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str]=None



class LeadResponse(LeadPreview):
    id: uuid.UUID
    verified: bool


class LeadBase(SQLModel):
    business_name: str
    industry: str
    lead_score: int
    verified: bool = False
    contact_person: Optional[str] = None
    designation: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None


class LeadCreate(LeadBase):
    user_id: Optional[uuid.UUID] = None 

class LeadUpdate(SQLModel):
    business_name: Optional[str] = None
    industry: Optional[str] = None
    lead_score: Optional[int] = None
    verified: Optional[bool] = None
    contact_person: Optional[str] = None
    designation: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None

class LeadRead(LeadBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
