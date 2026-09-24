from datetime import datetime
from sqlalchemy.orm import Session
from app.models.plan import MaintenancePlan, PlanDecision, PlanModification
from app.models.request import MaintenanceRequest
from app.models.dispatch import DownstreamDispatch, ActivePossession
from app.models.audit import AuditLog

def send_plan_to_authority(db: Session, plan_id: str):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise ValueError("Plan not found")
    
    plan.status = "SENT FOR APPROVAL"
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.request_id == plan.request_id).first()
    if req:
        req.status = "SENT FOR APPROVAL"

    audit = AuditLog(
        user="Central Operations Officer",
        role="PLANNER",
        action="Plan Sent to Authority",
        entity_type="PLAN",
        entity_id=plan_id,
        previous_status="GENERATED",
        new_status="SENT FOR APPROVAL",
        comments="Forwarded to Chief Controller for statutory sign-off"
    )
    db.add(audit)
    db.commit()
    return plan

def approve_plan(db: Session, plan_id: str, authority_user: str = "Chief Controller", officer_id: str = "CO MAS 4091", comments: str = ""):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise ValueError("Plan not found")

    now = datetime.now()
    date_str = now.strftime("%d %b %Y")
    time_str = now.strftime("%H:%M:%S")

    plan.status = "APPROVED"
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.request_id == plan.request_id).first()
    if req:
        req.status = "SCHEDULED"

    # Record Decision
    decision = PlanDecision(
        plan_id=plan.plan_id,
        request_id=plan.request_id,
        decision="ACCEPTED",
        authority_user=authority_user,
        officer_id=officer_id,
        decision_date=date_str,
        decision_time=time_str,
        comments=comments or "Statutory sanction granted under G&SR rules Chapter IV.",
        rejection_reason=None
    )
    db.add(decision)

    # Trigger Instantaneous Downstream Dispatch to 6 Operational Units
    units = [
        (1, "1. ENGINEERING DEPT", "SSE / Permanent Way (Salem)", f"{now.strftime('%H:%M')}:02", "SENT"),
        (2, "2. SIGNAL & TELECOM", "Section Controller (S&T)", f"{now.strftime('%H:%M')}:04", "SENT"),
        (3, "3. ELECTRICAL (OHE)", "Traction Power Controller (TPC)", f"{now.strftime('%H:%M')}:05", "SENT"),
        (4, "4. TRAFFIC CONTROL", "Chief Train Controller (CTC)", f"{now.strftime('%H:%M')}:06", "SENT"),
        (5, "5. DIVISION CONTROL", "DRM Operations Cell", f"{now.strftime('%H:%M')}:08", "SENT"),
        (6, "6. MAINTENANCE CREW", "Gang #4 Supervisor (Field Terminal)", f"{now.strftime('%H:%M')}:10", "ACKNOWLEDGED"),
    ]

    # Clear old dispatches for this block if any
    db.query(DownstreamDispatch).filter(DownstreamDispatch.block_id == plan.request_id).delete()

    for order, name, role, timestamp, st in units:
        disp = DownstreamDispatch(
            block_id=plan.request_id,
            unit_order=order,
            unit_name=name,
            recipient_role=role,
            sent_timestamp=timestamp,
            status=st,
            acknowledged_by="Field Terminal #4" if st == "ACKNOWLEDGED" else None,
            acknowledged_time=timestamp if st == "ACKNOWLEDGED" else None
        )
        db.add(disp)

    # Add or update in Active Possession Register
    existing_poss = db.query(ActivePossession).filter(ActivePossession.block_id == plan.request_id).first()
    if existing_poss:
        existing_poss.status = "ACTIVE"
        existing_poss.start_time = plan.recommended_start_time
        existing_poss.end_time = plan.recommended_end_time
    else:
        new_poss = ActivePossession(
            block_id=plan.request_id,
            section=plan.segment,
            department=plan.department.upper(),
            start_time=plan.recommended_start_time,
            end_time=plan.recommended_end_time,
            trains_affected=plan.conflicts_detected,
            status="ON SCHEDULE",
            remaining_display="START IN 00:38",
            total_seconds_duration=plan.duration_minutes * 60,
            elapsed_seconds=0,
            resource_gang=plan.resource_gang or "Gang #4"
        )
        db.add(new_poss)

    audit = AuditLog(
        user=authority_user,
        role="CHIEF_CONTROLLER",
        action="Plan Approved",
        entity_type="PLAN",
        entity_id=plan_id,
        previous_status="SENT FOR APPROVAL",
        new_status="APPROVED",
        comments=f"Statutory sign-off confirmed by {authority_user} ({officer_id}). Dispatches routed."
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)
    return plan

def modify_plan(db: Session, plan_id: str, modified_date: str, modified_start_time: str, modified_end_time: str,
                modified_duration: int, modified_track: str, modified_priority: str, operational_notes: str,
                modified_by: str = "Chief Controller"):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise ValueError("Plan not found")

    now = datetime.now()
    date_str = now.strftime("%d %b %Y")
    time_str = now.strftime("%H:%M:%S")

    # Record Modification record
    mod = PlanModification(
        plan_id=plan.plan_id,
        request_id=plan.request_id,
        original_date=plan.recommended_date,
        original_start_time=plan.recommended_start_time,
        original_end_time=plan.recommended_end_time,
        original_duration=plan.duration_minutes,
        original_track=plan.track,
        modified_date=modified_date,
        modified_start_time=modified_start_time,
        modified_end_time=modified_end_time,
        modified_duration=modified_duration,
        modified_track=modified_track,
        modified_priority=modified_priority,
        operational_notes=operational_notes,
        modified_by=modified_by
    )
    db.add(mod)

    # Update plan values
    plan.recommended_date = modified_date
    plan.recommended_start_time = modified_start_time
    plan.recommended_end_time = modified_end_time
    plan.duration_minutes = modified_duration
    plan.track = modified_track
    plan.priority = modified_priority
    plan.status = "MODIFIED"

    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.request_id == plan.request_id).first()
    if req:
        req.status = "MODIFIED"

    decision = PlanDecision(
        plan_id=plan.plan_id,
        request_id=plan.request_id,
        decision="MODIFIED",
        authority_user=modified_by,
        officer_id="CO MAS 4091",
        decision_date=date_str,
        decision_time=time_str,
        comments=operational_notes,
        rejection_reason=None
    )
    db.add(decision)

    audit = AuditLog(
        user=modified_by,
        role="CHIEF_CONTROLLER",
        action="Plan Modified",
        entity_type="PLAN",
        entity_id=plan_id,
        previous_status="SENT FOR APPROVAL",
        new_status="MODIFIED",
        comments=f"Slot revised to {modified_start_time}-{modified_end_time}. Notes: {operational_notes}"
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)
    return plan

def reject_plan(db: Session, plan_id: str, rejection_reason: str, comments: str, authority_user: str = "Chief Controller", officer_id: str = "CO MAS 4091"):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise ValueError("Plan not found")

    now = datetime.now()
    date_str = now.strftime("%d %b %Y")
    time_str = now.strftime("%H:%M:%S")

    plan.status = "REJECTED"
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.request_id == plan.request_id).first()
    if req:
        req.status = "REJECTED"

    decision = PlanDecision(
        plan_id=plan.plan_id,
        request_id=plan.request_id,
        decision="REJECTED",
        authority_user=authority_user,
        officer_id=officer_id,
        decision_date=date_str,
        decision_time=time_str,
        comments=comments,
        rejection_reason=rejection_reason
    )
    db.add(decision)

    audit = AuditLog(
        user=authority_user,
        role="CHIEF_CONTROLLER",
        action="Plan Rejected",
        entity_type="PLAN",
        entity_id=plan_id,
        previous_status="SENT FOR APPROVAL",
        new_status="REJECTED",
        comments=f"Rejection: {rejection_reason}. Comments: {comments}"
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)
    return plan
