import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, AlertTriangle, Layers, Clock, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { MaintenanceRequest, MaintenancePlan, SolverMetrics } from '../../types/railops';
import { GeospatialVectorMap } from './GeospatialVectorMap';
import { LiveAlertsSidebar } from './LiveAlertsSidebar';
import { ConflictAnalysisModal } from './ConflictAnalysisModal';
import { OptimizationSolverView } from './OptimizationSolverView';
import { WeeklyPlanningView } from '../panel1_department/WeeklyPlanningView';
import { MonthlyPlanningView } from '../panel1_department/MonthlyPlanningView';

interface Props {
  onNavigateToAuthority: () => void;
}

export const Panel2IntelligenceHub: React.FC<Props> = ({ onNavigateToAuthority }) => {
  const [subTab, setSubTab] = useState<'DASHBOARD' | 'REQUESTS' | 'OPERATIONS' | 'PLANNING' | 'MAP' | 'WEEKLY' | 'MONTHLY'>('DASHBOARD');
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [deptFilter, setDeptFilter] = useState<'ALL' | 'Engineering' | 'TRD' | 'S&T'>('ALL');
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlan | null>(null);
  const [activeRequestForConflict, setActiveRequestForConflict] = useState<MaintenanceRequest | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [solverMetrics, setSolverMetrics] = useState<SolverMetrics | null>(null);
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, solver, allPlans, weekly, monthly] = await Promise.all([
        api.getRequests(deptFilter === 'ALL' ? undefined : deptFilter),
        api.getSolverStatus(),
        api.getPlans(),
        api.getWeeklySchedule(),
        api.getMonthlySchedule()
      ]);
      setRequests(reqs);
      setSolverMetrics(solver);
      setPlans(allPlans);
      setWeeklySchedule(weekly);
      setMonthlyData(monthly);

      if (allPlans.length > 0 && !selectedPlan) {
        setSelectedPlan(allPlans.find(p => p.is_recommended) || allPlans[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deptFilter]);

  const handleAddToPlanning = async (reqId: string) => {
    try {
      const generated = await api.generatePlans(reqId);
      setPlans(generated);
      setSelectedPlan(generated.find(p => p.is_recommended) || generated[0]);
      setSubTab('PLANNING');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckConflict = (req: MaintenanceRequest) => {
    setActiveRequestForConflict(req);
    setIsConflictModalOpen(true);
  };

  const handleSendToAuthority = async (planId: string) => {
    await api.sendPlanToAuthority(planId);
    await loadData();
  };

  const filteredRequests = requests.filter(r => {
    if (deptFilter === 'ALL') return true;
    return r.department.toLowerCase().includes(deptFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Title & Hub Header */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-100 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-lg text-white uppercase tracking-wider">
                RAILOPS CENTRAL INTELLIGENCE HUB
              </span>
              <span className="bg-sky-950 text-sky-400 border border-sky-600/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                CO-HUB
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              CENTRALIZED RAILWAY BLOCK PLANNING & REAL-TIME OPERATIONS INTELLIGENCE
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
            <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              OFFICER: <strong className="text-white">R. KRISHNAN</strong> (CENTRAL OPERATIONS)
            </span>
          </div>
        </div>

        {/* Sub-tabs Row */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setSubTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'DASHBOARD'
                ? 'bg-slate-800 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setSubTab('REQUESTS')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'REQUESTS'
                ? 'bg-slate-800 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BLOCK REQUESTS ({requests.length})
          </button>
          <button
            onClick={() => setSubTab('PLANNING')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'PLANNING'
                ? 'bg-emerald-700 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BLOCK PLANNING & SOLVER
          </button>
          <button
            onClick={() => setSubTab('MAP')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'MAP'
                ? 'bg-sky-700 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RAILWAY MAP & ALERTS
          </button>
          <button
            onClick={() => setSubTab('WEEKLY')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'WEEKLY'
                ? 'bg-slate-800 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            WEEKLY SCHEDULE
          </button>
          <button
            onClick={() => setSubTab('MONTHLY')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              subTab === 'MONTHLY'
                ? 'bg-slate-800 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MONTHLY SCHEDULE
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards (Matching Screenshot 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {/* Card 1: Operational Status */}
        <div className="bg-slate-900 border-l-4 border-l-sky-500 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              OPERATIONAL STATUS // HPI-01
            </span>
            <span className="bg-sky-950 text-sky-400 border border-sky-500/40 text-[10px] px-2 py-0.5 rounded font-bold">
              CORRIDOR LIVE
            </span>
          </div>
          <div className="my-2">
            <div className="text-[11px] text-slate-400">ACTIVE BLOCKS</div>
            <div className="text-3xl font-hud font-bold text-white">12</div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 bg-emerald-500 rounded-sm"></span> CURRENTLY ACTIVE
            </span>
            <span>70 TOTAL REGISTERED BLOCKS</span>
          </div>
        </div>

        {/* Card 2: Priority Alert */}
        <div className="bg-slate-900 border-l-4 border-l-amber-500 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              PRIORITY ALERT // HPI-02
            </span>
            <span className="bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] px-2 py-0.5 rounded font-bold">
              ATTN MANDATORY
            </span>
          </div>
          <div className="my-2">
            <div className="text-[11px] text-amber-300/80">CRITICAL TASKS</div>
            <div className="text-3xl font-hud font-bold text-amber-400">08</div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 bg-amber-500 rounded-sm"></span> REQUIRING ACTION
            </span>
            <span>&lt; 45 MIN TIME CRITICALITY</span>
          </div>
        </div>

        {/* Card 3: Schedule Overlap */}
        <div className="bg-slate-900 border-l-4 border-l-rose-500 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">
              SCHEDULE OVERLAP // HPI-03
            </span>
            <span className="bg-rose-950 text-rose-300 border border-rose-500/50 text-[10px] px-2 py-0.5 rounded font-bold">
              BOTTLENECK DETECTED
            </span>
          </div>
          <div className="my-2">
            <div className="text-[11px] text-rose-300/80">CONFLICTS</div>
            <div className="text-3xl font-hud font-bold text-rose-400">05</div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="h-2 w-2 bg-rose-500 rounded-sm"></span> BLOCK / RESOURCE CONFLICTS
            </span>
            <span>3 TRAIN / 2 CREW OVERLAPS</span>
          </div>
        </div>
      </div>

      {/* Main Content Area based on SubTab */}
      {subTab === 'PLANNING' && (
        <OptimizationSolverView
          plans={plans}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
          onSendToAuthority={handleSendToAuthority}
          onNavigateToAuthority={onNavigateToAuthority}
          solverMetrics={solverMetrics}
        />
      )}

      {subTab === 'MAP' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <GeospatialVectorMap
              onOptimizeClick={(reqId) => {
                handleAddToPlanning(reqId);
              }}
            />
          </div>
          <div className="lg:col-span-4">
            <LiveAlertsSidebar />
          </div>
        </div>
      )}

      {subTab === 'WEEKLY' && (
        <WeeklyPlanningView scheduleItems={weeklySchedule} />
      )}

      {subTab === 'MONTHLY' && (
        <MonthlyPlanningView monthlyData={monthlyData} />
      )}

      {(subTab === 'DASHBOARD' || subTab === 'REQUESTS') && (
        <div className="space-y-6">
          {/* Geospatial Map Preview on Dashboard */}
          {subTab === 'DASHBOARD' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <GeospatialVectorMap
                  onOptimizeClick={(reqId) => {
                    handleAddToPlanning(reqId);
                  }}
                />
              </div>
              <div className="lg:col-span-4">
                <LiveAlertsSidebar />
              </div>
            </div>
          )}

          {/* Central Intake Register Table (Matching Screenshot 5) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden text-slate-100 font-mono">
            {/* Table Header & Department Filter Tabs */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm bg-amber-400"></span>
                  <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
                    BLOCK REQUESTS FROM DEPARTMENTS // CENTRAL INTAKE REGISTER
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-slate-400">SOURCES:</span>
                  <span className="bg-sky-950 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded">
                    1. ENGINEERING
                  </span>
                  <span className="bg-amber-950 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    2. ELECTRICAL
                  </span>
                  <span className="bg-teal-950 text-teal-400 border border-teal-500/30 px-1.5 py-0.5 rounded">
                    3. SIGNAL & TELECOM
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">FILTER BY DEPT:</span>
                  <button
                    onClick={() => setDeptFilter('ALL')}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      deptFilter === 'ALL'
                        ? 'bg-slate-800 text-white font-bold border border-slate-600'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ALL DEPARTMENTS ({requests.length})
                  </button>
                  <button
                    onClick={() => setDeptFilter('Engineering')}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      deptFilter === 'Engineering'
                        ? 'bg-sky-900/80 text-sky-200 font-bold border border-sky-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ENGINEERING (8)
                  </button>
                  <button
                    onClick={() => setDeptFilter('TRD')}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      deptFilter === 'TRD'
                        ? 'bg-amber-900/80 text-amber-200 font-bold border border-amber-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ELECTRICAL (4)
                  </button>
                  <button
                    onClick={() => setDeptFilter('S&T')}
                    className={`px-3 py-1 rounded text-xs transition-all ${
                      deptFilter === 'S&T'
                        ? 'bg-teal-900/80 text-teal-200 font-bold border border-teal-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    S&T (6)
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                    SHOW: PENDING ACTIONS FIRST
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] tracking-wider uppercase">
                    <th className="py-3 px-4 font-semibold">REQUEST ID</th>
                    <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                    <th className="py-3 px-4 font-semibold">LOCATION / SECTION</th>
                    <th className="py-3 px-4 font-semibold">BLOCK TYPE</th>
                    <th className="py-3 px-4 font-semibold">REQUESTED DATE</th>
                    <th className="py-3 px-4 font-semibold">REQ. TIME</th>
                    <th className="py-3 px-4 font-semibold">DURATION</th>
                    <th className="py-3 px-4 font-semibold">PRIORITY</th>
                    <th className="py-3 px-4 font-semibold">STATUS</th>
                    <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredRequests.map((req) => {
                    const hasConflict = req.conflict_flag === 'CONFLICT DETECTED';
                    const isPending = req.status === 'SUBMITTED' || req.status === 'DRAFT';
                    const isPlanned = req.status === 'PLANNED' || req.status === 'SENT FOR APPROVAL';

                    return (
                      <tr key={req.request_id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-sky-400">{req.request_id}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1.5 font-bold">
                            <span className={`h-2 w-2 rounded-sm ${
                              req.department === 'Engineering' ? 'bg-sky-500' :
                              req.department === 'S&T' ? 'bg-teal-400' : 'bg-amber-400'
                            }`}></span>
                            {req.department.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-200">{req.segment}</td>
                        <td className="py-3 px-4 text-slate-300">{req.maintenance_type}</td>
                        <td className="py-3 px-4 text-slate-400">{req.requested_date}</td>
                        <td className="py-3 px-4 text-slate-200 font-bold">{req.requested_start_time}</td>
                        <td className="py-3 px-4 text-slate-300">{req.duration_minutes} MIN</td>
                        <td className="py-3 px-4">
                          <span className={`border px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.priority === 'CRITICAL'
                              ? 'border-rose-500 text-rose-400 bg-rose-950/40'
                              : req.priority === 'HIGH'
                              ? 'border-amber-500 text-amber-400 bg-amber-950/40'
                              : 'border-slate-600 text-slate-300'
                          }`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {hasConflict ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-500/60 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                              ✕ CONFLICT DETECTED
                            </span>
                          ) : req.status === 'SCHEDULED' || req.status === 'APPROVED' ? (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold px-2 py-0.5 rounded">
                              ✔ APPROVED
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold px-2 py-0.5 rounded">
                              ■ PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCheckConflict(req)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700"
                            >
                              VIEW REQUEST
                            </button>
                            <button
                              onClick={() => handleCheckConflict(req)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                hasConflict
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                  : 'bg-amber-600 hover:bg-amber-500 text-white'
                              }`}
                            >
                              CHECK CONFLICT
                            </button>
                            <button
                              onClick={() => handleAddToPlanning(req.request_id)}
                              className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold"
                            >
                              ADD TO PLANNING
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>SHOWING 3 OF 18 ACTIVE BLOCK REQUEST ENTRIES</span>
              <span className="text-slate-400">STATUS POLLING: AUTO-REFRESH 10S</span>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Drill-Down Modal */}
      <ConflictAnalysisModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        request={activeRequestForConflict}
        onProceedToOptimization={(reqId) => {
          handleAddToPlanning(reqId);
        }}
      />
    </div>
  );
};
