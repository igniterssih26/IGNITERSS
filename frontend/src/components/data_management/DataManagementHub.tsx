import React, { useState, useEffect } from 'react';
import { Database, Upload, FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { DataSourceItem, DataImportLogItem, QualityReportItem } from '../../types/railops';

export const DataManagementHub: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [importLogs, setImportLogs] = useState<DataImportLogItem[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [qualityReport, setQualityReport] = useState<QualityReportItem[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'INVENTORY' | 'QUALITY' | 'LOGS' | 'SCHEMA'>('INVENTORY');

  const loadData = async () => {
    try {
      const [src, logs, inv, qReport] = await Promise.all([
        api.getDataSources(),
        api.getImportLogs(),
        api.getDatasetInventory(),
        api.getQualityReport()
      ]);
      setSources(src);
      setImportLogs(logs);
      setInventory(inv);
      setQualityReport(qReport);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateImport = async () => {
    setSimulating(true);
    try {
      await api.simulateImport('sr_turnout_inspection_telemetry.csv');
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-mono text-xs">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-400" />
              <span className="font-hud font-bold text-lg text-white uppercase tracking-wider">
                DATA ARCHITECTURE, INGESTION & DATASET MANAGEMENT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              CRIS FOIS / TMS / SMMS / TDMS standardized data pipeline & quality audit
            </p>
          </div>

          <button
            onClick={handleSimulateImport}
            disabled={simulating}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center gap-2 shadow transition-all disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {simulating ? 'INGESTING DATASET...' : 'SIMULATE CSV/JSON INGESTION'}
          </button>
        </div>

        {/* Sub-nav */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('INVENTORY')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'INVENTORY' ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            A. DATASET INVENTORY
          </button>
          <button
            onClick={() => setActiveSubTab('QUALITY')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'QUALITY' ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            B. DATA QUALITY REPORT
          </button>
          <button
            onClick={() => setActiveSubTab('LOGS')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'LOGS' ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            C. IMPORT AUDIT LOGS
          </button>
          <button
            onClick={() => setActiveSubTab('SCHEMA')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeSubTab === 'SCHEMA' ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            D. SCHEMA & RELATIONSHIPS
          </button>
        </div>
      </div>

      {/* View A: Dataset Inventory */}
      {activeSubTab === 'INVENTORY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              DATASET INVENTORY (SECTION 18.A DELIVERABLE)
            </span>
            <span className="text-[10px] text-slate-400">{inventory.length} Master Datasets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <th className="py-2.5 px-3">DATASET NAME</th>
                  <th className="py-2.5 px-3">SOURCE GATEWAY</th>
                  <th className="py-2.5 px-3 text-right">ROWS</th>
                  <th className="py-2.5 px-3">IMPORTANT COLUMNS / MAPPING</th>
                  <th className="py-2.5 px-3">DATA TYPE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {inventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/60">
                    <td className="py-2.5 px-3 font-bold text-sky-400">{item.dataset}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.source}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{item.rows}</td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono text-[10px]">{item.important_columns}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View B: Data Quality Report */}
      {activeSubTab === 'QUALITY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              DATA QUALITY REPORT (SECTION 18.E DELIVERABLE)
            </span>
            <span className="text-emerald-400 font-bold">OVERALL DATASET INTEGRITY: 99.71%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {qualityReport.map((q, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-bold text-white truncate" title={q.dataset_name}>{q.dataset_name}</div>
                <div className="text-[10px] text-slate-400">{q.source_type}</div>
                <div className="text-2xl font-bold font-hud text-emerald-400">{q.quality_score_pct}%</div>
                <div className="space-y-1 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="text-white font-bold">{q.total_records}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missing Fields Flagged:</span>
                    <span className="text-amber-400 font-bold">{q.missing_fields_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicate Records:</span>
                    <span className="text-emerald-400 font-bold">{q.duplicate_records_count}</span>
                  </div>
                </div>
                <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded text-center font-bold">
                  {q.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View C: Import Audit Logs */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              DATA IMPORT AUDIT LOGS (SECTION 15 & 18.D)
            </span>
            <span className="text-[10px] text-slate-400">{importLogs.length} Executions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <th className="py-2.5 px-3">IMPORT ID</th>
                  <th className="py-2.5 px-3">FILENAME</th>
                  <th className="py-2.5 px-3">TYPE</th>
                  <th className="py-2.5 px-3 text-right">TOTAL</th>
                  <th className="py-2.5 px-3 text-right">SUCCESS</th>
                  <th className="py-2.5 px-3 text-right">FAILED</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {importLogs.map((log) => (
                  <tr key={log.import_id} className="hover:bg-slate-850/60">
                    <td className="py-2.5 px-3 font-bold text-sky-400">{log.import_id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{log.filename}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.source_type}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">{log.total_rows}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{log.successful_rows}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-400">{log.failed_rows}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[10px] max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View D: Schema & Relationships */}
      {activeSubTab === 'SCHEMA' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              UNIFIED DATABASE ARCHITECTURE (SECTION 18.B & 18.C)
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 leading-relaxed space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold">
              RELATIONAL FLOW (ONE CENTRALIZED DATABASE):
            </div>
            <pre className="bg-slate-900 p-3 rounded text-sky-300 text-xs overflow-x-auto">
{`Station (MAS, SA, ED, CBE, AJJ)
    ↓
Section (SEC-SA-ED, SEC-MAS-AJJ)
    ↓
Asset (TMS-001, SMMS-004, TDMS-003)
    ↓
Maintenance Request (BR-2026-0142) [Panel 1]
    ↓
Central Intelligence Optimization Plan (Plan A / B / C) [Panel 2]
    ↓
Authority Decision (Approved / Modified / Rejected) [Panel 3]
    ↓
Downstream Dispatch to 6 Operational Units + Active Possession Register
    ↓
Work Completed Certification
    ↓
Station Maintenance History (Permanent Audit Record) [Panel 4]`}
            </pre>

            <div className="pt-2 text-slate-400 text-[11px]">
              <strong className="text-white">API Readiness (Section 18.F):</strong> Future real-time CRIS / NTES train streams enter through FastAPI endpoints under <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-300">/api/data/*</code> with strict schema transformation before entering the core relational tables.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
