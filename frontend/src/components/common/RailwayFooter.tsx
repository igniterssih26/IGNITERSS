import React from 'react';

export const RailwayFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 py-3 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-300">RAILOPS // CENTRAL OPERATIONS (CO)</span>
          <span className="text-slate-600">•</span>
          <span>DIVISION: SOUTHERN RAILWAYS</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">RELEASE REV 5.2_OPERATIONS</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400/90 font-medium">SECURITY: RESTRICTED ACCESS (OFFICIAL RAILWAY USE ONLY)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            ALL SUBSYSTEMS NOMINAL
          </span>
          <span className="text-slate-600">•</span>
          <span>SERVER: IR-SR-MAS-01</span>
          <span className="text-slate-600">•</span>
          <span className="text-sky-400">CRIS FOIS GATEWAY: CONNECTED</span>
          <span className="text-slate-600">•</span>
          <span>LATENCY: 14ms</span>
        </div>
      </div>
    </footer>
  );
};
