import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { History, Download, Printer, FileText, ChevronDown, ChevronUp, TrendingUp, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { KpiCard } from '../components/ui/KpiCard';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const HISTORY_DATA = [
  { id: 'WRK-0046', date: '18 Mar 2026', blkId: 'BLK-039', dept: 'Engineering', asset: 'AJ-204', segment: 'A-B', type: 'Corrective', requested: '14:00–16:00', executed: '14:05–16:10', duration: '2h 5m', trains: 3, delay: '15 min', condition: 'Fair', status: 'Completed' },
  { id: 'WRK-0045', date: '22 Jan 2026', blkId: 'BLK-028', dept: 'Engineering', asset: 'AJ-204', segment: 'A-B', type: 'Inspection', requested: '10:00–11:00', executed: '10:00–10:55', duration: '55 min', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0044', date: '14 Nov 2025', blkId: 'BLK-019', dept: 'Engineering', asset: 'BR-11', segment: 'A-B', type: 'Emergency', requested: '02:00–05:00', executed: '02:00–05:30', duration: '3h 30m', trains: 6, delay: '45 min', condition: 'Fair', status: 'Completed' },
  { id: 'WRK-0043', date: '07 Aug 2025', blkId: 'BLK-012', dept: 'Engineering', asset: 'AJ-204', segment: 'A-B', type: 'Preventive', requested: '18:00–20:00', executed: '18:00–20:00', duration: '2h', trains: 1, delay: '5 min', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0042', date: '02 Jun 2025', blkId: 'BLK-009', dept: 'TRD', asset: 'OE-118', segment: 'B-C', type: 'OHE Maint.', requested: '06:00–08:00', executed: '06:00–08:15', duration: '2h 15m', trains: 2, delay: '10 min', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0041', date: '15 Apr 2025', blkId: 'BLK-007', dept: 'S&T', asset: 'SB-07', segment: 'C-D', type: 'Inspection', requested: '08:00–09:00', executed: '08:00–09:05', duration: '1h 5m', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0040', date: '10 Mar 2025', blkId: 'BLK-005', dept: 'S&T', asset: 'PM-3', segment: 'E-F', type: 'Corrective', requested: '20:00–22:00', executed: '20:00–22:20', duration: '2h 20m', trains: 1, delay: '20 min', condition: 'Fair', status: 'Completed' },
  { id: 'WRK-0039', date: '01 Feb 2025', blkId: 'BLK-004', dept: 'Engineering', asset: 'BR-11', segment: 'A-B', type: 'Inspection', requested: '10:00–11:00', executed: '10:00–11:00', duration: '1h', trains: 1, delay: '5 min', condition: 'Poor', status: 'Completed' },
  { id: 'WRK-0038', date: '12 Jan 2025', blkId: 'BLK-003', dept: 'TRD', asset: 'SS-02', segment: 'B-C', type: 'Inspection', requested: '06:00–07:00', executed: '06:00–07:10', duration: '1h 10m', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0037', date: '05 Dec 2024', blkId: 'BLK-002', dept: 'Engineering', asset: 'SL-445', segment: 'C-D', type: 'Preventive', requested: '18:00–20:00', executed: '18:00–20:00', duration: '2h', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0036', date: '20 Nov 2024', blkId: 'BLK-001', dept: 'TRD', asset: 'OE-118', segment: 'B-C', type: 'Emergency', requested: '14:00–16:00', executed: '14:00–16:45', duration: '2h 45m', trains: 5, delay: '40 min', condition: 'Fair', status: 'Completed' },
  { id: 'WRK-0035', date: '08 Oct 2024', blkId: 'BLK-097', dept: 'Engineering', asset: 'T-22', segment: 'D-E', type: 'Preventive', requested: '20:00–22:00', executed: '20:00–22:00', duration: '2h', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0034', date: '15 Sep 2024', blkId: 'BLK-095', dept: 'S&T', asset: 'SB-07', segment: 'C-D', type: 'Corrective', requested: '08:00–10:00', executed: '08:00–09:30', duration: '1h 30m', trains: 1, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0033', date: '22 Aug 2024', blkId: 'BLK-091', dept: 'Engineering', asset: 'AJ-204', segment: 'A-B', type: 'Preventive', requested: '18:00–20:00', executed: '18:00–20:00', duration: '2h', trains: 1, delay: '5 min', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0032', date: '10 Jul 2024', blkId: 'BLK-088', dept: 'TRD', asset: 'SS-02', segment: 'B-C', type: 'Inspection', requested: '06:00–07:00', executed: '06:00–07:00', duration: '1h', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0031', date: '05 Jun 2024', blkId: 'BLK-084', dept: 'Engineering', asset: 'BR-11', segment: 'A-B', type: 'Corrective', requested: '02:00–05:00', executed: '02:00–05:15', duration: '3h 15m', trains: 4, delay: '30 min', condition: 'Fair', status: 'Completed' },
  { id: 'WRK-0030', date: '18 May 2024', blkId: 'BLK-081', dept: 'S&T', asset: 'PM-3', segment: 'E-F', type: 'Inspection', requested: '20:00–21:00', executed: '20:00–21:00', duration: '1h', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0029', date: '02 Apr 2024', blkId: 'BLK-077', dept: 'Engineering', asset: 'T-22', segment: 'D-E', type: 'Corrective', requested: '10:00–12:00', executed: '10:00–12:30', duration: '2h 30m', trains: 2, delay: '15 min', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0028', date: '15 Mar 2024', blkId: 'BLK-073', dept: 'TRD', asset: 'OE-118', segment: 'B-C', type: 'Preventive', requested: '06:00–08:00', executed: '06:00–08:00', duration: '2h', trains: 1, delay: '5 min', condition: 'Good', status: 'Completed' },
  { id: 'WRK-0027', date: '28 Feb 2024', blkId: 'BLK-070', dept: 'Engineering', asset: 'SL-445', segment: 'C-D', type: 'Inspection', requested: '18:00–19:00', executed: '18:00–19:00', duration: '1h', trains: 0, delay: '0', condition: 'Good', status: 'Completed' },
];

const monthlyData = [
  { month: 'Jan', works: 3 }, { month: 'Feb', works: 4 }, { month: 'Mar', works: 5 },
  { month: 'Apr', works: 4 }, { month: 'May', works: 6 }, { month: 'Jun', works: 5 },
  { month: 'Jul', works: 4 }, { month: 'Aug', works: 7 }, { month: 'Sep', works: 8 },
];

const deptPieData = [
  { name: 'Engineering', value: 60 }, { name: 'TRD', value: 25 }, { name: 'S&T', value: 15 },
];
const PIE_COLORS = ['#09090B', '#2563EB', '#16A34A'];

const delayTrendData = [
  { month: 'Jan', avg: 8 }, { month: 'Feb', avg: 12 }, { month: 'Mar', avg: 15 },
  { month: 'Apr', avg: 10 }, { month: 'May', avg: 6 }, { month: 'Jun', avg: 9 },
  { month: 'Jul', avg: 11 }, { month: 'Aug', avg: 14 }, { month: 'Sep', avg: 8 },
];

const durationCompareData = [
  { type: 'Preventive', requested: 120, actual: 122 }, { type: 'Corrective', requested: 120, actual: 135 },
  { type: 'Inspection', requested: 60, actual: 62 }, { type: 'Emergency', requested: 180, actual: 210 },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function WorkHistory() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = HISTORY_DATA.filter(r =>
    (deptFilter === 'ALL' || r.dept === deptFilter) &&
    (statusFilter === 'ALL' || r.status === statusFilter) &&
    (r.id.toLowerCase().includes(search.toLowerCase()) || r.asset.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">WORK HISTORY</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Complete maintenance execution record and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-900 bg-white text-xs font-bold uppercase hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"><Download size={12} /> Export CSV</button>
          <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-900 bg-white text-xs font-bold uppercase hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"><FileText size={12} /> Export PDF</button>
          <button className="flex items-center gap-1.5 px-3 py-2 border-2 border-zinc-900 bg-white text-xs font-bold uppercase hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"><Printer size={12} /> Print</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Total Works" value="46" color="default" icon={History} />
        <KpiCard label="This Month" value="8" color="blue" icon={Clock} />
        <KpiCard label="Avg Duration" value="1.8h" color="default" icon={BarChart2} />
        <KpiCard label="Success Rate" value="94.2%" color="green" icon={CheckCircle} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Monthly Completed Works (2026)</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
              <Bar dataKey="works" fill="#09090B" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Works by Department</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={deptPieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={10}>
                {deptPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Maintenance History Log</h3>
          <span className="text-[10px] font-mono text-zinc-400">{filtered.length} records</span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-3 border-b border-zinc-100 flex-wrap">
          <input
            type="text"
            placeholder="Search ID, asset, type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs outline-none w-48"
          />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50 cursor-pointer">
            <option value="ALL">All Departments</option>
            {['Engineering', 'TRD', 'S&T'].map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50 cursor-pointer">
            <option value="ALL">All Status</option>
            <option>Completed</option>
          </select>
          <input type="date" className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50" />
          <span className="text-xs text-zinc-400">to</span>
          <input type="date" className="border border-zinc-200 px-2 py-1.5 text-xs outline-none bg-zinc-50" />
          <button onClick={() => { setSearch(''); setDeptFilter('ALL'); setStatusFilter('ALL'); }} className="px-3 py-1.5 text-xs font-semibold border border-zinc-200 hover:bg-zinc-50 cursor-pointer">Reset</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['', 'Work ID', 'Date', 'Block ID', 'Dept', 'Asset', 'Seg', 'Type', 'Requested', 'Executed', 'Duration', 'Trains', 'Delay', 'Condition', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}>
                    <td className="px-3 py-2.5">
                      {expandedRow === row.id ? <ChevronUp size={12} className="text-zinc-400" /> : <ChevronDown size={12} className="text-zinc-400" />}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs font-bold text-zinc-900">{row.id}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-zinc-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-blue-600">{row.blkId}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-700">{row.dept}</td>
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-zinc-800">{row.asset}</td>
                    <td className="px-3 py-2.5 text-xs font-semibold text-zinc-700">{row.segment}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-600 whitespace-nowrap">{row.type}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-zinc-500">{row.requested}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-zinc-600">{row.executed}</td>
                    <td className="px-3 py-2.5 text-xs text-zinc-600">{row.duration}</td>
                    <td className={`px-3 py-2.5 text-xs font-bold ${Number(row.trains) > 3 ? 'text-red-600' : Number(row.trains) > 0 ? 'text-amber-600' : 'text-zinc-600'}`}>{row.trains}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${row.delay !== '0' ? 'text-amber-600' : 'text-green-600'}`}>{row.delay !== '0' ? row.delay : '—'}</td>
                    <td className={`px-3 py-2.5 text-xs font-semibold ${row.condition === 'Poor' ? 'text-red-600' : row.condition === 'Fair' ? 'text-amber-600' : 'text-green-600'}`}>{row.condition}</td>
                    <td className="px-3 py-2.5"><Badge variant="green">Done</Badge></td>
                  </tr>
                  {expandedRow === row.id && (
                    <tr className="border-b-2 border-zinc-200">
                      <td colSpan={15} className="px-6 py-4 bg-zinc-50">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Personnel Deployed</p>
                            <p className="text-xs text-zinc-700">8 Engineering staff<br/>2 Safety officers<br/>1 Supervisor</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Equipment Used</p>
                            <p className="text-xs text-zinc-700">Rail grinder, torque wrench<br/>Track geometry cart<br/>Safety flagging kit</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Work Description</p>
                            <p className="text-xs text-zinc-700">Corrective maintenance on {row.asset}. Segment {row.segment} was blocked and work completed within specified window.</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Supervisor Sign-off</p>
                            <p className="text-xs text-zinc-700 font-mono">AEN/CH/Div<br/>Signed: {row.date}</p>
                            <div className="mt-2 flex gap-1">
                              {['Photo 1', 'Photo 2'].map(p => (
                                <div key={p} className="w-12 h-12 bg-zinc-200 border border-zinc-300 flex items-center justify-center text-[9px] text-zinc-400">{p}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center gap-2">
          <TrendingUp size={13} className="text-white" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Performance Analytics</h3>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Average Train Delay Caused (min)</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={delayTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
                <Line type="monotone" dataKey="avg" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Requested vs Actual Duration (min)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={durationCompareData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="requested" name="Requested" fill="#D4D4D8" radius={0} />
                <Bar dataKey="actual" name="Actual" fill="#09090B" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics KPIs */}
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: 'On-time Completion', v: '78%', color: 'text-amber-600' },
            { l: 'Average Overrun', v: '12 min', color: 'text-red-600' },
            { l: 'Zero-delay Works', v: '31%', color: 'text-green-600' },
            { l: 'Multi-dept Works', v: '8%', color: 'text-blue-600' },
          ].map(item => (
            <div key={item.l} className="p-3 bg-zinc-50 border border-zinc-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{item.l}</p>
              <p className={`text-2xl font-black ${item.color}`}>{item.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
