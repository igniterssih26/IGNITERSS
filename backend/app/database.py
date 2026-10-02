import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import urllib.parse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "railops.db")
raw_url = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

def normalize_database_url(url: str) -> str:
    url = url.strip()
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    # Auto-encode password if special characters like '@' exist in password
    if url.startswith("postgresql://") or url.startswith("postgresql+psycopg://"):
        try:
            proto, rest = url.split("://", 1)
            if "@" in rest:
                # The host starts after the last '@'
                creds, host_part = rest.rsplit("@", 1)
                if ":" in creds:
                    username, password = creds.split(":", 1)
                    if "%" not in password:
                        password = urllib.parse.quote_plus(password)
                    url = f"{proto}://{username}:{password}@{host_part}"
        except Exception:
            pass
    return url

SQLALCHEMY_DATABASE_URL = normalize_database_url(raw_url)

try:
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            connect_args={"check_same_thread": False}
        )
    else:
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300
        )
except Exception as e:
    print(f"[DATABASE ENGINE WARNING] Error creating engine for {SQLALCHEMY_DATABASE_URL}: {e}")
    print("[DATABASE ENGINE] Falling back to SQLite engine to keep service alive.")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
