import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const LiveAlertsSidebar: React.FC = () => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-rose-500"></span>
            <span className="font-hud text-xs font-bold uppercase tracking-wider text-slate-200">
              LIVE ALERTS // OPERATIONAL NOTIFICATIONS
            </span>
          </div>
          <span className="bg-rose-950 text-rose-300 border border-rose-600/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
            4 ACTIVE NOTICES
          </span>
        </div>

        {/* Notices Stack */}
        <div className="mt-4 space-y-3 font-mono">
          {/* 1. Critical Alert */}
          <div className="border border-rose-500/80 bg-rose-950/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                CRITICAL
              </span>
              <span className="text-[10px] text-slate-400">11:12:08 IST</span>
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              SIGNAL FAILURE DETECTED — SALEM JUNCTION
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Axle counter interlock fault on Point 42B. Speed restriction to 15 km/h enforced automatically.
            </p>
            <div className="text-[10px] font-bold text-rose-400">
              SAFETY PROTOCOL G&SR-24 IN EFFECT
            </div>
          </div>

          {/* 2. Warning Alert */}
          <div className="border border-amber-500/80 bg-amber-950/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                WARNING
              </span>
              <span className="text-[10px] text-slate-400">11:09:44 IST</span>
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              BLOCK CONFLICT: BR-2026-0143 VS TRAIN 12691
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Requested Chennai-Arakkonam S&T block directly overlaps scheduled run of Kovai Superfast Express.
            </p>
            <div className="text-[10px] font-bold text-amber-400">
              EST. PASSENGER DELAY: +24 MIN
            </div>
          </div>

          {/* 3. Info Notice */}
          <div className="border border-sky-500/80 bg-sky-950/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-sky-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                INFO
              </span>
              <span className="text-[10px] text-slate-400">10:55:10 IST</span>
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              ENGINEERING SUBMITTED NEW BLOCK REQUEST
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Division Track Engineer filed BR 2026-0145 for deep screening machine between Salem and Karur.
            </p>
          </div>

          {/* 4. Success Notice */}
          <div className="border border-emerald-500/80 bg-emerald-950/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                SUCCESS
              </span>
              <span className="text-[10px] text-slate-400">10:48:00 IST</span>
            </div>
            <div className="text-xs font-bold text-white tracking-tight">
              BLOCK BR-2026-0138 DISPATCHED & APPROVED
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Chief Controller signature verified. S&T maintenance crew on site with possession memo #4881.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
        ALL EVENTS RECORDED TO CENTRAL COMPLIANCE REGISTER (DMS-LOG)
      </div>
    </div>
  );
};
