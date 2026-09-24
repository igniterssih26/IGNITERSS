from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class StationResponse(BaseModel):
    station_code: str
    station_name: str
    zone: str
    division: str
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    total_maintenance_works: int
    last_maintenance_date: Optional[str]
    departments_involved: str
    current_status: str

    class Config:
        from_attributes = True

class TrackAssetResponse(BaseModel):
    asset_id: str
    department: str
    dept_ref: str
    asset_type: str
    activity_description: str
    location: str
    station_code: str
    priority: str
    schedule_date: str
    status: str
    last_maintenance_date: Optional[str]
    condition_rating: str

    class Config:
        from_attributes = True

class MaintenanceHistoryResponse(BaseModel):
    maintenance_id: str
    station_code: str
    station_name: str
    department: str
    asset_id: Optional[str]
    track: str
    maintenance_type: str
    date: str
    year: int
    month: str
    start_time: str
    end_time: str
    duration_str: str
    description: Optional[str]
    status: str
    crew_gang: str

    class Config:
        from_attributes = True

class MaintenanceCompleteRequest(BaseModel):
    block_id: str
    station_code: Optional[str] = "SA"
    actual_start_time: Optional[str] = "12:10"
    actual_end_time: Optional[str] = "13:40"
    work_summary: Optional[str] = "Track inspection and destressing completed within scheduled window."
    crew_gang: Optional[str] = "Gang #4"
