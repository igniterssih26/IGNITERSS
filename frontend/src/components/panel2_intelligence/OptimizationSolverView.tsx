import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Clock, Send, Layers } from 'lucide-react';
import { MaintenancePlan, SolverMetrics } from '../../types/railops';

interface Props {
  plans: MaintenancePlan[];
  selectedPlan: MaintenancePlan | null;
  onSelectPlan: (plan: MaintenancePlan) => void;
  onSendToAuthority: (planId: string) => Promise<void>;
  onNavigateToAuthority: () => void;
  solverMetrics?: SolverMetrics | null;
}

export const OptimizationSolverView: React.FC<Props> = ({
  plans,
  selectedPlan,
  onSelectPlan,
  onSendToAuthority,
  onNavigateToAuthority,
  solverMetrics
}) => {
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Active plan fallback
  const currentPlan = selectedPlan || plans.find(p => p.is_recommended) || plans[0];

  const handleSend = async () => {
    if (!currentPlan) return;
    setSending(true);
    try {
      await onSendToAuthority(currentPlan.plan_id);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const isSent = currentPlan?.status === 'SENT FOR APPROVAL' || currentPlan?.status === 'APPROVED';

  return (
    <div className="space-y-4">
      {/* Top Solver Status Header (Matching Screenshot 4) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-slate-100 font-mono">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-sky-400"></span>
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              BLOCK OPTIMIZATION ENGINE // SOLVER STATUS & CONSTRAINT COMPLIANCE
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">SOLVER: <span className="text-slate-200 font-bold">OR-TOOLS MILP ENGINE</span></span>
            <span className="text-slate-600">|</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
              STATUS: COMPLETED (0.84S SOLVE TIME)
            </span>
          </div>
        </div>

        {/* 10 Operational Engine Input Parameters Ingested */}
        <div className="mt-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
            OPERATIONAL ENGINE INPUT PARAMETERS INGESTED:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            {[
              '1. Train Schedules (TMS)',
              '2. Existing Active Blocks',
              '3. Requested Blocks (Dept)',
              '4. Track Availability (SMS)',
              '5. Maintenance Duration',
              '6. Machine Setup & Clearing',
              '7. Workforce Availability',
              '8. Train Priority Ranking',
              '9. Freight Delivery SLA',
              '10. Historical Track Delays'
            ].map((param, idx) => (
              <div
                key={idx}
                className="bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 text-slate-300 truncate"
                title={param}
              >
                {param}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">REQUESTS EVALUATED</div>
            <div className="text-2xl font-bold font-hud text-slate-100 mt-1">18</div>
            <div className="text-[10px] text-slate-500 mt-0.5">ACROSS 3 DIVISIONS</div>
          </div>

          <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-500/40 text-center">
            <div className="text-[10px] text-rose-400 font-bold uppercase">CONFLICTS DETECTED</div>
            <div className="text-2xl font-bold font-hud text-rose-400 mt-1">05</div>
            <div className="text-[10px] text-rose-300/70 mt-0.5">3 RESOLVED BY RETIMING</div>
          </div>

          <div className="bg-sky-950/20 p-3 rounded-lg border border-sky-500/40 text-center">
            <div className="text-[10px] text-sky-400 font-bold uppercase">POSSIBLE ALTERNATIVES</div>
            <div className="text-2xl font-bold font-hud text-sky-400 mt-1">09</div>
            <div className="text-[10px] text-sky-300/70 mt-0.5">FEASIBLE CORRIDOR SLOTS</div>
          </div>

          <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/40 text-center">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">PLANS GENERATED</div>
            <div className="text-2xl font-bold font-hud text-emerald-400 mt-1">04</div>
            <div className="text-[10px] text-emerald-300/70 mt-0.5">1 OPTIMAL / 3 CONTINGENCY</div>
          </div>
        </div>
      </div>

      {/* Main Split Comparison Grid (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Recommended Block Plan // Best Plan (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 border-2 border-emerald-500/60 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span className="font-hud font-bold text-sm text-emerald-400 uppercase tracking-wider">
                  RECOMMENDED BLOCK PLAN // BEST PLAN
                </span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-xs font-mono font-bold px-2 py-0.5 rounded">
                PLAN STATUS: {currentPlan?.status || 'OPTIMIZED'}
              </span>
            </div>

            <div className="text-xs font-mono text-slate-400">
              BLOCK REQUEST: <span className="text-sky-400 font-bold">{currentPlan?.request_id || 'BR-2026-0142'}</span> | SECTION: <span className="text-white font-bold">{currentPlan?.segment || 'SALEM - ERODE'}</span>
            </div>

            {/* Time Comparison Box (Requested strikethrough vs Recommended Box) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Requested */}
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  ORIGINALLY REQUESTED TIME
                </div>
                <div className="text-2xl font-mono font-bold text-slate-400 line-through decoration-rose-500 decoration-2">
                  {currentPlan?.requested_start_time || '11:30'} — {currentPlan?.requested_end_time || '13:00'}
                </div>
                <div className="text-[10px] font-mono font-bold text-rose-400">
                  CLASH WITH 3 SCHEDULED TRAINS
                </div>
              </div>

              {/* Recommended Box */}
              <div className="bg-emerald-950/50 border-2 border-emerald-500 rounded-xl px-5 py-3 text-center rail-glow-green">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  RECOMMENDED ALLOTMENT WINDOW
                </div>
                <div className="text-3xl font-hud font-bold text-emerald-300 mt-0.5">
                  {currentPlan?.recommended_start_time || '12:10'} — {currentPlan?.recommended_end_time || '13:40'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5">
                  NET SHIFT: +40 MIN (ZERO CLASH)
                </div>
              </div>
            </div>

            {/* Operational Reason */}
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 leading-relaxed">
              <span className="text-slate-400 font-bold">OPERATIONAL REASON: </span>
              <span className="text-slate-300">
                "{currentPlan?.reason_for_recommendation || 'Original request conflicts with 3 scheduled passenger train movements (TR 12675, TR 12691, TR 0942). Retiming by +40 minutes allows passing of Express 12691 before block inception, recovering freight flow via Salem loop line without cancellation.'}"
              </span>
            </div>

            {/* 4 KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">DELAY IMPACT</div>
                <div className="text-lg font-bold text-white mt-0.5">{currentPlan?.delay_impact_min || 18} MIN</div>
                <div className="text-[9px] text-emerald-400 font-semibold">ACCEPTABLE SLA</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">CONFLICTS</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{currentPlan?.conflicts_detected || 0}</div>
                <div className="text-[9px] text-emerald-400 font-semibold">FULLY RESOLVED</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">RESOURCE UTIL.</div>
                <div className="text-lg font-bold text-white mt-0.5">{currentPlan?.resource_util_pct || 84}%</div>
                <div className="text-[9px] text-slate-400">{currentPlan?.resource_gang || 'GANG #4 & TAMP'}</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">RECOVERED TRAINS</div>
                <div className="text-lg font-bold text-sky-400 mt-0.5">{currentPlan?.recovered_trains || 3} TRAINS</div>
                <div className="text-[9px] text-sky-400">PREVENTED STALL</div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div>
              <span className="text-slate-400">RECOMMENDATION READY FOR </span>
              <span className="text-emerald-400 font-bold">CHIEF CONTROLLER AUTHORIZATION</span>
              <span className="ml-2 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-bold">
                TIER-1 RESOLUTION
              </span>
            </div>

            <button
              onClick={handleSend}
              disabled={sending || isSent}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all ${
                isSent
                  ? 'bg-emerald-800 text-emerald-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              {isSent ? 'SENT TO AUTHORITY (READY IN P3)' : sending ? 'TRANSMITTING...' : 'SEND TO AUTHORITY FOR APPROVAL'}
            </button>
          </div>
        </div>

        {/* Right Column: Alternative Plans // Contingency Options (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-100 flex flex-col justify-between font-mono">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
                ALTERNATIVE PLANS // CONTINGENCY OPTIONS
              </span>
              <span className="text-xs text-slate-400">3 CHOICES AVAILABLE</span>
            </div>

            {/* Plans List */}
            <div className="space-y-3">
              {plans.map((p, idx) => {
                const isSelected = (currentPlan?.plan_id === p.plan_id);

                return (
                  <div
                    key={p.plan_id || idx}
                    className={`rounded-lg border p-3 transition-all space-y-2 ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/40 shadow'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{p.plan_code}</span>
                        <span className="text-slate-400 text-[11px]">— {p.is_recommended ? 'RECOMMENDED' : p.operational_impact}</span>
                      </div>
                      {isSelected ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[10px] px-2 py-0.5 rounded font-bold">
                          SELECTED
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                          {p.operational_impact}
                        </span>
                      )}
                    </div>

                    <div className="text-emerald-400 font-bold text-sm">
                      WINDOW: {p.recommended_start_time} — {p.recommended_end_time} ({p.duration_minutes} MIN)
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                      <span>Delay: <strong className="text-white">{p.delay_impact_min} min</strong></span>
                      <span>Conflicts: <strong className={p.conflicts_detected === 0 ? 'text-emerald-400' : 'text-amber-400'}>{p.conflicts_detected}</strong></span>
                      <span>Resource: <strong className="text-white">{p.resource_util_pct}%</strong></span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => onSelectPlan(p)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isSelected ? 'ACTIVE' : 'SELECT'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1">
              * Note: Selecting an alternate recalculates downstream sectional train graphs automatically across TMS.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Footer Banner (Matching Screenshot 4 bottom) */}
      <div
        onClick={onNavigateToAuthority}
        className="bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-hud font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
            HUMAN APPROVAL REQUIRED // CHIEF CONTROLLER STATUTORY SIGN-OFF
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-amber-950 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold px-3 py-1 rounded">
            STATUTORY SANCTION MANDATORY
          </span>
          <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            PROCEED TO PANEL 3 →
          </span>
        </div>
      </div>
    </div>
  );
};
