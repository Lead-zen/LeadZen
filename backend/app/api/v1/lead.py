from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
import uuid

from app.dependencies.dependencies import get_session
from app.services.lead_service import LeadService
from app.schemas.lead import LeadRead, LeadCreate, LeadUpdate

router = APIRouter(prefix="/leads", tags=["Leads"])

# Create lead
@router.post("/", response_model=LeadRead)
async def create_lead(data: LeadCreate, session: AsyncSession = Depends(get_session)):
    service = LeadService(session)
    lead_dict = await service.create_lead(data)
    return LeadRead.model_validate(lead_dict)

# List leads
@router.get("/", response_model=List[LeadRead])
async def list_leads(
    industry: Optional[str] = Query(None, description="Filter by industry"),
    min_lead_score: Optional[int] = Query(None, description="Minimum lead score"),
    max_lead_score: Optional[int] = Query(None, description="Maximum lead score"),
    session: AsyncSession = Depends(get_session)):
    service = LeadService(session)
    leads = await service.list_leads(
        industry=industry,
        min_lead_score=min_lead_score,
        max_lead_score=max_lead_score
    )
    return [LeadRead.model_validate(l) for l in leads]

# Get lead by ID
@router.get("/{lead_id}", response_model=LeadRead)
async def get_lead(lead_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    service = LeadService(session)
    lead_dict = await service.get_lead(lead_id)
    return LeadRead.model_validate(lead_dict)

# Update lead
@router.put("/{lead_id}", response_model=LeadRead)
async def update_lead(lead_id: uuid.UUID, data: LeadUpdate, session: AsyncSession = Depends(get_session)):
    service = LeadService(session)
    lead_dict = await service.update_lead(lead_id, data)
    return LeadRead.model_validate(lead_dict)

# Delete lead
@router.delete("/{lead_id}")
async def delete_lead(lead_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    service = LeadService(session)
    ok = await service.delete_lead(lead_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}
