from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    transcript = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    action_items = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())