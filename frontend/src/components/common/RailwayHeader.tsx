import React from 'react';
import { Bell, Train, ShieldCheck, Activity, Database, CheckCircle2, History, PlayCircle, Users } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  pendingNoticeCount?: number;
}

export const RailwayHeader: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  pendingNoticeCount = 4
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: IR Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-600/20 text-sky-400 p-2 rounded-lg border border-sky-500/30 flex items-center justify-center">
            <Train className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-white font-hud">INDIAN RAILWAYS</span>
              <span className="text-slate-500 font-mono">|</span>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold font-hud">RAILOPS BLOCK PLANNER</span>
              <span className="bg-slate-800 text-[10px] text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">CO-HUB</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Centralized Maintenance Block Planning & Statutory Authority System</p>
          </div>
        </div>

        {/* Center: Navigation Panel Tabs */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('panel1')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'panel1'
                ? 'bg-sky-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Panel 1: Maintenance Dept
          </button>

          <button
            onClick={() => setActiveTab('panel2')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'panel2'
                ? 'bg-sky-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Panel 2: Central Intelligence
          </button>

          <button
            onClick={() => setActiveTab('panel3')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'panel3'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Panel 3: Authority / BDMS
          </button>

          <button
            onClick={() => setActiveTab('panel4')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'panel4'
                ? 'bg-sky-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Panel 4: Station History
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            Data & Ingestion
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'demo'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PlayCircle className="h-3.5 w-3.5" />
            15-Step Demo Guide
          </button>
        </nav>

        {/* Right: Operational Status, Alerts, Role Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 rounded text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            OPERATIONAL
          </div>

          <div className="relative cursor-pointer text-slate-400 hover:text-white transition-colors p-1.5 rounded-full bg-slate-800">
            <Bell className="h-4 w-4" />
            {pendingNoticeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center font-mono">
                {pendingNoticeCount}
              </span>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
            >
              <option value="DEPARTMENT" className="bg-slate-900 text-white">DEPT. OFFICER (SALEM DIV)</option>
              <option value="PLANNER" className="bg-slate-900 text-white">R. KRISHNAN (CO OFFICER)</option>
              <option value="AUTHORITY" className="bg-slate-900 text-white">CHIEF CONTROLLER (BDMS)</option>
              <option value="HISTORIAN" className="bg-slate-900 text-white">CHIEF AUDITOR / GIS</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
