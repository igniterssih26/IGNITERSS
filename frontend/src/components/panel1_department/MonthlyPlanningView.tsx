import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock, MapPin, Tag } from 'lucide-react';

interface Props {
  monthlyData: any;
}

export const MonthlyPlanningView: React.FC<Props> = ({ monthlyData }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-09-26');

  // Days in September 2026 (Starts on Tuesday, 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const iso = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    return {
      dayNum,
      iso,
      activities: monthlyData?.calendar_days?.[iso] || []
    };
  });

  const selectedActivities = selectedDate ? (monthlyData?.calendar_days?.[selectedDate] || []) : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="font-hud font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-400" />
            MONTHLY SECTIONAL PLANNER // SEPTEMBER 2026
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Interactive divisional calendar — select any date to inspect block demands
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700">SEPTEMBER 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-slate-400 mb-2">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* September 2026 starts on Tuesday, so 2 empty slots for Sun, Mon */}
            <div className="h-16 rounded bg-slate-950/20 border border-transparent"></div>
            <div className="h-16 rounded bg-slate-950/20 border border-transparent"></div>

            {daysInMonth.map((d) => {
              const count = d.activities.length;
              const isSelected = selectedDate === d.iso;
              const hasActivity = count > 0;

              return (
                <div
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`h-16 p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-400 shadow-md ring-1 ring-sky-400/30'
                      : hasActivity
                      ? 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
                      : 'bg-slate-950/60 border-slate-800/70 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs font-bold ${isSelected ? 'text-sky-400' : 'text-slate-300'}`}>
                      {d.dayNum}
                    </span>
                    {hasActivity && (
                      <span className="bg-sky-600 text-white text-[9px] font-mono px-1 rounded font-bold">
                        {count}
                      </span>
                    )}
                  </div>

                  {hasActivity ? (
                    <div className="text-[9px] font-mono truncate text-emerald-400 font-semibold">
                      {d.activities[0].type.slice(0, 10)}...
                    </div>
                  ) : (
                    <div className="text-[9px] font-mono text-slate-600">-</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Drawer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-hud text-xs font-bold text-white uppercase tracking-wider">
                ACTIVITIES SCHEDULED // {selectedDate || 'SELECT DATE'}
              </span>
              <span className="bg-slate-800 text-[11px] font-mono px-2 py-0.5 rounded text-sky-400">
                {selectedActivities.length} Tasks
              </span>
            </div>

            <div className="mt-3 space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {selectedActivities.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-mono text-xs">
                  No scheduled maintenance activities on this date.
                </div>
              ) : (
                selectedActivities.map((act: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-400">{act.id}</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
                        {act.status}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-100">{act.type}</div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{act.location}</span>
                    </div>

                    <div className="bg-slate-950 p-2 rounded border border-slate-800/80 font-mono text-[10px] flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="h-3 w-3" /> Time:
                      </span>
                      <span className="text-emerald-400 font-semibold">{act.time}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Dept: {act.department}</span>
                      <span className="text-amber-400 font-bold">{act.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Records derived from central `maintenance_requests` registry.
          </div>
        </div>
      </div>
    </div>
  );
};
