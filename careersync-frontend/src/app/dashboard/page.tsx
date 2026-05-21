"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PartnerStatusToggle } from "@/components/partner/PartnerStatusToggle";
import { getDashboardStats } from "@/services/apiService";
import Skeleton from "react-loading-skeleton";

interface DashboardStats {
  // Customer stats
  totalBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  totalSpent?: number;
  
  // Partner stats
  totalServices?: number;
  activeServices?: number;
  totalEarnings?: number;
  totalReviews?: number;
  averageRating?: number;
  isOnline?: boolean;
}

const toAmount = (value: number | string | undefined, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(normalized)) return normalized;
  }
  return fallback;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string | undefined, fallback = 0) => {
    const parsedAmount = toAmount(amount, fallback);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parsedAmount);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Mock activity data for now - would normally come from backend
  const recentActivity = [
    {
      id: '1',
      type: 'booking' as const,
      title: 'Frontend Engineer application sent to Bengaluru startup',
      description: 'Your profile was shortlisted for the first technical round.',
      time: '2 hrs ago',
      icon: '🚀',
      status: 'pending' as const
    },
    {
      id: '2',
      type: 'review' as const,
      title: 'Resume updated with latest React project',
      description: 'Hiring teams can now see your updated portfolio and skills.',
      time: '1 day ago',
      icon: '🏢',
      status: 'completed' as const
    }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gradient-to-b from-orange-50/40 via-white to-emerald-50/40">
          <WelcomeBanner stats={stats || undefined} />

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <Skeleton count={2} />
                  <Skeleton className="mt-4" height={32} width={80} />
                </div>
              ))
            ) : stats ? (
              user?.role === 'customer' ? (
                // Candidate stats
                <>
                  <StatsCard
                    title="Active Applications"
                    value={formatNumber(stats.totalBookings || 0)}
                    icon="📋"
                    description="Total applications sent"
                    color="blue"
                  />
                  <StatsCard
                    title="In Review"
                    value={formatNumber(stats.pendingBookings || 0)}
                    icon="⏳"
                    description="Companies reviewing now"
                    color="orange"
                  />
                  <StatsCard
                    title="Offers Received"
                    value={formatNumber(stats.completedBookings || 0)}
                    icon="✅"
                    description="Confirmed interview outcomes"
                    color="green"
                  />
                  <StatsCard
                    title="Expected CTC"
                    value={formatCurrency(stats.totalSpent, 1200000)}
                    icon="💰"
                    description="Annual salary target in INR"
                    color="purple"
                  />
                </>
              ) : (
                // Company / Partner stats
                <>
                  <StatsCard
                    title="Total Job Postings"
                    value={formatNumber(stats.totalServices || 0)}
                    icon="📋"
                    description={`${formatNumber(stats.activeServices || 0)} active roles`}
                    color="blue"
                  />
                  <StatsCard
                    title="Total Applicants"
                    value={formatNumber(stats.totalBookings || 0)}
                    icon="👥"
                    description={`${formatNumber(stats.completedBookings || 0)} screened`}
                    color="green"
                  />
                  <StatsCard
                    title="Total Hiring Budget"
                    value={formatCurrency(stats.totalEarnings, 5000000)}
                    icon="💰"
                    description="Allocated annual compensation in INR"
                    color="purple"
                  />
                  <StatsCard
                    title="Response Rating"
                    value={stats.averageRating ? `${stats.averageRating.toFixed(1)} ⭐` : 'No ratings'}
                    icon="⭐"
                    description="Candidate feedback"
                    color="orange"
                  />
                </>
              )
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { city: 'Bengaluru', role: 'Frontend', demand: 'High demand' },
              { city: 'Hyderabad', role: 'Full Stack', demand: 'Fast growing' },
              { city: 'Pune', role: 'Backend', demand: 'Consistent hiring' },
            ].map((item) => (
              <div key={item.city} className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">India Job Pulse</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{item.city}</p>
                <p className="text-sm text-slate-600 mt-1">{item.role} roles: {item.demand}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ActivityFeed activities={recentActivity} />
            </div>
            <div className="space-y-8">
              {user?.role === 'partner' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-6">Recruitment Status</h3>
                  <PartnerStatusToggle />
                  <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                    Toggle your status to online so candidates know you are actively hiring and conducting interviews.
                  </p>
                </div>
              )}
              <QuickActions userRole={user?.role || 'customer'} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
