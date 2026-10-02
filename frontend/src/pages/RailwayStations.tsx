import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Bell, Clock, CheckCircle, AlertTriangle, Train, FileText } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { KpiCard } from '../components/ui/KpiCard';

const STATIONS = ['Chennai Central', 'Villupuram', 'Salem', 'Erode', 'Coimbatore', 'Bangalore'];

const STATION_INFO: Record<string, { code: string; zone: string; division: string; tracks: number; platforms: number; totalWorks: number }> = {
  'Chennai Central': { code: 'MAS', zone: 'Southern', division: 'Chennai', tracks: 8, platforms: 12, totalWorks: 36 },
  'Villupuram': { code: 'VM', zone: 'Southern', division: 'Villupuram', tracks: 4, platforms: 6, totalWorks: 18 },
  'Salem': { code: 'SA', zone: 'Southern', division: 'Salem', tracks: 5, platforms: 8, totalWorks: 24 },
  'Erode': { code: 'ED', zone: 'Southern', division: 'Salem', tracks: 4, platforms: 6, totalWorks: 15 },
  'Coimbatore': { code: 'CBE', zone: 'Southern', division: 'Palakkad', tracks: 6, platforms: 10, totalWorks: 22 },
  'Bangalore': { code: 'SBC', zone: 'SWR', division: 'Bangalore', tracks: 10, platforms: 16, totalWorks: 41 },
};

const STATION_NOTIFICATIONS: Record<string, { msg: string; time: string; type: string }[]> = {
  'Chennai Central': [
    { msg: 'Block BLK-2026-047 approved. Track A-B closed Thursday 18:00–20:00.', time: '2 hours ago', type: 'green' },
    { msg: 'Train 12678 delayed by 40 min due to maintenance block.', time: '3 hours ago', type: 'red' },
    { msg: 'Possession POS-0031 started at 06:00 on segment A-B.', time: '6 hours ago', type: 'amber' },
    { msg: 'Block BLK-2026-039 completed successfully.', time: '8 hours ago', type: 'green' },
    { msg: 'Emergency maintenance request REQ-0138 submitted.', time: 'Yesterday', type: 'red' },
  ],
  'Salem': [
    { msg: 'Block BLK-2026-040 scheduled for Saturday 20:00–22:00.', time: '1 hour ago', type: 'amber' },
    { msg: 'Signal inspection completed on segment C-D.', time: '5 hours ago', type: 'green' },
  ],
};

const STATION_HISTORY: Record<string, { date: string; blkId: string; dept: string; type: string; segment: string; duration: string; trains: number; status: string }[]> = {
  'Chennai Central': [
    { date: '25 Sep 2026', blkId: 'BLK-039', dept: 'Engineering', type: 'Corrective', segment: 'A-B', duration: '2h', trains: 3, status: 'ACTIVE' },
    { date: '24 Sep 2026', blkId: 'BLK-036', dept: 'Engineering', type: 'Preventive', segment: 'D-E', duration: '2h', trains: 1, status: 'COMPLETED' },
    { date: '22 Sep 2026', blkId: 'BLK-034', dept: 'Engineering', type: 'Inspection', segment: 'A-B', duration: '2h', trains: 2, status: 'COMPLETED' },
    { date: '18 Mar 2026', blkId: 'BLK-041', dept: 'Engineering', type: 'Corrective', segment: 'A-B', duration: '2h', trains: 3, status: 'COMPLETED' },
    { date: '22 Jan 2026', blkId: 'BLK-028', dept: 'Engineering', type: 'Inspection', segment: 'A-B', duration: '1h', trains: 0, status: 'COMPLETED' },
    { date: '14 Nov 2025', blkId: 'BLK-019', dept: 'Engineering', type: 'Emergency', segment: 'A-B', duration: '3h', trains: 6, status: 'COMPLETED' },
    { date: '02 Jun 2025', blkId: 'BLK-009', dept: 'TRD', type: 'OHE Maint.', segment: 'B-C', duration: '2h', trains: 2, status: 'COMPLETED' },
    { date: '15 Apr 2025', blkId: 'BLK-007', dept: 'S&T', type: 'Inspection', segment: 'C-D', duration: '1h', trains: 0, status: 'COMPLETED' },
    { date: '01 Feb 2025', blkId: 'BLK-004', dept: 'Engineering', type: 'Inspection', segment: 'A-B', duration: '1h', trains: 1, status: 'COMPLETED' },
  ],
};

const TRAIN_SCHEDULES: Record<string, { no: string; name: string; type: string; arrival: string; departure: string; platform: string; status: string }[]> = {
  'Chennai Central': [
    { no: '12678', name: 'Chennai Mail', type: 'Express', arrival: '14:20', departure: '14:25', platform: '4', status: 'ON TIME' },
    { no: '16057', name: 'Saptagiri Exp', type: 'Express', arrival: '15:10', departure: '15:15', platform: '3', status: 'DELAYED' },
    { no: '22625', name: 'Chennai Rajdhani', type: 'Rajdhani', arrival: '16:30', departure: '16:35', platform: '1', status: 'ON TIME' },
    { no: '12163', name: 'CH-Dadar Exp', type: 'Express', arrival: '18:00', departure: '18:05', platform: '6', status: 'RESCHEDULED' },
    { no: '11041', name: 'Chennai Exp', type: 'Express', arrival: '20:10', departure: '20:15', platform: '2', status: 'ON TIME' },
  ],
};

const monthlyWorksData = [
  { month: 'Jan', works: 3 }, { month: 'Feb', works: 4 }, { month: 'Mar', works: 5 },
  { month: 'Apr', works: 4 }, { month: 'May', works: 6 }, { month: 'Jun', works: 5 },
  { month: 'Jul', works: 4 }, { month: 'Aug', works: 7 }, { month: 'Sep', works: 8 },
];

const statusColor = (s: string) => {
  if (s === 'ON TIME') return 'text-green-600';
  if (s === 'DELAYED') return 'text-red-600';
  return 'text-amber-600';
};

export default function RailwayStations() {
  const [activeStation, setActiveStation] = useState('Chennai Central');
  const [workflowState, setWorkflowState] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('railops_workflow');
    if (raw) {
      try {
        const wf = JSON.parse(raw);
        setWorkflowState(wf);
        if (wf.request?.segment?.includes('A') || wf.request?.segment?.includes('B')) {
          setActiveStation('Chennai Central');
        } else if (wf.request?.segment?.includes('C') || wf.request?.segment?.includes('D')) {
          setActiveStation('Salem');
        }
      } catch (e) {}
    }
  }, []);

  const info = STATION_INFO[activeStation] || STATION_INFO['Chennai Central'];
  
  // Combine static notifications with any workflow notifications
  const baseNotifs = STATION_NOTIFICATIONS[activeStation] || [];
  const notifications = workflowState?.operationsApproved ? [
    {
      msg: `Block ${workflowState.approvedBlock || 'BLK-2026-047'} authorized. Track ${workflowState.approvedSegment || 'A-B'} closed ${workflowState.approvedWindow || 'Thursday 18:00–20:00'}.`,
      time: 'Just now',
      type: 'green'
    },
    ...baseNotifs
  ] : baseNotifs;

  // Combine static history with dynamic workflow history entry
  const baseHistory = STATION_HISTORY[activeStation] || [];
  const history = workflowState?.operationsApproved ? [
    {
      date: 'Today',
      blkId: workflowState.approvedBlock || 'BLK-2026-047',
      dept: workflowState.approvedDept || 'Engineering',
      type: 'AI-Planned Maintenance',
      segment: workflowState.approvedSegment || 'A-B',
      duration: '2h',
      trains: 1,
      status: 'ACTIVE'
    },
    ...baseHistory
  ] : baseHistory;

  const trains = TRAIN_SCHEDULES[activeStation] || [];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">RAILWAY STATIONS</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Station directory, maintenance impact and operational history</p>
      </div>

      {/* End-to-End Workflow Progress Banner */}
      {workflowState?.operationsApproved && (
        <div className="p-4 bg-green-50 border-2 border-green-600 shadow-[3px_3px_0px_#16A34A] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-900">
                Full Lifecycle Completed: {workflowState.approvedBlock || 'BLK-2026-047'}
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                Maintenance Dept ➔ Central Intelligence (AI Plan) ➔ Railway Operations (Approved) ➔ Station Execution ({activeStation})
              </p>
            </div>
          </div>
          <Badge status="APPROVED">POSSESSION ACTIVE</Badge>
        </div>
      )}

      {/* Station Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATIONS.map(s => (
          <button key={s} onClick={() => setActiveStation(s)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wide border-2 border-zinc-900 transition-colors cursor-pointer ${
              activeStation === s ? 'bg-zinc-900 text-white shadow-[2px_2px_0px_#2563EB]' : 'bg-white text-zinc-700 hover:bg-zinc-50'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Station KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Works" value={info.totalWorks} color="default" icon={FileText} />
        <KpiCard label="This Month" value="8" color="blue" icon={Clock} />
        <KpiCard label="Active Blocks" value="1" color="amber" icon={AlertTriangle} />
        <KpiCard label="Pending Notifs." value={notifications.length} color="default" icon={Bell} />
      </div>

      {/* Station Info + Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Station Details */}
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-2">
            <MapPin size={13} className="text-white" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">{activeStation}</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { l: 'Station Code', v: info.code },
              { l: 'Railway Zone', v: info.zone },
              { l: 'Division', v: info.division },
              { l: 'Total Tracks', v: info.tracks },
              { l: 'Platforms', v: info.platforms },
              { l: 'Total Works (All)', v: info.totalWorks },
            ].map(item => (
              <div key={item.l} className="flex items-center justify-between border-b border-zinc-50 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.l}</span>
                <span className="text-xs font-black font-mono text-zinc-900">{item.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Impact */}
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Current Maintenance Impact</h3>
          </div>
          <div className="p-0">
            {[
              { blk: 'BLK-2026-047', segment: 'A-B', dept: 'Engineering', window: 'Thu 18:00–20:00', impact: 'Train delay', status: 'APPROVED', trains: '12678, 16057' },
              { blk: 'BLK-2026-039', segment: 'A-B', dept: 'Engineering', window: 'Today 06:00–08:00', impact: 'Line block', status: 'ACTIVE', trains: '3 trains' },
            ].map((item, i) => (
              <div key={i} className="p-3 border-b border-zinc-50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-zinc-800">{item.blk}</span>
                  <Badge status={item.status}>{item.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-zinc-500">
                  <span>Segment: <strong>{item.segment}</strong></span>
                  <span>Dept: <strong>{item.dept}</strong></span>
                  <span>Window: <strong className="font-mono">{item.window}</strong></span>
                  <span>Impact: <strong className="text-amber-600">{item.impact}</strong></span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-500">Trains: <span className="font-mono font-semibold text-red-600">{item.trains}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-2">
            <Bell size={13} className="text-white" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Station Notifications</h3>
          </div>
          <div className="p-3 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">No notifications for this station.</p>
            ) : notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 border border-zinc-100 hover:bg-zinc-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${n.type === 'green' ? 'bg-green-500' : n.type === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-700 leading-snug">{n.msg}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Train Schedule */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-2">
          <Train size={13} className="text-white" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Train Schedule at {activeStation}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Train No.', 'Name', 'Type', 'Arrival', 'Departure', 'Platform', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(trains.length > 0 ? trains : [{ no: '—', name: 'No scheduled trains', type: '—', arrival: '—', departure: '—', platform: '—', status: 'ON TIME' }]).map((t, i) => (
                <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-black text-zinc-900">{t.no}</td>
                  <td className="px-4 py-3 text-xs text-zinc-700">{t.name}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{t.type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{t.arrival}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{t.departure}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{'platform' in t ? t.platform : '—'}</td>
                  <td className={`px-4 py-3 text-xs font-black ${statusColor(t.status)}`}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History + Chart */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Station Maintenance History</h3>
          <span className="text-[10px] font-mono text-zinc-400">Total Works: {info.totalWorks}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="p-4 border-r border-zinc-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Monthly Works (2026)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyWorksData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 11 }} />
                <Bar dataKey="works" fill="#2563EB" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  {['Date', 'Block ID', 'Department', 'Type', 'Segment', 'Duration', 'Trains Affected', 'Status'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-xs text-zinc-500 whitespace-nowrap">{h.date}</td>
                    <td className="px-3 py-2.5 font-mono text-xs font-bold text-zinc-700">{h.blkId}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-600">{h.dept}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-600">{h.type}</td>
                    <td className="px-3 py-2.5 text-xs font-semibold text-zinc-700">{h.segment}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-600">{h.duration}</td>
                    <td className={`px-3 py-2.5 text-xs font-bold ${h.trains > 3 ? 'text-red-600' : h.trains > 0 ? 'text-amber-600' : 'text-green-600'}`}>{h.trains}</td>
                    <td className="px-3 py-2.5"><Badge status={h.status}>{h.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
