"use client";

import { Button } from "@/components/ui/button";
import { getJobById, generateCoverLetter, createBooking } from "@/services/apiService";
import { Navbar } from "@/components/shared/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { Briefcase, MapPin, DollarSign, Clock, Building2, CheckCircle2, ChevronRight, Award } from "lucide-react";
import Skeleton from "react-loading-skeleton";

interface JobDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  salaryRange: string;
  employmentType: string;
  location: string;
  requiredSkills: string[];
  experienceLevel: string;
  company: {
    _id: string;
    companyName: string;
    industry: string;
    website: string;
    companySize: string;
    bio: string;
  };
  partner?: {
    user?: {
      fullName: string;
    };
    bio?: string;
  };
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  useEffect(() => {
    if (!authLoading && user?.role === 'partner') {
      router.push('/employer/jobs');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user?.role !== 'partner') {
      const fetchJob = async () => {
        try {
          const response = await getJobById(jobId);
          setJob(response.data);
        } catch (error) {
          console.error("Failed to fetch job details:", error);
          toast.error("Failed to load job details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchJob();
    }
  }, [jobId, authLoading, user]);

  const handleApplyClick = async () => {
    if (!user) {
      toast.error("Please log in to apply for this job.");
      router.push("/login");
      return;
    }
    
    setIsApplyModalOpen(true);
    setIsGeneratingCoverLetter(true);
    
    try {
      const response = await generateCoverLetter(jobId);
      setCoverLetter(response.data.coverLetter);
    } catch (error) {
      console.error("Error generating AI cover letter:", error);
      setCoverLetter("Dear Hiring Manager,\n\nI am very interested in this role and believe my technical skill set matches your requirements. I would love to schedule a time to talk.\n\nBest regards,\n" + user.fullName);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    
    try {
      await createBooking({
        serviceId: jobId,
        bookingDate: new Date().toISOString(),
        coverLetter: coverLetter,
        resumeUrl: user?.resumeUrl || ""
      } as any);
      
      toast.success("Application submitted successfully!");
      setIsApplyModalOpen(false);
      router.push("/applications");
    } catch (error) {
      console.error("Application failed:", error);
      toast.error("Failed to submit application.");
    } finally {
      setIsApplying(false);
    }
  };

  if (authLoading || (user?.role === 'partner')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
          <div className="text-slate-900 font-medium">Validating credentials...</div>
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 max-w-5xl mx-auto px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 rounded"></div>
          <div className="h-10 w-2/3 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="md:col-span-2 h-64 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
      <Navbar />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 font-serif">Job Not Found</h2>
        <Link href="/jobs" className="text-indigo-600 font-bold hover:underline">
          Return to Browse Jobs
        </Link>
      </div>
    </div>
  );

  const companyProfile = job.company || {
    companyName: job.partner?.user?.fullName || "TechCorp Inc.",
    industry: "Information Technology",
    website: "#",
    companySize: "50-200 employees",
    bio: job.partner?.bio || "No description available."
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Breadcrumb Header */}
      <div className="bg-slate-900 pt-32 pb-16 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-indigo-400">{job.category}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold font-serif text-white">{job.title}</h1>
              <p className="text-lg text-indigo-300 font-semibold mt-2">{companyProfile.companyName}</p>
            </div>
            
            <Button 
              onClick={handleApplyClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-6 text-base font-bold shadow-lg transition-all"
            >
              Apply to Role
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Main details */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Quick Details Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <Briefcase className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Job Type</span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">{job.employmentType}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <MapPin className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Location</span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">{job.location}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <DollarSign className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Salary Range</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{job.salaryRange}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
                <Award className="h-5 w-5 text-indigo-600 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Experience</span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">{job.experienceLevel}</span>
              </div>
            </div>

            {/* Description Block */}
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Job Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">{job.description}</p>
            </div>

            {/* Required Skills Tags */}
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Required Technical Stack</h3>
              <div className="flex gap-2 flex-wrap">
                {job.requiredSkills?.map((skill, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-4 py-1.5 rounded-lg text-sm shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            
            {/* Company Info Block */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Hiring Organization
              </h3>
              <h4 className="text-xl font-bold text-slate-900">{companyProfile.companyName}</h4>
              <p className="text-sm font-medium text-slate-500 mt-1">{companyProfile.industry}</p>
              
              <div className="mt-4 space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Company Size:</span>
                  <span className="font-medium text-slate-900">{companyProfile.companySize}</span>
                </div>
                {companyProfile.website && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Website:</span>
                    <a href={companyProfile.website} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {companyProfile.bio && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 leading-relaxed italic">{companyProfile.bio}</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Smart One-Click Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-lg font-serif">Apply for {job.title}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Custom cover note generated using Gemini AI</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-5">
              
              {/* Cover Letter Text */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block uppercase tracking-wider">AI Suggested Cover Note</label>
                {isGeneratingCoverLetter ? (
                  <div className="h-48 flex flex-col items-center justify-center border border-slate-200 rounded-lg bg-slate-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700 mb-2"></div>
                    <span className="text-sm text-slate-600 font-semibold">Gemini AI is crafting your cover note...</span>
                  </div>
                ) : (
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={8}
                    required
                    placeholder="Enter your cover letter..."
                    className="w-full p-4 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none leading-relaxed bg-slate-50 focus:bg-white transition-all"
                  />
                )}
              </div>

              {/* Resume status */}
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold block">Application Attachment</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">
                    {user?.resumeUrl ? "Primary ATS resume selected" : "Auto-populating profile details"}
                  </span>
                </div>
                <Link href="/profile" className="text-xs font-bold text-indigo-700 hover:underline">
                  Edit Profile / Resume
                </Link>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 border-t border-slate-100 pt-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-lg border-2 border-slate-200 px-6 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isApplying || isGeneratingCoverLetter}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 font-bold shadow"
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}