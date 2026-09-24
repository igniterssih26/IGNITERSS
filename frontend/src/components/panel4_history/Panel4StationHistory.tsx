import React, { useState, useEffect } from 'react';
import {
  History, Search, Filter, Calendar, MapPin, Wrench, ChevronRight,
  Clock, ShieldCheck, CheckCircle2, Building2, Tag, Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { Station, StationMaintenanceHistory } from '../../types/railops';

export const Panel4StationHistory: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationCode, setSelectedStationCode] = useState<string>('SA');
  const [historyRecords, setHistoryRecords] = useState<StationMaintenanceHistory[]>([]);
  const [departmentTab, setDepartmentTab] = useState<'ALL' | 'Engineering' | 'TRD' | 'S&T'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStations = async () => {
    try {
      const data = await api.getStations();
      setStations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await api.searchHistory({
        station: selectedStationCode === 'ALL' ? undefined : selectedStationCode,
        department: departmentTab === 'ALL' ? undefined : departmentTab,
        q: searchQuery.trim() || undefined
      });
      setHistoryRecords(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [selectedStationCode, departmentTab, searchQuery]);

  const selectedStation = stations.find(s => s.station_code === selectedStationCode);

  // Group records by year & month for chronological timeline
  const timelineGroups: Record<number, Record<string, StationMaintenanceHistory[]>> = {};
  historyRecords.forEach(rec => {
    const yr = rec.year || 2026;
    const mo = rec.month || 'September';
    if (!timelineGroups[yr]) timelineGroups[yr] = {};
    if (!timelineGroups[yr][mo]) timelineGroups[yr][mo] = [];
    timelineGroups[yr][mo].push(rec);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md text-slate-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-lg text-white uppercase tracking-wider">
                PANEL 4 // RAILWAY STATION MAINTENANCE HISTORY
              </span>
              <span className="bg-sky-950 text-sky-400 border border-sky-600/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                HISTORICAL REPOSITORY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Permanent station-wise & department-wise maintenance possession records
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Station, Asset, ID, Type..."
              className="bg-transparent text-xs text-white placeholder-slate-500 font-mono focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Station Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 font-mono text-xs">
          <span className="text-slate-400 text-[11px] shrink-0">SELECT STATION:</span>
          {stations.map(st => {
            const isSelected = selectedStationCode === st.station_code;
            return (
              <button
                key={st.station_code}
                onClick={() => setSelectedStationCode(st.station_code)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-600 border-sky-400 text-white font-bold shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{st.station_name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-sky-800 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {st.station_code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Station Highlight Summary Card */}
      {selectedStation && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-slate-100 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-r border-slate-800 pr-4 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">STATION DETAILS</span>
              <div className="text-lg font-bold text-white font-hud">{selectedStation.station_name}</div>
              <div className="text-xs text-sky-400 font-bold">{selectedStation.station_code} // {selectedStation.division}</div>
              <div className="text-[11px] text-slate-400">{selectedStation.location}</div>
            </div>

            <div className="border-r border-slate-800 pr-4 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">TOTAL POSSESSIONS RECORDED</span>
              <div className="text-3xl font-hud font-bold text-emerald-400 mt-1">
                {selectedStation.total_maintenance_works}
              </div>
              <div className="text-[11px] text-slate-400">All certified under G&SR norms</div>
            </div>

            <div className="border-r border-slate-800 pr-4 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">LAST MAINTENANCE SANCTION</span>
              <div className="text-lg font-bold text-slate-200 mt-1">
                {selectedStation.last_maintenance_date || 'N/A'}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold">Status: {selectedStation.current_status}</div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">DEPARTMENTS INVOLVED</span>
              <div className="text-xs text-slate-300 font-bold mt-1">
                {selectedStation.departments_involved}
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-slate-400">Integrated Central Registry</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Breakdown Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 mr-2">DEPARTMENT BREAKDOWN:</span>
        <button
          onClick={() => setDepartmentTab('ALL')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            departmentTab === 'ALL'
              ? 'bg-slate-800 text-white font-bold border border-slate-600'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ALL DEPARTMENTS ({historyRecords.length})
        </button>
        <button
          onClick={() => setDepartmentTab('Engineering')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            departmentTab === 'Engineering'
              ? 'bg-sky-900 text-sky-200 font-bold border border-sky-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ENGINEERING (TMS - Track)
        </button>
        <button
          onClick={() => setDepartmentTab('TRD')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            departmentTab === 'TRD'
              ? 'bg-amber-900 text-amber-200 font-bold border border-amber-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          TRD (TDMS - Traction/OHE)
        </button>
        <button
          onClick={() => setDepartmentTab('S&T')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            departmentTab === 'S&T'
              ? 'bg-teal-900 text-teal-200 font-bold border border-teal-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          S&T (SMMS - Signal & Interlock)
        </button>
      </div>

      {/* Split Grid: Chronological Timeline & Detailed Records Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chronological Station Timeline (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-slate-100 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" />
              CHRONOLOGICAL TIMELINE // {selectedStationCode}
            </span>
            <span className="text-[10px] text-slate-400">Tree View</span>
          </div>

          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2">
            {Object.keys(timelineGroups).sort((a, b) => Number(b) - Number(a)).map(yearStr => {
              const year = Number(yearStr);
              const months = timelineGroups[year];

              return (
                <div key={year} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-950 text-sky-400 border border-sky-500/40 text-xs font-bold px-2.5 py-0.5 rounded font-hud">
                      {year}
                    </span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                  </div>

                  <div className="border-l-2 border-slate-800 ml-4 pl-4 space-y-4">
                    {Object.keys(months).map(month => (
                      <div key={month} className="space-y-2">
                        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                          {month}
                        </div>

                        <div className="space-y-2">
                          {months[month].map(item => (
                            <div
                              key={item.maintenance_id}
                              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-1 text-xs hover:border-slate-700 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  item.department === 'Engineering'
                                    ? 'bg-sky-950 text-sky-300 border border-sky-500/30'
                                    : item.department === 'TRD'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                    : 'bg-teal-950 text-teal-300 border border-teal-500/30'
                                }`}>
                                  {item.department} — {item.maintenance_type}
                                </span>
                                <span className="text-[10px] text-slate-400">{item.date}</span>
                              </div>

                              <div className="text-white font-medium text-[11px] truncate">
                                {item.description}
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                                <span>Asset: {item.asset_id || 'N/A'}</span>
                                <span className="text-emerald-400 font-semibold">{item.duration_str}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Maintenance History Records Table (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-slate-100 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="font-hud font-bold text-xs uppercase tracking-wider text-slate-200">
              MAINTENANCE HISTORY TABLE // PERMANENT AUDIT REGISTRY
            </span>
            <span className="text-[10px] text-slate-400">{historyRecords.length} Records</span>
          </div>

          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] tracking-wider uppercase">
                <tr>
                  <th className="py-2.5 px-3">MNT ID</th>
                  <th className="py-2.5 px-3">DATE</th>
                  <th className="py-2.5 px-3">DEPT</th>
                  <th className="py-2.5 px-3">ASSET</th>
                  <th className="py-2.5 px-3">TYPE</th>
                  <th className="py-2.5 px-3">WINDOW</th>
                  <th className="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {historyRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No historical maintenance records match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  historyRecords.map(rec => (
                    <tr key={rec.maintenance_id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-sky-400">{rec.maintenance_id}</td>
                      <td className="py-2.5 px-3 text-slate-300">{rec.date}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rec.department === 'Engineering'
                            ? 'text-sky-400'
                            : rec.department === 'TRD'
                            ? 'text-amber-400'
                            : 'text-teal-400'
                        }`}>
                          {rec.department}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-200">{rec.asset_id || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-200 truncate max-w-[140px]" title={rec.maintenance_type}>
                        {rec.maintenance_type}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {rec.start_time} - {rec.end_time} ({rec.duration_str})
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          ✔ {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
