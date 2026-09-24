from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class PlanResponse(BaseModel):
    plan_id: str
    plan_code: str
    request_id: str
    department: str
    station_code: str
    zone: str
    segment: str
    track: str
    maintenance_type: str
    requested_date: str
    requested_start_time: str
    requested_end_time: str
    recommended_date: str
    recommended_start_time: str
    recommended_end_time: str
    duration_minutes: int
    priority: str
    risk_level: str
    operational_impact: str
    reason_for_recommendation: Optional[str]
    conflicts_detected: int
    delay_impact_min: int
    resource_util_pct: int
    recovered_trains: int
    resource_gang: str
    is_recommended: bool
    tier_resolution: str
    status: str

    class Config:
        from_attributes = True

class PlanGenerateRequest(BaseModel):
    request_id: str

class PlanApproveRequest(BaseModel):
    plan_id: str
    authority_user: Optional[str] = "Chief Controller"
    officer_id: Optional[str] = "CO MAS 4091"
    comments: Optional[str] = "Statutory sign-off granted. All safety clearances verified."

class PlanModifyRequest(BaseModel):
    plan_id: str
    modified_date: str
    modified_start_time: str
    modified_end_time: str
    modified_duration: int
    modified_track: str
    modified_priority: str
    operational_notes: Optional[str] = "Adjusted to clear passenger peak window."
    modified_by: Optional[str] = "Chief Controller"

class PlanRejectRequest(BaseModel):
    plan_id: str
    rejection_reason: str # Operational Conflict, Insufficient Availability, Train Impact, Incorrect Timing, Maintenance Issue, Other
    comments: Optional[str] = "Rejected due to critical passenger traffic window."
    authority_user: Optional[str] = "Chief Controller"
    officer_id: Optional[str] = "CO MAS 4091"

class DispatchResponse(BaseModel):
    id: int
    block_id: str
    unit_order: int
    unit_name: str
    recipient_role: str
    sent_timestamp: str
    status: str
    acknowledged_by: Optional[str]
    acknowledged_time: Optional[str]

    class Config:
        from_attributes = True

class ActivePossessionResponse(BaseModel):
    block_id: str
    section: str
    department: str
    start_time: str
    end_time: str
    trains_affected: int
    status: str
    remaining_display: str
    total_seconds_duration: int
    elapsed_seconds: int
    resource_gang: str

    class Config:
        from_attributes = True

class DecisionResponse(BaseModel):
    id: int
    plan_id: str
    request_id: str
    decision: str
    authority_user: str
    officer_id: str
    decision_date: str
    decision_time: str
    comments: Optional[str]
    rejection_reason: Optional[str]

    class Config:
        from_attributes = True
