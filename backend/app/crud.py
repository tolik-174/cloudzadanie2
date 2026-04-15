from sqlalchemy.orm import Session

from app.models import Meeting
from app.schemas import MeetingCreate


def create_meeting(db: Session, meeting_data: MeetingCreate, summary: str, action_items: str):
    meeting = Meeting(
        title=meeting_data.title,
        transcript=meeting_data.transcript,
        summary=summary,
        action_items=action_items
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def get_all_meetings(db: Session):
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()


def get_meeting_by_id(db: Session, meeting_id: int):
    return db.query(Meeting).filter(Meeting.id == meeting_id).first()