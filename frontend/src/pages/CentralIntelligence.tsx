import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Brain, Calendar, Map, GitBranch, AlertTriangle, CheckCircle,
  Clock, Activity, ChevronRight, Play, ZapOff, Zap,
  ArrowRight, Eye, TrendingDown, TrendingUp, X, Layers
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { KpiCard } from '../components/ui/KpiCard';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const volData = [
  { dept: 'Engineering', count: 42 }, { dept: 'TRD', count: 31 }, { dept: 'S&T', count: 28 },
];
const utilData = [
  { day: 'Mon', util: 65 }, { day: 'Tue', util: 72 }, { day: 'Wed', util: 58 },
  { day: 'Thu', util: 81 }, { day: 'Fri', util: 69 }, { day: 'Sat', util: 77 }, { day: 'Sun', util: 84 },
];

const TIMES = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WEEK_BLOCKS = [
  { req: 'REQ-0141', dept: 'TRD', segment: 'B-C', priority: 'MEDIUM', status: 'APPROVED', row: 2, col: 0, requested: '10:00–12:00', recommended: '10:00–12:00', conflict: 'None' },
  { req: 'REQ-0140', dept: 'S&T', segment: 'C-D', priority: 'HIGH', status: 'RECOMMENDED', row: 0, col: 1, requested: '06:00–08:00', recommended: '06:00–08:00', conflict: 'None' },
  { req: 'REQ-0138', dept: 'Engineering', segment: 'A-B', priority: 'EMERGENCY', status: 'ACTIVE', row: 1, col: 2, requested: '08:00–10:00', recommended: '08:00–10:00', conflict: 'None' },
  { req: 'REQ-0142', dept: 'Engineering', segment: 'A-B', priority: 'HIGH', status: 'REQUESTED', row: 4, col: 3, requested: '14:00–16:00', recommended: '18:00–20:00', conflict: 'Train 12678' },
  { req: 'REQ-0139', dept: 'Engineering', segment: 'D-E', priority: 'LOW', status: 'APPROVED', row: 6, col: 4, requested: '18:00–20:00', recommended: '18:00–20:00', conflict: 'None' },
];

const blockColor = (status: string) => {
  if (status === 'ACTIVE') return 'bg-red-100 border-l-4 border-red-500 text-red-800';
  if (status === 'APPROVED') return 'bg-green-100 border-l-4 border-green-500 text-green-800';
  if (status === 'RECOMMENDED') return 'bg-purple-100 border-l-4 border-purple-500 text-purple-800';
  if (status === 'REQUESTED') return 'bg-amber-100 border-l-4 border-amber-500 text-amber-800';
  return 'bg-zinc-100 border-l-4 border-zinc-400 text-zinc-700';
};

const MONTH_DATA: Record<number, { count: number; critical: number; planned: number; active: number }> = {
  3: { count: 2, critical: 0, planned: 1, active: 0 },
  8: { count: 1, critical: 1, planned: 0, active: 0 },
  10: { count: 3, critical: 1, planned: 2, active: 0 },
  15: { count: 2, critical: 0, planned: 2, active: 0 },
  17: { count: 1, critical: 0, planned: 0, active: 1 },
  22: { count: 2, critical: 1, planned: 1, active: 0 },
  24: { count: 3, critical: 0, planned: 2, active: 1 },
  25: { count: 2, critical: 0, planned: 2, active: 0 },
  28: { count: 1, critical: 0, planned: 1, active: 0 },
};

const STATIONS = [
  { name: 'Chennai Central', lat: 13.0827, lng: 80.2707, code: 'MAS', status: 'operational' },
  { name: 'Villupuram', lat: 11.9387, lng: 79.4912, code: 'VM', status: 'maintenance' },
  { name: 'Salem', lat: 11.6508, lng: 78.1582, code: 'SA', status: 'operational' },
  { name: 'Erode', lat: 11.3410, lng: 77.7172, code: 'ED', status: 'operational' },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, code: 'CBE', status: 'operational' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, code: 'SBC', status: 'operational' },
];

const RAILWAY_LINES = [
  { coords: [[13.0827, 80.2707], [11.9387, 79.4912]] as [number, number][], color: '#DC2626', label: 'A-B (Maintenance Block)' },
  { coords: [[11.9387, 79.4912], [11.6508, 78.1582]] as [number, number][], color: '#2563EB', label: 'B-C' },
  { coords: [[11.6508, 78.1582], [11.3410, 77.7172]] as [number, number][], color: '#2563EB', label: 'C-D' },
  { coords: [[11.3410, 77.7172], [11.0168, 76.9558]] as [number, number][], color: '#2563EB', label: 'D-E' },
  { coords: [[11.6508, 78.1582], [12.9716, 77.5946]] as [number, number][], color: '#2563EB', label: 'Salem–Bangalore' },
];

const AGENTS = [
  { name: 'Request Analysis', state: 'complete', icon: Brain, finding: 'Priority: HIGH — Asset criticality HIGH + urgency HIGH', rules: ['If urgency=HIGH → HIGH PRIORITY', 'If asset criticality=HIGH → HIGH PRIORITY', 'If info incomplete → INCOMPLETE'] },
  { name: 'Maintenance Context', state: 'complete', icon: Activity, finding: 'Risk: HIGH — Failure count: 4, Last maint: 18 Mar 2026', rules: ['Failure count ≥ 3 → HIGH RISK', 'Months since maint ≥ 6 → MEDIUM RISK', 'Otherwise → LOW RISK'] },
  { name: 'Train Conflict', state: 'warning', icon: AlertTriangle, finding: 'CONFLICT: Train 12678 on Track T2 at 14:20–15:10', rules: ['Check train timetable vs block window', 'Check same track AND time overlap', 'Route overlap alone ≠ conflict'] },
  { name: 'Cross-Department', state: 'complete', icon: Layers, finding: 'No overlapping dept maintenance on segment A-B', rules: ['Same segment + overlapping time + different dept → CONFLICT', 'Compatible activities → COMBINED BLOCK OPPORTUNITY'] },
  { name: 'Impact Assessment', state: 'complete', icon: TrendingDown, finding: 'Impact: HIGH — 6 trains affected, asset criticality HIGH', rules: ['≥5 trains affected → HIGH', '2–4 trains → MEDIUM', '0–1 train → LOW'] },
  { name: 'Block Planning', state: 'running', icon: Clock, finding: 'Analyzing 4 candidate windows...', rules: ['Check train conflicts', 'Check existing blocks', 'Check dept conflicts', 'Rank feasible slots'] },
  { name: 'Alternative Planning', state: 'waiting', icon: GitBranch, finding: '—', rules: ['Compare impact across slots', 'Rank by: trains, impact, conflicts, duration'] },
  { name: 'Recommendation', state: 'waiting', icon: CheckCircle, finding: '—', rules: ['Combine all agent outputs', 'Select lowest impact feasible window', 'Generate human-readable reason'] },
];

const stateIcon = (state: string) => {
  if (state === 'complete') return <CheckCircle size={14} className="text-green-600" />;
  if (state === 'warning') return <AlertTriangle size={14} className="text-amber-500" />;
  if (state === 'running') return <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
  return <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-300" />;
};

const stateBadge = (state: string) => {
  if (state === 'complete') return <Badge variant="green">Complete</Badge>;
  if (state === 'warning') return <Badge variant="amber">Conflict</Badge>;
  if (state === 'running') return <Badge variant="blue">Running</Badge>;
  return <Badge variant="default">Waiting</Badge>;
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function CentralIntelligence() {
  const [activeView, setActiveView] = useState<'weekly' | 'monthly' | 'map' | 'agents'>('weekly');
  const [selectedBlock, setSelectedBlock] = useState<typeof WEEK_BLOCKS[0] | null>(null);
  const [blockStatuses, setBlockStatuses] = useState<Record<string, string>>({});
  const [rulesAgent, setRulesAgent] = useState<typeof AGENTS[0] | null>(null);
  const [simTime, setSimTime] = useState('14:00');
  const [simRan, setSimRan] = useState(false);
  const [recAction, setRecAction] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (activeView === 'map') {
      setMapLoaded(true);
    }
  }, [activeView]);

  const handleBlockAction = (req: string, action: string) => {
    setBlockStatuses(prev => ({ ...prev, [req]: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'MODIFIED' }));
    setSelectedBlock(null);
  };

  const views = [
    { key: 'weekly', label: 'Weekly Schedule', icon: Calendar },
    { key: 'monthly', label: 'Monthly Schedule', icon: Calendar },
    { key: 'map', label: 'Railway Map', icon: Map },
    { key: 'agents', label: 'Agent Pipeline', icon: Brain },
  ] as const;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">RAILOPS CENTRAL INTELLIGENCE</h1>
        <p className="text-zinc-500 text-sm mt-0.5">AI-assisted block planning, conflict analysis and operational optimization</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Active Blocks" value="7" color="blue" icon={Activity} />
        <KpiCard label="Critical Requests" value="12" color="red" icon={AlertTriangle} />
        <KpiCard label="Pending Approval" value="5" color="amber" icon={Clock} />
        <KpiCard label="Train Conflicts" value="9" color="red" icon={ZapOff} />
        <KpiCard label="High Risk Tasks" value="14" color="amber" icon={TrendingUp} />
        <KpiCard label="Affected Trains" value="23" color="default" icon={GitBranch} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Request Volume by Department</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={volData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
              <Bar dataKey="count" fill="#09090B" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Block Utilization % — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={utilData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
              <Line type="monotone" dataKey="util" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-0 border-2 border-zinc-900 w-fit shadow-[3px_3px_0px_#18181B]">
        {views.map(v => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-r-2 border-zinc-900 last:border-r-0 ${
              activeView === v.key ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'
            }`}>
            <v.icon size={13} /> {v.label}
          </button>
        ))}
      </div>

      {/* ── WEEKLY SCHEDULE ── */}
      {activeView === 'weekly' && (
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Weekly Schedule — 22–28 Sep 2026</h3>
            <div className="flex gap-3">
              {[['APPROVED','bg-green-400'], ['ACTIVE','bg-red-400'], ['RECOMMENDED','bg-purple-400'], ['REQUESTED','bg-amber-400']].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold">
                  <span className={`w-2.5 h-2.5 ${c}`} /> {l}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <div className="grid min-w-[700px]" style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}>
              <div className="border-b-2 border-zinc-200 pb-2" />
              {DAYS.map(d => (
                <div key={d} className="border-b-2 border-zinc-200 border-l border-zinc-100 py-2 text-center text-[10px] font-black uppercase tracking-widest text-zinc-600">{d}</div>
              ))}
              {TIMES.map((t, ri) => (
                <React.Fragment key={t}>
                  <div className="border-b border-zinc-100 py-3 pr-2 text-[10px] font-mono text-zinc-400 text-right">{t}</div>
                  {DAYS.map((d, ci) => {
                    const block = WEEK_BLOCKS.find(b => b.row === ri && b.col === ci);
                    const overrideStatus = block ? (blockStatuses[block.req] || block.status) : '';
                    return (
                      <div key={d} className={`border-b border-l border-zinc-100 min-h-[56px] p-1 cursor-pointer hover:opacity-90 transition-opacity ${block ? blockColor(overrideStatus) : 'hover:bg-zinc-50'}`}
                        onClick={() => block && setSelectedBlock(block)}>
                        {block && (
                          <div className="text-[10px] leading-tight">
                            <div className="font-black font-mono">{block.req}</div>
                            <div className="font-semibold">{block.dept}</div>
                            <div className="opacity-70">{block.segment}</div>
                            {block.conflict !== 'None' && <div className="text-[9px] mt-0.5">⚠ {block.conflict}</div>}
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

      {/* ── MONTHLY SCHEDULE ── */}
      {activeView === 'monthly' && (
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Monthly Schedule — September 2026</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 border-2 border-zinc-900">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-2.5 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b-2 border-zinc-900 border-r-2 border-zinc-100 last:border-r-0">{d}</div>
              ))}
              {Array.from({ length: 2 }).map((_, i) => <div key={`e${i}`} className="border-b border-r border-zinc-100 min-h-[80px]" />)}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const info = MONTH_DATA[day];
                const isToday = day === 24;
                return (
                  <div key={day} className={`border-b border-r border-zinc-100 min-h-[80px] p-2 cursor-pointer hover:bg-zinc-50 transition-colors ${isToday ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}>
                    <div className={`text-xs font-black ${isToday ? 'text-blue-700' : 'text-zinc-700'}`}>{day}{isToday && ' ●'}</div>
                    {info && (
                      <div className="mt-1 space-y-0.5">
                        {info.count > 0 && <div className="text-[9px] font-semibold text-zinc-600 bg-zinc-100 px-1 py-0.5">{info.count} req</div>}
                        {info.critical > 0 && <div className="text-[9px] font-bold text-red-700 bg-red-50 px-1 py-0.5">⚠ crit</div>}
                        {info.planned > 0 && <div className="text-[9px] font-semibold text-green-700 bg-green-50 px-1 py-0.5">✓ {info.planned}</div>}
                        {info.active > 0 && <div className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5">▶ active</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── RAILWAY MAP ── */}
      {activeView === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
            <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex-1">Railway Network Map — Southern India</h3>
              <input placeholder="Search train (e.g. 12678)..." className="px-3 py-1.5 text-xs bg-zinc-800 border border-zinc-600 text-white placeholder:text-zinc-500 outline-none w-48" />
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase hover:bg-blue-700 transition-colors cursor-pointer">Search</button>
            </div>
            <div style={{ height: 480 }}>
              {mapLoaded && MapContainer ? (
                <MapContainer center={[12.0, 78.5]} zoom={7} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  {RAILWAY_LINES.map((line, i) => (
                    <Polyline key={i} positions={line.coords} pathOptions={{ color: line.color, weight: line.color === '#DC2626' ? 4 : 3, dashArray: line.color === '#DC2626' ? '8,4' : undefined }} />
                  ))}
                  {STATIONS.map((s, i) => (
                    <CircleMarker key={i} center={[s.lat, s.lng]} radius={8}
                      pathOptions={{ fillColor: s.status === 'maintenance' ? '#DC2626' : '#2563EB', color: '#18181B', weight: 2, fillOpacity: 1 }}>
                      <Popup><div className="text-xs font-bold">{s.name} ({s.code})<br /><span className={s.status === 'maintenance' ? 'text-red-600' : 'text-green-600'}>{s.status}</span></div></Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-zinc-50">
                  <div className="text-center">
                    <Map size={40} className="mx-auto text-zinc-300 mb-2" />
                    <p className="text-xs text-zinc-500 font-semibold">Loading Railway Map...</p>
                    <p className="text-[10px] text-zinc-400 mt-1">OpenStreetMap via react-leaflet</p>
                  </div>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="px-4 py-2 border-t border-zinc-100 flex items-center gap-4 flex-wrap">
              {[['#DC2626','Maintenance Block (A-B)'], ['#2563EB','Normal Route'], ['#16A34A','Train Path (selected)'], ['#D97706','Alternative Route']].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-600">
                  <span className="w-5 h-1.5 inline-block rounded-full" style={{ background: c }} /> {l}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
              <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-900">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Active Trains</p>
              </div>
              {[
                { no: '12678', name: 'Chennai Mail', status: 'ON TIME', track: 'T2' },
                { no: '16057', name: 'Saptagiri Exp', status: 'DELAYED', track: 'T1' },
                { no: '22625', name: 'Rajdhani', status: 'ON TIME', track: 'T3' },
                { no: '12163', name: 'CH-Dadar Exp', status: 'RESCHEDULED', track: 'T2' },
                { no: '11041', name: 'Chennai Exp', status: 'ON TIME', track: 'T4' },
              ].map(t => (
                <div key={t.no} className="flex items-center justify-between px-3 py-2 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer">
                  <div>
                    <div className="text-xs font-black font-mono text-zinc-900">{t.no}</div>
                    <div className="text-[10px] text-zinc-500">{t.name}</div>
                  </div>
                  <Badge status={t.status}>{t.status === 'ON TIME' ? '✓' : t.status === 'DELAYED' ? '⚠' : '↻'}</Badge>
                </div>
              ))}
            </div>
            <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
              <div className="px-3 py-2 border-b border-zinc-100 bg-red-600">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Active Conflicts</p>
              </div>
              {[
                { id: 'CON-001', train: '12678', track: 'T2', time: '14:20–15:10', severity: 'HIGH' },
                { id: 'CON-002', train: '16057', track: 'T1', time: '15:30–16:15', severity: 'MEDIUM' },
                { id: 'CON-003', train: '22625', track: 'T3', time: '16:00–16:45', severity: 'LOW' },
              ].map(c => (
                <div key={c.id} className="px-3 py-2 border-b border-zinc-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-zinc-500">{c.id}</span>
                    <Badge status={c.severity}>{c.severity}</Badge>
                  </div>
                  <div className="text-xs font-semibold text-zinc-800">Train {c.train} · {c.track}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{c.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AGENT PIPELINE ── */}
      {activeView === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-0">
            <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
              <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Rule-Based Agent Pipeline — REQ-0142</h3>
                <Badge variant="blue">Running</Badge>
              </div>
              <div className="p-4 space-y-0">
                {AGENTS.map((agent, i) => (
                  <div key={i} className="relative">
                    {i < AGENTS.length - 1 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-zinc-200 z-0" />}
                    <div className={`relative z-10 flex items-start gap-3 p-3 border-2 mb-0 transition-all ${
                      agent.state === 'complete' ? 'border-green-200 bg-green-50' :
                      agent.state === 'warning' ? 'border-amber-200 bg-amber-50' :
                      agent.state === 'running' ? 'border-blue-200 bg-blue-50' : 'border-zinc-100 bg-zinc-50'
                    }`}>
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {stateIcon(agent.state)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Agent {i + 1}</span>
                            <span className="text-xs font-black text-zinc-900">{agent.name}</span>
                          </div>
                          {stateBadge(agent.state)}
                        </div>
                        {agent.state !== 'waiting' && (
                          <p className="text-xs text-zinc-600 mt-0.5">{agent.finding}</p>
                        )}
                      </div>
                      <button onClick={() => setRulesAgent(agent)}
                        className="px-2.5 py-1 text-[10px] font-bold uppercase border border-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors cursor-pointer flex-shrink-0">
                        <Eye size={10} className="inline mr-1" /> Rules
                      </button>
                    </div>
                    {i < AGENTS.length - 1 && (
                      <div className="flex justify-center my-0 relative z-10">
                        <ArrowRight size={14} className="text-zinc-300 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="m-4 p-4 bg-zinc-900 border-2 border-zinc-900 shadow-[3px_3px_0px_#2563EB]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">AI / Rule-Based Recommendation</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { l: 'Recommended Block', v: 'Thu 18:00–20:00' },
                    { l: 'Priority', v: 'HIGH' },
                    { l: 'Impact', v: 'LOW' },
                    { l: 'Affected Trains', v: '1' },
                  ].map(item => (
                    <div key={item.l}>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{item.l}</p>
                      <p className="text-sm font-black text-white">{item.v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-300 mb-3">
                  The requested 14:00–16:00 window conflicts with Train 12678 (Track T2, 14:20–15:10). The 16:00–18:00 window overlaps TRD maintenance on B-C. 18:00–20:00 is the earliest feasible window with only 1 affected train.
                </p>
                {!recAction ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setRecAction('approved'); setApproveModal(true); }} className="px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase border-2 border-green-600 hover:bg-white hover:text-green-600 transition-colors cursor-pointer flex items-center gap-1.5"><CheckCircle size={12} /> Approve</button>
                    <button onClick={() => setRecAction('modified')} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold uppercase border-2 border-amber-500 hover:bg-white hover:text-amber-600 transition-colors cursor-pointer">Modify</button>
                    <button onClick={() => setRecAction('rejected')} className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1.5"><X size={12} /> Reject</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge status={recAction === 'approved' ? 'APPROVED' : recAction === 'rejected' ? 'REJECTED' : 'MODIFIED'}>
                      {recAction.toUpperCase()}
                    </Badge>
                    <button onClick={() => setRecAction(null)} className="text-xs text-zinc-400 underline cursor-pointer">Reset</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Card */}
          <div className="space-y-3">
            <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
              <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Current Request</p>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { l: 'Request ID', v: 'REQ-0142' },
                  { l: 'Department', v: 'Engineering' },
                  { l: 'Asset', v: 'Rail Joint AJ-204' },
                  { l: 'Segment', v: 'A-B' },
                  { l: 'Requested', v: '14:00–16:00' },
                  { l: 'Duration', v: '2 hours' },
                  { l: 'Priority', v: <Badge status="HIGH">HIGH</Badge> },
                  { l: 'Criticality', v: <Badge status="HIGH">HIGH</Badge> },
                ].map(item => (
                  <div key={item.l} className="flex items-center justify-between border-b border-zinc-50 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.l}</span>
                    <span className="text-xs font-semibold text-zinc-800 font-mono">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Windows */}
            <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
              <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Candidate Windows</p>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { time: '14:00–16:00', verdict: 'CONFLICT', note: 'Train 12678', color: 'border-red-200 bg-red-50' },
                  { time: '16:00–18:00', verdict: 'CONFLICT', note: 'TRD Maintenance', color: 'border-red-200 bg-red-50' },
                  { time: '18:00–20:00', verdict: 'FEASIBLE', note: '1 train affected', color: 'border-green-200 bg-green-50' },
                  { time: '20:00–22:00', verdict: 'FEASIBLE', note: 'No conflicts', color: 'border-green-200 bg-green-50' },
                ].map(w => (
                  <div key={w.time} className={`p-2 border-2 ${w.color} flex items-center justify-between`}>
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-800">{w.time}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">{w.note}</span>
                    </div>
                    <Badge status={w.verdict}>{w.verdict}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHAT-IF SIMULATION ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-2">
          <Zap size={14} className="text-amber-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white">What-If Simulation</h3>
          <span className="text-zinc-400 text-[10px] ml-2">Simulate block parameter changes in real-time</span>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Block Start Time</label>
              <input type="time" value={simTime} onChange={e => setSimTime(e.target.value)} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm font-mono outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Duration</label>
              <select className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                {['1 hour', '2 hours', '3 hours', '4 hours'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Segment</label>
              <select className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                {['A-B', 'B-C', 'C-D', 'D-E', 'E-F'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Button onClick={() => setSimRan(true)} className="w-full justify-center">
              <Play size={13} /> Run Simulation
            </Button>
          </div>

          <div className={`lg:col-span-2 grid grid-cols-2 gap-4 transition-all ${simRan ? 'opacity-100' : 'opacity-40'}`}>
            <div className="p-4 bg-red-50 border-2 border-red-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-3">BEFORE — {simRan ? '14:00' : '—'}</p>
              <div className="space-y-2">
                {[['Affected Trains', '6'], ['Impact Level', 'HIGH'], ['Conflicts', '3'], ['Feasible', 'NO']].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-xs text-red-600">{l}</span>
                    <span className="text-xs font-black text-red-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-green-50 border-2 border-green-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-3">AFTER — {simRan ? simTime || '18:00' : '—'}</p>
              <div className="space-y-2">
                {[['Affected Trains', simRan ? '1' : '—'], ['Impact Level', simRan ? 'LOW' : '—'], ['Conflicts', simRan ? '0' : '—'], ['Feasible', simRan ? 'YES' : '—']].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-xs text-green-600">{l}</span>
                    <span className="text-xs font-black text-green-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CROSS-DEPT COORDINATION ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Cross-Department Coordination Opportunities</h3>
        </div>
        <div className="p-4">
          <div className="p-4 border-2 border-green-200 bg-green-50 shadow-[3px_3px_0px_#16A34A]">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="green">Combined Block Opportunity</Badge>
                  <span className="text-[10px] font-mono text-zinc-500">Segment A-B · Thu 18:00–20:00</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  {[['Engineering', 'Rail maintenance'], ['TRD', 'OHE inspection'], ['S&T', 'Signal inspection']].map(([d, a]) => (
                    <div key={d} className="text-xs">
                      <span className="font-black text-zinc-800">{d}</span>
                      <span className="text-zinc-500 ml-1">{a}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-green-700">
                  3 maintenance activities can be completed under one coordinated block. Potential savings: 2 additional closures, reduced disruption.
                </p>
              </div>
              <button className="px-3 py-1.5 border-2 border-green-600 text-green-700 text-xs font-bold uppercase hover:bg-green-600 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-4">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <Modal open={!!selectedBlock} onClose={() => setSelectedBlock(null)} title={`Block Detail — ${selectedBlock.req}`} subtitle={`${selectedBlock.dept} · Segment ${selectedBlock.segment}`} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Status', v: <Badge status={blockStatuses[selectedBlock.req] || selectedBlock.status}>{blockStatuses[selectedBlock.req] || selectedBlock.status}</Badge> },
                { l: 'Priority', v: <Badge status={selectedBlock.priority}>{selectedBlock.priority}</Badge> },
                { l: 'Requested', v: selectedBlock.requested },
                { l: 'Recommended', v: selectedBlock.recommended },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{item.l}</p>
                  <div className="text-xs font-semibold text-zinc-800 font-mono">{item.v}</div>
                </div>
              ))}
            </div>
            {selectedBlock.conflict !== 'None' && (
              <div className="p-3 bg-red-50 border-2 border-red-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">Conflict Detected</p>
                <p className="text-xs text-red-700">{selectedBlock.conflict} scheduled during requested window. Block moved to {selectedBlock.recommended}.</p>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              <Button variant="success" size="sm" onClick={() => handleBlockAction(selectedBlock.req, 'approve')}><CheckCircle size={12} /> Approve</Button>
              <Button variant="ghost" size="sm" onClick={() => handleBlockAction(selectedBlock.req, 'modify')}>Modify</Button>
              <Button variant="danger" size="sm" onClick={() => handleBlockAction(selectedBlock.req, 'reject')}><X size={12} /> Reject</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Rules Modal */}
      {rulesAgent && (
        <Modal open={!!rulesAgent} onClose={() => setRulesAgent(null)} title={`${rulesAgent.name} — Decision Rules`} size="sm">
          <div className="space-y-2">
            {rulesAgent.rules.map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-zinc-50 border border-zinc-200">
                <ChevronRight size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-zinc-700 font-mono">{r}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
