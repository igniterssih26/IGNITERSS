import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Edit3, Send, Clock, ShieldCheck,
  AlertTriangle, Check, RefreshCw, ChevronDown, ChevronUp, FileText, CheckCheck
} from 'lucide-react';
import { api } from '../../services/api';
import {
  MaintenancePlan,
  DownstreamDispatch,
  ActivePossession,
  PlanDecision
} from '../../types/railops';

interface Props {
  onMaintenanceCompleted?: () => void;
}

export const Panel3AuthoritySignOff: React.FC<Props> = ({ onMaintenanceCompleted }) => {
  const [pendingPlans, setPendingPlans] = useState<MaintenancePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MaintenancePlan | null>(null);
  const [dispatches, setDispatches] = useState<DownstreamDispatch[]>([]);
  const [possessions, setPossessions] = useState<ActivePossession[]>([]);
  const [decisions, setDecisions] = useState<PlanDecision[]>([]);
  
  // Modification Form state
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [modDate, setModDate] = useState('2026-09-26');
  const [modStartTime, setModStartTime] = useState('12:10');
  const [modEndTime, setModEndTime] = useState('13:40');
  const [modRoute, setModRoute] = useState('SALEM MAIN');
  const [modPriority, setModPriority] = useState('HIGH');
  const [modGang, setModGang] = useState('GANG #4');
  const [modNotes, setModNotes] = useState('Adjusted for sectional tamping unit clearance');

  // Rejection Form state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Operational Conflict');
  const [rejectComments, setRejectComments] = useState('');

  // Status banners
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pending, activePoss, decs] = await Promise.all([
        api.getPendingAuthorityPlans(),
        api.getActivePossessions(),
        api.getDecisionsHistory()
      ]);
      setPendingPlans(pending);
      setPossessions(activePoss);
      setDecisions(decs);

      // Select BR-2026-0142 plan by default if available
      const target = pending.find(p => p.request_id === 'BR-2026-0142' && p.is_recommended) || pending[0];
      if (target) {
        setSelectedPlan(target);
        setModDate(target.recommended_date);
        setModStartTime(target.recommended_start_time);
        setModEndTime(target.recommended_end_time);
        
        // Load dispatches for this block or fallback to 0138
        const disp = await api.getDispatches(target.request_id);
        if (disp.length > 0) {
          setDispatches(disp);
        } else {
          const fallbackDisp = await api.getDispatches('BR-2026-0138');
          setDispatches(fallbackDisp);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      await api.approvePlan(
        selectedPlan.plan_id,
        'Chief Controller',
        'CO MAS 4091',
        'Statutory sanction granted under Indian Railways G&SR Chapter IV rules.'
      );
      setActionSuccess(`Plan ${selectedPlan.plan_id} APPROVED! Downstream dispatches triggered.`);
      await loadData();
      // Reload dispatches for approved plan
      const updatedDisp = await api.getDispatches(selectedPlan.request_id);
      setDispatches(updatedDisp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setLoading(true);
    try {
      await api.modifyPlan({
        plan_id: selectedPlan.plan_id,
        modified_date: modDate,
        modified_start_time: modStartTime,
        modified_end_time: modEndTime,
        modified_duration: 90,
        modified_track: modRoute,
        modified_priority: modPriority,
        operational_notes: modNotes
      });
      setIsModifyOpen(false);
      setActionSuccess(`Plan ${selectedPlan.plan_id} MODIFIED and rescheduled.`);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setLoading(true);
    try {
      await api.rejectPlan(selectedPlan.plan_id, rejectReason, rejectComments);
      setIsRejectOpen(false);
      setActionSuccess(`Plan ${selectedPlan.plan_id} REJECTED.`);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePossession = async (blockId: string) => {
    setLoading(true);
    try {
      await api.completeMaintenance({
        block_id: blockId,
        station_code: 'SA',
        actual_start_time: '12:10',
        actual_end_time: '13:40',
        work_summary: 'Track inspection and destressing completed within scheduled window.',
        crew_gang: 'Gang #4'
      });
      setActionSuccess(`Maintenance ${blockId} marked COMPLETED. Archived to Panel 4 Station History!`);
      await loadData();
      if (onMaintenanceCompleted) onMaintenanceCompleted();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Matching Screenshot 1 top header) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-slate-100 font-mono shadow-md">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="font-hud font-bold text-sm uppercase tracking-wider text-slate-100">
            HUMAN APPROVAL REQUIRED // CHIEF CONTROLLER STATUTORY SIGN-OFF
          </span>
        </div>

        <div className="bg-amber-950 text-amber-300 border border-amber-500/50 text-xs font-bold px-3 py-1 rounded">
          STATUTORY SANCTION MANDATORY
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-mono rounded-lg flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Target Block Request Box (Matching Screenshot 1 White Container) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Col 1: Target Block Request */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              TARGET BLOCK REQUEST:
            </div>
            <div className="text-base font-bold text-slate-900 font-hud">
              {selectedPlan?.request_id || 'BR-2026-0142'}
            </div>
            <div className="text-slate-500 text-[11px]">
              {selectedPlan?.segment || 'Salem - Erode (Engineering Dept)'}
            </div>
          </div>

          {/* Col 2: Recommended Block Plan */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              RECOMMENDED BLOCK PLAN:
            </div>
            <div className="text-base font-bold text-emerald-600 font-hud">
              {selectedPlan?.plan_code || 'PLAN A'} ({selectedPlan?.recommended_start_time || '12:10'} — {selectedPlan?.recommended_end_time || '13:40'})
            </div>
            <div className="text-slate-500 text-[11px]">
              Delay: {selectedPlan?.delay_impact_min || 18} min | Net Conflicts: {selectedPlan?.conflicts_detected || 0}
            </div>
          </div>

          {/* Col 3: Designated Planning Officer */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              DESIGNATED PLANNING OFFICER:
            </div>
            <div className="text-base font-bold text-slate-900 font-hud">
              CENTRAL OPERATIONS (CO)
            </div>
            <div className="text-slate-500 text-[11px]">
              Officer ID: CO MAS 4091
            </div>
          </div>
        </div>

        {/* Notice & 3 Big Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-500">
            NOTICE: Approval will trigger instantaneous downstream dispatch to 6 operational units.
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            {/* REJECT BUTTON */}
            <button
              onClick={() => setIsRejectOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all"
            >
              <span className="font-mono text-xs">✕ ✕</span> REJECT
            </button>

            {/* MODIFY BUTTON */}
            <button
              onClick={() => setIsModifyOpen(!isModifyOpen)}
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" /> MODIFY
            </button>

            {/* APPROVE BUTTON */}
            <button
              onClick={handleApprove}
              disabled={loading || selectedPlan?.status === 'APPROVED'}
              className={`px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg transition-all text-white ${
                selectedPlan?.status === 'APPROVED'
                  ? 'bg-emerald-800 opacity-90 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              <Check className="h-4 w-4" />
              {selectedPlan?.status === 'APPROVED' ? '✔ APPROVED' : '✔ ✔ APPROVE'}
            </button>
          </div>
        </div>

        {/* Manual Block Adjustment Matrix Form (Collapsible, matching Screenshot 1) */}
        {isModifyOpen && (
          <form onSubmit={handleModifySubmit} className="mt-4 pt-4 border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 text-slate-800 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold uppercase tracking-wider text-slate-900">
                MANUAL BLOCK ADJUSTMENT MATRIX
              </span>
              <button
                type="button"
                onClick={() => setIsModifyOpen(false)}
                className="text-rose-600 font-bold hover:underline"
              >
                [CLOSE FORM]
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">DATE</label>
                <input
                  type="text"
                  value={modDate}
                  onChange={(e) => setModDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">START TIME</label>
                <input
                  type="text"
                  value={modStartTime}
                  onChange={(e) => setModStartTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">END TIME</label>
                <input
                  type="text"
                  value={modEndTime}
                  onChange={(e) => setModEndTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">ROUTE</label>
                <select
                  value={modRoute}
                  onChange={(e) => setModRoute(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                >
                  <option value="SALEM MAIN">SALEM MAIN</option>
                  <option value="SALEM LOOP">SALEM LOOP</option>
                  <option value="UP LINE">UP LINE</option>
                  <option value="DN LINE">DN LINE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">PRIORITY</label>
                <select
                  value={modPriority}
                  onChange={(e) => setModPriority(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                >
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">RESOURCE GANG</label>
                <input
                  type="text"
                  value={modGang}
                  onChange={(e) => setModGang(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 mb-1 font-semibold">OPERATIONAL NOTES</label>
              <input
                type="text"
                value={modNotes}
                onChange={(e) => setModNotes(e.target.value)}
                placeholder="Reason for adjustment"
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded text-xs"
              >
                APPLY & RE-OPTIMIZE
              </button>
            </div>
          </form>
        )}

        {/* Rejection Form Modal */}
        {isRejectOpen && (
          <form onSubmit={handleRejectSubmit} className="mt-4 pt-4 border-2 border-rose-300 rounded-lg p-4 bg-rose-50 text-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200">
              <span className="font-bold text-rose-800 uppercase">
                REJECT MAINTENANCE PLAN // SPECIFY REASON
              </span>
              <button type="button" onClick={() => setIsRejectOpen(false)} className="text-rose-600 font-bold">
                ✕ CANCEL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-600 font-semibold mb-1">REJECTION REASON</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white border border-rose-300 rounded p-2 text-xs"
                >
                  <option value="Operational Conflict">Operational Conflict</option>
                  <option value="Insufficient Availability">Insufficient Availability</option>
                  <option value="Train Impact">Train Impact (Passenger Express Delay)</option>
                  <option value="Incorrect Timing">Incorrect Timing</option>
                  <option value="Maintenance Issue">Maintenance Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-semibold mb-1">AUTHORITY COMMENTS</label>
                <input
                  type="text"
                  value={rejectComments}
                  onChange={(e) => setRejectComments(e.target.value)}
                  placeholder="Explain rejection decision"
                  required
                  className="w-full bg-white border border-rose-300 rounded p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded text-xs">
                CONFIRM REJECTION
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Split Section: Downstream Dispatch & Active Possession Register (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-xs">
        {/* Left Column: Notification & Dispatch // Downstream Audit (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-emerald-400"></span>
                <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
                  NOTIFICATION & DISPATCH // DOWNSTREAM AUDIT
                </span>
              </div>
              <span className="text-[10px] text-slate-400">ALL CHANNELS SYNCHRONIZED</span>
            </div>

            <div className="text-[11px] text-slate-400">
              DISPATCH RECEIVER MATRIX FOR APPROVED BLOCK {selectedPlan?.request_id || 'BR-2026-0138'}:
            </div>

            {/* 6 Operational Units */}
            <div className="space-y-2">
              {dispatches.map((disp) => (
                <div
                  key={disp.id || disp.unit_order}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    disp.status === 'ACKNOWLEDGED'
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-xs">{disp.unit_name}</div>
                    <div className="text-[10px] text-slate-400">{disp.recipient_role}</div>
                  </div>

                  <div>
                    {disp.status === 'ACKNOWLEDGED' ? (
                      <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        ✔ ACKNOWLEDGED
                      </span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        ✔ SENT [{disp.sent_timestamp}]
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Block Monitoring // Real-Time Possession Register (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-emerald-400"></span>
                <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
                  ACTIVE BLOCK MONITORING // REAL-TIME POSSESSION REGISTER
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{possessions.length} ACTIVE POSSESSIONS</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] tracking-wider uppercase">
                    <th className="py-2.5 px-3">BLOCK ID</th>
                    <th className="py-2.5 px-3">SECTION</th>
                    <th className="py-2.5 px-3">DEPARTMENT</th>
                    <th className="py-2.5 px-3">START</th>
                    <th className="py-2.5 px-3">END</th>
                    <th className="py-2.5 px-3">TRAINS AFF.</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">REMAINING</th>
                    <th className="py-2.5 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {possessions.map((poss) => (
                    <tr key={poss.block_id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-sky-400">{poss.block_id}</td>
                      <td className="py-2.5 px-3 text-slate-200">{poss.section}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          poss.department === 'SIGNAL'
                            ? 'bg-teal-950 text-teal-300 border border-teal-500/30'
                            : 'bg-sky-950 text-sky-300 border border-sky-500/30'
                        }`}>
                          {poss.department}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{poss.start_time}</td>
                      <td className="py-2.5 px-3 text-slate-300">{poss.end_time}</td>
                      <td className="py-2.5 px-3 text-center">{poss.trains_affected}</td>
                      <td className="py-2.5 px-3">
                        {poss.status === 'ACTIVE' ? (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ■ ACTIVE
                          </span>
                        ) : poss.status === 'COMPLETED' ? (
                          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            COMPLETED
                          </span>
                        ) : (
                          <span className="bg-sky-950 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ON SCHEDULE
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{poss.remaining_display}</td>
                      <td className="py-2.5 px-3 text-right">
                        {poss.status !== 'COMPLETED' ? (
                          <button
                            onClick={() => handleCompletePossession(poss.block_id)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors"
                            title="Release track possession and archive to Panel 4 Station Maintenance History"
                          >
                            COMPLETE WORK →
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500">ARCHIVED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
              <span>ALL POSSESSIONS GOVERNED UNDER INDIAN RAILWAYS G&SR CHAPTER IV RULES</span>
              <span className="text-emerald-400 font-bold">SPEED RESTRICTION COMPLIANCE: 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision History Table (Section 4 requirements) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-100 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
            AUTHORITY DECISION AUDIT LOG // STATUTORY ARCHIVE
          </span>
          <span className="text-[10px] text-slate-400">Total Decisions: {decisions.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[10px] tracking-wider uppercase border-b border-slate-800">
                <th className="py-2.5 px-3">PLAN ID</th>
                <th className="py-2.5 px-3">REQUEST ID</th>
                <th className="py-2.5 px-3">DECISION</th>
                <th className="py-2.5 px-3">AUTHORITY OFFICER</th>
                <th className="py-2.5 px-3">DATE / TIME</th>
                <th className="py-2.5 px-3">COMMENTS / REASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-[11px]">
              {decisions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-500">
                    No decisions logged yet. Approved plans will register here automatically.
                  </td>
                </tr>
              ) : (
                decisions.map((dec) => (
                  <tr key={dec.id} className="hover:bg-slate-850/60">
                    <td className="py-2.5 px-3 font-bold text-sky-400">{dec.plan_id}</td>
                    <td className="py-2.5 px-3 text-slate-300">{dec.request_id}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dec.decision === 'ACCEPTED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : dec.decision === 'MODIFIED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                      }`}>
                        {dec.decision}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">{dec.authority_user} ({dec.officer_id})</td>
                    <td className="py-2.5 px-3 text-slate-400">{dec.decision_date} {dec.decision_time}</td>
                    <td className="py-2.5 px-3 text-slate-300">{dec.rejection_reason || dec.comments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
