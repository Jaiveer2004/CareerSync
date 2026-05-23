"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, generateJD } from "@/services/apiService";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Brain, Sparkles, MapPin, DollarSign, Award, Clock, Briefcase, Plus, Trash2 } from "lucide-react";

const serviceCategories = [
  'Software Engineering', 'Data & AI', 'Infrastructure & Security', 'Product & Design',
  'UI/UX Design', 'QA & Testing', 'Cybersecurity', 'Cloud Computing',
  'Mobile Development', 'Frontend Development', 'Backend Development',
  'Full Stack Development', 'AI/Machine Learning', 'Data Engineering',
  'Systems Architecture', 'Technical Support', 'Engineering Management', 'Other'
];

export function CreateJobForm() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Software Engineering");
  const [salaryRange, setSalaryRange] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [location, setLocation] = useState("Remote");
  const [experienceLevel, setExperienceLevel] = useState("3-5 years");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  // AI generation loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // AI JD Generator Integration
  const handleGenerateAI = async () => {
    if (!title.trim()) {
      toast.error("Please enter a Job Title first to generate details.");
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("AI is generating Job Description details...");
    
    try {
      const response = await generateJD({
        title: title,
        industry: category,
        experienceLevel: experienceLevel
      });
      
      const parsed = response.data.data;
      if (parsed.description) setDescription(parsed.description);
      if (parsed.salaryRange) setSalaryRange(parsed.salaryRange);
      if (parsed.location) setLocation(parsed.location);
      if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
      if (parsed.requiredSkills) setSkills(parsed.requiredSkills);
      
      toast.dismiss(toastId);
      toast.success("AI generated JD successfully! Form pre-filled.");
    } catch (err) {
      console.error("AI generation failed:", err);
      toast.dismiss(toastId);
      toast.error("Failed to generate details. You can fill out the form manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const promise = createJob({
        title,
        description,
        category,
        salaryRange,
        employmentType,
        location,
        experienceLevel,
        requiredSkills: skills,
        isActive
      });

      await toast.promise(promise, {
        loading: 'Posting your job role...',
        success: () => {
          setTimeout(() => router.push('/employer/jobs'), 1500);
          return <b>Job role posted successfully!</b>;
        },
        error: (err) => {
          const errorMessage = err instanceof Error && 'response' in err && 
            err.response && typeof err.response === 'object' && 
            'data' in err.response && err.response.data && 
            typeof err.response.data === 'object' && 'message' in err.response.data
            ? String(err.response.data.message)
            : "Failed to post job!";
          return <b>{errorMessage}</b>;
        },
      });
    } catch (error) {
      console.error("Job posting creation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-2xl mx-auto shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Job Posting</h2>
          <p className="text-slate-500 text-sm">Design and post a technical role to tech candidates</p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Job Title and AI Helper */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-slate-800">
            Job Title
          </Label>
          <div className="flex gap-2">
            <Input
              id="title"
              placeholder="e.g., Senior Full Stack Dev"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating || !title}
              className="bg-indigo-600 hover:bg-slate-900 text-white font-bold flex gap-1.5 shrink-0 rounded-lg px-4"
            >
              <Brain className="w-4 h-4" />
              AI JD
            </Button>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-800">Domain Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {serviceCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold text-slate-800">
            Job Description / Responsibilities
          </Label>
          <Textarea
            id="description"
            placeholder="Outline the responsibilities, expectations, and stack for this position."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="resize-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dynamic Filters - Salary / Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-semibold text-slate-800">
              Salary / Annual CTC (e.g. ₹12L - ₹15L)
            </Label>
            <Input
              id="salary"
              placeholder="₹12L - ₹18L"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-semibold text-slate-800">
              Experience Level Required
            </Label>
            <Input
              id="experience"
              placeholder="3-5 years"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Location and Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-slate-800">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Remote / Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobtype" className="text-sm font-semibold text-slate-800">
              Employment Type
            </Label>
            <select
              id="jobtype"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Skills Tag input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-800">Required Skills</Label>
          <div className="flex flex-wrap gap-1.5 p-3 border border-slate-200 rounded-lg bg-slate-50 min-h-[48px]">
            {skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-indigo-400 hover:text-indigo-900">
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add key skill + Press Enter"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-xs font-semibold text-slate-900 placeholder-slate-400 flex-1 min-w-[120px]"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-slate-50 rounded"
          />
          <Label htmlFor="isActive" className="text-sm font-semibold text-slate-800">
            Publish and make active immediately
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !title || !description || !salaryRange}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-lg py-3 text-base shadow"
        >
          {isLoading ? "Posting Role..." : "Post Job Opportunity"}
        </Button>

      </form>
    </div>
  );
}