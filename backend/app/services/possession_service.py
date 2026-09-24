import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.dispatch import ActivePossession
from app.models.request import MaintenanceRequest
from app.models.plan import MaintenancePlan
from app.models.station import Station, StationMaintenanceHistory
from app.models.audit import AuditLog

def complete_maintenance_block(db: Session, block_id: str, station_code: str = "SA",
                               actual_start: str = "12:10", actual_end: str = "13:40",
                               work_summary: str = "Track inspection and destressing completed successfully",
                               crew_gang: str = "Gang #4"):
    possession = db.query(ActivePossession).filter(ActivePossession.block_id == block_id).first()
    if possession:
        possession.status = "COMPLETED"
        possession.remaining_display = "00:00:00"

    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.request_id == block_id).first()
    if req:
        req.status = "COMPLETED"
        station_code = req.station_code or station_code

    plan = db.query(MaintenancePlan).filter(MaintenancePlan.request_id == block_id).first()
    if plan:
        plan.status = "COMPLETED"

    # Fetch station details
    station = db.query(Station).filter(Station.station_code == station_code).first()
    station_name = station.station_name if station else "Salem Junction"

    now = datetime.now()
    mnt_id = f"MNT-{random.randint(10485, 19999)}"

    # Add to Station Maintenance History
    history_entry = StationMaintenanceHistory(
        maintenance_id=mnt_id,
        station_code=station_code,
        station_name=station_name,
        department=req.department if req else "Engineering",
        asset_id=req.asset_id if req else "TMS-002",
        track=req.track if req else "Track 2",
        maintenance_type=req.maintenance_type if req else "Thermit Weld Repair & Destressing",
        date=now.strftime("%d %b %Y"),
        year=now.year,
        month=now.strftime("%B"),
        start_time=actual_start,
        end_time=actual_end,
        duration_str="1 hr 30 min",
        description=work_summary,
        status="Completed",
        crew_gang=crew_gang
    )
    db.add(history_entry)

    # Increment station total works
    if station:
        station.total_maintenance_works += 1
        station.last_maintenance_date = now.strftime("%d %b %Y")

    audit = AuditLog(
        user="Site Supervisor",
        role="ENGINEERING",
        action="Maintenance Completed",
        entity_type="POSSESSION",
        entity_id=block_id,
        previous_status="ACTIVE",
        new_status="COMPLETED",
        comments=f"Track possession released. Logged in Station History as {mnt_id}"
    )
    db.add(audit)
    db.commit()
    return history_entry
