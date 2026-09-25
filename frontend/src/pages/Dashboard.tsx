import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wrench, Brain, Activity, MapPin, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, Database, Wifi, Server } from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { Badge } from '../components/ui/Badge';

const requestVolumeData = [
  { day: 'Mon', requests: 12 }, { day: 'Tue', requests: 8 }, { day: 'Wed', requests: 15 },
  { day: 'Thu', requests: 11 }, { day: 'Fri', requests: 9 }, { day: 'Sat', requests: 6 }, { day: 'Sun', requests: 4 },
];

const utilizationData = [
  { time: '06:00', util: 45 }, { time: '08:00', util: 62 }, { time: '10:00', util: 78 },
  { time: '12:00', util: 55 }, { time: '14:00', util: 85 }, { time: '16:00', util: 72 }, { time: '18:00', util: 91 }, { time: '20:00', util: 68 },
];

const recentActivity = [
  { id: 'REQ-0142', dept: 'Engineering', asset: 'Rail Joint AJ-204', status: 'REQUESTED', time: '14:32' },
  { id: 'REQ-0141', dept: 'TRD', asset: 'OHE Wire OE-118', status: 'ANALYZING', time: '13:18' },
  { id: 'REQ-0140', dept: 'S&T', asset: 'Signal Box SB-07', status: 'RECOMMENDED', time: '11:45' },
  { id: 'REQ-0139', dept: 'Engineering', asset: 'Track T-22', status: 'APPROVED', time: '10:22' },
  { id: 'REQ-0138', dept: 'Engineering', asset: 'Bridge BR-11', status: 'ACTIVE', time: '06:00' },
];

const systemStatus = [
  { name: 'Backend API', status: 'Online', color: 'green', icon: Server },
  { name: 'Database', status: 'Connected', color: 'green', icon: Database },
  { name: 'WebSocket', status: 'Active', color: 'green', icon: Wifi },
  { name: 'AI Engine', status: 'Running', color: 'green', icon: Zap },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">RAILOPS DASHBOARD</h1>
          <p className="text-zinc-500 text-sm mt-0.5">System overview — All panels connected to central database</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">Last updated: 09:38:00</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="Total Requests" value="128" trend="up" trendValue="+4 today" color="default" icon={Wrench} />
        <KpiCard label="Active Blocks" value="7" sub="3 segments affected" color="blue" icon={Activity} />
        <KpiCard label="Train Conflicts" value="9" trend="down" trendValue="-2 resolved" color="red" icon={AlertTriangle} />
        <KpiCard label="Pending Approval" value="5" sub="Awaiting authority" color="amber" icon={Clock} />
        <KpiCard label="Completed Today" value="12" trend="up" trendValue="+3 vs yesterday" color="green" icon={CheckCircle} />
        <KpiCard label="System Health" value="98.2%" sub="All systems nominal" color="green" icon={TrendingUp} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Request Volume — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={requestVolumeData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#71717A' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
              <Bar dataKey="requests" fill="#2563EB" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-4">Block Utilization % — Today</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#71717A' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#71717A' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ border: '2px solid #18181B', borderRadius: 0, fontSize: 12 }} />
              <Line type="monotone" dataKey="util" stroke="#18181B" strokeWidth={2} dot={{ fill: '#18181B', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
          <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Recent Activity</h3>
            <span className="text-[10px] text-zinc-400 font-mono">Latest 5 requests</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                {['Request ID', 'Department', 'Asset', 'Status', 'Time'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row, i) => (
                <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs font-semibold text-blue-600">{row.id}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-700">{row.dept}</td>
                  <td className="px-4 py-2.5 text-xs text-zinc-600 font-mono">{row.asset}</td>
                  <td className="px-4 py-2.5"><Badge status={row.status}>{row.status}</Badge></td>
                  <td className="px-4 py-2.5 text-xs font-mono text-zinc-500">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* System Status */}
          <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
            <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">System Status</h3>
            </div>
            <div className="p-3 space-y-2">
              {systemStatus.map(s => (
                <div key={s.name} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <s.icon size={13} className="text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-700">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-semibold text-green-600 uppercase">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
            <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Quick Access</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Maintenance', icon: Wrench, path: '/maintenance', color: 'hover:bg-zinc-50' },
                { label: 'Intelligence', icon: Brain, path: '/intelligence', color: 'hover:bg-blue-50' },
                { label: 'Operations', icon: Activity, path: '/operations', color: 'hover:bg-amber-50' },
                { label: 'Stations', icon: MapPin, path: '/stations', color: 'hover:bg-green-50' },
              ].map(q => (
                <button
                  key={q.path}
                  onClick={() => navigate(q.path)}
                  className={`flex flex-col items-center gap-1 p-3 border-2 border-zinc-900 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer ${q.color}`}
                >
                  <q.icon size={16} />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
