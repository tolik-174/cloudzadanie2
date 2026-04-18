from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import MeetingCreate, MeetingResponse
from app.crud import create_meeting, get_all_meetings, get_meeting_by_id
from app.services.summarizer import generate_summary, extract_action_items
from app.crud import create_meeting, get_all_meetings, get_meeting_by_id, delete_meeting

router = APIRouter(prefix="/meetings", tags=["Meetings"])


@router.post("/text", response_model=MeetingResponse)
def create_meeting_from_text(meeting: MeetingCreate, db: Session = Depends(get_db)):
    summary = generate_summary(meeting.transcript)
    action_items = extract_action_items(meeting.transcript)

    created = create_meeting(db, meeting, summary, action_items)
    return created


@router.get("", response_model=list[MeetingResponse])
def read_meetings(db: Session = Depends(get_db)):
    return get_all_meetings(db)


@router.get("/{meeting_id}", response_model=MeetingResponse)
def read_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = get_meeting_by_id(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting
@router.delete("/{meeting_id}")
def remove_meeting(meeting_id: int, db: Session = Depends(get_db)):
    deleted_meeting = delete_meeting(db, meeting_id)

    if not deleted_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    return {"message": "Meeting deleted successfully"}