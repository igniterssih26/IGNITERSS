import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Wrench, Brain, Activity, MapPin, History,
  Bell, Settings, Menu, X, Search, ChevronRight, Train,
  User, LogOut, Shield
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import MaintenanceDepartment from './pages/MaintenanceDepartment';
import CentralIntelligence from './pages/CentralIntelligence';
import RailwayOperations from './pages/RailwayOperations';
import RailwayStations from './pages/RailwayStations';
import WorkHistory from './pages/WorkHistory';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wrench, label: 'Maintenance Dept', path: '/maintenance' },
  { icon: Brain, label: 'Central Intelligence', path: '/intelligence' },
  { icon: Activity, label: 'Railway Operations', path: '/operations' },
  { icon: MapPin, label: 'Railway Stations', path: '/stations' },
  { icon: History, label: 'Work History', path: '/history' },
];

const bottomNav = [
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function NotificationsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-1">NOTIFICATIONS</h1>
      <p className="text-zinc-500 text-sm mb-6">System alerts and updates</p>
      <div className="space-y-3">
        {[
          { msg: 'Block BLK-2026-047 approved for Thursday 18:00–20:00', time: '2 hours ago', type: 'green' },
          { msg: 'Train 12678 delayed by 40 min due to maintenance block', time: '3 hours ago', type: 'amber' },
          { msg: 'CONFLICT detected: REQ-0142 overlaps Train 12678 at 14:20', time: '5 hours ago', type: 'red' },
          { msg: 'Possession POS-0031 completed successfully', time: '8 hours ago', type: 'green' },
          { msg: 'New emergency request REQ-0138 submitted by Engineering', time: 'Yesterday', type: 'red' },
        ].map((n, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B]`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'green' ? 'bg-green-500' : n.type === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-800 font-medium">{n.msg}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-1">SETTINGS</h1>
      <p className="text-zinc-500 text-sm mb-6">System configuration and preferences</p>
      <div className="space-y-4">
        {['User Management', 'Role & Permissions', 'Notification Preferences', 'System Configuration', 'API Keys', 'Audit Logs'].map(s => (
          <div key={s} className="flex items-center justify-between p-4 bg-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] cursor-pointer hover:bg-zinc-50 transition-colors">
            <span className="text-sm font-semibold text-zinc-800">{s}</span>
            <ChevronRight size={16} className="text-zinc-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();

  const currentPage = [...navItems, ...bottomNav].find(n => n.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'} flex-shrink-0 bg-zinc-900 flex flex-col transition-all duration-200 border-r-2 border-zinc-700`}>
        {/* Logo */}
        <div className="p-4 border-b-2 border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 border border-blue-400">
              <Train size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-sm tracking-tight leading-none">RAILOPS</div>
              <div className="text-zinc-400 text-[9px] font-semibold tracking-widest uppercase leading-none mt-0.5">Block Planning System</div>
            </div>
          </div>
          <div className="mt-2 text-[9px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 inline-block">v2.0.0 — BETA</div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-2 mt-1">Main Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors rounded-sm ${
                  isActive
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={14} className={isActive ? 'text-zinc-900' : 'text-zinc-400'} />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight size={12} className="ml-auto text-zinc-600" />}
                </>
              )}
            </NavLink>
          ))}

          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-2 mt-3">System</p>
          {bottomNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors rounded-sm ${
                  isActive ? 'bg-white text-zinc-900' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`
              }
            >
              <item.icon size={14} className="text-zinc-400" />
              <span>{item.label}</span>
              {item.label === 'Notifications' && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t-2 border-zinc-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">Admin User</div>
              <div className="text-zinc-400 text-[9px] font-mono truncate">SYSTEM ADMIN</div>
            </div>
            <button className="p-1 hover:bg-zinc-700 rounded transition-colors">
              <LogOut size={12} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b-2 border-zinc-900 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-zinc-100 border border-zinc-200 transition-colors">
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <span className="font-bold text-zinc-900 uppercase tracking-wide text-[11px]">{currentPage}</span>
          </div>

          <div className="flex-1 max-w-sm ml-4">
            <div className="flex items-center border-2 border-zinc-900 bg-white px-3 py-1.5 gap-2">
              <Search size={13} className="text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search requests, trains, assets..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="text-xs outline-none flex-1 font-medium placeholder:text-zinc-400 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
            </div>

            <button className="relative p-2 hover:bg-zinc-100 border border-zinc-200 transition-colors">
              <Bell size={15} className="text-zinc-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-white">
              <Shield size={12} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
            </div>

            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center cursor-pointer">
              <User size={13} className="text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/maintenance" element={<MaintenanceDepartment />} />
            <Route path="/intelligence" element={<CentralIntelligence />} />
            <Route path="/operations" element={<RailwayOperations />} />
            <Route path="/stations" element={<RailwayStations />} />
            <Route path="/history" element={<WorkHistory />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
