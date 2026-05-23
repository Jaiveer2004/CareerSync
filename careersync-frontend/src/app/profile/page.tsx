"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/services/authService";
import { updateUserProfile, parseResume } from "@/services/apiService";
import { Shield, Lock, User, Mail, Phone, Key, Eye, EyeOff, CheckCircle2, XCircle, Upload, Plus, Trash2, BookOpen, Briefcase, FileText } from "lucide-react";
import TwoFactorSetup, { DisableTwoFactor } from "@/components/auth/TwoFactorSetup";
import toast from "react-hot-toast";

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  
  // Profile state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Candidate fields state
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState<ExperienceItem[]>(user?.experience || []);
  const [education, setEducation] = useState<EducationItem[]>(user?.education || []);
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || "");
  
  // File upload state
  const [isParsing, setIsParsing] = useState(false);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [show2FADisable, setShow2FADisable] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync user state on reload
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");
      setSkills(user.skills || []);
      setExperience(user.experience || []);
      setEducation(user.education || []);
      setResumeUrl(user.resumeUrl || "");
      setTwoFactorEnabled(user.twoFactorEnabled || false);
    }
  }, [user]);

  // Profile completeness percentage
  const completeness = useMemo(() => {
    let score = 20; // Default for account
    if (fullName) score += 15;
    if (phone) score += 15;
    if (skills.length > 0) score += 20;
    if (experience.length > 0) score += 15;
    if (education.length > 0) score += 15;
    return score;
  }, [fullName, phone, skills, experience, education]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateUserProfile({
        fullName,
        phoneNumber: phone,
        skills,
        experience,
        education,
        resumeUrl
      });
      
      // Update local storage/context user object
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
      toast.success("Profile saved!");
    } catch {
      setError("Failed to update profile");
      toast.error("Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resume drag-and-drop parsing handler
  const handleResumeDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadAndParseFile(files[0]);
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadAndParseFile(files[0]);
    }
  };

  const uploadAndParseFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF document.");
      return;
    }
    
    setIsParsing(true);
    const toastId = toast.loading("AI is parsing your resume...");
    
    try {
      const formData = new FormData();
      formData.append("resume", file);
      
      const response = await parseResume(formData);
      const parsed = response.data.data;
      
      if (parsed.fullName) setFullName(parsed.fullName);
      if (parsed.phoneNumber) setPhone(parsed.phoneNumber);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.experience) setExperience(parsed.experience);
      if (parsed.education) setEducation(parsed.education);
      setResumeUrl("https://careersync-resumes.s3.amazonaws.com/" + file.name); // Mock upload S3 path
      
      toast.dismiss(toastId);
      toast.success("Resume parsed successfully! Check the pre-filled fields below.");
      setIsEditingProfile(true);
    } catch (err) {
      console.error("Parsing failed:", err);
      toast.dismiss(toastId);
      toast.error("Resume parsing failed. You can fill out your profile manually.");
    } finally {
      setIsParsing(false);
    }
  };

  // Skill tag add/delete
  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Experience array modifiers
  const handleAddExperience = () => {
    setExperience([...experience, { company: "", role: "", duration: "", description: "" }]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, key: keyof ExperienceItem, val: string) => {
    const updated = [...experience];
    updated[index][key] = val;
    setExperience(updated);
  };

  // Education array modifiers
  const handleAddEducation = () => {
    setEducation([...education, { school: "", degree: "", year: "" }]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, key: keyof EducationItem, val: string) => {
    const updated = [...education];
    updated[index][key] = val;
    setEducation(updated);
  };

  // Danger Zone - Change Password Validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordValidation.isValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // simulate endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to change password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setShow2FADisable(true);
    } else {
      setShow2FASetup(true);
    }
  };

  const handle2FASuccess = () => {
    setShow2FASetup(false);
    setShow2FADisable(false);
    setTwoFactorEnabled(!twoFactorEnabled);
    setSuccess(twoFactorEnabled ? "2FA disabled successfully" : "2FA enabled successfully");
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!deletePassword.trim()) {
      setError("Please enter your current password to delete your account.");
      return;
    }

    const confirmed = window.confirm("This action is permanent and cannot be undone. Delete your account?");
    if (!confirmed) return;

    setIsDeletingAccount(true);

    try {
      const response = await deleteAccount({ password: deletePassword });
      setSuccess(response.data?.message || "Account deleted successfully.");
      logout();
      router.push('/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError?.response?.data?.message || "Failed to delete account. Please verify your password.");
    } finally {
      setIsDeletingAccount(false);
      setDeletePassword("");
    }
  };

  if (show2FASetup) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <TwoFactorSetup onSuccess={handle2FASuccess} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (show2FADisable) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4">
            <DisableTwoFactor onSuccess={handle2FASuccess} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          
          {/* Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Account Center</p>
              <h1 className="text-3xl font-bold text-slate-900 font-serif">Profile Settings</h1>
              <p className="text-slate-600 text-sm mt-0.5">Optimize your profile matching criteria and account security</p>
            </div>
            
            {user?.role === 'customer' && (
              <div className="flex-shrink-0 bg-slate-900 text-white px-5 py-3 rounded-xl border border-slate-800 text-right">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Profile Completeness</span>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${completeness}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{completeness}%</span>
                </div>
              </div>
            )}
          </div>

          {success && (
            <Alert variant="success" onClose={() => setSuccess("")}>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" onClose={() => setError("")}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Naukri-Style Drag & Drop Resume Parser */}
          {user?.role === 'customer' && (
            <Card className="border-indigo-100 bg-indigo-50/20 shadow-sm border-dashed border-2">
              <CardContent className="pt-6">
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleResumeDrop}
                  className="flex flex-col items-center justify-center text-center p-8 rounded-xl cursor-pointer hover:bg-indigo-50/40 transition-colors"
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                >
                  <input
                    type="file"
                    id="resume-file-input"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                  />
                  <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100 mb-4 text-indigo-600">
                    {isParsing ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                    ) : (
                      <Upload className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">AI Resume Onboarding</h3>
                  <p className="text-sm text-slate-500 max-w-md mt-2">
                    Drag and drop your resume PDF here, or click to browse. Our AI parsing will extract education, experience, and skills into your profile.
                  </p>
                  {resumeUrl && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <FileText className="w-4 h-4" />
                      Uploaded: {resumeUrl.split('/').pop()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personal Information & CV Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">CV Portfolio Details</CardTitle>
                    <CardDescription className="mt-1">
                      Update your contact details and professional skills
                    </CardDescription>
                  </div>
                </div>
                {!isEditingProfile && (
                  <Button variant="outline" className="border-slate-300 font-bold" onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-800">Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditingProfile}
                      className="bg-slate-50 border-slate-200 text-slate-900 disabled:text-slate-900 disabled:opacity-100 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-800">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        className="pl-10 bg-slate-50 border-slate-200 text-slate-900 disabled:text-slate-900 disabled:opacity-100 font-medium"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-800">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-slate-50 border-slate-200 text-slate-900 font-medium"
                        disabled={!isEditingProfile}
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-semibold text-slate-800">Role</Label>
                    <Input
                      id="role"
                      value={user?.role === 'customer' ? 'Candidate (Job Seeker)' : 'Recruiter (Employer)'}
                      disabled
                      className="capitalize bg-slate-50 border-slate-200 font-medium"
                    />
                  </div>
                </div>

                {/* Candidate Specific Sections */}
                {user?.role === 'customer' && (
                  <div className="space-y-6 border-t border-slate-100 pt-6">
                    
                    {/* Skills Tag input */}
                    <div className="space-y-2.5">
                      <Label className="text-sm font-bold text-slate-800 uppercase tracking-wider block">Key Technical Skills</Label>
                      <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-lg bg-slate-50">
                        {skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded">
                            {skill}
                            {isEditingProfile && (
                              <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-indigo-900">
                                ✕
                              </button>
                            )}
                          </span>
                        ))}
                        {isEditingProfile && (
                          <input
                            type="text"
                            placeholder="Add a skill + Press Enter"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleAddSkill}
                            className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs font-semibold text-slate-900 placeholder-slate-400"
                          />
                        )}
                      </div>
                    </div>

                    {/* Professional Work Experience */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          Work Experience
                        </Label>
                        {isEditingProfile && (
                          <Button type="button" variant="outline" size="sm" onClick={handleAddExperience} className="text-indigo-700 border-indigo-200">
                            <Plus className="w-4 h-4 mr-1" /> Add Experience
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {experience.map((exp, index) => (
                          <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative space-y-3">
                            {isEditingProfile && (
                              <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</span>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                  disabled={!isEditingProfile}
                                  placeholder="Google"
                                  className="text-sm font-semibold text-slate-900"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</span>
                                <Input
                                  value={exp.role}
                                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                  disabled={!isEditingProfile}
                                  placeholder="Senior Frontend Dev"
                                  className="text-sm font-semibold text-slate-900"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                                <Input
                                  value={exp.duration}
                                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                  disabled={!isEditingProfile}
                                  placeholder="Jan 2021 - Present"
                                  className="text-sm font-semibold text-slate-900"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Responsibilities Summary</span>
                              <textarea
                                value={exp.description}
                                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                disabled={!isEditingProfile}
                                rows={2}
                                placeholder="Designed architecture of React features..."
                                className="w-full text-sm font-medium text-slate-900 p-2.5 border border-slate-200 bg-white rounded focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education list */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Education History
                        </Label>
                        {isEditingProfile && (
                          <Button type="button" variant="outline" size="sm" onClick={handleAddEducation} className="text-indigo-700 border-indigo-200">
                            <Plus className="w-4 h-4 mr-1" /> Add Education
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {education.map((edu, index) => (
                          <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg relative grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {isEditingProfile && (
                              <button type="button" onClick={() => handleRemoveEducation(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">School / College</span>
                              <Input
                                value={edu.school}
                                onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="BITS Pilani"
                                className="text-sm font-semibold text-slate-900"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Degree</span>
                              <Input
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="B.Tech in CS"
                                className="text-sm font-semibold text-slate-900"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year of Graduation</span>
                              <Input
                                value={edu.year}
                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="2022"
                                className="text-sm font-semibold text-slate-900"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {isEditingProfile && (
                  <div className="flex gap-3 border-t border-slate-100 pt-4">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 font-bold" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-lg border-2 border-slate-200 px-6 font-bold"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setFullName(user?.fullName || "");
                        setPhone(user?.phoneNumber || "");
                        setSkills(user?.skills || []);
                        setExperience(user?.experience || []);
                        setEducation(user?.education || []);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Change Password & Security */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-violet-50 rounded-lg border border-violet-100">
                  <Lock className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Change Password</CardTitle>
                  <CardDescription className="mt-1">
                    Update your password to keep your account secure
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-600">Password Requirements:</p>
                    <div className="space-y-1">
                      <PasswordRequirement met={passwordValidation.minLength} text="At least 8 characters" />
                      <PasswordRequirement met={passwordValidation.hasUpperCase} text="One uppercase letter" />
                      <PasswordRequirement met={passwordValidation.hasLowerCase} text="One lowercase letter" />
                      <PasswordRequirement met={passwordValidation.hasNumber} text="One number" />
                      <PasswordRequirement met={passwordValidation.hasSpecialChar} text="One special character" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-50 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-700 text-white rounded-lg px-6 font-bold"
                  disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                >
                  {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
                    <CardDescription className="mt-1">
                      Add an extra layer of security by requiring a verification code in addition to your password
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
              </div>
            </CardHeader>
            {twoFactorEnabled && (
              <CardContent>
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    Two-factor authentication is currently <strong>enabled</strong> on your account.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 shadow-sm">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-red-700">Delete Account</CardTitle>
                  <CardDescription className="mt-1 text-slate-700">
                    Permanently delete your account and all stored CV data.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deletePassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                    <Input
                      id="deletePassword"
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="pl-10 pr-10 bg-white border-red-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                    >
                      {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  className="text-white hover:text-white rounded-lg px-6 font-bold"
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0" />
      ) : (
        <XCircle className="h-3 w-3 text-slate-500 flex-shrink-0" />
      )}
      <span className={met ? "text-emerald-600" : "text-slate-600"}>{text}</span>
    </div>
  );
}
