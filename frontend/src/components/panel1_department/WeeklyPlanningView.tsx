import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { WeeklyScheduleItem } from '../../types/railops';

interface Props {
  scheduleItems: WeeklyScheduleItem[];
}

export const WeeklyPlanningView: React.FC<Props> = ({ scheduleItems }) => {
  // Days of week
  const days = [
    { day: 'MON', date: '21 Sep 2026', iso: '2026-09-21' },
    { day: 'TUE', date: '22 Sep 2026', iso: '2026-09-22' },
    { day: 'WED', date: '23 Sep 2026', iso: '2026-09-23' },
    { day: 'THU', date: '24 Sep 2026', iso: '2026-09-24' },
    { day: 'FRI', date: '25 Sep 2026', iso: '2026-09-25' },
    { day: 'SAT', date: '26 Sep 2026', iso: '2026-09-26' },
    { day: 'SUN', date: '27 Sep 2026', iso: '2026-09-27' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'SCHEDULED':
        return <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">SCHEDULED</span>;
      case 'MODIFIED':
        return <span className="bg-amber-950/80 text-amber-400 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">MODIFIED</span>;
      case 'COMPLETED':
        return <span className="bg-teal-950/80 text-teal-300 border border-teal-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">COMPLETED</span>;
      case 'REJECTED':
        return <span className="bg-rose-950/80 text-rose-400 border border-rose-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">REJECTED</span>;
      case 'SENT FOR APPROVAL':
        return <span className="bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">PENDING BDMS</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div>
          <h3 className="font-hud font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-400" />
            WEEKLY OPERATIONAL TIMELINE // CORRIDOR BLOCK SCHEDULE
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Synchronized with Central Intelligence and Authority BDMS Sanctions
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Approved / Scheduled
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span> Modified Slot
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-purple-500"></span> Under Review
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((d) => {
          const itemsForDay = scheduleItems.filter(
            (i) => i.requested_date === d.iso || (d.day === 'SAT' && i.request_id === 'BR-2026-0142')
          );
          const isToday = d.day === 'SAT';

          return (
            <div
              key={d.day}
              className={`rounded-lg border p-2.5 min-h-[300px] flex flex-col ${
                isToday
                  ? 'bg-slate-800/80 border-sky-500/50 shadow-md ring-1 ring-sky-500/20'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className={`font-mono text-xs font-bold ${isToday ? 'text-sky-400' : 'text-slate-300'}`}>
                  {d.day}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{d.date.slice(0, 6)}</span>
              </div>

              <div className="space-y-2 flex-1">
                {itemsForDay.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-600 font-mono italic">
                    No Blocks
                  </div>
                ) : (
                  itemsForDay.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-700/80 rounded p-2 text-xs hover:border-slate-500 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-sky-400">{item.request_id}</span>
                        {getStatusBadge(item.status)}
                      </div>

                      <div className="text-[11px] font-medium text-slate-200 truncate" title={item.maintenance_type}>
                        {item.maintenance_type}
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                        <span className="truncate">{item.station} ({item.track})</span>
                      </div>

                      <div className="bg-slate-950/70 p-1.5 rounded border border-slate-800 font-mono text-[10px] space-y-0.5">
                        <div className="text-slate-400 flex justify-between">
                          <span>Req:</span>
                          <span className="text-slate-300">{item.requested_time}</span>
                        </div>
                        <div className="text-emerald-400 font-semibold flex justify-between">
                          <span>Planned:</span>
                          <span>{item.planned_time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>Dur: {item.duration}</span>
                        <span className={`font-semibold ${
                          item.priority === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
