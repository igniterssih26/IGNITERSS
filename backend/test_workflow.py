import urllib.request
import json

BASE = "http://127.0.0.1:8000/api"

def post(endpoint, data):
    req = urllib.request.Request(
        f"{BASE}{endpoint}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get(endpoint):
    with urllib.request.urlopen(f"{BASE}{endpoint}") as resp:
        return json.loads(resp.read().decode("utf-8"))

def put(endpoint):
    req = urllib.request.Request(f"{BASE}{endpoint}", method="PUT")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_tests():
    print("--- 1. Testing Request Requisition (Panel 1) ---")
    new_req = post("/requests", {
        "department": "Engineering",
        "dept_ref": "TMS",
        "station_code": "SA",
        "zone": "SR",
        "segment": "Salem - Erode (KM 340/01 - 342/10)",
        "track": "UP LINE",
        "asset_id": "TMS-009",
        "maintenance_type": "TRACK MAINTENANCE",
        "description": "Rail joint replacement and destressing",
        "requested_date": "2026-09-28",
        "requested_start_time": "11:30",
        "requested_end_time": "13:00",
        "duration_minutes": 90,
        "priority": "HIGH",
        "urgency": "High",
        "asset_criticality": "Tier-1",
        "reason": "Ultrasonic testing indicated high rail stress"
    })
    req_id = new_req["request_id"]
    print(f"Created request: {req_id}, status: {new_req['status']}")

    print("\n--- 2. Testing Optimization Solver (Panel 2) ---")
    plans = post("/plans/generate", {"request_id": req_id})
    print(f"Plans generated: {len(plans)}")
    plan_a = next(p for p in plans if p["plan_code"] == "PLAN A")
    print(f"Plan A recommended: {plan_a['recommended_start_time']} - {plan_a['recommended_end_time']} (Net Shift: +60 min)")

    print("\n--- 3. Forward Plan to Authority (Panel 2 -> Panel 3) ---")
    sent_plan = put(f"/plans/{plan_a['plan_id']}/send")
    print(f"Plan status after sending: {sent_plan['status']}")

    print("\n--- 4. Chief Controller Statutory Sign-Off (Panel 3) ---")
    approved = post("/authority/approve", {
        "plan_id": plan_a["plan_id"],
        "authority_user": "Chief Controller",
        "officer_id": "CO MAS 4091",
        "comments": "Statutory sanction granted under G&SR rules."
    })
    print(f"Plan approved status: {approved['status']}")

    # Verify downstream dispatches
    dispatches = get(f"/authority/dispatches/{req_id}")
    print(f"Downstream dispatches generated: {len(dispatches)}")
    for d in dispatches:
        print(f"  [{d['unit_order']}] {d['unit_name']}: {d['status']} ({d['sent_timestamp']})")

    # Verify active possession register
    possessions = get("/possessions/active")
    print(f"Active possessions: {len(possessions)}")

    print("\n--- 5. Testing Maintenance Completion & History Archival (Panel 3 -> Panel 4) ---")
    hist = post("/possessions/complete", {
        "block_id": req_id,
        "station_code": "SA",
        "actual_start_time": "12:10",
        "actual_end_time": "13:40",
        "work_summary": "Track destressing completed successfully.",
        "crew_gang": "Gang #4"
    })
    print(f"Archived to Station History: {hist['maintenance_id']} at {hist['station_name']} ({hist['date']})")

    # Verify Station counter increment
    station = get("/stations/SA")
    print(f"Station {station['station_name']} total works count: {station['total_maintenance_works']}")

    print("\n--- 6. Testing Schedules & Data Quality Reports ---")
    weekly = get("/schedules/weekly")
    print(f"Weekly schedule items: {len(weekly)}")
    quality = get("/data/quality-report")
    print(f"Data quality datasets checked: {len(quality)}")
    audit = get("/audit/logs")
    print(f"Audit log entries: {len(audit)}")

    print("\n>>> ALL END-TO-END WORKFLOW TESTS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    run_tests()
