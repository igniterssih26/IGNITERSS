import React from 'react';
import { X, AlertTriangle, Clock, Train, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MaintenanceRequest } from '../../types/railops';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest | null;
  onProceedToOptimization: (requestId: string) => void;
}

export const ConflictAnalysisModal: React.FC<Props> = ({
  isOpen,
  onClose,
  request,
  onProceedToOptimization
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full p-5 text-slate-100 font-mono text-xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-hud font-bold text-sm text-white uppercase tracking-wider">
              CORRIDOR CONFLICT ANALYSIS // {request.request_id}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Request Overview Banner */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400">Section: </span>
              <span className="text-white font-bold">{request.segment}</span>
            </div>
            <div>
              <span className="text-slate-400">Department: </span>
              <span className="text-sky-400 font-bold">{request.department}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Requested Window: </span>
              <span className="text-rose-400 font-bold">{request.requested_date} // {request.requested_start_time} - {request.requested_end_time} ({request.duration_minutes} min)</span>
            </div>
            <div>
              <span className="text-slate-400">Priority: </span>
              <span className="text-amber-400 font-bold">{request.priority}</span>
            </div>
          </div>
        </div>

        {/* Clashes Detected */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
            <AlertTriangle className="h-4 w-4" />
            <span>3 DIRECT OPERATIONAL OVERLAPS DETECTED</span>
          </div>

          <div className="space-y-2">
            <div className="bg-rose-950/30 border border-rose-500/50 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Train className="h-4 w-4 text-rose-400" />
                <div>
                  <div className="text-white font-bold">TR-12675 // Kovai Superfast Express</div>
                  <div className="text-[10px] text-slate-400">Scheduled Arrival: 11:42 | Departure: 11:47 (UP Line)</div>
                </div>
              </div>
              <span className="text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-600/50">
                HEAD-ON BLOCK CLASH
              </span>
            </div>

            <div className="bg-rose-950/30 border border-rose-500/50 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Train className="h-4 w-4 text-rose-400" />
                <div>
                  <div className="text-white font-bold">TR-12691 // Nilgiri Express</div>
                  <div className="text-[10px] text-slate-400">Scheduled Running: 12:15 - 12:35 (Corridor Inception)</div>
                </div>
              </div>
              <span className="text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-600/50">
                PASSENGER DELAY +24M
              </span>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/50 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Train className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="text-white font-bold">TR-0942 // Container Freight Rake</div>
                  <div className="text-[10px] text-slate-400">Freight Corridor Slot: 12:40 (Salem Yard Inbound)</div>
                </div>
              </div>
              <span className="text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-600/50">
                CAN DIVERT VIA LOOP
              </span>
            </div>
          </div>
        </div>

        {/* Solver Feasibility Preview */}
        <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded-lg space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>FEASIBLE SHIFT WINDOW IDENTIFIED BY OR-TOOLS ENGINE</span>
          </div>
          <p className="text-slate-300">
            Shifting slot by <span className="text-emerald-400 font-bold">+40 minutes (12:10 - 13:40)</span> allows Express 12691 to pass before possession inception, and reroutes freight rake 0942 via Salem Loop Line without cancellation.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-white"
          >
            DISMISS
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedToOptimization(request.request_id);
            }}
            className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-2 shadow-lg"
          >
            RUN BLOCK OPTIMIZATION SOLVER
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
