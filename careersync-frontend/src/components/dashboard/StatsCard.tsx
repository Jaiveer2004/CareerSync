"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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
    blue: 'bg-blue-50/60 text-blue-600 border border-blue-100/50',
    green: 'bg-emerald-50/60 text-emerald-600 border border-emerald-100/50',
    purple: 'bg-indigo-50/60 text-indigo-600 border border-indigo-100/50',
    orange: 'bg-orange-50/60 text-orange-600 border border-orange-100/50',
    red: 'bg-rose-50/60 text-rose-600 border border-rose-100/50'
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-sans tracking-tight">{value}</p>
          {description && (
            <p className="text-slate-400 text-xs mt-2.5 font-medium">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-3 bg-slate-50 w-fit px-2 py-1 rounded border border-slate-100">
              <span className={`text-xs font-bold flex items-center gap-0.5 ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-400 text-xs ml-1.5 font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]} shadow-sm group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

