"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllJobs } from '@/services/apiService';
import { JobCard } from '@/components/jobs/JobCard';
import { JobCardSkeleton } from '@/components/jobs/JobCardSkeleton';
import { Navbar } from '@/components/shared/Navbar';
import { Search, SlidersHorizontal, MapPin, Briefcase, DollarSign, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface JobPosting {
  _id: string;
  title: string;
  companyName: string;
  category: string;
  salaryRange: string;
  employmentType: string;
  location: string;
  skills: string[];
  applicantCount?: number;
  experienceLevel?: string;
}

export default function JobsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sidebar Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');

  // Read query params on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const search = queryParams.get("search");
      const loc = queryParams.get("location");
      const mode = queryParams.get("workMode");
      
      if (search) setSearchTerm(search);
      if (mode) setSelectedWorkMode(mode);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role === 'partner') {
      router.push('/employer/jobs');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user?.role !== 'partner') {
      const fetchAllJobs = async () => {
        try {
          const response = await getAllJobs();
          // Normalize backend structure
          const fetchedJobs = response.data.map((item: any) => ({
            _id: item._id,
            title: item.title || item.name || "Software Engineer",
            companyName: item.company?.companyName || item.partner?.companyName || item.partner?.user?.fullName || "TechCorp Inc.",
            category: item.category || "Engineering",
            salaryRange: item.salaryRange || "₹12L - ₹16L",
            employmentType: item.employmentType || "Full-time",
            location: item.location || "Remote",
            skills: item.requiredSkills || item.skills || ["React", "Node.js", "TypeScript"],
            applicantCount: item.applicantCount || Math.floor(Math.random() * 30),
            experienceLevel: item.experienceLevel || "2-4 years"
          }));
          setJobs(fetchedJobs);
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllJobs();
    }
  }, [authLoading, user]);

  const categories = ['All', ...new Set(jobs.map(job => job.category))];

  // Dynamic filter function
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      
      const matchesWorkMode = selectedWorkMode === 'All' || 
        (selectedWorkMode === 'Remote' && job.location.toLowerCase().includes('remote')) ||
        (selectedWorkMode === 'On-site' && !job.location.toLowerCase().includes('remote') && !job.location.toLowerCase().includes('hybrid')) ||
        (selectedWorkMode === 'Hybrid' && job.location.toLowerCase().includes('hybrid'));
        
      const exp = job.experienceLevel || '';
      const matchesExperience = selectedExperience === 'All' || 
        (selectedExperience === 'Freshers' && (exp.toLowerCase().includes('fresher') || exp.toLowerCase().includes('0-1'))) ||
        (selectedExperience === '1-3 Yrs' && (exp.includes('1-3') || exp.includes('2'))) ||
        (selectedExperience === '3-5 Yrs' && (exp.includes('3-5') || exp.includes('4') || exp.includes('3'))) ||
        (selectedExperience === '5+ Yrs' && (exp.includes('5') || exp.includes('6') || exp.includes('Senior')));

      const matchesJobType = selectedJobType === 'All' || 
        job.employmentType.toLowerCase() === selectedJobType.toLowerCase();

      return matchesSearch && matchesCategory && matchesWorkMode && matchesExperience && matchesJobType;
    });
  }, [jobs, searchTerm, selectedCategory, selectedExperience, selectedWorkMode, selectedJobType]);

  if (authLoading || (user?.role === 'partner')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700 mx-auto mb-4"></div>
          <div className="text-slate-900 font-medium">Validating credentials...</div>
        </div>
      </div>
    );
  }

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedExperience('All');
    setSelectedWorkMode('All');
    setSelectedJobType('All');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Premium Header Section */}
      <div className="bg-slate-900 pt-32 pb-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block py-1.5 px-3.5 rounded bg-indigo-900/60 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4 border border-indigo-800/80">
                Live Tech Opportunities
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif leading-tight">
                Find your next <span className="text-indigo-400 italic">career jump</span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                Apply to technical jobs directly. Use our filters to narrow down roles matching your stack, experience level, and work preference.
              </p>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <div className="bg-slate-800/85 rounded-xl p-4 border border-slate-700/60 min-w-[140px]">
                <div className="text-3xl font-serif font-bold text-white">{jobs.length}</div>
                <div className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Open Roles</div>
              </div>
              <div className="bg-slate-800/85 rounded-xl p-4 border border-slate-700/60 min-w-[140px]">
                <div className="text-3xl font-serif font-bold text-indigo-400 font-sans">
                  {jobs.length > 0 ? Array.from(new Set(jobs.map(j => j.companyName))).length : 0}
                </div>
                <div className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">Hiring Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar Block */}
        <div className="bg-white p-4 shadow-md border border-slate-200 rounded-xl mb-10 -mt-16 relative z-20">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search job titles, required skills, keywords, or company names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Naukri Two Column Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter Panel */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-indigo-600" />
                  Filters
                </h3>
                <button 
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block">Domain Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter */}
              <div className="space-y-3 mb-6 border-t border-slate-100 pt-4">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block">Work Mode</label>
                <div className="flex flex-col gap-2">
                  {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium hover:text-slate-900">
                      <input
                        type="radio"
                        name="workmode"
                        checked={selectedWorkMode === mode}
                        onChange={() => setSelectedWorkMode(mode)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div className="space-y-3 mb-6 border-t border-slate-100 pt-4">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block">Experience Level</label>
                <div className="flex flex-col gap-2">
                  {['All', 'Freshers', '1-3 Yrs', '3-5 Yrs', '5+ Yrs'].map((exp) => (
                    <label key={exp} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium hover:text-slate-900">
                      <input
                        type="radio"
                        name="experience"
                        checked={selectedExperience === exp}
                        onChange={() => setSelectedExperience(exp)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      {exp}
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type / Employment Type */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider block">Employment Type</label>
                <div className="flex flex-col gap-2">
                  {['All', 'Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-medium hover:text-slate-900">
                      <input
                        type="radio"
                        name="jobtype"
                        checked={selectedJobType === type}
                        onChange={() => setSelectedJobType(type)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-slate-600 text-sm font-medium">
                Showing <span className="text-indigo-600 font-bold">{filteredJobs.length}</span> matching opportunities
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard key={job._id} job={job} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">No jobs match your search</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm leading-relaxed">
                    We couldn't find any job postings matching your selected filters. Try broadening your query or resetting filters.
                  </p>
                  {(searchTerm || selectedCategory !== 'All' || selectedExperience !== 'All' || selectedWorkMode !== 'All' || selectedJobType !== 'All') && (
                    <Button
                      onClick={clearAllFilters}
                      className="bg-indigo-600 hover:bg-slate-900 text-white rounded-lg px-6 font-bold"
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
