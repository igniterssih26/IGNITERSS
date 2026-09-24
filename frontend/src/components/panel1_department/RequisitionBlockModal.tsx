import React, { useState } from 'react';
import { X, AlertTriangle, Send, Check } from 'lucide-react';
import { api } from '../../services/api';
import { MaintenanceRequest } from '../../types/railops';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (req: MaintenanceRequest) => void;
  initialDept?: string;
}

export const RequisitionBlockModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialDept = 'Engineering'
}) => {
  const [department, setDepartment] = useState(initialDept);
  const [stationCode, setStationCode] = useState('SA');
  const [segment, setSegment] = useState('Salem - Erode (KM 334/12 - 338/04)');
  const [track, setTrack] = useState('UP LINE');
  const [assetId, setAssetId] = useState('TMS-006');
  const [maintenanceType, setMaintenanceType] = useState('TRACK MAINTENANCE');
  const [description, setDescription] = useState('Deep screening machine ballast cleaning and destressing');
  const [requestedDate, setRequestedDate] = useState('2026-09-26');
  const [requestedStartTime, setRequestedStartTime] = useState('11:30');
  const [requestedEndTime, setRequestedEndTime] = useState('13:00');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [priority, setPriority] = useState('HIGH');
  const [urgency, setUrgency] = useState('High');
  const [assetCriticality, setAssetCriticality] = useState('Tier-1');
  const [reason, setReason] = useState('Ultrasonic flaw testing indicated high localized rail stress');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await api.createRequest({
        department,
        dept_ref: department === 'Engineering' ? 'TMS' : department === 'S&T' ? 'SMMS' : 'TDMS',
        station_code: stationCode,
        zone: 'SR',
        segment,
        track,
        asset_id: assetId,
        maintenance_type: maintenanceType,
        description,
        requested_date: requestedDate,
        requested_start_time: requestedStartTime,
        requested_end_time: requestedEndTime,
        duration_minutes: durationMinutes,
        priority,
        urgency,
        asset_criticality: assetCriticality,
        reason
      });
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit requisition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-100">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              <h3 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                FORM IR-BDMS-01 // REQUISITION FOR RAILWAY MAINTENANCE BLOCK
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Submit divisional maintenance requirement to Central Intelligence Hub
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DEPARTMENT</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="Engineering">Engineering (TMS - Track)</option>
                <option value="S&T">S&T (SMMS - Signal & Telecom)</option>
                <option value="TRD">TRD (TDMS - Traction Distribution / OHE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">STATION / YARD</label>
              <select
                value={stationCode}
                onChange={(e) => setStationCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="SA">Salem Junction (SA)</option>
                <option value="MAS">Chennai Central (MAS)</option>
                <option value="AJJ">Arakkonam Junction (AJJ)</option>
                <option value="ED">Erode Junction (ED)</option>
                <option value="TUP">Tiruppur (TUP)</option>
                <option value="CBE">Coimbatore Junction (CBE)</option>
                <option value="TPJ">Tiruchchirappalli (TPJ)</option>
                <option value="MDU">Madurai Junction (MDU)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">LOCATION / SECTION / CHAINAGE</label>
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="e.g. Salem - Erode (KM 334/12 - 338/04)"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">TRACK / LINE</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="UP LINE">UP LINE</option>
                <option value="DN LINE">DN LINE</option>
                <option value="MAIN LINE">MAIN LINE</option>
                <option value="LOOP LINE">LOOP LINE</option>
                <option value="YARD LINE 2">YARD LINE 2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">ASSET ID (OPTIONAL)</label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="e.g. TMS-006, Point 42B"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">MAINTENANCE TYPE</label>
              <select
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="TRACK MAINTENANCE">TRACK MAINTENANCE (Ballast/Weld/Destressing)</option>
                <option value="SIGNAL MAINTENANCE">SIGNAL MAINTENANCE (Axle counter/Interlocking)</option>
                <option value="OHE 25KV MAINTENANCE">OHE 25KV MAINTENANCE (Catenary/Tensioning)</option>
                <option value="POINT MACHINE OVERHAUL">POINT MACHINE OVERHAUL</option>
                <option value="ULTRASONIC USFD TESTING">ULTRASONIC USFD TESTING</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">WORK DESCRIPTION</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">REQUESTED DATE</label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">DURATION (MINUTES)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={15}
                max={360}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">REQUESTED START TIME</label>
              <input
                type="time"
                value={requestedStartTime}
                onChange={(e) => setRequestedStartTime(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">REQUESTED END TIME</label>
              <input
                type="time"
                value={requestedEndTime}
                onChange={(e) => setRequestedEndTime(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PRIORITY</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="CRITICAL">CRITICAL (G&SR Statutory)</option>
                <option value="HIGH">HIGH (Preventive Schedule)</option>
                <option value="MEDIUM">MEDIUM (Standard Cycle)</option>
                <option value="LOW">LOW (Opportunistic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">ASSET CRITICALITY</label>
              <select
                value={assetCriticality}
                onChange={(e) => setAssetCriticality(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="Tier-1">Tier-1 (High-speed passenger trunk)</option>
                <option value="Tier-2">Tier-2 (Branch corridor)</option>
                <option value="Tier-3">Tier-3 (Yard / Stabling line)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">OPERATIONAL JUSTIFICATION / REASON</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Ultrasonic flaw testing indicated high localized rail stress"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Direct ingestion into RailOps Central Intelligence Hub (Panel 2)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800 border border-slate-700"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? 'TRANSMITTING...' : 'TRANSMIT BLOCK REQUISITION'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
