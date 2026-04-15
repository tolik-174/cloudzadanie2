from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MeetingCreate(BaseModel):
    title: str
    transcript: str


class MeetingResponse(BaseModel):
    id: int
    title: str
    transcript: str
    summary: Optional[str] = None
    action_items: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True