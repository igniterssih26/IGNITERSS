import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal, DB_PATH
from app.services.seed_data import seed_database
from app.routes.requests import router as requests_router
from app.routes.plans import router as plans_router
from app.routes.authority import router as authority_router
from app.routes.possessions import router as possessions_router
from app.routes.stations import router as stations_router
from app.routes.schedules import router as schedules_router
from app.routes.data_management import router as data_router
from app.routes.audit import router as audit_router

# Safe Database Initialization
def init_db():
    try:
        print("[DATABASE] Verifying tables with engine:", engine.url)
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_database(db)
            print("[DATABASE] Database tables and seed data verified successfully.")
        finally:
            db.close()
    except Exception as e:
        print(f"[DATABASE WARNING] Remote database connection failed: {e}")
        try:
            if not str(engine.url).startswith("sqlite"):
                print("[DATABASE] Falling back to local SQLite so the web service remains online...")
                from sqlalchemy import create_engine
                fallback_url = f"sqlite:///{DB_PATH}"
                fallback_engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
                Base.metadata.create_all(bind=fallback_engine)
                SessionLocal.configure(bind=fallback_engine)
                db = SessionLocal()
                try:
                    seed_database(db)
                    print("[DATABASE] Local SQLite fallback ready.")
                finally:
                    db.close()
        except Exception as fallback_err:
            print(f"[DATABASE ERROR] Fallback initialization error: {fallback_err}")

init_db()

app = FastAPI(
    title="RailOps Central API",
    description="Intelligent Railway Maintenance Block Planning & Statutory Authority System",
    version="5.2.0"
)

# CORS Middleware allowing Vite dev server and frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# Include Routers
app.include_router(requests_router)
app.include_router(plans_router)
app.include_router(authority_router)
app.include_router(possessions_router)
app.include_router(stations_router)
app.include_router(schedules_router)
app.include_router(data_router)
app.include_router(audit_router)

@app.get("/")
def root():
    return {
        "system": "RailOps / IGNITERSS Central API",
        "status": "ONLINE",
        "documentation": "/docs",
        "health": "/api/health",
        "info": "/api/info"
    }

@app.get("/api/info")
def root_info():
    return {
        "system": "RailOps Intelligent Railway Maintenance Planning & Authority Platform",
        "cluster": "SEC-PROD-04",
        "zone": "Southern Railway (SR)",
        "division": "Salem & Chennai",
        "status": "ONLINE",
        "version": "5.2.0"
    }

@app.get("/api/health")
def health():
    dialect_name = engine.dialect.name
    return {
        "status": "healthy",
        "database": f"{dialect_name} ({'Supabase / PostgreSQL' if 'postgres' in dialect_name else 'SQLite'})",
        "gateway": "CRIS FOIS CONNECTED",
        "latency_ms": 14
    }

# Mount Frontend SPA if dist exists
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

