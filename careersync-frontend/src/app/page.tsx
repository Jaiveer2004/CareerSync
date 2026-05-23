"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, BrainCircuit, PenTool, ShieldCheck, ArrowRight, Search, MapPin, Briefcase } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [workMode, setWorkMode] = useState("All");

  const serviceCategories = [
    {
      id: 1,
      title: "Software Engineering",
      icon: <Code2 className="w-8 h-8 text-indigo-400" />,
      desc: "Frontend, Backend, Full Stack & Architecture roles.",
    },
    {
      id: 2,
      title: "Data & AI",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />,
      desc: "Data Science, Machine Learning, & AI Engineering.",
    },
    {
      id: 3,
      title: "Product & Design",
      icon: <PenTool className="w-8 h-8 text-indigo-400" />,
      desc: "Product Strategy, UI/UX, & User Research.",
    },
    {
      id: 4,
      title: "Infrastructure & Security",
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      desc: "Cloud, DevOps, SRE, & Cybersecurity positions.",
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (location) params.append("location", location);
    if (workMode !== "All") params.append("workMode", workMode);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        
        {/* Modern Split Hero Section with Naukri-Style Search */}
        <section className="pt-32 pb-24 px-6 lg:px-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-semibold tracking-wider mb-6 border border-indigo-500/20">
              🚀 Discover India's Leading Next-Gen Job Board
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight max-w-4xl">
              Find Your Dream Job & <br className="hidden md:inline" />
              <span className="text-indigo-400 italic">Accelerate</span> Your Technical Career
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl">
              Connect with top tech product companies using our AI ATS matching matching software. Instant cover letters, resume parser, and direct recruiter chat.
            </p>
            
            {/* Naukri-Style Advanced Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-5xl bg-white p-3 rounded-xl shadow-2xl flex flex-col lg:flex-row gap-2 text-slate-900 border border-slate-700/30">
              {/* Role Search */}
              <div className="flex-1 relative flex items-center min-w-0 border-b lg:border-b-0 lg:border-r border-slate-200 py-2 px-3">
                <Search className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter skills, designations, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-500 font-medium"
                />
              </div>
              
              {/* Location Search */}
              <div className="lg:w-64 relative flex items-center border-b lg:border-b-0 lg:border-r border-slate-200 py-2 px-3">
                <MapPin className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g., Bengaluru)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-500 font-medium"
                />
              </div>

              {/* Work Mode */}
              <div className="lg:w-48 relative flex items-center py-2 px-3">
                <Briefcase className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 font-medium appearance-none cursor-pointer"
                >
                  <option value="All">All Work Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Search Button */}
              <Button type="submit" className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 py-6 text-lg font-bold shadow-lg transition-all flex items-center justify-center">
                Search Jobs
              </Button>
            </form>

            {/* Trending Keywords tags */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-2.5 max-w-3xl">
              <span className="text-slate-400 text-sm font-medium">Trending searches:</span>
              {["React", "Node.js", "AI Engineer", "DevOps", "Data Science", "TypeScript", "Product Manager"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="text-xs px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick stats panel */}
            <div className="mt-16 flex gap-12 items-center justify-center flex-wrap">
              <div className="text-center">
                <h4 className="text-3xl md:text-4xl font-serif font-bold text-white">500+</h4>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Active Recruiters</p>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
              <div className="text-center">
                <h4 className="text-3xl md:text-4xl font-serif font-bold text-indigo-400">12k+</h4>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Placements This Year</p>
              </div>
              <div className="w-px h-10 bg-slate-800 hidden md:block"></div>
              <div className="text-center">
                <h4 className="text-3xl md:text-4xl font-serif font-bold text-white">96.8%</h4>
                <p className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">AI Match Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Clean & Professional */}
        <section id="categories" className="py-24 px-6 lg:px-12 bg-slate-50 text-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold font-serif mb-4 text-slate-900 tracking-tight">Explore Roles by Category</h2>
                <p className="text-lg text-slate-500 leading-relaxed">Leverage our semantic matching to find the exact role that fits your tech stack and career trajectory.</p>
              </div>
              <Link href="/jobs" className="group flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                View All Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceCategories.map((category) => (
                <Link key={category.id} href={`/jobs?search=${encodeURIComponent(category.title)}`} className="group block h-full">
                  <div className="relative bg-white rounded-xl p-8 h-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-indigo-600 transition-colors duration-300" />
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {category.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Hiring Section - Top Companies */}
        <section className="py-20 px-6 lg:px-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-8">Top Companies Hiring Right Now</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center opacity-60 hover:opacity-85 transition-opacity">
              {["Google", "Microsoft", "Amazon", "Infosys", "Wipro", "TCS"].map((company) => (
                <div key={company} className="flex items-center justify-center p-4 border border-slate-200 rounded hover:shadow-sm cursor-pointer transition-shadow" onClick={() => handleTagClick(company)}>
                  <span className="font-bold text-lg text-slate-700 tracking-tight font-serif">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Split CTA Section */}
        <section className="py-24 px-6 lg:px-12 bg-gradient-to-r from-indigo-700 to-blue-800 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="flex-1 max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">Are You Ready to Recruit Tech Talent?</h2>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Connect with thousands of developers and tech professionals. Leverage our resume parsing and candidate ranking to automate your screening funnel.
              </p>
              <Link href="/employer/jobs/create">
                <Button className="bg-white text-indigo-900 hover:bg-slate-100 rounded-lg px-8 py-6 text-base font-bold shadow-lg">
                  Create a Job Posting
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-px h-px md:h-64 bg-indigo-500/40"></div>
            <div className="flex-1 max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">Looking to Apply For Roles?</h2>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Build your professional profile instantly. Drag-and-drop your resume to automatically parse skills and experience into a clean ATS-friendly profile.
              </p>
              <Link href="/profile">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-900 rounded-lg px-8 py-6 text-base font-bold">
                  Upload Resume & Join
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Professional Footer */}
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-indigo-700 flex items-center justify-center rounded">
                    <span className="text-white font-serif font-bold text-lg">C</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 font-serif">CareerSync</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  The premier tech job board connecting outstanding developers, analysts, and designers with fast-growing technical product teams.
                </p>
              </div>
              
              <div>
                <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-sm uppercase">Platform</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                  <li><Link href="/about" className="hover:text-indigo-700 transition-colors">About Us</Link></li>
                  <li><Link href="/jobs" className="hover:text-indigo-700 transition-colors">Browse Jobs</Link></li>
                  <li><Link href="/companies" className="hover:text-indigo-700 transition-colors">Companies</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-sm uppercase">Resources</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                  <li><Link href="/blog" className="hover:text-indigo-700 transition-colors">Career Advice</Link></li>
                  <li><Link href="/help" className="hover:text-indigo-700 transition-colors">Help Center</Link></li>
                  <li><Link href="/support" className="hover:text-indigo-700 transition-colors">Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-sm uppercase">Legal</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                  <li><Link href="/privacy" className="hover:text-indigo-700 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-indigo-700 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} CareerSync. All rights reserved.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-100 cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-100 cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-100 cursor-pointer transition-colors"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
