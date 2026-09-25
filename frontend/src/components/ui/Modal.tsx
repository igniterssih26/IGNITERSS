import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, subtitle, children, size = 'md' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl', full: 'max-w-7xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full ${sizeClass} bg-white border-2 border-zinc-900 shadow-[5px_5px_0px_#18181B] max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between p-4 border-b-2 border-zinc-900 bg-zinc-900 text-white flex-shrink-0">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">{title}</h2>
            {subtitle && <p className="text-zinc-400 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors ml-4">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}
