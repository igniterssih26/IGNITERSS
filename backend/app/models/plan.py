from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class MaintenancePlan(Base):
    __tablename__ = "maintenance_plans"

    plan_id = Column(String, primary_key=True, index=True) # e.g. PLAN-BR-2026-0142-A
    plan_code = Column(String, default="PLAN A") # PLAN A (RECOMMENDED), PLAN B, PLAN C
    request_id = Column(String, ForeignKey("maintenance_requests.request_id"), nullable=False, index=True)
    department = Column(String, nullable=False)
    station_code = Column(String, nullable=False)
    zone = Column(String, default="SR")
    segment = Column(String, nullable=False)
    track = Column(String, default="MAIN")
    maintenance_type = Column(String, nullable=False)
    
    # Requested vs Recommended
    requested_date = Column(String, nullable=False)
    requested_start_time = Column(String, nullable=False)
    requested_end_time = Column(String, nullable=False)
    
    recommended_date = Column(String, nullable=False)
    recommended_start_time = Column(String, nullable=False) # e.g. 12:10
    recommended_end_time = Column(String, nullable=False)   # e.g. 13:40
    duration_minutes = Column(Integer, default=90)
    
    priority = Column(String, default="HIGH")
    risk_level = Column(String, default="LOW")
    operational_impact = Column(String, default="ACCEPTABLE SLA")
    reason_for_recommendation = Column(Text, nullable=True)
    conflicts_detected = Column(Integer, default=0)
    
    # Metrics
    delay_impact_min = Column(Integer, default=18)
    resource_util_pct = Column(Integer, default=84)
    recovered_trains = Column(Integer, default=3)
    resource_gang = Column(String, default="GANG #4 & TAMP")
    is_recommended = Column(Boolean, default=True)
    tier_resolution = Column(String, default="TIER-1 RESOLUTION")
    
    # Status: GENERATED, SENT FOR APPROVAL, APPROVED, MODIFIED, REJECTED, SCHEDULED, ACTIVE, COMPLETED
    status = Column(String, default="GENERATED", index=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PlanDecision(Base):
    __tablename__ = "plan_decisions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plan_id = Column(String, ForeignKey("maintenance_plans.plan_id"), nullable=False, index=True)
    request_id = Column(String, nullable=False)
    decision = Column(String, nullable=False) # ACCEPTED, MODIFIED, REJECTED
    authority_user = Column(String, default="Chief Controller")
    officer_id = Column(String, default="CO MAS 4091")
    decision_date = Column(String, nullable=False)
    decision_time = Column(String, nullable=False)
    comments = Column(Text, nullable=True)
    rejection_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class PlanModification(Base):
    __tablename__ = "plan_modifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plan_id = Column(String, ForeignKey("maintenance_plans.plan_id"), nullable=False, index=True)
    request_id = Column(String, nullable=False)
    original_date = Column(String, nullable=False)
    original_start_time = Column(String, nullable=False)
    original_end_time = Column(String, nullable=False)
    original_duration = Column(Integer, nullable=False)
    original_track = Column(String, nullable=False)
    
    modified_date = Column(String, nullable=False)
    modified_start_time = Column(String, nullable=False)
    modified_end_time = Column(String, nullable=False)
    modified_duration = Column(Integer, nullable=False)
    modified_track = Column(String, nullable=False)
    modified_priority = Column(String, nullable=False)
    operational_notes = Column(Text, nullable=True)
    modified_by = Column(String, default="Chief Controller")
    created_at = Column(DateTime, default=datetime.utcnow)
