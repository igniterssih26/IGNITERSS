from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float, Boolean
from app.database import Base

class Train(Base):
    __tablename__ = "trains"

    train_number = Column(String, primary_key=True, index=True) # 12675, 12691, 0942
    train_name = Column(String, nullable=False) # Kovai Superfast Express, Nilgiri Express
    train_type = Column(String, default="SUPERFAST EXPRESS") # EXPRESS, SUPERFAST, PASSENGER, FREIGHT
    origin = Column(String, default="MAS")
    destination = Column(String, default="CBE")
    corridor = Column(String, default="South Corridor")
    priority = Column(Integer, default=1) # 1 is highest
    goods_train_indicator = Column(Boolean, default=False)


class TrainSchedule(Base):
    __tablename__ = "train_schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    train_number = Column(String, index=True)
    section_id = Column(String, index=True) # SEC-SA-ED, SEC-MAS-AJJ
    station_code = Column(String, index=True)
    scheduled_arrival = Column(String, nullable=False) # HH:MM
    scheduled_departure = Column(String, nullable=False) # HH:MM
    direction = Column(String, default="DOWN") # UP, DOWN
    route_line = Column(String, default="MAIN LINE")


class TrainMovement(Base):
    __tablename__ = "train_movements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    train_number = Column(String, index=True)
    current_section = Column(String, nullable=False)
    status = Column(String, default="ON TIME") # ON TIME, DELAYED (+18m), ALERT
    delay_minutes = Column(Integer, default=0)
    current_speed = Column(Integer, default=95)
    last_reported_time = Column(String, default="11:32:00")
