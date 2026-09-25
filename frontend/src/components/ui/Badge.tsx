import React from 'react';

type Variant = 'default' | 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'cyan' | 'outline';

const variants: Record<Variant, string> = {
  default: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  outline: 'bg-white text-zinc-700 border-zinc-400',
};

const statusMap: Record<string, Variant> = {
  REQUESTED: 'default', ANALYZING: 'blue', RECOMMENDED: 'purple',
  APPROVED: 'green', REJECTED: 'red', ACTIVE: 'amber', COMPLETED: 'green',
  HIGH: 'red', MEDIUM: 'amber', LOW: 'green', NORMAL: 'default',
  EMERGENCY: 'red', CRITICAL: 'red', PENDING: 'amber',
  MODIFIED: 'purple', EXECUTING: 'cyan', OVERDUE: 'red',
  'ON TIME': 'green', DELAYED: 'red', RESCHEDULED: 'amber',
  SENT: 'green', WAITING: 'amber', CONFLICT: 'red', FEASIBLE: 'green',
  RUNNING: 'blue', COMPLETE: 'green', WARNING: 'amber',
};

export function Badge({ children, variant, status, className = '' }: {
  children: React.ReactNode;
  variant?: Variant;
  status?: string;
  className?: string;
}) {
  const v = variant || (status ? statusMap[status] || 'default' : 'default');
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm ${variants[v]} ${className}`}>
      {children}
    </span>
  );
}
