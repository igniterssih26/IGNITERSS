import React, { useState, useEffect } from 'react';

export const SystemStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('26 SEP 2026 // 15:35:02 IST');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const d = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      const t = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(`${d} // ${t} IST`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          LIVE SYSTEM STATUS: ONLINE
        </span>
        <span className="text-slate-600">|</span>
        <span>ZONE: SOUTHERN RAILWAY CO-HQ</span>
        <span className="text-slate-600">|</span>
        <span>SERVER CLUSTER: SEC-PROD-04</span>
      </div>

      <div className="flex items-center gap-4">
        <span>LAST SYNCHRONIZED: <span className="text-slate-200">{currentTime}</span></span>
        <span className="text-slate-600">|</span>
        <span className="text-sky-400 font-medium">TMS FEED ACTIVE (12MS)</span>
      </div>
    </div>
  );
};
