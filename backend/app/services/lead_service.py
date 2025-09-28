from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from fastapi import HTTPException
from typing import List, Optional
import uuid

from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate

class LeadService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_leads(
        self,
        user_id: Optional[uuid.UUID] = None,  # 🔹 add user_id
        industry: Optional[str] = None,
        min_lead_score: Optional[int] = None,
        max_lead_score: Optional[int] = None
    ) -> List[dict]:
        query = select(Lead)

        # 🔹 filter by user_id if provided
        if user_id:
            query = query.where(Lead.user_id == user_id)

        if industry:
            query = query.where(Lead.industry.ilike(f"%{industry}%"))
        if min_lead_score is not None:
            query = query.where(Lead.lead_score >= min_lead_score)
        if max_lead_score is not None:
            query = query.where(Lead.lead_score <= max_lead_score)

        result = await self.session.exec(query)
        leads = result.all()

        return [lead.model_dump() for lead in leads]

    async def count_leads(
        self,
        user_id: Optional[uuid.UUID] = None,  # 🔹 add user_id
        industry: Optional[str] = None,
        min_lead_score: Optional[int] = None,
        max_lead_score: Optional[int] = None
    ) -> int:
        from sqlmodel import func, select
        
        query = select(func.count(Lead.id))

        # 🔹 filter by user_id if provided
        if user_id:
            query = query.where(Lead.user_id == user_id)

        if industry:
            query = query.where(Lead.industry.ilike(f"%{industry}%"))
        if min_lead_score is not None:
            query = query.where(Lead.lead_score >= min_lead_score)
        if max_lead_score is not None:
            query = query.where(Lead.lead_score <= max_lead_score)

        result = await self.session.exec(query)
        return result.one()

    async def get_lead(self, lead_id: uuid.UUID) -> dict:
        lead = await self.session.get(Lead, lead_id)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead.model_dump()

    async def create_lead(self, data: LeadCreate) -> dict:
        lead = Lead(**data.model_dump())
        self.session.add(lead)
        await self.session.commit()
        await self.session.refresh(lead)
        return lead.model_dump()

    async def update_lead(self, lead_id: uuid.UUID, data: LeadUpdate) -> dict:
        # Fetch existing lead
        lead = await self.session.get(Lead, lead_id)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")

        # Convert update data to dict, excluding unset fields
        update_data = data.model_dump(exclude_unset=True)

        # Update only the fields provided in the request 
        for key, value in update_data.items():
            setattr(lead, key, value)

        # Save changes
        self.session.add(lead)
        await self.session.commit()
        await self.session.refresh(lead)

        return lead.model_dump()


    async def delete_lead(self, lead_id: uuid.UUID) -> bool:
        lead = await self.session.get(Lead, lead_id)
        if not lead:
            return False
        await self.session.delete(lead)
        await self.session.commit()
        return True
 