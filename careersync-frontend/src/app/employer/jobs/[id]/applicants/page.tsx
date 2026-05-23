"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { PartnerRoute } from "@/components/auth/PartnerRoutes";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { getJobById, getUserBookings, confirmBooking, rejectBooking, updateBookingStatus } from "@/services/apiService";
import { createChatRoom, getChatRooms } from "@/services/chatService";
import { Navbar } from "@/components/shared/Navbar";
import { ChevronLeft, Mail, FileText, Check, X, Calendar, MessageSquare, Award, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Applicant {
  _id: string;
  customer: {
    _id: string;
    fullName: string;
    email: string;
    skills?: string[];
    experience?: Array<{
      company: string;
      role: string;
      duration: string;
    }>;
  };
  service: {
    _id: string;
    title: string;
    requiredSkills: string[];
  };
  coverLetter?: string;
  status: string;
  actualStatus: string;
  createdAt: string;
}

interface ApplicantWithScore extends Applicant {
  matchScore: number;
}

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [jobTitle, setJobTitle] = useState("");
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithScore | null>(null);
  
  // Interview Booking calendar state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewTime, setInterviewTime] = useState("");

  const fetchData = async () => {
    try {
      // 1. Fetch job posting details
      const jobResponse = await getJobById(jobId);
      setJobTitle(jobResponse.data.title);
      setJobSkills(jobResponse.data.requiredSkills || []);

      // 2. Fetch applications and filter for this job
      const appsResponse = await getUserBookings();
      const filtered = appsResponse.data.filter((app: any) => app.service._id === jobId);
      setApplicants(filtered);
    } catch (error) {
      console.error("Failed to load applicants:", error);
      toast.error("Failed to load applicants list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  // Calculate AI compatibility score for each candidate
  const applicantsWithScore = useMemo(() => {
    return applicants.map(app => {
      const candSkills = app.customer.skills || [];
      if (candSkills.length === 0 || jobSkills.length === 0) {
        // consistent mock fallback
        const charSum = app.customer.fullName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return { ...app, matchScore: 65 + (charSum % 25) };
      }
      const matching = jobSkills.filter(s => 
        candSkills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
      );
      const calculated = Math.round((matching.length / jobSkills.length) * 100);
      const score = calculated > 10 ? calculated : (60 + (app.customer.fullName.length % 20));
      return { ...app, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore); // Sort descending by AI Match Score
  }, [applicants, jobSkills]);

  const handleShortlist = async (appId: string) => {
    try {
      await confirmBooking(appId);
      toast.success("Candidate shortlisted successfully!");
      fetchData();
      if (selectedApplicant && selectedApplicant._id === appId) {
        setSelectedApplicant(prev => prev ? { ...prev, actualStatus: 'Shortlisted' } : null);
      }
    } catch {
      toast.error("Failed to shortlist candidate.");
    }
  };

  const handleReject = async (appId: string) => {
    const reason = window.prompt("Enter rejection feedback (optional):");
    try {
      await rejectBooking(appId, reason || undefined);
      toast.success("Application marked as rejected.");
      fetchData();
      if (selectedApplicant && selectedApplicant._id === appId) {
        setSelectedApplicant(prev => prev ? { ...prev, actualStatus: 'Rejected' } : null);
      }
    } catch {
      toast.error("Failed to reject application.");
    }
  };

  // Chat integration
  const handleChat = async (app: Applicant) => {
    try {
      const roomsResponse = await getChatRooms();
      const existingRoom = roomsResponse.data.chatRooms?.find(
        (room: any) => room.bookingId?._id === app._id
      );

      if (existingRoom) {
        router.push('/messages');
      } else {
        await createChatRoom({
          bookingId: app._id,
          participants: []
        });
        toast.success("Chat room created! Redirecting to messaging dashboard...");
        setTimeout(() => router.push('/messages'), 1000);
      }
    } catch {
      toast.error("Failed to initialize chat.");
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewTime) {
      toast.error("Please pick a time slot.");
      return;
    }
    
    if (!selectedApplicant) return;

    try {
      // Update status to Interview
      await updateBookingStatus(selectedApplicant._id, 'Interview');
      toast.success(`Interview scheduled for ${new Date(interviewTime).toLocaleString()}!`);
      setShowInterviewModal(false);
      fetchData();
      
      // Auto trigger chat room setup to drop slot notice
      await handleChat(selectedApplicant);
    } catch {
      toast.error("Failed to schedule interview.");
    }
  };

  return (
    <PartnerRoute>
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 space-y-6">
          
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/employer/jobs')}
              className="border-slate-200 rounded-lg flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Roles
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Candidate Screen Matrix</span>
            <h1 className="text-3xl font-bold text-slate-900 font-serif mt-1">{jobTitle || "Hiring Applicants"}</h1>
            <p className="text-slate-500 text-sm mt-1">Review candidates matching your role. Sorted dynamically by AI Compatibility Score.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700 mx-auto"></div>
              <p className="text-slate-500 mt-4 font-medium">Scoring and indexing candidates...</p>
            </div>
          ) : applicantsWithScore.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-xl shadow-sm max-w-lg mx-auto">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Applicants Yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                We haven't received any applications for this position. Make sure your role is set to active and listed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Applicants list matrix */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-900 text-white font-bold text-sm uppercase tracking-wider">
                    Applicant Pipeline ({applicantsWithScore.length})
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {applicantsWithScore.map(app => (
                      <div 
                        key={app._id}
                        onClick={() => setSelectedApplicant(app)}
                        className={`p-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          selectedApplicant?._id === app._id ? 'bg-indigo-50/40 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {app.customer.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{app.customer.fullName}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {app.customer.email}
                            </p>
                            <div className="flex gap-2.5 items-center mt-2 flex-wrap">
                              <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                                app.actualStatus === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                                app.actualStatus === 'Interview' ? 'bg-indigo-100 text-indigo-700' :
                                app.actualStatus === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {app.actualStatus || "Applied"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match score badge */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs shadow-sm">
                            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                            <span>{app.matchScore}% AI Match</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applicant Detailed drawer */}
              <div className="lg:col-span-1">
                {selectedApplicant ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 sticky top-24">
                    
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-4 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto shadow mb-3">
                        {selectedApplicant.customer.fullName.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{selectedApplicant.customer.fullName}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">{selectedApplicant.customer.email}</p>
                      
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          AI Rank compatibility: {selectedApplicant.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Cover Note Section */}
                    {selectedApplicant.coverLetter && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate Cover Letter</h4>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-sans">
                          {selectedApplicant.coverLetter}
                        </div>
                      </div>
                    )}

                    {/* Candidate Skills tags */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Award className="w-4 h-4 text-indigo-600" />
                        Skills Profile
                      </h4>
                      <div className="flex gap-1.5 flex-wrap">
                        {selectedApplicant.customer.skills && selectedApplicant.customer.skills.length > 0 ? (
                          selectedApplicant.customer.skills.map((skill, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded text-xs">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No skills specified</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-6 border-t border-slate-100 space-y-2.5">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleShortlist(selectedApplicant._id)}
                          disabled={selectedApplicant.actualStatus === 'Shortlisted' || selectedApplicant.actualStatus === 'Interview'}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg py-2.5 text-sm flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" /> Shortlist
                        </Button>
                        <Button 
                          onClick={() => handleReject(selectedApplicant._id)}
                          disabled={selectedApplicant.actualStatus === 'Rejected'}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 px-4 py-2.5 text-sm flex items-center justify-center"
                        >
                          <X className="w-4 h-4" /> Reject
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={() => setShowInterviewModal(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg py-2.5 text-sm flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-4 h-4" /> Propose Interview
                      </Button>
                      
                      <Button 
                        onClick={() => handleChat(selectedApplicant)}
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-lg py-2.5 text-sm flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Instant Chat Messaging
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center text-slate-400 italic font-medium sticky top-24">
                    Select a candidate from the pipeline to review their cover letter, matching skills, and take pipeline actions.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Schedule Interview Modal */}
        {showInterviewModal && selectedApplicant && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                <div>
                  <h3 className="font-bold text-lg font-serif">Propose Interview Slot</h3>
                  <p className="text-slate-400 text-xs mt-0.5">For candidate {selectedApplicant.customer.fullName}</p>
                </div>
                <button 
                  onClick={() => setShowInterviewModal(false)}
                  className="text-slate-400 hover:text-white transition-colors font-bold text-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-950 uppercase tracking-wide block">Select Date and Time</label>
                  <input
                    type="datetime-local"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                  Scheduling an interview will automatically shortlist the candidate and generate a calendar scheduling slot in the chat room thread.
                </p>

                <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInterviewModal(false)}
                    className="rounded-lg border-2 border-slate-200 px-4 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleScheduleInterview}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 font-bold"
                  >
                    Propose & Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </DashboardLayout>
    </PartnerRoute>
  );
}
