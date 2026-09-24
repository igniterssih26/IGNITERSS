from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = Column(String, default="System")
    role = Column(String, default="OPERATOR") # ENGINEERING, S&T, TRD, PLANNER, CHIEF_CONTROLLER, ADMIN
    action = Column(String, nullable=False) # Request Created, Plan Generated, Plan Accepted, etc.
    entity_type = Column(String, default="REQUEST") # REQUEST, PLAN, BLOCK, POSSESSION, DATA_IMPORT
    entity_id = Column(String, nullable=False)
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)
    comments = Column(Text, nullable=True)


class DataSource(Base):
    __tablename__ = "data_sources"

    source_id = Column(String, primary_key=True, index=True) # SRC-001
    source_name = Column(String, nullable=False) # Indian Railways Southern Zone Corridor Feed
    source_type = Column(String, nullable=False) # CSV, JSON, SIMULATION, MANUAL, API
    file_name = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    imported_at = Column(DateTime, default=datetime.utcnow)
    last_updated_at = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=True)


class DataImportLog(Base):
    __tablename__ = "data_import_logs"

    import_id = Column(String, primary_key=True, index=True) # IMP-2026-001
    filename = Column(String, nullable=False)
    source_type = Column(String, default="CSV")
    import_time = Column(DateTime, default=datetime.utcnow)
    total_rows = Column(Integer, default=0)
    successful_rows = Column(Integer, default=0)
    failed_rows = Column(Integer, default=0)
    duplicate_rows = Column(Integer, default=0)
    warnings = Column(Integer, default=0)
    errors = Column(Integer, default=0)
    status = Column(String, default="Completed") # Completed, Completed with warnings, Failed
    notes = Column(Text, nullable=True)
