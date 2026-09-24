export interface MaintenanceRequest {
  request_id: string;
  department: string;
  dept_ref?: string;
  station_code: string;
  zone: string;
  segment: string;
  track: string;
  asset_id?: string;
  maintenance_type: string;
  description?: string;
  requested_date: string;
  requested_start_time: string;
  requested_end_time: string;
  duration_minutes: number;
  priority: string;
  urgency: string;
  asset_criticality: string;
  reason?: string;
  status: string;
  conflict_flag: string;
  conflict_summary?: string;
  created_at?: string;
}

export interface TrackAsset {
  asset_id: string;
  department: string;
  dept_ref: string;
  asset_type: string;
  activity_description: string;
  location: string;
  station_code: string;
  priority: string;
  schedule_date: string;
  status: 'COMPLETED' | 'OVERDUE' | 'REQUESTED' | 'UPCOMING';
  last_maintenance_date?: string;
  condition_rating: string;
}

export interface MaintenancePlan {
  plan_id: string;
  plan_code: string;
  request_id: string;
  department: string;
  station_code: string;
  zone: string;
  segment: string;
  track: string;
  maintenance_type: string;
  requested_date: string;
  requested_start_time: string;
  requested_end_time: string;
  recommended_date: string;
  recommended_start_time: string;
  recommended_end_time: string;
  duration_minutes: number;
  priority: string;
  risk_level: string;
  operational_impact: string;
  reason_for_recommendation?: string;
  conflicts_detected: number;
  delay_impact_min: number;
  resource_util_pct: number;
  recovered_trains: number;
  resource_gang: string;
  is_recommended: boolean;
  tier_resolution: string;
  status: string;
}

export interface PlanDecision {
  id: number;
  plan_id: string;
  request_id: string;
  decision: string;
  authority_user: string;
  officer_id: string;
  decision_date: string;
  decision_time: string;
  comments?: string;
  rejection_reason?: string;
}

export interface DownstreamDispatch {
  id: number;
  block_id: string;
  unit_order: number;
  unit_name: string;
  recipient_role: string;
  sent_timestamp: string;
  status: 'SENT' | 'ACKNOWLEDGED';
  acknowledged_by?: string;
  acknowledged_time?: string;
}

export interface ActivePossession {
  block_id: string;
  section: string;
  department: string;
  start_time: string;
  end_time: string;
  trains_affected: number;
  status: 'ACTIVE' | 'ON SCHEDULE' | 'COMPLETED';
  remaining_display: string;
  total_seconds_duration: number;
  elapsed_seconds: number;
  resource_gang: string;
}

export interface Station {
  station_code: string;
  station_name: string;
  zone: string;
  division: string;
  location: string;
  latitude?: number;
  longitude?: number;
  total_maintenance_works: number;
  last_maintenance_date?: string;
  departments_involved: string;
  current_status: string;
}

export interface StationMaintenanceHistory {
  maintenance_id: string;
  station_code: string;
  station_name: string;
  department: string;
  asset_id?: string;
  track: string;
  maintenance_type: string;
  date: string;
  year: number;
  month: string;
  start_time: string;
  end_time: string;
  duration_str: string;
  description?: string;
  status: string;
  crew_gang: string;
}

export interface WeeklyScheduleItem {
  request_id: string;
  station: string;
  department: string;
  segment: string;
  track: string;
  maintenance_type: string;
  requested_date: string;
  requested_time: string;
  planned_time: string;
  duration: string;
  priority: string;
  status: string;
  impact: string;
}

export interface DataSourceItem {
  source_id: string;
  source_name: string;
  source_type: string;
  file_name?: string;
  imported_at?: string;
  description?: string;
}

export interface DataImportLogItem {
  import_id: string;
  filename: string;
  source_type: string;
  import_time?: string;
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  duplicate_rows: number;
  warnings: number;
  errors: number;
  status: string;
  notes?: string;
}

export interface QualityReportItem {
  dataset_name: string;
  source_type: string;
  total_records: number;
  valid_records: number;
  missing_fields_count: number;
  duplicate_records_count: number;
  quality_score_pct: number;
  status: string;
}

export interface SolverMetrics {
  solver: string;
  status: string;
  solve_time_sec: string;
  parameters_ingested: string[];
  metrics: {
    requests_evaluated: number;
    conflicts_detected: number;
    conflicts_resolved: number;
    possible_alternatives: number;
    plans_generated: number;
    optimal_plans: number;
    contingency_plans: number;
  };
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_status?: string;
  new_status?: string;
  comments?: string;
}
