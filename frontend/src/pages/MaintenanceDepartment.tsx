import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Plus, Search, Filter, Eye, ChevronDown, AlertTriangle,
  Wrench, Clock, CheckCircle, Package, FileText, Calendar,
  TrendingUp, X, Upload, ChevronRight
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { KpiCard } from '../components/ui/KpiCard';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const REQUESTS = [
  { id: 'REQ-0142', dept: 'Engineering', asset: 'Rail Joint AJ-204', segment: 'A-B', time: '14:00–16:00', duration: '2h', priority: 'HIGH', criticality: 'HIGH', status: 'REQUESTED', aiRec: '18:00–20:00' },
  { id: 'REQ-0141', dept: 'TRD', asset: 'OHE Wire OE-118', segment: 'B-C', time: '10:00–12:00', duration: '2h', priority: 'MEDIUM', criticality: 'MEDIUM', status: 'ANALYZING', aiRec: '—' },
  { id: 'REQ-0140', dept: 'S&T', asset: 'Signal Box SB-07', segment: 'C-D', time: '06:00–08:00', duration: '2h', priority: 'HIGH', criticality: 'HIGH', status: 'RECOMMENDED', aiRec: '06:00–08:00' },
  { id: 'REQ-0139', dept: 'Engineering', asset: 'Track T-22', segment: 'D-E', time: '18:00–20:00', duration: '2h', priority: 'LOW', criticality: 'LOW', status: 'APPROVED', aiRec: '18:00–20:00' },
  { id: 'REQ-0138', dept: 'Engineering', asset: 'Bridge BR-11', segment: 'A-B', time: '08:00–10:00', duration: '2h', priority: 'EMERGENCY', criticality: 'CRITICAL', status: 'ACTIVE', aiRec: '08:00–10:00' },
  { id: 'REQ-0137', dept: 'S&T', asset: 'Point Machine PM-3', segment: 'E-F', time: '20:00–22:00', duration: '2h', priority: 'HIGH', criticality: 'HIGH', status: 'COMPLETED', aiRec: '20:00–22:00' },
  { id: 'REQ-0136', dept: 'TRD', asset: 'Substation SS-02', segment: 'B-C', time: '12:00–14:00', duration: '2h', priority: 'MEDIUM', criticality: 'MEDIUM', status: 'REJECTED', aiRec: '—' },
  { id: 'REQ-0135', dept: 'Engineering', asset: 'Sleeper SL-445', segment: 'C-D', time: '16:00–18:00', duration: '2h', priority: 'LOW', criticality: 'LOW', status: 'COMPLETED', aiRec: '16:00–18:00' },
];

const ASSETS = [
  { id: 'AJ-204', type: 'Rail Joint', segment: 'A-B', track: 'T2', criticality: 'HIGH', condition: 'Needs Attention', lastMaint: '18 Mar 2026', failures: 4, nextDue: '10 Sep 2026', status: 'ACTIVE' },
  { id: 'OE-118', type: 'OHE Wire', segment: 'B-C', track: 'T1', criticality: 'MEDIUM', condition: 'Good', lastMaint: '01 Feb 2026', failures: 1, nextDue: '01 Aug 2026', status: 'ACTIVE' },
  { id: 'SB-07', type: 'Signal Box', segment: 'C-D', track: 'T3', criticality: 'HIGH', condition: 'Fair', lastMaint: '22 Jan 2026', failures: 2, nextDue: '22 Jul 2026', status: 'ACTIVE' },
  { id: 'T-22', type: 'Track', segment: 'D-E', track: 'T2', criticality: 'LOW', condition: 'Good', lastMaint: '14 Nov 2025', failures: 0, nextDue: '14 May 2026', status: 'ACTIVE' },
  { id: 'BR-11', type: 'Bridge', segment: 'A-B', track: 'T1', criticality: 'CRITICAL', condition: 'Poor', lastMaint: '07 Aug 2025', failures: 6, nextDue: 'OVERDUE', status: 'CRITICAL' },
  { id: 'PM-3', type: 'Point Machine', segment: 'E-F', track: 'T4', criticality: 'HIGH', condition: 'Fair', lastMaint: '10 Dec 2025', failures: 3, nextDue: '10 Jun 2026', status: 'ACTIVE' },
  { id: 'SS-02', type: 'Substation', segment: 'B-C', track: 'T2', criticality: 'MEDIUM', condition: 'Good', lastMaint: '15 Jan 2026', failures: 1, nextDue: '15 Jul 2026', status: 'ACTIVE' },
  { id: 'SL-445', type: 'Sleeper', segment: 'C-D', track: 'T3', criticality: 'LOW', condition: 'Good', lastMaint: '20 Feb 2026', failures: 0, nextDue: '20 Aug 2026', status: 'ACTIVE' },
];

const HISTORY = [
  { date: '18 Mar 2026', asset: 'AJ-204', dept: 'Engineering', type: 'Corrective Maintenance', segment: 'A-B', block: 'BLK-041', start: '14:00', end: '16:00', duration: '2h', reason: 'Worn rail', condition: 'Fair', status: 'Completed' },
  { date: '22 Jan 2026', asset: 'AJ-204', dept: 'Engineering', type: 'Inspection', segment: 'A-B', block: 'BLK-028', start: '10:00', end: '11:00', duration: '1h', reason: 'Routine', condition: 'Good', status: 'Completed' },
  { date: '14 Nov 2025', asset: 'BR-11', dept: 'Engineering', type: 'Emergency Repair', segment: 'A-B', block: 'BLK-019', start: '02:00', end: '05:00', duration: '3h', reason: 'Crack found', condition: 'Fair', status: 'Completed' },
  { date: '07 Aug 2025', asset: 'AJ-204', dept: 'Engineering', type: 'Preventive Maintenance', segment: 'A-B', block: 'BLK-012', start: '18:00', end: '20:00', duration: '2h', reason: 'Scheduled', condition: 'Good', status: 'Completed' },
  { date: '02 Jun 2025', asset: 'OE-118', dept: 'TRD', type: 'OHE Maintenance', segment: 'B-C', block: 'BLK-009', start: '06:00', end: '08:00', duration: '2h', reason: 'Wear', condition: 'Good', status: 'Completed' },
  { date: '15 Apr 2025', asset: 'SB-07', dept: 'S&T', type: 'Signal Inspection', segment: 'C-D', block: 'BLK-007', start: '08:00', end: '09:00', duration: '1h', reason: 'Routine', condition: 'Good', status: 'Completed' },
  { date: '10 Mar 2025', asset: 'PM-3', dept: 'S&T', type: 'Corrective', segment: 'E-F', block: 'BLK-005', start: '20:00', end: '22:00', duration: '2h', reason: 'Failure', condition: 'Fair', status: 'Completed' },
  { date: '01 Feb 2025', asset: 'BR-11', dept: 'Engineering', type: 'Inspection', segment: 'A-B', block: 'BLK-004', start: '10:00', end: '11:00', duration: '1h', reason: 'Routine', condition: 'Poor', status: 'Completed' },
  { date: '12 Jan 2025', asset: 'SS-02', dept: 'TRD', type: 'Inspection', segment: 'B-C', block: 'BLK-003', start: '06:00', end: '07:00', duration: '1h', reason: 'Routine', condition: 'Good', status: 'Completed' },
  { date: '05 Dec 2024', asset: 'SL-445', dept: 'Engineering', type: 'Preventive', segment: 'C-D', block: 'BLK-002', start: '18:00', end: '20:00', duration: '2h', reason: 'Scheduled', condition: 'Good', status: 'Completed' },
];

const failureChartData = [
  { asset: 'AJ-204', failures: 4 }, { asset: 'BR-11', failures: 6 }, { asset: 'PM-3', failures: 3 },
  { asset: 'SB-07', failures: 2 }, { asset: 'OE-118', failures: 1 }, { asset: 'SS-02', failures: 1 },
  { asset: 'T-22', failures: 0 }, { asset: 'SL-445', failures: 0 },
];

const WEEK_SCHEDULE = [
  { req: 'REQ-0141', dept: 'TRD', segment: 'B-C', priority: 'MEDIUM', status: 'APPROVED', day: 'Mon', row: 2, col: 1 },
  { req: 'REQ-0138', dept: 'Engineering', segment: 'A-B', priority: 'EMERGENCY', status: 'ACTIVE', day: 'Wed', row: 1, col: 3 },
  { req: 'REQ-0140', dept: 'S&T', segment: 'C-D', priority: 'HIGH', status: 'RECOMMENDED', day: 'Tue', row: 0, col: 2 },
  { req: 'REQ-0142', dept: 'Engineering', segment: 'A-B', priority: 'HIGH', status: 'REQUESTED', day: 'Thu', row: 4, col: 4 },
  { req: 'REQ-0139', dept: 'Engineering', segment: 'D-E', priority: 'LOW', status: 'APPROVED', day: 'Fri', row: 6, col: 5 },
];

const TIMES = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_DATA: Record<number, { count: number; critical: number; planned: number }> = {
  3: { count: 2, critical: 0, planned: 1 }, 8: { count: 1, critical: 1, planned: 0 },
  10: { count: 3, critical: 1, planned: 2 }, 15: { count: 2, critical: 0, planned: 2 },
  17: { count: 1, critical: 0, planned: 0 }, 22: { count: 2, critical: 1, planned: 1 },
  24: { count: 3, critical: 0, planned: 2 }, 25: { count: 2, critical: 0, planned: 2 },
  28: { count: 1, critical: 0, planned: 1 },
};

const conditionColor = (c: string) => {
  if (c === 'Poor') return 'text-red-600';
  if (c === 'Needs Attention') return 'text-amber-600';
  if (c === 'Fair') return 'text-yellow-600';
  return 'text-green-600';
};

const blockColor = (status: string) => {
  if (status === 'ACTIVE') return 'bg-red-100 border-l-4 border-red-600 text-red-800';
  if (status === 'APPROVED') return 'bg-green-100 border-l-4 border-green-600 text-green-800';
  if (status === 'RECOMMENDED') return 'bg-purple-100 border-l-4 border-purple-600 text-purple-800';
  if (status === 'REQUESTED') return 'bg-amber-100 border-l-4 border-amber-500 text-amber-800';
  return 'bg-zinc-100 border-l-4 border-zinc-400 text-zinc-700';
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function MaintenanceDepartment() {
  const [activeTab, setActiveTab] = useState<'requests' | 'assets' | 'history' | 'schedule'>('requests');
  const [dept, setDept] = useState('Engineering');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<typeof REQUESTS[0] | null>(null);
  const [scheduleView, setScheduleView] = useState<'week' | 'month'>('week');
  const [requests, setRequests] = useState(REQUESTS);
  const [formData, setFormData] = useState({
    dept: 'Engineering', type: 'Preventive Maintenance', asset: 'AJ-204',
    segment: 'A-B', urgency: 'NORMAL', criticality: 'MEDIUM',
    date: '', startTime: '', endTime: '', reason: '', description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const filteredReqs = requests.filter(r =>
    (statusFilter === 'ALL' || r.status === statusFilter) &&
    (r.id.includes(search) || r.asset.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = () => {
    const newId = `REQ-0${143 + Math.floor(Math.random() * 100)}`;
    const newReq = {
      id: newId, dept: formData.dept, asset: formData.asset,
      segment: formData.segment, time: `${formData.startTime}–${formData.endTime}`,
      duration: '2h', priority: formData.urgency, criticality: formData.criticality,
      status: 'REQUESTED', aiRec: '18:00–20:00',
      type: formData.type, reason: formData.reason,
      date: formData.date, startTime: formData.startTime, endTime: formData.endTime,
    };
    setRequests(prev => [newReq, ...prev]);
    // Persist to localStorage for downstream panels
    localStorage.setItem('railops_workflow', JSON.stringify({
      stage: 'ANALYSIS',
      request: newReq,
      submittedAt: new Date().toISOString(),
    }));
    setSubmitted(true);
    // Navigate to Central Intelligence after 1.5s
    setTimeout(() => {
      setSubmitted(false);
      setShowCreateModal(false);
      navigate('/intelligence');
    }, 1500);
  };

  const tabs = [
    { key: 'requests', label: 'Requests', icon: FileText },
    { key: 'assets', label: 'Assets', icon: Package },
    { key: 'history', label: 'History', icon: Clock },
    { key: 'schedule', label: 'Schedule', icon: Calendar },
  ] as const;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">MAINTENANCE DEPARTMENT</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage maintenance requests, assets and maintenance history</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-zinc-900 bg-white">
            <span className="px-3 py-2 text-xs text-zinc-500 border-r-2 border-zinc-900 font-semibold">DEPT</span>
            <select value={dept} onChange={e => setDept(e.target.value)} className="px-3 py-2 text-xs font-semibold text-zinc-900 outline-none bg-white cursor-pointer">
              {['Engineering', 'TRD', 'S&T'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="md">
            <Plus size={14} /> New Maintenance Request
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Total Requests" value="128" icon={FileText} />
        <KpiCard label="Pending" value="17" color="amber" icon={Clock} />
        <KpiCard label="High Priority" value="8" color="red" icon={AlertTriangle} />
        <KpiCard label="Overdue" value="12" color="red" icon={TrendingUp} />
        <KpiCard label="Critical Assets" value="23" color="amber" icon={Package} />
        <KpiCard label="Completed" value="46" color="green" icon={CheckCircle} />
      </div>

      {/* Tabs */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="flex border-b-2 border-zinc-900">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-r border-zinc-200 last:border-r-0 ${
                activeTab === t.key ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: REQUESTS ── */}
        {activeTab === 'requests' && (
          <div>
            <div className="flex items-center gap-2 p-3 border-b border-zinc-100 flex-wrap">
              <div className="flex items-center border border-zinc-200 bg-zinc-50 px-2 py-1.5 gap-1.5 min-w-[200px]">
                <Search size={12} className="text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID or asset..." className="text-xs outline-none bg-transparent flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {['ALL', 'REQUESTED', 'ANALYZING', 'RECOMMENDED', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      statusFilter === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                    }`}>
                    {s === 'ALL' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {['Request ID', 'Department', 'Asset', 'Segment', 'Req. Time', 'Duration', 'Priority', 'Status', 'AI Rec.', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReqs.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{r.id}</td>
                      <td className="px-4 py-3 text-xs text-zinc-700">{r.dept}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.asset}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{r.segment}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{r.time}</td>
                      <td className="px-4 py-3 text-xs text-zinc-600">{r.duration}</td>
                      <td className="px-4 py-3"><Badge status={r.priority}>{r.priority}</Badge></td>
                      <td className="px-4 py-3"><Badge status={r.status}>{r.status}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-green-600">{r.aiRec}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedReq(r)} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase border border-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors cursor-pointer">
                          <Eye size={10} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: ASSETS ── */}
        {activeTab === 'assets' && (
          <div>
            <div className="flex items-center gap-2 p-3 border-b border-zinc-100">
              <div className="flex items-center border border-zinc-200 bg-zinc-50 px-2 py-1.5 gap-1.5">
                <Search size={12} className="text-zinc-400" />
                <input placeholder="Search assets..." className="text-xs outline-none bg-transparent w-40" />
              </div>
              <select className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50 cursor-pointer">
                <option>All Types</option>
                {['Rail Joint', 'OHE Wire', 'Signal Box', 'Track', 'Bridge', 'Point Machine', 'Substation', 'Sleeper'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50 cursor-pointer">
                <option>All Criticality</option>
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {['Asset ID', 'Type', 'Segment', 'Track', 'Criticality', 'Condition', 'Last Maint.', 'Failures', 'Next Due', 'Status'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ASSETS.map((a, i) => (
                    <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-900">{a.id}</td>
                      <td className="px-4 py-3 text-xs text-zinc-700">{a.type}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{a.segment}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{a.track}</td>
                      <td className="px-4 py-3"><Badge status={a.criticality}>{a.criticality}</Badge></td>
                      <td className={`px-4 py-3 text-xs font-semibold ${conditionColor(a.condition)}`}>{a.condition}</td>
                      <td className="px-4 py-3 text-xs font-mono text-zinc-500">{a.lastMaint}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-black ${a.failures >= 4 ? 'text-red-600' : a.failures >= 2 ? 'text-amber-600' : 'text-zinc-700'}`}>{a.failures}</span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-mono ${a.nextDue === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-zinc-500'}`}>{a.nextDue}</td>
                      <td className="px-4 py-3"><Badge status={a.status}>{a.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: HISTORY ── */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center gap-2 p-3 border-b border-zinc-100 flex-wrap">
              {[
                { label: 'Department', opts: ['All', 'Engineering', 'TRD', 'S&T'] },
                { label: 'Asset', opts: ['All', 'AJ-204', 'BR-11', 'OE-118', 'PM-3', 'SB-07'] },
                { label: 'Type', opts: ['All', 'Preventive', 'Corrective', 'Inspection', 'Emergency'] },
              ].map(f => (
                <select key={f.label} className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50 cursor-pointer">
                  {f.opts.map(o => <option key={o}>{o === 'All' ? `All ${f.label}s` : o}</option>)}
                </select>
              ))}
              <input type="date" className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50" />
              <input type="date" className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-zinc-100">
              {/* Timeline */}
              <div className="border-r border-zinc-100 p-4 space-y-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Timeline</p>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-zinc-200" />
                  {HISTORY.map((h, i) => (
                    <div key={i} className="flex gap-3 pb-4 relative">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center flex-shrink-0 z-10 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-900" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono font-semibold text-zinc-500">{h.date}</p>
                        <p className="text-xs font-semibold text-zinc-800">{h.asset}</p>
                        <p className="text-[10px] text-zinc-500">{h.type}</p>
                        <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 font-bold uppercase">{h.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table + Chart */}
              <div className="lg:col-span-2">
                <div className="p-3 border-b border-zinc-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Failure Frequency by Asset</p>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={failureChartData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                      <XAxis dataKey="asset" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 11 }} />
                      <Bar dataKey="failures" fill="#DC2626" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        {['Date', 'Asset', 'Dept', 'Type', 'Block', 'Time', 'Duration', 'Reason', 'Condition', 'Status'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY.map((h, i) => (
                        <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                          <td className="px-3 py-2.5 font-mono text-xs text-zinc-500 whitespace-nowrap">{h.date}</td>
                          <td className="px-3 py-2.5 font-mono text-xs font-bold text-zinc-800">{h.asset}</td>
                          <td className="px-3 py-2.5 text-xs text-zinc-600">{h.dept}</td>
                          <td className="px-3 py-2.5 text-xs text-zinc-600 whitespace-nowrap">{h.type}</td>
                          <td className="px-3 py-2.5 font-mono text-xs text-zinc-500">{h.block}</td>
                          <td className="px-3 py-2.5 font-mono text-xs text-zinc-600">{h.start}–{h.end}</td>
                          <td className="px-3 py-2.5 text-xs text-zinc-600">{h.duration}</td>
                          <td className="px-3 py-2.5 text-xs text-zinc-500">{h.reason}</td>
                          <td className={`px-3 py-2.5 text-xs font-semibold ${conditionColor(h.condition)}`}>{h.condition}</td>
                          <td className="px-3 py-2.5"><Badge status="green" variant="green">Done</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SCHEDULE ── */}
        {activeTab === 'schedule' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              {(['week', 'month'] as const).map(v => (
                <button key={v} onClick={() => setScheduleView(v)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 border-zinc-900 transition-colors cursor-pointer ${
                    scheduleView === v ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900 hover:bg-zinc-50'
                  }`}>
                  {v === 'week' ? 'Weekly View' : 'Monthly View'}
                </button>
              ))}
            </div>

            {scheduleView === 'week' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-700">22–28 Sep 2026</h3>
                  <div className="flex gap-2 text-[10px] font-semibold">
                    {[['APPROVED','bg-green-100 border-green-500'], ['ACTIVE','bg-red-100 border-red-500'], ['RECOMMENDED','bg-purple-100 border-purple-500'], ['REQUESTED','bg-amber-100 border-amber-500']].map(([l, c]) => (
                      <span key={l} className={`px-2 py-0.5 border-l-4 ${c} text-zinc-700`}>{l}</span>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="grid min-w-[700px]" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
                    {/* Header */}
                    <div className="border-b-2 border-zinc-900 py-2" />
                    {DAYS.map(d => (
                      <div key={d} className="border-b-2 border-zinc-900 border-l border-zinc-100 py-2 px-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-700">{d}</div>
                    ))}
                    {/* Rows */}
                    {TIMES.map((t, ri) => (
                      <React.Fragment key={t}>
                        <div className="border-b border-zinc-100 py-2 px-2 text-[10px] font-mono text-zinc-400 text-right">{t}</div>
                        {DAYS.map((d, ci) => {
                          const block = WEEK_SCHEDULE.find(b => b.row === ri && b.col === ci);
                          return (
                            <div key={d} className={`border-b border-l border-zinc-100 min-h-[52px] p-1 ${block ? blockColor(block.status) : ''}`}>
                              {block && (
                                <div className="text-[10px] leading-tight">
                                  <div className="font-black font-mono">{block.req}</div>
                                  <div className="font-semibold truncate">{block.dept}</div>
                                  <div className="opacity-70">{block.segment}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {scheduleView === 'month' && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">September 2026</h3>
                <div className="grid grid-cols-7 gap-0 border-2 border-zinc-900">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b-2 border-zinc-900 border-r border-zinc-100 last:border-r-0">{d}</div>
                  ))}
                  {/* Sep 1 starts on Tuesday (offset 2) */}
                  {Array.from({ length: 2 }).map((_, i) => <div key={`e-${i}`} className="border-b border-r border-zinc-100 min-h-[70px]" />)}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                    const info = MONTH_DATA[day];
                    const isToday = day === 24;
                    return (
                      <div key={day} className={`border-b border-r border-zinc-100 min-h-[70px] p-2 cursor-pointer hover:bg-zinc-50 transition-colors last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                        <div className={`text-xs font-black mb-1 ${isToday ? 'text-blue-600' : 'text-zinc-700'}`}>{day}</div>
                        {info && (
                          <div className="space-y-0.5">
                            {info.count > 0 && <div className="text-[9px] font-semibold text-zinc-600">{info.count} req</div>}
                            {info.critical > 0 && <div className="text-[9px] font-bold text-red-600">⚠ {info.critical} crit</div>}
                            {info.planned > 0 && <div className="text-[9px] font-semibold text-green-600">✓ {info.planned} planned</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create Request Modal ── */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Maintenance Request" subtitle="Submit a maintenance block request to the planning engine" size="lg">
        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <p className="text-lg font-black text-zinc-900">Request Submitted!</p>
            <p className="text-zinc-500 text-sm mt-1">Forwarding to Central Intelligence for AI analysis...</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-blue-600 text-sm font-bold">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Redirecting to Agent Pipeline...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Department</label>
                <select value={formData.dept} onChange={e => setFormData(p => ({ ...p, dept: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['Engineering', 'TRD', 'S&T'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Maintenance Type</label>
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['Preventive Maintenance', 'Corrective Maintenance', 'Inspection', 'Emergency Repair', 'Rail Renewal', 'Track Maintenance', 'Signal Maintenance', 'Electrical Maintenance', 'OHE Maintenance'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Asset</label>
                <select value={formData.asset} onChange={e => setFormData(p => ({ ...p, asset: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {ASSETS.map(a => <option key={a.id}>{a.id} — {a.type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Segment</label>
                <select value={formData.segment} onChange={e => setFormData(p => ({ ...p, segment: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['A-B', 'B-C', 'C-D', 'D-E', 'E-F'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Urgency</label>
                <select value={formData.urgency} onChange={e => setFormData(p => ({ ...p, urgency: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['NORMAL', 'MEDIUM', 'HIGH', 'EMERGENCY'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Asset Criticality</label>
                <select value={formData.criticality} onChange={e => setFormData(p => ({ ...p, criticality: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Requested Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Start Time</label>
                  <input type="time" value={formData.startTime} onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">End Time</label>
                  <input type="time" value={formData.endTime} onChange={e => setFormData(p => ({ ...p, endTime: e.target.value }))} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Reason</label>
              <input value={formData.reason} onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))} placeholder="Reason for maintenance..." className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Detailed description..." className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                <input type="checkbox" className="accent-zinc-900" /> Previous Failure
              </label>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-zinc-900 text-xs font-semibold hover:bg-zinc-50 cursor-pointer">
                <Upload size={12} /> Attach Files
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit Request</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Request Detail Modal ── */}
      {selectedReq && (
        <Modal open={!!selectedReq} onClose={() => setSelectedReq(null)} title={`Request Detail — ${selectedReq.id}`} subtitle={`${selectedReq.dept} · ${selectedReq.asset}`} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Status', value: <Badge status={selectedReq.status}>{selectedReq.status}</Badge> },
                { label: 'Priority', value: <Badge status={selectedReq.priority}>{selectedReq.priority}</Badge> },
                { label: 'Criticality', value: <Badge status={selectedReq.criticality}>{selectedReq.criticality}</Badge> },
                { label: 'Asset', value: selectedReq.asset },
                { label: 'Segment', value: selectedReq.segment },
                { label: 'Requested Time', value: selectedReq.time },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{item.label}</p>
                  <div className="text-xs font-semibold text-zinc-800">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-green-50 border-2 border-green-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-1">AI Recommendation</p>
              <p className="text-xs font-semibold text-green-800">Recommended Block: {selectedReq.aiRec !== '—' ? selectedReq.aiRec : 'Analysis in progress...'}</p>
              {selectedReq.aiRec !== '—' && (
                <p className="text-xs text-green-700 mt-1">
                  The requested {selectedReq.time} window has been analyzed. {selectedReq.aiRec} is the recommended slot with minimal operational impact.
                </p>
              )}
            </div>

            {selectedReq.status === 'REQUESTED' && (
              <div className="p-3 bg-amber-50 border-2 border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Train Conflict</p>
                <p className="text-xs text-amber-800">Train 12678 scheduled at 14:20–15:10 on Track T2 in segment {selectedReq.segment}. Conflict detected at requested time window.</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setSelectedReq(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
