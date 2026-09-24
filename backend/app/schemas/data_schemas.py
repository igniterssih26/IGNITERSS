from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class DataSourceResponse(BaseModel):
    source_id: str
    source_name: str
    source_type: str
    file_name: Optional[str]
    imported_at: Optional[datetime]
    description: Optional[str]

    class Config:
        from_attributes = True

class DataImportLogResponse(BaseModel):
    import_id: str
    filename: str
    source_type: str
    import_time: Optional[datetime]
    total_rows: int
    successful_rows: int
    failed_rows: int
    duplicate_rows: int
    warnings: int
    errors: int
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user: str
    role: str
    action: str
    entity_type: str
    entity_id: str
    previous_status: Optional[str]
    new_status: Optional[str]
    comments: Optional[str]

    class Config:
        from_attributes = True

class QualityReportItem(BaseModel):
    dataset_name: str
    source_type: str
    total_records: int
    valid_records: int
    missing_fields_count: int
    duplicate_records_count: int
    quality_score_pct: float
    status: str
