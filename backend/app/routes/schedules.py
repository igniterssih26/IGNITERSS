from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.request import MaintenanceRequest
from app.models.plan import MaintenancePlan

router = APIRouter(prefix="/api/schedules", tags=["Schedules"])

@router.get("/weekly")
def get_weekly_schedule(db: Session = Depends(get_db)):
    # Aggregates requests and plans into a Mon-Sun weekly schedule
    requests = db.query(MaintenanceRequest).all()
    plans_by_req = {p.request_id: p for p in db.query(MaintenancePlan).filter(MaintenancePlan.is_recommended == True).all()}

    items = []
    for r in requests:
        plan = plans_by_req.get(r.request_id)
        items.append({
            "request_id": r.request_id,
            "station": r.station_code,
            "department": r.department,
            "segment": r.segment,
            "track": r.track,
            "maintenance_type": r.maintenance_type,
            "requested_date": r.requested_date,
            "requested_time": f"{r.requested_start_time} - {r.requested_end_time}",
            "planned_time": f"{plan.recommended_start_time} - {plan.recommended_end_time}" if plan else f"{r.requested_start_time} - {r.requested_end_time}",
            "duration": f"{r.duration_minutes} min",
            "priority": r.priority,
            "status": plan.status if plan and plan.status in ["APPROVED", "MODIFIED", "SCHEDULED", "COMPLETED"] else r.status,
            "impact": plan.operational_impact if plan else "EVALUATING"
        })
    return items

@router.get("/monthly")
def get_monthly_schedule(month: str = "2026-09", db: Session = Depends(get_db)):
    requests = db.query(MaintenanceRequest).all()
    plans = {p.request_id: p for p in db.query(MaintenancePlan).all()}

    # Group activities by date
    days_data: Dict[str, List[Dict[str, Any]]] = {}
    for r in requests:
        dt = r.requested_date
        if dt not in days_data:
            days_data[dt] = []
        p = plans.get(r.request_id)
        days_data[dt].append({
            "id": r.request_id,
            "department": r.department,
            "type": r.maintenance_type,
            "location": r.segment,
            "priority": r.priority,
            "status": p.status if p and p.status in ["APPROVED", "MODIFIED", "SCHEDULED", "COMPLETED"] else r.status,
            "time": f"{p.recommended_start_time if p else r.requested_start_time} - {p.recommended_end_time if p else r.requested_end_time}"
        })

    return {
        "month": month,
        "calendar_days": days_data
    }
