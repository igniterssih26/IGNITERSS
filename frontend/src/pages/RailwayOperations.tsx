import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, X, Clock, AlertTriangle, FileText,
  Send, UserCheck, Train, Shield, Zap, ChevronDown, Eye
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { KpiCard } from '../components/ui/KpiCard';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const APPROVAL_QUEUE = [
  { blkId: 'BLK-2026-047', reqId: 'REQ-0142', dept: 'Engineering', segment: 'A-B', asset: 'Rail Joint AJ-204', window: 'Thu 18:00–20:00', duration: '2h', priority: 'HIGH', impact: 'LOW', score: 94, status: 'PENDING' },
  { blkId: 'BLK-2026-046', reqId: 'REQ-0141', dept: 'TRD', segment: 'B-C', asset: 'OHE Wire OE-118', window: 'Mon 10:00–12:00', duration: '2h', priority: 'MEDIUM', impact: 'LOW', score: 87, status: 'PENDING' },
  { blkId: 'BLK-2026-045', reqId: 'REQ-0140', dept: 'S&T', segment: 'C-D', asset: 'Signal Box SB-07', window: 'Tue 06:00–08:00', duration: '2h', priority: 'HIGH', impact: 'MEDIUM', score: 78, status: 'PENDING' },
  { blkId: 'BLK-2026-044', reqId: 'REQ-0138', dept: 'Engineering', segment: 'A-B', asset: 'Bridge BR-11', window: 'Wed 08:00–10:00', duration: '2h', priority: 'EMERGENCY', impact: 'HIGH', score: 65, status: 'PENDING' },
  { blkId: 'BLK-2026-043', reqId: 'REQ-0136', dept: 'TRD', segment: 'B-C', asset: 'Substation SS-02', window: 'Mon 12:00–14:00', duration: '2h', priority: 'MEDIUM', impact: 'LOW', score: 91, status: 'PENDING' },
];

const POSSESSIONS = [
  { posId: 'POS-0031', blkId: 'BLK-2026-039', segment: 'A-B', dept: 'Engineering', start: '06:00', end: '08:00', status: 'ACTIVE', personnel: 12 },
  { posId: 'POS-0030', blkId: 'BLK-2026-038', segment: 'B-C', dept: 'TRD', start: '04:00', end: '06:00', status: 'COMPLETED', personnel: 8 },
  { posId: 'POS-0029', blkId: 'BLK-2026-037', segment: 'C-D', dept: 'S&T', start: '02:00', end: '04:00', status: 'COMPLETED', personnel: 6 },
];

const DISPATCH_UNITS = [
  { icon: UserCheck, role: 'Station Master', entity: 'Chennai Central', status: 'SENT', time: '18:05' },
  { icon: Train, role: 'Loco Pilot', entity: 'Train 12678', status: 'SENT', time: '18:05' },
  { icon: Shield, role: 'Guard', entity: 'Train 12678', status: 'SENT', time: '18:06' },
  { icon: FileText, role: 'Section Controller', entity: 'Chennai Division', status: 'SENT', time: '18:06' },
  { icon: Zap, role: 'TRD Staff', entity: 'Maintenance Crew', status: 'PENDING', time: '—' },
  { icon: AlertTriangle, role: 'S&T Staff', entity: 'Signal Team', status: 'PENDING', time: '—' },
];

const BLOCK_REGISTER = [
  { id: 'BLK-2026-039', date: '25 Sep 2026', segment: 'A-B', dept: 'Engineering', window: '06:00–08:00', duration: '2h', status: 'ACTIVE', approvedBy: 'DRM Chennai', approvedAt: '25 Sep 01:30' },
  { id: 'BLK-2026-038', date: '25 Sep 2026', segment: 'B-C', dept: 'TRD', window: '04:00–06:00', duration: '2h', status: 'COMPLETED', approvedBy: 'DRM Chennai', approvedAt: '24 Sep 23:00' },
  { id: 'BLK-2026-037', date: '25 Sep 2026', segment: 'C-D', dept: 'S&T', window: '02:00–04:00', duration: '2h', status: 'COMPLETED', approvedBy: 'ADSTE', approvedAt: '24 Sep 21:00' },
  { id: 'BLK-2026-036', date: '24 Sep 2026', segment: 'D-E', dept: 'Engineering', window: '18:00–20:00', duration: '2h', status: 'COMPLETED', approvedBy: 'DRM Chennai', approvedAt: '24 Sep 16:00' },
  { id: 'BLK-2026-035', date: '23 Sep 2026', segment: 'E-F', dept: 'S&T', window: '20:00–22:00', duration: '2h', status: 'COMPLETED', approvedBy: 'ADSTE', approvedAt: '23 Sep 18:00' },
  { id: 'BLK-2026-034', date: '22 Sep 2026', segment: 'A-B', dept: 'Engineering', window: '08:00–10:00', duration: '2h', status: 'COMPLETED', approvedBy: 'DRM Chennai', approvedAt: '22 Sep 06:00' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function RailwayOperations() {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [approveTarget, setApproveTarget] = useState<typeof APPROVAL_QUEUE[0] | null>(null);
  const [modifyTarget, setModifyTarget] = useState<typeof APPROVAL_QUEUE[0] | null>(null);
  const [rejectTarget, setRejectTarget] = useState<typeof APPROVAL_QUEUE[0] | null>(null);
  const [completeTarget, setCompleteTarget] = useState<typeof POSSESSIONS[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [possessionStatuses, setPossessionStatuses] = useState<Record<string, string>>({});
  const [modifyTime, setModifyTime] = useState('');
  const [incomingBlock, setIncomingBlock] = useState<any>(null);
  const [approvedBlock, setApprovedBlock] = useState<string | null>(null);

  useEffect(() => {
    // Load incoming block from Central Intelligence
    const raw = localStorage.getItem('railops_workflow');
    if (raw) {
      const wf = JSON.parse(raw);
      if (wf.stage === 'APPROVAL' && wf.recommendation && !wf.operationsApproved) {
        setIncomingBlock({ blkId: 'BLK-2026-047', reqId: 'REQ-NEW', dept: wf.request?.dept || 'Engineering', segment: wf.request?.segment || 'A-B', asset: wf.request?.asset || '—', window: wf.recommendation.window, duration: '2h', priority: wf.recommendation.priority, impact: wf.recommendation.impact, score: 94, status: 'PENDING' });
      }
    }
  }, []);

  const handleApprove = (blk: typeof APPROVAL_QUEUE[0] | any) => {
    setStatuses(prev => ({ ...prev, [blk.blkId]: 'APPROVED' }));
    setApproveTarget(null);
    setApprovedBlock(blk.blkId);
    // Save workflow progress and navigate to Railway Stations
    const raw = localStorage.getItem('railops_workflow');
    const wf = raw ? JSON.parse(raw) : {};
    localStorage.setItem('railops_workflow', JSON.stringify({
      ...wf,
      stage: 'POSSESSION',
      operationsApproved: true,
      approvedBlock: blk.blkId,
      approvedWindow: blk.window,
      approvedSegment: blk.segment,
      approvedDept: blk.dept,
      operationsApprovedAt: new Date().toISOString(),
    }));
    setTimeout(() => navigate('/stations'), 1500);
  };
  const handleReject = (blk: typeof APPROVAL_QUEUE[0]) => {
    setStatuses(prev => ({ ...prev, [blk.blkId]: 'REJECTED' }));
    setRejectTarget(null);
    setRejectReason('');
  };
  const handleModify = (blk: typeof APPROVAL_QUEUE[0]) => {
    setStatuses(prev => ({ ...prev, [blk.blkId]: 'MODIFIED' }));
    setModifyTarget(null);
  };
  const handleComplete = (pos: typeof POSSESSIONS[0]) => {
    setPossessionStatuses(prev => ({ ...prev, [pos.posId]: 'COMPLETED' }));
    setCompleteTarget(null);
    setCompletionNotes('');
  };

  const pendingCount = APPROVAL_QUEUE.filter(b => !statuses[b.blkId]).length;
  const approvedCount = Object.values(statuses).filter(s => s === 'APPROVED').length;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900">RAILWAY OPERATIONS</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Block approval, possession management and downstream dispatch</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Pending Approval" value={pendingCount} color="amber" icon={Clock} />
        <KpiCard label="Approved Today" value={approvedCount} color="green" icon={CheckCircle} />
        <KpiCard label="Active Possessions" value="1" color="blue" icon={AlertTriangle} />
        <KpiCard label="Dispatches Sent" value="4" color="default" icon={Send} />
      </div>

      {/* ── APPROVAL QUEUE ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Pending Approval Queue</h3>
          <span className="text-[10px] font-mono text-zinc-400">{pendingCount} awaiting authority decision</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Block ID', 'Request', 'Department', 'Segment', 'Asset', 'Rec. Window', 'Dur.', 'Priority', 'Impact', 'AI Score', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPROVAL_QUEUE.map((blk, i) => {
                const s = statuses[blk.blkId] || 'PENDING';
                return (
                  <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-xs font-bold text-zinc-900">{blk.blkId}</td>
                    <td className="px-3 py-3 font-mono text-xs text-blue-600">{blk.reqId}</td>
                    <td className="px-3 py-3 text-xs text-zinc-700">{blk.dept}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-zinc-700">{blk.segment}</td>
                    <td className="px-3 py-3 font-mono text-xs text-zinc-600">{blk.asset}</td>
                    <td className="px-3 py-3 font-mono text-xs text-zinc-700">{blk.window}</td>
                    <td className="px-3 py-3 text-xs text-zinc-600">{blk.duration}</td>
                    <td className="px-3 py-3"><Badge status={blk.priority}>{blk.priority}</Badge></td>
                    <td className="px-3 py-3"><Badge status={blk.impact}>{blk.impact}</Badge></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-zinc-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${blk.score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-700">{blk.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {s !== 'PENDING' ? (
                        <Badge status={s}>{s}</Badge>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setApproveTarget(blk)} className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold border-2 border-green-600 hover:bg-white hover:text-green-600 transition-colors cursor-pointer">✓</button>
                          <button onClick={() => setModifyTarget(blk)} className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold border-2 border-amber-500 hover:bg-white hover:text-amber-600 transition-colors cursor-pointer">✎</button>
                          <button onClick={() => setRejectTarget(blk)} className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold border-2 border-red-600 hover:bg-white hover:text-red-600 transition-colors cursor-pointer">✗</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ACTIVE POSSESSIONS ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Active Possessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Possession ID', 'Block', 'Segment', 'Department', 'Start', 'End', 'Status', 'Personnel', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POSSESSIONS.map((pos, i) => {
                const s = possessionStatuses[pos.posId] || pos.status;
                return (
                  <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-900">{pos.posId}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{pos.blkId}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{pos.segment}</td>
                    <td className="px-4 py-3 text-xs text-zinc-700">{pos.dept}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">{pos.start}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">{pos.end}</td>
                    <td className="px-4 py-3"><Badge status={s}>{s}</Badge></td>
                    <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{pos.personnel}</td>
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      {s === 'ACTIVE' && (
                        <button onClick={() => setCompleteTarget(pos)} className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-bold border-2 border-green-600 hover:bg-white hover:text-green-600 transition-colors cursor-pointer">Complete</button>
                      )}
                      <button className="px-2.5 py-1 border border-zinc-300 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1"><Eye size={10} /> View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DOWNSTREAM DISPATCH ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Downstream Dispatch Notifications</h3>
          <span className="text-[10px] text-zinc-400">Auto-sent upon approval · BLK-2026-039</span>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DISPATCH_UNITS.map((unit, i) => (
            <div key={i} className={`p-3 border-2 ${unit.status === 'SENT' ? 'border-green-200 bg-green-50' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="p-1.5 bg-zinc-900">
                  <unit.icon size={14} className="text-white" />
                </div>
                <Badge status={unit.status === 'SENT' ? 'APPROVED' : 'PENDING'}>{unit.status}</Badge>
              </div>
              <div className="text-xs font-black text-zinc-900">{unit.role}</div>
              <div className="text-[10px] text-zinc-500">{unit.entity}</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">{unit.time !== '—' ? `Sent at ${unit.time}` : 'Pending...'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BLOCK REGISTER ── */}
      <div className="bg-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]">
        <div className="px-4 py-3 border-b-2 border-zinc-900 bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">Block Register</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-zinc-600 text-zinc-300 text-[10px] font-bold uppercase hover:bg-zinc-700 transition-colors cursor-pointer">Export CSV</button>
            <button className="px-3 py-1.5 border border-zinc-600 text-zinc-300 text-[10px] font-bold uppercase hover:bg-zinc-700 transition-colors cursor-pointer">Print</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {['Block ID', 'Date', 'Segment', 'Department', 'Window', 'Duration', 'Status', 'Approved By', 'Approved At'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOCK_REGISTER.map((blk, i) => (
                <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-900">{blk.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{blk.date}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{blk.segment}</td>
                  <td className="px-4 py-3 text-xs text-zinc-700">{blk.dept}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600">{blk.window}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{blk.duration}</td>
                  <td className="px-4 py-3"><Badge status={blk.status}>{blk.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-zinc-600">{blk.approvedBy}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{blk.approvedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── APPROVE MODAL ── */}
      {approveTarget && (
        <Modal open={!!approveTarget} onClose={() => setApproveTarget(null)} title="Confirm Block Approval" subtitle={`${approveTarget.blkId} — ${approveTarget.reqId}`} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Block', v: approveTarget.blkId }, { l: 'Request', v: approveTarget.reqId },
                { l: 'Segment', v: approveTarget.segment }, { l: 'Window', v: approveTarget.window },
                { l: 'Priority', v: <Badge status={approveTarget.priority}>{approveTarget.priority}</Badge> },
                { l: 'Impact', v: <Badge status={approveTarget.impact}>{approveTarget.impact}</Badge> },
              ].map((item, i) => (
                <div key={i} className="p-2.5 bg-zinc-50 border border-zinc-200">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{item.l}</p>
                  <div className="text-xs font-semibold text-zinc-800 font-mono">{item.v}</div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-green-50 border border-green-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-1">Downstream Dispatch Preview</p>
              <p className="text-xs text-green-700">Upon approval, 6 units will be automatically notified: Station Master, Loco Pilot, Guard, Section Controller, TRD Staff, S&T Staff.</p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setApproveTarget(null)}>Cancel</Button>
              <Button variant="success" onClick={() => handleApprove(approveTarget)}><CheckCircle size={13} /> Confirm Approval</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODIFY MODAL ── */}
      {modifyTarget && (
        <Modal open={!!modifyTarget} onClose={() => setModifyTarget(null)} title="Modify Block" subtitle={modifyTarget.blkId} size="md">
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-700">Modifying will re-run the planning analysis with the new parameters.</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">New Start Time</label>
                <input type="time" value={modifyTime} onChange={e => setModifyTime(e.target.value)} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Duration</label>
                <select className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['1 hour', '2 hours', '3 hours', '4 hours'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Reason for Modification</label>
              <textarea rows={2} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none resize-none" placeholder="Reason..." />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setModifyTarget(null)}>Cancel</Button>
              <Button onClick={() => handleModify(modifyTarget)}>Save Modification</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectTarget && (
        <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Block" subtitle={rejectTarget.blkId} size="sm">
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">This will reject the maintenance block and notify the requesting department.</div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Rejection Reason *</label>
              <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none resize-none" placeholder="State reason for rejection..." />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleReject(rejectTarget)} disabled={!rejectReason.trim()}><X size={13} /> Confirm Reject</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── COMPLETE POSSESSION MODAL ── */}
      {completeTarget && (
        <Modal open={!!completeTarget} onClose={() => setCompleteTarget(null)} title="Complete Possession" subtitle={completeTarget.posId} size="sm">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Actual End Time</label>
                <input type="time" className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Condition After</label>
                <select className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none bg-white cursor-pointer">
                  {['Good', 'Fair', 'Needs Attention', 'Poor'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Work Done</label>
              <textarea rows={3} value={completionNotes} onChange={e => setCompletionNotes(e.target.value)} className="w-full border-2 border-zinc-900 px-3 py-2 text-sm outline-none resize-none" placeholder="Describe work done..." />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button variant="secondary" onClick={() => setCompleteTarget(null)}>Cancel</Button>
              <Button variant="success" onClick={() => handleComplete(completeTarget)}><CheckCircle size={13} /> Mark Complete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
