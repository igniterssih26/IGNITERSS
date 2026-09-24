from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class RequestCreate(BaseModel):
    department: str = Field(..., example="Engineering")
    dept_ref: Optional[str] = Field("TMS", example="TMS")
    station_code: str = Field(..., example="SA")
    zone: Optional[str] = Field("SR", example="SR")
    segment: str = Field(..., example="Salem - Erode (KM 334/12 - 338/04)")
    track: Optional[str] = Field("UP LINE", example="UP LINE")
    asset_id: Optional[str] = Field(None, example="TMS-002")
    maintenance_type: str = Field(..., example="TRACK MAINTENANCE")
    description: Optional[str] = Field("", example="Thermit weld repair and destressing")
    requested_date: str = Field(..., example="2026-09-26")
    requested_start_time: str = Field(..., example="11:30")
    requested_end_time: str = Field(..., example="13:00")
    duration_minutes: Optional[int] = Field(90, example=90)
    priority: Optional[str] = Field("HIGH", example="HIGH")
    urgency: Optional[str] = Field("High", example="High")
    asset_criticality: Optional[str] = Field("Tier-1", example="Tier-1")
    reason: Optional[str] = Field("", example="Defect detected during USFD testing")

class RequestResponse(BaseModel):
    request_id: str
    department: str
    dept_ref: Optional[str]
    station_code: str
    zone: str
    segment: str
    track: str
    asset_id: Optional[str]
    maintenance_type: str
    description: Optional[str]
    requested_date: str
    requested_start_time: str
    requested_end_time: str
    duration_minutes: int
    priority: str
    urgency: str
    asset_criticality: str
    reason: Optional[str]
    status: str
    conflict_flag: str
    conflict_summary: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
