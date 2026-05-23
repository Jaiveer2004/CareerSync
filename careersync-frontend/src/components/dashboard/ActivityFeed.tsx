"use client";

import React from "react";
import { Calendar, Briefcase, Star, CreditCard, Clipboard, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'booking' | 'service' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
  icon?: React.ReactNode;
  status?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const s = status.toLowerCase();

    if (['shortlisted', 'interview', 'completed', 'active'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-2.5 h-2.5" />
          {status}
        </span>
      );
    }
    if (['applied', 'reviewing', 'pending'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          {status}
        </span>
      );
    }
    if (['rejected', 'cancelled'].includes(s)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
          <XCircle className="w-2.5 h-2.5" />
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-700 border border-slate-100">
        <AlertCircle className="w-2.5 h-2.5" />
        {status}
      </span>
    );
  };

  const getDefaultIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'service':
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" fill="currentColor" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      default:
        return <Clipboard className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
        <span className="text-xs font-semibold text-slate-400">Live Timeline</span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
          <Clipboard className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-semibold">No recent activity logs</p>
          <p className="text-slate-400 text-xs mt-1">Real-time application milestones will appear here</p>
        </div>
      ) : (
        <div className="relative pl-4 border-l border-slate-200 space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="relative group">
              {/* Dot Indicator */}
              <div className="absolute -left-[24.5px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 group-hover:border-indigo-600 group-hover:scale-110 transition-all flex items-center justify-center shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-slate-50/40 hover:bg-slate-50/90 border border-slate-100 hover:border-slate-200/80 p-4 rounded-xl transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200/50 flex items-center justify-center shadow-inner">
                    {activity.icon || getDefaultIcon(activity.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {activity.title}
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-end gap-2 flex-shrink-0 justify-between sm:justify-start">
                  {activity.status && getStatusBadge(activity.status)}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}