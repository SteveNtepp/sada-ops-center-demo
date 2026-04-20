import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  trend?: number;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'yellow';
  pulse?: boolean;
}

const colorMap = {
  orange: { bg: 'rgba(249,115,22,0.08)', icon: '#F97316', text: '#F97316' },
  blue: { bg: 'rgba(37,99,235,0.08)', icon: '#2563EB', text: '#2563EB' },
  green: { bg: 'rgba(34,197,94,0.08)', icon: '#22C55E', text: '#22C55E' },
  red: { bg: 'rgba(239,68,68,0.08)', icon: '#EF4444', text: '#EF4444' },
  yellow: { bg: 'rgba(245,158,11,0.08)', icon: '#F59E0B', text: '#F59E0B' },
};

export default function KPICard({ label, value, sub, icon, trend, color = 'orange', pulse }: KPICardProps) {
  const c = colorMap[color];

  return (
    <div className="card p-5 flex flex-col gap-3 relative overflow-hidden animate-fade-in">
      {pulse && (
        <div className="absolute top-3 right-3 w-2 h-2">
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: c.text }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: c.text }} />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        {icon && (
          <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: c.bg }}>
            <span style={{ color: c.icon }}>{icon}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
        </div>
      </div>

      {(sub || trend !== undefined) && (
        <div className="flex items-center gap-2">
          {trend !== undefined && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-green-600 bg-green-50 dark:bg-green-500/10' : 'text-red-500 bg-red-50 dark:bg-red-500/10'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {sub && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
      )}

      {/* Decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, ${c.text}, transparent)` }} />
    </div>
  );
}
