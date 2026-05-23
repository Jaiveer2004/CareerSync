"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, Briefcase, UserCheck } from "lucide-react";

interface WelcomeBannerProps {
  stats?: {
    totalBookings?: number;
    totalServices?: number;
    averageRating?: number;
    isOnline?: boolean;
  };
}

export function WelcomeBanner({ stats }: WelcomeBannerProps) {
  const { user } = useAuth();
  
  const indiaDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getWelcomeMessage = () => {
    if (user?.role === 'partner') {
      return "Ready to hire top tech talent across India today?";
    }
    return "Explore open technical roles and track your direct job matches.";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 text-white border border-slate-800 shadow-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/5 blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {indiaDate} • IST
            </span>
            {user?.role === 'partner' && stats?.isOnline && (
              <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active Recruiter
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.fullName?.split(' ')[0]}! Namaste 🙏
          </h1>
          <p className="text-slate-300 text-base max-w-xl">
            {getWelcomeMessage()}
          </p>
          
          {user?.role === 'partner' && stats && (
            <div className="flex items-center space-x-6 pt-2">
              {stats.isOnline !== undefined && (
                <div className="flex items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                  <span className="text-sm font-semibold text-slate-200">
                    Recruiter Status: {stats.isOnline ? 'Active' : 'Offline'}
                  </span>
                </div>
              )}
              {stats.averageRating ? (
                <div className="flex items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
                  <span className="text-yellow-400 mr-1.5 text-sm">⭐</span>
                  <span className="text-sm font-semibold text-slate-200">{stats.averageRating.toFixed(1)} Rating</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
        
        <div className="hidden md:block">
          <div className="w-28 h-28 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner group hover:scale-105 transition-transform duration-300">
            {user?.role === 'partner' ? (
              <Briefcase className="w-12 h-12 text-indigo-400" />
            ) : (
              <UserCheck className="w-12 h-12 text-emerald-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}