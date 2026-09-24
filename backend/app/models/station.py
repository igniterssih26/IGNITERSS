from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from app.database import Base

class Station(Base):
    __tablename__ = "stations"

    station_code = Column(String, primary_key=True, index=True) # e.g. MAS, SA, ED, CBE, AJJ
    station_name = Column(String, nullable=False) # e.g. Chennai Central, Salem Junction
    zone = Column(String, default="SR")
    division = Column(String, default="Salem Division")
    location = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    total_maintenance_works = Column(Integer, default=0)
    last_maintenance_date = Column(String, nullable=True)
    departments_involved = Column(String, default="Engineering, TRD, S&T")
    current_status = Column(String, default="OPERATIONAL")


class RailwaySection(Base):
    __tablename__ = "railway_sections"

    section_id = Column(String, primary_key=True, index=True) # e.g. SEC-SA-ED
    section_name = Column(String, nullable=False) # Salem - Erode
    from_station_code = Column(String, nullable=False)
    to_station_code = Column(String, nullable=False)
    km_start = Column(Float, default=334.0)
    km_end = Column(Float, default=396.0)
    line_type = Column(String, default="DOUBLE LINE") # DOUBLE LINE, QUAD, SINGLE
    max_speed_kmh = Column(Integer, default=110)
    electrified = Column(String, default="YES (25KV AC)")


class TrackAsset(Base):
    __tablename__ = "track_assets"

    asset_id = Column(String, primary_key=True, index=True) # TMS-001, TMS-002, SMMS-004, TDMS-003, TMS-005
    department = Column(String, nullable=False) # Engineering, S&T, TRD
    dept_ref = Column(String, default="TMS") # TMS, SMMS, TDMS
    asset_type = Column(String, nullable=False) # Track, Signal, OHE, Interlock
    activity_description = Column(String, nullable=False) # Track Inspection (Ultrasonic USFD)
    location = Column(String, nullable=False) # KM 102/4 UP, PODANUR YARD, KM 145/2
    station_code = Column(String, nullable=False)
    priority = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    schedule_date = Column(String, nullable=False) # 18 SEP 2026, 20 SEP 2026
    status = Column(String, default="UPCOMING") # COMPLETED, OVERDUE, REQUESTED, UPCOMING
    last_maintenance_date = Column(String, nullable=True)
    condition_rating = Column(String, default="Good")


class StationMaintenanceHistory(Base):
    __tablename__ = "station_maintenance_history"

    maintenance_id = Column(String, primary_key=True, index=True) # MNT-10482
    station_code = Column(String, nullable=False, index=True) # SA, MAS, ED, etc.
    station_name = Column(String, nullable=False)
    department = Column(String, nullable=False) # Engineering, TRD, S&T
    asset_id = Column(String, nullable=True)
    track = Column(String, default="Track 2")
    maintenance_type = Column(String, nullable=False) # Preventive Maintenance, Rail Joint Replacement
    date = Column(String, nullable=False) # 18 Sep 2026
    year = Column(Integer, default=2026)
    month = Column(String, default="September")
    start_time = Column(String, default="18:00")
    end_time = Column(String, default="20:00")
    duration_str = Column(String, default="2 hours")
    description = Column(Text, nullable=True)
    status = Column(String, default="Completed")
    crew_gang = Column(String, default="Gang #4")
    created_at = Column(DateTime, default=datetime.utcnow)
