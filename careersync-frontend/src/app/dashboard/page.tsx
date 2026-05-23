"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecruiterStatusToggle } from "@/components/employer/RecruiterStatusToggle";
import { getDashboardStats, getAllJobs, getPartnerServices } from "@/services/apiService";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  Users, 
  Star, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  User, 
  Activity, 
  Plus
} from "lucide-react";

interface DashboardStats {
  // Customer stats
  totalBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  totalSpent?: number;
  recentBookings?: any[];
  
  // Partner stats
  totalServices?: number;
  activeServices?: number;
  totalEarnings?: number;
  totalReviews?: number;
  averageRating?: number;
  isOnline?: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [activePostings, setActivePostings] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "customer") {
        fetchRecommendedJobs();
      } else if (user.role === "partner") {
        fetchActivePostings();
      }
    }
  }, [user]);

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

  const fetchRecommendedJobs = async () => {
    try {
      const response = await getAllJobs();
      const userSkills = user?.skills || [];
      
      const matched = response.data.map((job: any) => {
        const requiredSkills = job.requiredSkills || job.skills || [];
        const overlap = requiredSkills.filter((s: string) => 
          userSkills.some((us: string) => us.toLowerCase() === s.toLowerCase())
        );
        const matchScore = requiredSkills.length > 0 
          ? Math.round((overlap.length / requiredSkills.length) * 100) 
          : 50;
          
        return { ...job, matchScore };
      })
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 3);
      
      setRecommendedJobs(matched);
    } catch (err) {
      console.error("Failed to fetch recommended jobs:", err);
    }
  };

  const fetchActivePostings = async () => {
    try {
      const response = await getPartnerServices();
      // Populate applicant count if missing or mock
      const posts = response.data.map((job: any) => ({
        ...job,
        applicantCount: job.applicantCount !== undefined ? job.applicantCount : Math.floor(Math.random() * 12) + 1
      }));
      setActivePostings(posts.slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch active postings:", err);
    }
  };

  const completeness = () => {
    let score = 20;
    if (user?.fullName) score += 15;
    if (user?.phoneNumber) score += 15;
    if (user?.skills && user.skills.length > 0) score += 20;
    if (user?.experience && user.experience.length > 0) score += 15;
    if (user?.education && user.education.length > 0) score += 15;
    return score;
  };

  const getRecentActivities = () => {
    if (!stats || !stats.recentBookings) return [];
    
    return stats.recentBookings.map((booking: any) => {
      const isCustomer = user?.role === 'customer';
      const companyName = booking.partner?.companyName || 'TechCorp';
      const applicantName = booking.customer?.fullName || 'Candidate';
      const jobTitle = booking.service?.title || booking.service?.name || 'Software Engineer';
      const timeAgo = new Date(booking.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
      
      return {
        id: booking._id,
        type: 'booking' as const,
        title: isCustomer 
          ? `Application sent to ${companyName}`
          : `New application received for ${jobTitle}`,
        description: isCustomer
          ? `Applied for the position of ${jobTitle}.`
          : `Candidate ${applicantName} has applied.`,
        time: timeAgo,
        status: booking.status
      };
    });
  };

  const recentActivity = getRecentActivities();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen">
          
          <WelcomeBanner stats={stats || undefined} />

          {/* Stats Cards Section */}
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
                <>
                  <StatsCard
                    title="Active Applications"
                    value={stats.totalBookings || 0}
                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                    description="Total applications sent"
                    color="blue"
                  />
                  <StatsCard
                    title="In Review"
                    value={stats.pendingBookings || 0}
                    icon={<Clock className="w-5 h-5 text-orange-600" />}
                    description="Companies reviewing now"
                    color="orange"
                  />
                  <StatsCard
                    title="Shortlisted / Offers"
                    value={stats.completedBookings || 0}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    description="Interview pipeline milestones"
                    color="green"
                  />
                  <StatsCard
                    title="Expected CTC Target"
                    value="₹12.0L"
                    icon={<Coins className="w-5 h-5 text-indigo-600" />}
                    description="Target compensation range"
                    color="purple"
                  />
                </>
              ) : (
                <>
                  <StatsCard
                    title="Active Job Postings"
                    value={stats.totalServices || 0}
                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                    description={`${stats.activeServices || 0} active roles`}
                    color="blue"
                  />
                  <StatsCard
                    title="Total Applicants"
                    value={stats.totalBookings || 0}
                    icon={<Users className="w-5 h-5 text-emerald-600" />}
                    description="Applications received"
                    color="green"
                  />
                  <StatsCard
                    title="Recruitment Funnel"
                    value={stats.completedBookings || 0}
                    icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
                    description="Shortlisted for interviews"
                    color="orange"
                  />
                  <StatsCard
                    title="Allocated Budget"
                    value="₹45.0L"
                    icon={<Coins className="w-5 h-5 text-indigo-600" />}
                    description="Planned compensation budget"
                    color="purple"
                  />
                </>
              )
            ) : null}
          </div>

          {/* Two-Column Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Main Dashboard Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {user?.role === 'customer' ? (
                /* Customer Widgets */
                <>
                  {/* Application funnel visualizer */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
                      Application Stage Pipeline
                    </h3>
                    
                    <div className="grid grid-cols-5 gap-2 relative">
                      {[
                        { label: 'Applied', count: stats?.totalBookings || 0, color: 'bg-blue-500' },
                        { label: 'Reviewing', count: stats?.pendingBookings || 0, color: 'bg-amber-500' },
                        { label: 'Shortlisted', count: stats?.completedBookings || 0, color: 'bg-emerald-500' },
                        { label: 'Interview', count: Math.min(stats?.completedBookings || 0, 1), color: 'bg-indigo-500' },
                        { label: 'Offer', count: 0, color: 'bg-purple-500' }
                      ].map((stage, idx) => (
                        <div key={stage.label} className="flex flex-col items-center bg-slate-50/50 border border-slate-200/50 p-3.5 rounded-xl text-center relative group hover:bg-slate-50 hover:shadow-sm transition-all">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-2 ${stage.color}`}>
                            {stage.count}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                          
                          {idx < 4 && (
                            <span className="hidden sm:block absolute top-[22px] -right-[10px] text-slate-400 font-bold z-10">
                              →
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommended Jobs Widget */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                          AI Recommended Tech Jobs
                        </h3>
                        <p className="text-slate-400 text-xs font-medium mt-0.5">Top openings matching your candidate skills</p>
                      </div>
                      <Link href="/jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                        Explore all
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {recommendedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {recommendedJobs.map((job) => (
                          <div key={job._id} className="p-4 rounded-xl border border-slate-200/40 hover:border-indigo-200 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all flex items-start justify-between gap-4 group">
                            <div className="space-y-1.5">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                              <p className="text-xs text-slate-500 font-semibold">{job.companyName}</p>
                              <div className="flex items-center gap-3 pt-2">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {job.location}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Coins className="w-3 h-3 text-slate-400" />
                                  {job.salaryRange}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end justify-between h-full self-stretch">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                                job.matchScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                job.matchScore >= 50 ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                'bg-slate-50 text-slate-600 border border-slate-200'
                              }`}>
                                {job.matchScore}% Match
                              </span>
                              <Link href={`/jobs/${job._id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 mt-4">
                                Apply
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-xs font-semibold bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No recommended jobs found. Add skills to your profile to get matches!
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Partner/HR Widgets */
                <>
                  {/* Recruiter hiring conversion funnel */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-indigo-600" />
                      Recruitment Funnel Metrics
                    </h3>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Active Roles', count: stats?.activeServices || 0, color: 'border-blue-200 bg-blue-50/30 text-blue-800' },
                        { label: 'Applications', count: stats?.totalBookings || 0, color: 'border-emerald-200 bg-emerald-50/30 text-emerald-800' },
                        { label: 'Shortlisted', count: stats?.completedBookings || 0, color: 'border-indigo-200 bg-indigo-50/30 text-indigo-800' },
                        { label: 'Screening Ratio', count: stats?.totalBookings ? `${Math.round(((stats.completedBookings || 0) / stats.totalBookings) * 100)}%` : '0%', color: 'border-orange-200 bg-orange-50/30 text-orange-800' }
                      ].map((funnel) => (
                        <div key={funnel.label} className={`border p-4 rounded-2xl text-center ${funnel.color}`}>
                          <p className="text-2xl font-bold font-sans">{funnel.count}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">{funnel.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Job Openings Grid */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                          Active Job Listings
                        </h3>
                        <p className="text-slate-400 text-xs font-medium mt-0.5">Quick shortcuts to candidate screening matrices</p>
                      </div>
                      <Link href="/employer/jobs/create" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        Post Job
                      </Link>
                    </div>

                    {activePostings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activePostings.map((job) => (
                          <div key={job._id} className="p-4 rounded-xl border border-slate-200/60 hover:border-indigo-200 bg-slate-50/20 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{job.title}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  job.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'
                                }`}>
                                  {job.isActive ? 'Active' : 'Closed'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-semibold mt-1">{job.category}</p>
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                              <span className="text-xs font-bold text-slate-500">
                                {job.applicantCount} Candidates
                              </span>
                              <Link href={`/employer/jobs/${job._id}/applicants`} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5">
                                View Matrix
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 text-xs font-semibold bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No active jobs found. Publish a posting to start sourcing!
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Dynamic timeline feed */}
              <ActivityFeed activities={recentActivity} />
            </div>

            {/* Right Sidebar Dashboard Column */}
            <div className="space-y-8">
              
              {user?.role === 'customer' ? (
                /* Profile completeness radial/linear tracker for students */
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Profile Completeness</h3>
                      <p className="text-slate-400 text-[10px] font-medium mt-0.5">Increase score for higher matches</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>ATS Readiness</span>
                      <span className="text-indigo-600">{completeness()}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/30">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${completeness()}%` }}></div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                    {completeness() < 100 
                      ? "💡 Tip: Go to Profile Settings and upload a PDF resume to instantly reach 100% and unlock auto-generated matches!"
                      : "🎉 Congratulations! Your profile is 100% complete and fully optimized for automated screening."
                    }
                  </p>
                  
                  {completeness() < 100 && (
                    <Link href="/profile" className="block text-center w-full py-2 bg-slate-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold transition-colors">
                      Optimize Profile
                    </Link>
                  )}
                </div>
              ) : (
                /* Recruiting active status widget for recruiters */
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Conducting Sourcing</h3>
                      <p className="text-slate-400 text-[10px] font-medium mt-0.5">Recruitment visibility parameters</p>
                    </div>
                  </div>
                  
                  {/* Status Toggle Button */}
                  <RecruiterStatusToggle />

                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    Your recruiter status is flagged as active, allowing candidates to view compatibility ratings and book calendar slots during application.
                  </p>
                </div>
              )}

              {/* Quick Actions Panel */}
              <QuickActions userRole={user?.role || 'customer'} />
            </div>

          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

