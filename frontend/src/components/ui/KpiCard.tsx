import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function KpiCard({ label, value, sub, trend, trendValue, color = 'default', icon: Icon }: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  color?: 'default' | 'blue' | 'red' | 'green' | 'amber';
  icon?: React.ElementType;
}) {
  const colorMap = {
    default: 'bg-white',
    blue: 'bg-blue-50',
    red: 'bg-red-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50',
  };
  const iconColorMap = {
    default: 'bg-zinc-900 text-white',
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white',
    green: 'bg-green-600 text-white',
    amber: 'bg-amber-500 text-white',
  };
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-zinc-500';

  return (
    <div className={`p-4 border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
          <p className="text-3xl font-black text-zinc-900 leading-none">{value}</p>
          {sub && <p className="text-xs text-zinc-500 mt-1 truncate">{sub}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-1.5 ${trendColor}`}>
              <TrendIcon size={12} />
              <span className="text-xs font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2 flex-shrink-0 ml-2 ${iconColorMap[color]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
