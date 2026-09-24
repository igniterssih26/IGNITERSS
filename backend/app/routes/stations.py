from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.station import Station, StationMaintenanceHistory, RailwaySection
from app.schemas.station_schemas import StationResponse, MaintenanceHistoryResponse

router = APIRouter(prefix="/api/stations", tags=["Stations"])

@router.get("", response_model=List[StationResponse])
def get_stations(db: Session = Depends(get_db)):
    return db.query(Station).order_by(Station.station_name.asc()).all()

@router.get("/{station_code}", response_model=StationResponse)
def get_station(station_code: str, db: Session = Depends(get_db)):
    st = db.query(Station).filter(Station.station_code == station_code.upper()).first()
    if not st:
        raise HTTPException(status_code=404, detail="Station not found")
    return st

@router.get("/{station_code}/history", response_model=List[MaintenanceHistoryResponse])
def get_station_history(station_code: str, db: Session = Depends(get_db)):
    return db.query(StationMaintenanceHistory).filter(
        StationMaintenanceHistory.station_code == station_code.upper()
    ).order_by(StationMaintenanceHistory.id.desc() if hasattr(StationMaintenanceHistory, 'id') else StationMaintenanceHistory.date.desc()).all()

@router.get("/network/sections")
def get_railway_sections(db: Session = Depends(get_db)):
    sections = db.query(RailwaySection).all()
    return [
        {
            "section_id": s.section_id,
            "section_name": s.section_name,
            "from_station_code": s.from_station_code,
            "to_station_code": s.to_station_code,
            "km_start": s.km_start,
            "km_end": s.km_end,
            "line_type": s.line_type,
            "max_speed_kmh": s.max_speed_kmh,
            "electrified": s.electrified
        }
        for s in sections
    ]

# Global history search endpoint
@router.get("/records/search", response_model=List[MaintenanceHistoryResponse])
def search_maintenance_history(
    q: Optional[str] = None,
    station: Optional[str] = None,
    department: Optional[str] = None,
    year: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StationMaintenanceHistory)
    if station and station != "ALL":
        query = query.filter(StationMaintenanceHistory.station_code == station)
    if department and department != "ALL":
        query = query.filter(StationMaintenanceHistory.department.ilike(f"%{department}%"))
    if year:
        query = query.filter(StationMaintenanceHistory.year == year)
    if status and status != "ALL":
        query = query.filter(StationMaintenanceHistory.status == status)
    if q:
        query = query.filter(
            or_(
                StationMaintenanceHistory.maintenance_id.ilike(f"%{q}%"),
                StationMaintenanceHistory.station_name.ilike(f"%{q}%"),
                StationMaintenanceHistory.asset_id.ilike(f"%{q}%"),
                StationMaintenanceHistory.description.ilike(f"%{q}%"),
                StationMaintenanceHistory.maintenance_type.ilike(f"%{q}%"),
            )
        )
    return query.all()
