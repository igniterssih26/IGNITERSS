from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.audit import AuditLog
from app.schemas.data_schemas import AuditLogResponse

router = APIRouter(prefix="/api/audit", tags=["Audit"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
