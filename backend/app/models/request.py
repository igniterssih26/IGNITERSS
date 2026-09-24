from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from app.database import Base

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    request_id = Column(String, primary_key=True, index=True) # e.g. BR-2026-0142
    department = Column(String, nullable=False, index=True) # Engineering, S&T, TRD
    dept_ref = Column(String, default="TMS") # TMS, SMMS, TDMS
    station_code = Column(String, nullable=False, index=True) # e.g. SA
    zone = Column(String, default="SR") # Southern Railway
    segment = Column(String, nullable=False) # e.g. Salem - Erode (KM 334/12 - 338/04)
    track = Column(String, default="UP LINE") # UP LINE, DN LINE, YARD, MAIN
    asset_id = Column(String, nullable=True) # e.g. TMS-001
    maintenance_type = Column(String, nullable=False) # TRACK MAINTENANCE, SIGNAL MAINTENANCE, etc.
    description = Column(Text, nullable=True)
    requested_date = Column(String, nullable=False) # YYYY-MM-DD e.g. 2026-09-26
    requested_start_time = Column(String, nullable=False) # HH:MM e.g. 11:30
    requested_end_time = Column(String, nullable=False) # HH:MM e.g. 13:00
    duration_minutes = Column(Integer, default=90)
    priority = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    urgency = Column(String, default="High") # Standard, High, Immediate
    asset_criticality = Column(String, default="Tier-1")
    reason = Column(Text, nullable=True)
    
    # Lifecycle Status:
    # DRAFT, SUBMITTED, UNDER ANALYSIS, PLANNED, SENT FOR APPROVAL, APPROVED, MODIFIED, REJECTED, SCHEDULED, ACTIVE, COMPLETED
    status = Column(String, default="SUBMITTED", index=True)
    conflict_flag = Column(String, default="PENDING") # PENDING, CONFLICT DETECTED, RESOLVED, CLEAR
    conflict_summary = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
