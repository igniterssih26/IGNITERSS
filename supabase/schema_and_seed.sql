-- ==============================================================================
-- RAILOPS / IGNITERSS — COMPLETE SUPABASE POSTGRESQL SCHEMA & INITIAL DATA SEED
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click on "SQL Editor" in the left sidebar.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
-- ==============================================================================

-- 1. STATIONS TABLE
CREATE TABLE IF NOT EXISTS stations (
    station_code VARCHAR PRIMARY KEY,
    station_name VARCHAR NOT NULL,
    zone VARCHAR DEFAULT 'SR',
    division VARCHAR DEFAULT 'Salem Division',
    location VARCHAR NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    total_maintenance_works INTEGER DEFAULT 0,
    last_maintenance_date VARCHAR,
    departments_involved VARCHAR DEFAULT 'Engineering, TRD, S&T',
    current_status VARCHAR DEFAULT 'OPERATIONAL'
);
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations (station_code);

-- 2. RAILWAY SECTIONS TABLE
CREATE TABLE IF NOT EXISTS railway_sections (
    section_id VARCHAR PRIMARY KEY,
    section_name VARCHAR NOT NULL,
    from_station_code VARCHAR NOT NULL,
    to_station_code VARCHAR NOT NULL,
    km_start DOUBLE PRECISION DEFAULT 334.0,
    km_end DOUBLE PRECISION DEFAULT 396.0,
    line_type VARCHAR DEFAULT 'DOUBLE LINE',
    max_speed_kmh INTEGER DEFAULT 110,
    electrified VARCHAR DEFAULT 'YES (25KV AC)'
);
CREATE INDEX IF NOT EXISTS idx_sections_id ON railway_sections (section_id);

-- 3. TRACK ASSETS TABLE
CREATE TABLE IF NOT EXISTS track_assets (
    asset_id VARCHAR PRIMARY KEY,
    department VARCHAR NOT NULL,
    dept_ref VARCHAR DEFAULT 'TMS',
    asset_type VARCHAR NOT NULL,
    activity_description VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    station_code VARCHAR NOT NULL,
    priority VARCHAR DEFAULT 'HIGH',
    schedule_date VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'UPCOMING',
    last_maintenance_date VARCHAR,
    condition_rating VARCHAR DEFAULT 'Good'
);
CREATE INDEX IF NOT EXISTS idx_track_assets_id ON track_assets (asset_id);

-- 4. STATION MAINTENANCE HISTORY TABLE
CREATE TABLE IF NOT EXISTS station_maintenance_history (
    maintenance_id VARCHAR PRIMARY KEY,
    station_code VARCHAR NOT NULL,
    station_name VARCHAR NOT NULL,
    department VARCHAR NOT NULL,
    asset_id VARCHAR,
    track VARCHAR DEFAULT 'Track 2',
    maintenance_type VARCHAR NOT NULL,
    date VARCHAR NOT NULL,
    year INTEGER DEFAULT 2026,
    month VARCHAR DEFAULT 'September',
    start_time VARCHAR DEFAULT '18:00',
    end_time VARCHAR DEFAULT '20:00',
    duration_str VARCHAR DEFAULT '2 hours',
    description TEXT,
    status VARCHAR DEFAULT 'Completed',
    crew_gang VARCHAR DEFAULT 'Gang #4',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_smh_code ON station_maintenance_history (station_code);

-- 5. MAINTENANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id VARCHAR PRIMARY KEY,
    department VARCHAR NOT NULL,
    dept_ref VARCHAR DEFAULT 'TMS',
    station_code VARCHAR NOT NULL,
    zone VARCHAR DEFAULT 'SR',
    segment VARCHAR NOT NULL,
    track VARCHAR DEFAULT 'UP LINE',
    asset_id VARCHAR,
    maintenance_type VARCHAR NOT NULL,
    description TEXT,
    requested_date VARCHAR NOT NULL,
    requested_start_time VARCHAR NOT NULL,
    requested_end_time VARCHAR NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    priority VARCHAR DEFAULT 'HIGH',
    urgency VARCHAR DEFAULT 'High',
    asset_criticality VARCHAR DEFAULT 'Tier-1',
    reason TEXT,
    status VARCHAR DEFAULT 'SUBMITTED',
    conflict_flag VARCHAR DEFAULT 'PENDING',
    conflict_summary TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mreq_id ON maintenance_requests (request_id);
CREATE INDEX IF NOT EXISTS idx_mreq_dept ON maintenance_requests (department);
CREATE INDEX IF NOT EXISTS idx_mreq_station ON maintenance_requests (station_code);
CREATE INDEX IF NOT EXISTS idx_mreq_status ON maintenance_requests (status);

-- 6. MAINTENANCE PLANS TABLE
CREATE TABLE IF NOT EXISTS maintenance_plans (
    plan_id VARCHAR PRIMARY KEY,
    plan_code VARCHAR DEFAULT 'PLAN A',
    request_id VARCHAR NOT NULL REFERENCES maintenance_requests(request_id) ON DELETE CASCADE,
    department VARCHAR NOT NULL,
    station_code VARCHAR NOT NULL,
    zone VARCHAR DEFAULT 'SR',
    segment VARCHAR NOT NULL,
    track VARCHAR DEFAULT 'MAIN',
    maintenance_type VARCHAR NOT NULL,
    requested_date VARCHAR NOT NULL,
    requested_start_time VARCHAR NOT NULL,
    requested_end_time VARCHAR NOT NULL,
    recommended_date VARCHAR NOT NULL,
    recommended_start_time VARCHAR NOT NULL,
    recommended_end_time VARCHAR NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    priority VARCHAR DEFAULT 'HIGH',
    risk_level VARCHAR DEFAULT 'LOW',
    operational_impact VARCHAR DEFAULT 'ACCEPTABLE SLA',
    reason_for_recommendation TEXT,
    conflicts_detected INTEGER DEFAULT 0,
    delay_impact_min INTEGER DEFAULT 18,
    resource_util_pct INTEGER DEFAULT 84,
    recovered_trains INTEGER DEFAULT 3,
    resource_gang VARCHAR DEFAULT 'GANG #4 & TAMP',
    is_recommended BOOLEAN DEFAULT TRUE,
    tier_resolution VARCHAR DEFAULT 'TIER-1 RESOLUTION',
    status VARCHAR DEFAULT 'GENERATED',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mplan_id ON maintenance_plans (plan_id);
CREATE INDEX IF NOT EXISTS idx_mplan_req_id ON maintenance_plans (request_id);
CREATE INDEX IF NOT EXISTS idx_mplan_status ON maintenance_plans (status);

-- 7. PLAN DECISIONS TABLE
CREATE TABLE IF NOT EXISTS plan_decisions (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR NOT NULL REFERENCES maintenance_plans(plan_id) ON DELETE CASCADE,
    request_id VARCHAR NOT NULL,
    decision VARCHAR NOT NULL,
    authority_user VARCHAR DEFAULT 'Chief Controller',
    officer_id VARCHAR DEFAULT 'CO MAS 4091',
    decision_date VARCHAR NOT NULL,
    decision_time VARCHAR NOT NULL,
    comments TEXT,
    rejection_reason VARCHAR,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pdec_plan_id ON plan_decisions (plan_id);

-- 8. PLAN MODIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS plan_modifications (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR NOT NULL REFERENCES maintenance_plans(plan_id) ON DELETE CASCADE,
    request_id VARCHAR NOT NULL,
    original_date VARCHAR NOT NULL,
    original_start_time VARCHAR NOT NULL,
    original_end_time VARCHAR NOT NULL,
    original_duration INTEGER NOT NULL,
    original_track VARCHAR NOT NULL,
    modified_date VARCHAR NOT NULL,
    modified_start_time VARCHAR NOT NULL,
    modified_end_time VARCHAR NOT NULL,
    modified_duration INTEGER NOT NULL,
    modified_track VARCHAR NOT NULL,
    modified_priority VARCHAR NOT NULL,
    operational_notes TEXT,
    modified_by VARCHAR DEFAULT 'Chief Controller',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pmod_plan_id ON plan_modifications (plan_id);

-- 9. TRAINS TABLE
CREATE TABLE IF NOT EXISTS trains (
    train_number VARCHAR PRIMARY KEY,
    train_name VARCHAR NOT NULL,
    train_type VARCHAR DEFAULT 'SUPERFAST EXPRESS',
    origin VARCHAR DEFAULT 'MAS',
    destination VARCHAR DEFAULT 'CBE',
    corridor VARCHAR DEFAULT 'South Corridor',
    priority INTEGER DEFAULT 1,
    goods_train_indicator BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_trains_num ON trains (train_number);

-- 10. TRAIN SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS train_schedules (
    id SERIAL PRIMARY KEY,
    train_number VARCHAR,
    section_id VARCHAR,
    station_code VARCHAR,
    scheduled_arrival VARCHAR NOT NULL,
    scheduled_departure VARCHAR NOT NULL,
    direction VARCHAR DEFAULT 'DOWN',
    route_line VARCHAR DEFAULT 'MAIN LINE'
);
CREATE INDEX IF NOT EXISTS idx_tsched_num ON train_schedules (train_number);
CREATE INDEX IF NOT EXISTS idx_tsched_sec ON train_schedules (section_id);
CREATE INDEX IF NOT EXISTS idx_tsched_st ON train_schedules (station_code);

-- 11. TRAIN MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS train_movements (
    id SERIAL PRIMARY KEY,
    train_number VARCHAR,
    current_section VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'ON TIME',
    delay_minutes INTEGER DEFAULT 0,
    current_speed INTEGER DEFAULT 95,
    last_reported_time VARCHAR DEFAULT '11:32:00'
);
CREATE INDEX IF NOT EXISTS idx_tmov_num ON train_movements (train_number);

-- 12. DOWNSTREAM DISPATCHES TABLE
CREATE TABLE IF NOT EXISTS downstream_dispatches (
    id SERIAL PRIMARY KEY,
    block_id VARCHAR,
    unit_order INTEGER NOT NULL,
    unit_name VARCHAR NOT NULL,
    recipient_role VARCHAR NOT NULL,
    sent_timestamp VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'SENT',
    acknowledged_by VARCHAR,
    acknowledged_time VARCHAR,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ddisp_blk ON downstream_dispatches (block_id);

-- 13. ACTIVE POSSESSIONS TABLE
CREATE TABLE IF NOT EXISTS active_possessions (
    block_id VARCHAR PRIMARY KEY,
    section VARCHAR NOT NULL,
    department VARCHAR NOT NULL,
    start_time VARCHAR NOT NULL,
    end_time VARCHAR NOT NULL,
    trains_affected INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'ACTIVE',
    remaining_display VARCHAR DEFAULT '00:28:14',
    total_seconds_duration INTEGER DEFAULT 5400,
    elapsed_seconds INTEGER DEFAULT 1800,
    resource_gang VARCHAR DEFAULT 'Gang #4',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_aposs_blk ON active_possessions (block_id);

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "user" VARCHAR DEFAULT 'System',
    role VARCHAR DEFAULT 'OPERATOR',
    action VARCHAR NOT NULL,
    entity_type VARCHAR DEFAULT 'REQUEST',
    entity_id VARCHAR NOT NULL,
    previous_status VARCHAR,
    new_status VARCHAR,
    comments TEXT
);

-- 15. DATA SOURCES TABLE
CREATE TABLE IF NOT EXISTS data_sources (
    source_id VARCHAR PRIMARY KEY,
    source_name VARCHAR NOT NULL,
    source_type VARCHAR NOT NULL,
    file_name VARCHAR,
    source_url VARCHAR,
    imported_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);
CREATE INDEX IF NOT EXISTS idx_dsrc_id ON data_sources (source_id);

-- 16. DATA IMPORT LOGS TABLE
CREATE TABLE IF NOT EXISTS data_import_logs (
    import_id VARCHAR PRIMARY KEY,
    filename VARCHAR NOT NULL,
    source_type VARCHAR DEFAULT 'CSV',
    import_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_rows INTEGER DEFAULT 0,
    successful_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    duplicate_rows INTEGER DEFAULT 0,
    warnings INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'Completed',
    notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_dimp_id ON data_import_logs (import_id);

-- ==============================================================================
-- INITIAL DATA SEEDING (Idempotent: Uses ON CONFLICT DO NOTHING)
-- ==============================================================================

-- 1. STATIONS SEED
INSERT INTO stations (station_code, station_name, zone, division, location, latitude, longitude, total_maintenance_works, last_maintenance_date, departments_involved, current_status)
VALUES
    ('MAS', 'Chennai Central', 'SR', 'Chennai Division', 'KM 0.0 MAS', 13.0827, 80.2707, 42, '18 Sep 2026', 'Engineering, TRD, S&T', 'OPERATIONAL'),
    ('AJJ', 'Arakkonam Junction', 'SR', 'Chennai Division', 'KM 68.0 AJJ', 13.0805, 79.6698, 28, '20 Sep 2026', 'Engineering, S&T', 'OPERATIONAL'),
    ('SA', 'Salem Junction', 'SR', 'Salem Division', 'KM 334.0 SA', 11.6643, 78.1460, 35, '22 Sep 2026', 'Engineering, TRD, S&T', 'OPERATIONAL'),
    ('ED', 'Erode Junction', 'SR', 'Salem Division', 'KM 396.0 ED', 11.3410, 77.7172, 31, '19 Sep 2026', 'Engineering, TRD', 'OPERATIONAL'),
    ('TUP', 'Tiruppur', 'SR', 'Salem Division', 'KM 446.0 TUP', 11.1085, 77.3411, 19, '15 Sep 2026', 'Engineering, TRD', 'OPERATIONAL'),
    ('CBE', 'Coimbatore Junction', 'SR', 'Salem Division', 'KM 496.0 CBE', 11.0168, 76.9558, 38, '21 Sep 2026', 'Engineering, TRD, S&T', 'OPERATIONAL'),
    ('TPJ', 'Tiruchchirappalli Junction', 'SR', 'Trichy Division', 'KM 140.0 TPJ', 10.7905, 78.7047, 24, '17 Sep 2026', 'Engineering, S&T', 'OPERATIONAL'),
    ('MDU', 'Madurai Junction', 'SR', 'Madurai Division', 'KM 297.0 MDU', 9.9252, 78.1198, 22, '16 Sep 2026', 'Engineering, TRD', 'OPERATIONAL')
ON CONFLICT (station_code) DO NOTHING;

-- 2. RAILWAY SECTIONS SEED
INSERT INTO railway_sections (section_id, section_name, from_station_code, to_station_code, km_start, km_end, line_type, max_speed_kmh, electrified)
VALUES
    ('SEC-MAS-AJJ', 'Chennai - Arakkonam', 'MAS', 'AJJ', 0.0, 68.0, 'QUAD LINE', 130, 'YES (25KV AC)'),
    ('SEC-AJJ-SA', 'Arakkonam - Salem', 'AJJ', 'SA', 68.0, 334.0, 'DOUBLE LINE', 110, 'YES (25KV AC)'),
    ('SEC-SA-ED', 'Salem - Erode', 'SA', 'ED', 334.0, 396.0, 'DOUBLE LINE', 110, 'YES (25KV AC)'),
    ('SEC-ED-TUP', 'Erode - Tiruppur', 'ED', 'TUP', 396.0, 446.0, 'DOUBLE LINE', 110, 'YES (25KV AC)'),
    ('SEC-TUP-CBE', 'Tiruppur - Coimbatore', 'TUP', 'CBE', 446.0, 496.0, 'DOUBLE LINE', 110, 'YES (25KV AC)'),
    ('SEC-SA-TPJ', 'Salem - Trichy', 'SA', 'TPJ', 0.0, 140.0, 'SINGLE LINE', 100, 'YES (25KV AC)'),
    ('SEC-TPJ-MDU', 'Trichy - Madurai', 'TPJ', 'MDU', 0.0, 157.0, 'DOUBLE LINE', 110, 'YES (25KV AC)')
ON CONFLICT (section_id) DO NOTHING;

-- 3. TRACK ASSETS SEED
INSERT INTO track_assets (asset_id, department, dept_ref, asset_type, activity_description, location, station_code, priority, schedule_date, status, last_maintenance_date, condition_rating)
VALUES
    ('TMS-001', 'Engineering', 'TMS', 'Track', 'Track Inspection (Ultrasonic USFD)', 'KM 102/4 UP', 'SA', 'HIGH', '18 SEP 2026', 'COMPLETED', '18 Sep 2026', 'Good'),
    ('TMS-002', 'Engineering', 'TMS', 'Track', 'Thermit Weld Repair & Destressing', 'KM 98/7 DN', 'SA', 'CRITICAL', '20 SEP 2026', 'OVERDUE', '10 Aug 2026', 'Requires Weld Grinding'),
    ('SMMS-004', 'S&T', 'SMMS', 'Signal', 'Track Circuit Shunting Sensitivity Test', 'PODANUR YARD', 'CBE', 'HIGH', '22 SEP 2026', 'REQUESTED', '15 Aug 2026', 'Operational'),
    ('TDMS-003', 'TRD', 'TDMS', 'OHE', 'Contact Wire Height & Stagger Realignment', 'KM 145/2', 'ED', 'MEDIUM', '25 SEP 2026', 'UPCOMING', '01 Sep 2026', 'Nominal'),
    ('TMS-005', 'Engineering', 'TMS', 'Track', 'Switch Expansion Joint (SEJ) Gap Reset', 'KM 76/11', 'SA', 'CRITICAL', '21 SEP 2026', 'OVERDUE', '05 Jul 2026', 'Immediate Reset Mandatory'),
    ('TMS-006', 'Engineering', 'TMS', 'Track', 'Deep Screening Machine Ballast Cleaning', 'KM 334/12 - 338/04', 'SA', 'HIGH', '26 SEP 2026', 'REQUESTED', '12 May 2026', 'High Fouling Index'),
    ('SMMS-007', 'S&T', 'SMMS', 'Signal', 'Axle Counter Interlock Point 42B Overhaul', 'Point 42B SA', 'SA', 'CRITICAL', '26 SEP 2026', 'OVERDUE', '18 Jul 2026', 'G&SR-24 Restriction Active')
ON CONFLICT (asset_id) DO NOTHING;

-- 4. MAINTENANCE REQUESTS SEED
INSERT INTO maintenance_requests (request_id, department, dept_ref, station_code, zone, segment, track, asset_id, maintenance_type, description, requested_date, requested_start_time, requested_end_time, duration_minutes, priority, urgency, asset_criticality, reason, status, conflict_flag, conflict_summary)
VALUES
    ('BR-2026-0142', 'Engineering', 'TMS', 'SA', 'SR', 'Salem - Erode (KM 334/12 - 338/04)', 'UP LINE', 'TMS-006', 'TRACK MAINTENANCE', 'Deep screening machine and track destressing between Salem and Erode', '2026-09-26', '11:30', '13:00', 90, 'HIGH', 'High', 'Tier-1', 'Ultrasonic flaw testing indicated high localized rail stress', 'SUBMITTED', 'PENDING', 'Clash with 3 scheduled passenger train movements'),
    ('BR-2026-0143', 'S&T', 'SMMS', 'MAS', 'SR', 'Chennai - Arakkonam (UP LINE)', 'UP LINE', 'SMMS-007', 'SIGNAL MAINTENANCE', 'Interlock inspection and point motor renewal on UP trunk line', '2026-09-26', '14:00', '15:00', 60, 'CRITICAL', 'Immediate', 'Tier-1', 'Axle counter fault logged on Point 42B', 'SUBMITTED', 'CONFLICT DETECTED', 'Directly overlaps scheduled run of Kovai Superfast Express (12691)'),
    ('BR-2026-0144', 'TRD', 'TDMS', 'CBE', 'SR', 'Coimbatore - Tiruppur', 'MAIN', 'TDMS-003', 'OHE 25KV MAINTENANCE', 'OHE catenary contact wire replacement and tension verification', '2026-09-27', '09:30', '11:30', 120, 'MEDIUM', 'Standard', 'Tier-2', 'Routine 60-day contact wire wear cycle check', 'SUBMITTED', 'PENDING', 'Evaluating morning goods freight slots')
ON CONFLICT (request_id) DO NOTHING;

-- 5. MAINTENANCE PLANS SEED
INSERT INTO maintenance_plans (plan_id, plan_code, request_id, department, station_code, zone, segment, track, maintenance_type, requested_date, requested_start_time, requested_end_time, recommended_date, recommended_start_time, recommended_end_time, duration_minutes, priority, risk_level, operational_impact, reason_for_recommendation, conflicts_detected, delay_impact_min, resource_util_pct, recovered_trains, resource_gang, is_recommended, tier_resolution, status)
VALUES
    ('PLAN-BR-2026-0142-A', 'PLAN A', 'BR-2026-0142', 'Engineering', 'SA', 'SR', 'Salem - Erode (KM 334/12 - 338/04)', 'UP LINE', 'TRACK MAINTENANCE', '2026-09-26', '11:30', '13:00', '2026-09-26', '12:10', '13:40', 90, 'HIGH', 'LOW', 'ACCEPTABLE SLA', 'Original request conflicts with 3 scheduled passenger train movements (TR 12675, TR 12691, TR 0942). Retiming by +40 minutes allows passing of Express 12691 before block inception, recovering freight flow via Salem loop line without cancellation.', 0, 18, 84, 3, 'GANG #4 & TAMP', TRUE, 'TIER-1 RESOLUTION', 'SENT FOR APPROVAL'),
    ('PLAN-BR-2026-0142-B', 'PLAN B', 'BR-2026-0142', 'Engineering', 'SA', 'SR', 'Salem - Erode (KM 334/12 - 338/04)', 'UP LINE', 'TRACK MAINTENANCE', '2026-09-26', '11:30', '13:00', '2026-09-26', '13:30', '15:00', 90, 'HIGH', 'MEDIUM', 'MED IMPACT', 'Deferred slot into mid-afternoon off-peak corridor window. Minor hold-up of freight rake 0942 for 31 minutes at Salem North yard.', 1, 31, 72, 2, 'GANG #4', FALSE, 'TIER-2 RESOLUTION', 'GENERATED'),
    ('PLAN-BR-2026-0142-C', 'PLAN C', 'BR-2026-0142', 'Engineering', 'SA', 'SR', 'Salem - Erode (KM 334/12 - 338/04)', 'UP LINE', 'TRACK MAINTENANCE', '2026-09-26', '11:30', '13:00', '2026-09-26', '10:40', '12:10', 90, 'HIGH', 'LOW', 'HIGH CREW LOAD', 'Advanced slot before Kovai Express departure. Requires early mobilization of Salem Section tamping machinery and permanent way gang.', 0, 24, 91, 3, 'GANG #4 & CRANE', FALSE, 'TIER-2 RESOLUTION', 'GENERATED')
ON CONFLICT (plan_id) DO NOTHING;

-- 6. DOWNSTREAM DISPATCHES SEED
INSERT INTO downstream_dispatches (block_id, unit_order, unit_name, recipient_role, sent_timestamp, status, acknowledged_by, acknowledged_time)
VALUES
    ('BR-2026-0138', 1, '1. ENGINEERING DEPT', 'SSE / Permanent Way (Salem)', '10:48:02', 'SENT', NULL, NULL),
    ('BR-2026-0138', 2, '2. SIGNAL & TELECOM', 'Section Controller (S&T)', '10:48:04', 'SENT', NULL, NULL),
    ('BR-2026-0138', 3, '3. ELECTRICAL (OHE)', 'Traction Power Controller (TPC)', '10:48:05', 'SENT', NULL, NULL),
    ('BR-2026-0138', 4, '4. TRAFFIC CONTROL', 'Chief Train Controller (CTC)', '10:48:06', 'SENT', NULL, NULL),
    ('BR-2026-0138', 5, '5. DIVISION CONTROL', 'DRM Operations Cell', '10:48:08', 'SENT', NULL, NULL),
    ('BR-2026-0138', 6, '6. MAINTENANCE CREW', 'Gang #4 Supervisor (Field Terminal)', '10:48:10', 'ACKNOWLEDGED', 'Gang #4 Supervisor', '10:48:12');

-- 7. ACTIVE POSSESSIONS SEED
INSERT INTO active_possessions (block_id, section, department, start_time, end_time, trains_affected, status, remaining_display, total_seconds_duration, elapsed_seconds, resource_gang)
VALUES
    ('BR-2026-0138', 'Chennai - Arakkonam', 'SIGNAL', '10:00', '11:30', 2, 'ACTIVE', '00:28:14', 5400, 3600, 'Gang #1 (MAS)'),
    ('BR-2026-0140', 'Salem - Erode', 'ENGINEERING', '11:00', '13:00', 3, 'ACTIVE', '01:05:32', 7200, 3300, 'Gang #4 (Salem)'),
    ('BR-2026-0142', 'Salem - Erode (MNT-3)', 'ENGINEERING', '12:10', '13:40', 0, 'ON SCHEDULE', 'START IN 00:55', 5400, 0, 'Gang #4 & TAMP')
ON CONFLICT (block_id) DO NOTHING;

-- 8. TRAINS SEED
INSERT INTO trains (train_number, train_name, train_type, origin, destination, corridor, priority, goods_train_indicator)
VALUES
    ('12675', 'Kovai Superfast Express', 'SUPERFAST EXPRESS', 'MAS', 'CBE', 'South Corridor', 1, FALSE),
    ('12691', 'Nilgiri Express', 'SUPERFAST EXPRESS', 'MAS', 'CBE', 'South Corridor', 1, FALSE),
    ('0942', 'Container Freight Rake', 'FREIGHT', 'MAS', 'ED', 'South Corridor', 3, TRUE)
ON CONFLICT (train_number) DO NOTHING;

-- 9. STATION MAINTENANCE HISTORY SEED
INSERT INTO station_maintenance_history (maintenance_id, station_code, station_name, department, asset_id, track, maintenance_type, date, year, month, start_time, end_time, duration_str, description, status, crew_gang)
VALUES
    ('MNT-10482', 'SA', 'Salem Junction', 'Engineering', 'TMS-001', 'Track 2', 'Preventive Maintenance', '18 Sep 2026', 2026, 'September', '18:00', '20:00', '2 hours', 'Rail Joint RJ-204 maintenance and ultrasonic testing', 'Completed', 'Gang #4'),
    ('MNT-10481', 'MAS', 'Chennai Central', 'S&T', 'SMMS-004', 'Platform 1', 'Signal Inspection', '15 Sep 2026', 2026, 'September', '01:00', '03:00', '2 hours', 'Axle counter calibration and sensitivity renewal', 'Completed', 'S&T Team 1'),
    ('MNT-10480', 'ED', 'Erode Junction', 'TRD', 'TDMS-003', 'Main Line', 'OHE Inspection', '10 Sep 2026', 2026, 'September', '02:00', '04:30', '2.5 hours', '25kV contact wire alignment and dropper adjustment', 'Completed', 'TRD Gang ED'),
    ('MNT-10479', 'SA', 'Salem Junction', 'Engineering', 'TMS-002', 'Track 1', 'Rail Joint Replacement', '04 Aug 2026', 2026, 'August', '23:30', '02:30', '3 hours', 'Thermit weld renewal and gap destressing at Point 18', 'Completed', 'Gang #4'),
    ('MNT-10478', 'SA', 'Salem Junction', 'TRD', 'TDMS-001', 'Yard Line 2', 'OHE Inspection', '12 Jun 2026', 2026, 'June', '01:30', '03:30', '2 hours', 'Traction feeder wire insulator cleaning', 'Completed', 'TRD Gang SA'),
    ('MNT-10477', 'SA', 'Salem Junction', 'S&T', 'SMMS-001', 'Point 42B', 'Signal Maintenance', '22 Mar 2026', 2026, 'March', '10:00', '12:00', '2 hours', 'Point machine drive rod replacement and test interlocking', 'Completed', 'S&T Unit SA'),
    ('MNT-10476', 'SA', 'Salem Junction', 'Engineering', 'TMS-003', 'Main Line', 'Track Inspection', '15 Jan 2026', 2026, 'January', '09:00', '13:00', '4 hours', 'Annual comprehensive track inspection and sleeper packing', 'Completed', 'Permanent Way Gang'),
    ('MNT-10475', 'CBE', 'Coimbatore Junction', 'Engineering', 'TMS-007', 'Track 3', 'Platform Maintenance', '05 Sep 2026', 2026, 'September', '14:00', '17:00', '3 hours', 'Track ballast renewal and edge clearance', 'Completed', 'Gang #2'),
    ('MNT-10474', 'CBE', 'Coimbatore Junction', 'TRD', 'TDMS-004', 'Track 2', 'Electrical Maintenance', '14 Aug 2026', 2026, 'August', '00:00', '03:00', '3 hours', 'Substation transformer relay testing', 'Completed', 'TRD Gang CBE')
ON CONFLICT (maintenance_id) DO NOTHING;

-- 10. DATA SOURCES SEED
INSERT INTO data_sources (source_id, source_name, source_type, file_name, source_url, description)
VALUES
    ('SRC-001', 'Indian Railways Southern Railway Master Corridor Register', 'CSV', 'sr_corridor_master_2026.csv', 'internal://cris/fois/sr_feed', 'Official Southern Railway sectional asset and chainage register'),
    ('SRC-002', 'Control Office Application (COA) Train Schedules', 'API', 'coa_live_schedules.json', 'https://fois.indianrail.gov.in/api/coa', 'Real-time train running and path allocation gateway')
ON CONFLICT (source_id) DO NOTHING;

-- 11. DATA IMPORT LOGS SEED
INSERT INTO data_import_logs (import_id, filename, source_type, total_rows, successful_rows, failed_rows, duplicate_rows, warnings, errors, status, notes)
VALUES
    ('IMP-2026-001', 'sr_track_assets.csv', 'CSV', 1420, 1418, 2, 0, 5, 0, 'Completed with warnings', '2 records flagged with non-standard chainage formatting; successfully mapped to default section'),
    ('IMP-2026-002', 'coa_south_corridor_timings.json', 'JSON', 850, 850, 0, 0, 0, 0, 'Completed', 'All scheduled paths ingested into train_schedules table with zero conflicts')
ON CONFLICT (import_id) DO NOTHING;

-- 12. AUDIT LOGS SEED
INSERT INTO audit_logs ("user", role, action, entity_type, entity_id, previous_status, new_status, comments)
VALUES
    ('R. Krishnan', 'PLANNER', 'System Initialized', 'SYSTEM', 'SYS-START', NULL, 'ONLINE', 'RailOps Southern Railway production cluster initialized and synchronized');
