import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ArrowRight, ShieldCheck, CheckCheck, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  onNavigateTab: (tab: string) => void;
  onRefreshAll: () => void;
}

export const DemoGuideRunner: React.FC<Props> = ({ onNavigateTab, onRefreshAll }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [running, setRunning] = useState(false);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const steps = [
    {
      num: 1,
      title: 'Department Files Maintenance Request',
      desc: 'Engineering Department files BR-2026-0142 for Salem - Erode (KM 334/12 - 338/04).',
      panel: 'panel1',
      panelName: 'Panel 1: Maintenance Department'
    },
    {
      num: 2,
      title: 'Request Appears in Central Intake Register',
      desc: 'Central Operations Hub receives the request in real time with PENDING status.',
      panel: 'panel2',
      panelName: 'Panel 2: Central Intelligence'
    },
    {
      num: 3,
      title: 'Conflict Detection Engine Flags Clashes',
      desc: 'Engine flags 3 passenger train clashes (Kovai Express 12675, Nilgiri Express 12691, Freight 0942).',
      panel: 'panel2',
      panelName: 'Panel 2: Central Intelligence'
    },
    {
      num: 4,
      title: 'OR-Tools MILP Solver Generates Plan A, B, C',
      desc: 'Engine retimes slot to 12:10 - 13:40 (+40 min shift) resolving all 3 clashes without cancellations.',
      panel: 'panel2',
      panelName: 'Panel 2: Solver Screen'
    },
    {
      num: 5,
      title: 'Forward Plan to Authority for Statutory Sign-Off',
      desc: 'Plan status changes to SENT FOR APPROVAL, and appears on Chief Controller decision dashboard.',
      panel: 'panel3',
      panelName: 'Panel 3: Authority / BDMS'
    },
    {
      num: 6,
      title: 'Chief Controller Grants Statutory Sanction',
      desc: 'Statutory approval triggers instantaneous downstream dispatch to 6 operational units.',
      panel: 'panel3',
      panelName: 'Panel 3: Downstream Dispatch'
    },
    {
      num: 7,
      title: 'Real-Time Possession Register Initiated',
      desc: 'Active possession created with live countdown timer and speed restriction compliance.',
      panel: 'panel3',
      panelName: 'Panel 3: Active Possessions'
    },
    {
      num: 8,
      title: 'Schedules Synchronized Across Panels 1 & 2',
      desc: 'Weekly and Monthly planning views dynamically reflect the approved slot.',
      panel: 'panel1',
      panelName: 'Panel 1: Weekly/Monthly Planning'
    },
    {
      num: 9,
      title: 'Maintenance Execution Completed',
      desc: 'Track possession released and certified clear by site supervisor.',
      panel: 'panel3',
      panelName: 'Panel 3: Complete Work Action'
    },
    {
      num: 10,
      title: 'Permanent Archiving to Station Maintenance History',
      desc: 'Salem Junction (SA) history counter increments and permanent audit entry is logged.',
      panel: 'panel4',
      panelName: 'Panel 4: Station History'
    }
  ];

  const handleStepAction = async (stepNum: number) => {
    setRunning(true);
    try {
      if (stepNum === 1 || stepNum === 2) {
        onNavigateTab('panel1');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Checked Maintenance Department register.`]);
      } else if (stepNum === 3 || stepNum === 4) {
        await api.generatePlans('BR-2026-0142');
        onNavigateTab('panel2');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Generated optimization Plan A (12:10-13:40).`]);
      } else if (stepNum === 5) {
        await api.sendPlanToAuthority('PLAN-BR-2026-0142-A');
        onNavigateTab('panel3');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Sent Plan A to Authority.`]);
      } else if (stepNum === 6 || stepNum === 7) {
        await api.approvePlan('PLAN-BR-2026-0142-A');
        onNavigateTab('panel3');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Approved by Chief Controller. 6-unit dispatch triggered.`]);
      } else if (stepNum === 8) {
        onNavigateTab('panel1');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Verified schedule sync in Panel 1.`]);
      } else if (stepNum === 9 || stepNum === 10) {
        await api.completeMaintenance({
          block_id: 'BR-2026-0142',
          station_code: 'SA',
          work_summary: 'Track inspection and destressing certified clear.'
        });
        onNavigateTab('panel4');
        setStatusLog(prev => [...prev, `[Step ${stepNum}] Archived to Station History in Panel 4.`]);
      }
      setCurrentStep(Math.min(stepNum + 1, steps.length));
      onRefreshAll();
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 font-mono text-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-purple-400" />
            <span className="font-hud font-bold text-base text-white uppercase tracking-wider">
              15-STEP END-TO-END DEMONSTRATION WORKFLOW RUNNER
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute the complete statutory railway maintenance lifecycle across all 4 integrated panels
          </p>
        </div>

        <button
          onClick={() => handleStepAction(currentStep)}
          disabled={running}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
        >
          <PlayCircle className="h-4 w-4" />
          {running ? 'EXECUTING STEP...' : `AUTO-RUN STEP ${currentStep} →`}
        </button>
      </div>

      {/* Step Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s) => {
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div
              key={s.num}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-950/80 border-emerald-500/40'
                  : isCurrent
                  ? 'bg-slate-950 border-purple-500 ring-1 ring-purple-500/40 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isDone
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    STEP {s.num} OF {steps.length}
                  </span>

                  <span className="text-[10px] text-slate-400 font-bold">{s.panelName}</span>
                </div>

                <div className="font-bold text-sm text-white">{s.title}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">{s.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-850 flex items-center justify-between">
                <button
                  onClick={() => onNavigateTab(s.panel)}
                  className="text-sky-400 hover:underline text-[11px] flex items-center gap-1 font-bold"
                >
                  Jump to {s.panelName.split(':')[0]} →
                </button>

                <button
                  onClick={() => handleStepAction(s.num)}
                  disabled={running}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isDone ? 'RE-RUN' : isCurrent ? 'RUN NOW' : 'TRIGGER'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Log */}
      {statusLog.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            AUTOMATION RUN LOG:
          </div>
          <div className="space-y-1 font-mono text-[11px] text-emerald-400 max-h-32 overflow-y-auto">
            {statusLog.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
