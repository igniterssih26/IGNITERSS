from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from app.database import Base

class DownstreamDispatch(Base):
    __tablename__ = "downstream_dispatches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    block_id = Column(String, index=True) # e.g. BR-2026-0138, BR-2026-0142
    unit_order = Column(Integer, nullable=False) # 1 to 6
    unit_name = Column(String, nullable=False) # 1. ENGINEERING DEPT, 2. SIGNAL & TELECOM, etc.
    recipient_role = Column(String, nullable=False) # SSE / Permanent Way (Salem), Section Controller (S&T), etc.
    sent_timestamp = Column(String, nullable=False) # 10:48:02
    status = Column(String, default="SENT") # SENT, ACKNOWLEDGED
    acknowledged_by = Column(String, nullable=True)
    acknowledged_time = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ActivePossession(Base):
    __tablename__ = "active_possessions"

    block_id = Column(String, primary_key=True, index=True) # e.g. BR-2026-0138, BR-2026-0140, BR-2026-0142
    section = Column(String, nullable=False) # Chennai - Arakkonam, Salem - Erode
    department = Column(String, nullable=False) # SIGNAL, ENGINEERING, ELECTRICAL
    start_time = Column(String, nullable=False) # 10:00, 11:00, 12:10
    end_time = Column(String, nullable=False)   # 11:30, 13:00, 13:40
    trains_affected = Column(Integer, default=0)
    status = Column(String, default="ACTIVE") # ACTIVE, ON SCHEDULE, COMPLETED
    remaining_display = Column(String, default="00:28:14")
    total_seconds_duration = Column(Integer, default=5400) # 90 min
    elapsed_seconds = Column(Integer, default=1800)
    resource_gang = Column(String, default="Gang #4")
    created_at = Column(DateTime, default=datetime.utcnow)
