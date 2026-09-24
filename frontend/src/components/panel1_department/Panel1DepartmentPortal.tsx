import React, { useState, useEffect } from 'react';
import { Plus, Filter, ArrowUpDown, ChevronRight, Eye, AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import { TrackAsset, MaintenanceRequest, WeeklyScheduleItem } from '../../types/railops';
import { RequisitionBlockModal } from './RequisitionBlockModal';
import { WeeklyPlanningView } from './WeeklyPlanningView';
import { MonthlyPlanningView } from './MonthlyPlanningView';

interface Props {
  onPlanCreated?: () => void;
}

export const Panel1DepartmentPortal: React.FC<Props> = ({ onPlanCreated }) => {
  const [selectedDeptRef, setSelectedDeptRef] = useState<'TMS' | 'SMMS' | 'TDMS'>('TMS');
  const [activeSubTab, setActiveSubTab] = useState<'MAINTENANCE' | 'DASHBOARD' | 'UPCOMING' | 'WEEKLY' | 'MONTHLY'>('MAINTENANCE');
  const [assets, setAssets] = useState<TrackAsset[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [weeklyItems, setWeeklyItems] = useState<WeeklyScheduleItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<TrackAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetsData, reqsData, weeklyData, monthlyRes] = await Promise.all([
        api.getAssets(selectedDeptRef, statusFilter),
        api.getRequests(),
        api.getWeeklySchedule(),
        api.getMonthlySchedule()
      ]);
      setAssets(assetsData);
      setRequests(reqsData);
      setWeeklyItems(weeklyData);
      setMonthlyData(monthlyRes);
    } catch (err) {
      console.error('Error fetching department data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDeptRef, statusFilter]);

  const handleRequestCreated = (newReq: MaintenanceRequest) => {
    loadData();
    if (onPlanCreated) onPlanCreated();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            COMPLETED
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-500/50 rail-glow-red">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping"></span>
            OVERDUE
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
            REQUESTED
          </span>
        );
      case 'UPCOMING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-500/40">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            UPCOMING
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'CRITICAL') {
      return (
        <span className="border border-rose-500 text-rose-400 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
          CRITICAL
        </span>
      );
    }
    if (priority === 'HIGH') {
      return (
        <span className="border border-amber-500/80 text-amber-400 px-2 py-0.5 rounded text-[11px] font-mono font-semibold">
          HIGH
        </span>
      );
    }
    return (
      <span className="border border-slate-600 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Subheader Row (Matching Screenshot 2) */}
      <div className="bg-white text-slate-800 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold font-hud tracking-wide text-slate-900 uppercase">
            MAINTENANCE DEPARTMENT
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Monitor maintenance activities and submit railway block requests
          </p>
        </div>

        {/* Action & Nav Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedDeptRef}
                onChange={(e) => setSelectedDeptRef(e.target.value as any)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none cursor-pointer pr-8"
              >
                <option value="TMS">DEPT REF: TMS — TRACK MAINTENANCE</option>
                <option value="SMMS">DEPT REF: SMMS — SIGNAL & TELECOM</option>
                <option value="TDMS">DEPT REF: TDMS — TRACTION DISTRIBUTION</option>
              </select>
            </div>

            {/* Navigation Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveSubTab('DASHBOARD')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === 'DASHBOARD'
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DASHBOARD
              </button>
              <button
                onClick={() => setActiveSubTab('MAINTENANCE')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === 'MAINTENANCE'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MAINTENANCE
              </button>
              <button
                onClick={() => setActiveSubTab('UPCOMING')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === 'UPCOMING'
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                UPCOMING
              </button>
              <button
                onClick={() => setActiveSubTab('WEEKLY')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === 'WEEKLY'
                    ? 'bg-sky-700 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                WEEKLY PLANNING
              </button>
              <button
                onClick={() => setActiveSubTab('MONTHLY')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === 'MONTHLY'
                    ? 'bg-sky-700 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MONTHLY PLANNING
              </button>
            </div>
          </div>

          {/* Primary CTA: Requisition Block */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow transition-all"
          >
            <Plus className="h-4 w-4" />
            REQUISITION BLOCK
          </button>
        </div>
      </div>

      {/* Dynamic Sub-Views */}
      {activeSubTab === 'WEEKLY' && (
        <WeeklyPlanningView scheduleItems={weeklyItems} />
      )}

      {activeSubTab === 'MONTHLY' && (
        <MonthlyPlanningView monthlyData={monthlyData} />
      )}

      {activeSubTab === 'DASHBOARD' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
            <span className="text-xs font-mono text-slate-400">TOTAL ASSETS MONITORED</span>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">{assets.length} Assets</div>
            <p className="text-[11px] text-slate-500 font-mono mt-2">Compliance verified under Track Master Registry</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
            <span className="text-xs font-mono text-rose-400 font-bold">OVERDUE / CRITICAL INTERVENTIONS</span>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {assets.filter(a => a.status === 'OVERDUE' || a.priority === 'CRITICAL').length} Defects
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-2">Requires immediate block requisition</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-slate-100">
            <span className="text-xs font-mono text-emerald-400 font-bold">ACTIVE / SCHEDULED BLOCKS</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {requests.filter(r => r.status === 'SCHEDULED' || r.status === 'ACTIVE').length} Sanctions
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-2">Dispatched to field maintenance gangs</p>
          </div>
        </div>
      )}

      {(activeSubTab === 'MAINTENANCE' || activeSubTab === 'UPCOMING') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
          {/* Card Header & Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold font-hud text-slate-900 tracking-wide uppercase">
                MAINTENANCE INVENTORY
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Department asset compliance registry and sectional records
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>STATUS:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-mono font-semibold focus:outline-none"
                >
                  <option value="ALL">ALL ({assets.length})</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="REQUESTED">REQUESTED</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span>SORT:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-mono font-semibold focus:outline-none"
                >
                  <option value="DESC">DATE (DESC)</option>
                  <option value="ASC">DATE (ASC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 text-[11px] tracking-wider uppercase">
                  <th className="py-3 px-4 font-semibold">ASSET ID</th>
                  <th className="py-3 px-4 font-semibold">ACTIVITY DESCRIPTION</th>
                  <th className="py-3 px-4 font-semibold">LOCATION</th>
                  <th className="py-3 px-4 font-semibold">PRIORITY</th>
                  <th className="py-3 px-4 font-semibold">SCHEDULE</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                      No assets found for the selected department filter.
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.asset_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{asset.asset_id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{asset.activity_description}</td>
                      <td className="py-3.5 px-4 text-slate-600">{asset.location}</td>
                      <td className="py-3.5 px-4">{getPriorityBadge(asset.priority)}</td>
                      <td className="py-3.5 px-4 text-slate-600">{asset.schedule_date}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(asset.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-slate-800 hover:text-sky-600 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          VIEW <span className="text-slate-400">→</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500">
            <span>SHOWING 1 TO {assets.length} OF 42 RECORDS</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 rounded border border-slate-300 hover:bg-white disabled:opacity-50">
                PREV
              </button>
              <button className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold">1</button>
              <button className="px-2 py-1 rounded border border-slate-300 hover:bg-white">2</button>
              <button className="px-2 py-1 rounded border border-slate-300 hover:bg-white">3</button>
              <button className="px-2 py-1 rounded border border-slate-300 hover:bg-white">NEXT</button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full p-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-sky-400">{selectedAsset.asset_id}</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-300 font-medium">{selectedAsset.department}</span>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs">
              <div className="text-sm font-bold text-white">{selectedAsset.activity_description}</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>Location: <span className="text-white font-semibold">{selectedAsset.location}</span></div>
                <div>Station: <span className="text-white font-semibold">{selectedAsset.station_code}</span></div>
                <div>Condition: <span className="text-white font-semibold">{selectedAsset.condition_rating}</span></div>
                <div>Last Work: <span className="text-white font-semibold">{selectedAsset.last_maintenance_date || 'N/A'}</span></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span>Priority: {getPriorityBadge(selectedAsset.priority)}</span>
                <span>Status: {getStatusBadge(selectedAsset.status)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded text-xs font-mono font-bold bg-sky-600 hover:bg-sky-500 text-white"
              >
                REQUISITION BLOCK FOR ASSET →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requisition Modal */}
      <RequisitionBlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestCreated}
        initialDept={selectedDeptRef === 'TMS' ? 'Engineering' : selectedDeptRef === 'SMMS' ? 'S&T' : 'TRD'}
      />
    </div>
  );
};
