import React, { useState } from 'react';
import { Compass, Train, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface Props {
  onOptimizeClick: (requestId: string) => void;
}

export const GeospatialVectorMap: React.FC<Props> = ({ onOptimizeClick }) => {
  const [selectedSection, setSelectedSection] = useState<'SALEM_ERODE' | 'CHENNAI_ARAKKONAM' | 'ERODE_COIMBATORE'>('SALEM_ERODE');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 flex flex-col justify-between railway-hud-grid relative overflow-hidden">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-sm bg-emerald-400"></span>
            <span className="font-hud text-xs font-bold uppercase tracking-wider text-slate-200">
              LIVE RAILWAY NETWORK // REAL-TIME GEOSPATIAL VECTOR MAP
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            GRID: SOUTH CORRIDOR (11°00'N 78°00'E) | TRACK MONITORED: 840 KM
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 text-sky-400 animate-spin" />
            GPS / SCADA ACTIVE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">SCALE: 1:250000</span>
        </div>
      </div>

      {/* Vector Line Schematic Canvas */}
      <div className="relative py-6 min-h-[300px] flex items-center justify-center">
        <svg viewBox="0 0 880 260" className="w-full h-auto max-h-[320px] select-none">
          {/* Grid lines background */}
          <defs>
            <linearGradient id="opLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="blockLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Track 1: Chennai (MAS) to Arakkonam (AJJ) - Conflict Red Line */}
          <line x1="70" y1="90" x2="190" y2="90" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <text x="130" y="80" fill="#ef4444" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CLASH: AJJ</text>

          {/* Track 2: Arakkonam to Salem - Green Operational Track */}
          <path d="M 190 90 L 260 110 L 320 125" stroke="#10b981" strokeWidth="5" fill="none" />

          {/* Track 3: Salem (SA) to Erode (ED) - Maintenance Block Section (Orange Glow) */}
          <line
            x1="320" y1="125" x2="440" y2="125"
            stroke="#f97316" strokeWidth="8" strokeLinecap="round"
            filter="url(#glowOrange)"
            className="cursor-pointer"
            onClick={() => setSelectedSection('SALEM_ERODE')}
          />
          <text x="380" y="115" fill="#f97316" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            MNT BLK (KM 334-396)
          </text>

          {/* Loop Line / Alt Route via Salem Loop (Dashed Yellow) */}
          <path
            d="M 320 125 C 340 155, 420 155, 440 125"
            stroke="#eab308" strokeWidth="3" strokeDasharray="4,4" fill="none"
          />
          <text x="380" y="165" fill="#eab308" fontSize="8" fontFamily="monospace" textAnchor="middle">
            ALT ROUTE (LOOP)
          </text>

          {/* Track 4: Erode to Tiruppur & Coimbatore - Green Operational */}
          <path d="M 440 125 L 530 100 L 610 100" stroke="#10b981" strokeWidth="5" fill="none" />

          {/* Branch: Salem to Karur & Trichy (TPJ) to Madurai (MDU) */}
          <path d="M 320 125 L 360 170 L 490 170 L 590 170" stroke="#10b981" strokeWidth="4" fill="none" />

          {/* Station Nodes */}
          {/* Chennai Central */}
          <circle cx="70" cy="90" r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <text x="70" y="70" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            CHENNAI (MAS)
          </text>
          <text x="70" y="108" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">KM 0.0</text>

          {/* Arakkonam */}
          <circle cx="190" cy="90" r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <text x="190" y="70" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            ARAKKONAM (AJJ)
          </text>

          {/* Salem Junction */}
          <circle
            cx="320" cy="125" r="7" fill="#ffffff" stroke="#f97316" strokeWidth="3"
            className="cursor-pointer"
            onClick={() => setSelectedSection('SALEM_ERODE')}
          />
          <text x="305" y="145" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            SALEM (SA)
          </text>

          {/* Erode Junction */}
          <circle
            cx="440" cy="125" r="7" fill="#ffffff" stroke="#f97316" strokeWidth="3"
            className="cursor-pointer"
            onClick={() => setSelectedSection('SALEM_ERODE')}
          />
          <text x="455" y="145" fill="#ffffff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            ERODE (ED)
          </text>

          {/* Tiruppur */}
          <circle cx="530" cy="100" r="5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          <text x="530" y="85" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            TIRUPPUR (TUP)
          </text>

          {/* Coimbatore */}
          <circle cx="610" cy="100" r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <text x="610" y="85" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            COIMBATORE (CBE)
          </text>

          {/* Trichy */}
          <circle cx="490" cy="170" r="5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
          <text x="490" y="190" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            TRICHY (TPJ)
          </text>

          {/* Madurai */}
          <circle cx="590" cy="170" r="6" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
          <text x="590" y="190" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            MADURAI (MDU)
          </text>

          {/* Real-time Moving Trains */}
          {/* Train 12691 in Alert near Arakkonam */}
          <g transform="translate(235, 100)">
            <rect x="0" y="-12" width="68" height="18" rx="3" fill="#991b1b" stroke="#f87171" strokeWidth="1" />
            <text x="34" y="0" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              TR-12691 [ALERT]
            </text>
            <circle cx="0" cy="-3" r="3" fill="#38bdf8" />
          </g>

          {/* Freight Train 0942 in Loop */}
          <g transform="translate(350, 138)">
            <rect x="0" y="-10" width="62" height="16" rx="3" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
            <text x="31" y="1" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              MNT-0942 [LOOP]
            </text>
          </g>

          {/* Inspected Section Tooltip Badge */}
          <g transform="translate(370, 85)">
            <rect x="0" y="0" width="120" height="24" rx="3" fill="#1e293b" stroke="#f97316" strokeWidth="1" />
            <text x="60" y="11" fill="#f97316" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              CLICK: SALEM-ERODE SECTION
            </text>
            <text x="60" y="20" fill="#e2e8f0" fontSize="7" fontFamily="monospace" textAnchor="middle">
              BLOCK BR-2026-0142 ACTIVE
            </text>
          </g>
        </svg>

        {/* Inspected Section HUD Overlay Box (Matching Screenshot 3) */}
        <div className="absolute bottom-2 left-2 bg-slate-900/95 border-2 border-amber-600/80 rounded-lg p-3 text-xs font-mono shadow-2xl max-w-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
            <span className="font-bold text-amber-400">INSPECTED SECTION: SALEM - ERODE</span>
            <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-300">KM 334 - 396</span>
          </div>

          <div className="mt-2 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">STATUS:</span>
              <span className="text-amber-400 font-bold">MAINTENANCE BLOCK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">BLOCK REF:</span>
              <span className="text-sky-400 font-bold">BR-2026-0142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DURATION:</span>
              <span className="text-slate-200">11:30 - 13:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TRAINS AFFECTED:</span>
              <span className="text-rose-400 font-bold">03 TRAINS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CONFLICT:</span>
              <span className="text-rose-400 font-bold">YES (PEAK PASSENGER)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ALT ROUTE:</span>
              <span className="text-emerald-400 font-semibold">AVAILABLE (VIA LOOP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IMPACT:</span>
              <span className="text-amber-400">18 MIN ESTIMATED DELAY</span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => onOptimizeClick('BR-2026-0142')}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-[11px] font-mono flex items-center gap-1 shadow transition-colors"
            >
              [OPTIMIZE NOW →]
            </button>
          </div>
        </div>
      </div>

      {/* Map Legend Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-emerald-500 rounded-sm"></span> GREEN: OPERATIONAL TRACK
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-sky-500 rounded-sm"></span> BLUE: ACTIVE TRAIN
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-amber-500 rounded-sm"></span> ORANGE: PLANNED BLOCK
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-rose-600 rounded-sm"></span> RED: CONFLICT / UNAVAILABLE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 bg-yellow-400 rounded-sm border border-dashed border-slate-900"></span> YELLOW: ALT ROUTE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white"></span> WHITE: STATION / JCT
          </span>
        </div>

        <div className="text-slate-500">
          VECTOR REFRESH: REALTIME GPS/SCADA
        </div>
      </div>
    </div>
  );
};
