// Reusable ChartCard Component for SMARTORA
import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = ''
}) {
  return (
    <div className={`bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {title}
            </h3>
            {badge && <span>{badge}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 self-end sm:self-auto">{actions}</div>}
      </div>

      <div className="w-full relative">
        {children}
      </div>
    </div>
  );
}
