"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  color = 'blue' 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    purple: 'bg-slate-900 text-white border border-slate-700',
    orange: 'bg-orange-50 text-orange-700 border border-orange-100',
    red: 'bg-rose-50 text-rose-700 border border-rose-100'
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-serif font-bold text-slate-900 mt-2">{value}</p>
          {description && (
            <p className="text-slate-500 text-xs mt-2">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-3 bg-slate-50 w-fit px-2 py-1 rounded">
              <span className={`text-xs font-bold ${
                trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-500 text-xs ml-2 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${colorClasses[color]} shadow-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
