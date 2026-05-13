"use client";

import { useAuth } from "@/context/AuthContext";

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
      return "Ready to hire top talent across India today?";
    }
    return "Ready to land your next tech role in India?";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-emerald-300/20 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-200 mb-2">{indiaDate} • IST</p>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.fullName?.split(' ')[0]}! Namaste 🙏
          </h1>
          <p className="text-blue-100 text-lg mb-4">
            {getWelcomeMessage()}
          </p>
          
          {user?.role === 'partner' && stats && (
            <div className="flex items-center space-x-6">
              {stats.isOnline !== undefined && (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${stats.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm">
                    {stats.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              )}
              {stats.averageRating && (
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-1">⭐</span>
                  <span className="text-sm">{stats.averageRating.toFixed(1)} rating</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
            <span className="text-6xl">
              {user?.role === 'partner' ? '🏢' : '🚀'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats for mobile */}
      {user?.role === 'partner' && stats && (
        <div className="lg:hidden mt-4 flex space-x-4">
          {stats.isOnline !== undefined && (
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${stats.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm">{stats.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          )}
          {stats.averageRating && (
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
              <span className="text-yellow-300 mr-1 text-sm">⭐</span>
              <span className="text-sm">{stats.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}