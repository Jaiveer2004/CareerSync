"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Loader } from "@/components/shared/Loader";
import { PageTransition } from "@/components/shared/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { getAllServices } from "@/services/apiService";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  partner: {
    user: {
      fullName: string;
      profilePicture: string;
    };
    bio: string;
    averageRating: number;
  };
  reviewCount: number;
  averageRating: number;
}

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getAllServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  if (showLoader) {
    return <Loader onLoadingComplete={handleLoadingComplete} />;
  }

  const serviceCategories = [
    {
      id: 1,
      title: "Software Engineering",
      icon: "💻",
      desc: "Frontend, Backend, Full Stack & Architecture roles.",
    },
    {
      id: 2,
      title: "Data & AI",
      icon: "🧠",
      desc: "Data Science, Machine Learning, & AI Engineering.",
    },
    {
      id: 3,
      title: "Product & Design",
      icon: "🎨",
      desc: "Product Strategy, UI/UX, & User Research.",
    },
    {
      id: 4,
      title: "Infrastructure & Security",
      icon: "🛡️",
      desc: "Cloud, DevOps, SRE, & Cybersecurity positions.",
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        
        {/* Modern Split Hero Section */}
        <section className="pt-32 pb-24 px-6 lg:px-12 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
            <div className="flex-1 text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wider mb-6 border border-indigo-100">
                🚀 TOP TECH TALENT AT YOUR FINGERTIPS
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 font-serif leading-tight">
                Your Next Engineering Role, <br />
                <span className="text-indigo-700 italic">Synchronized</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                From junior developers to lead architects, CareerSync connects you with top-tier tech opportunities using our advanced ATS platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/services">
                  <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-indigo-700 hover:bg-slate-900 text-white rounded-none shadow-xl transition-all">
                    Find a Job
                  </Button>
                </Link>
                <Link href="#categories">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-none transition-all">
                    Explore Roles
                  </Button>
                </Link>
              </div>

              <div className="flex gap-10 items-center">
                <div>
                  <h4 className="text-3xl font-serif font-bold text-slate-900">500+</h4>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Hiring Companies</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div>
                  <h4 className="text-3xl font-serif font-bold text-indigo-700">10k+</h4>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Monthly Placements</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative align-center items-center justify-center hidden lg:flex">
                <div className="absolute inset-0 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl relative z-10 w-full max-w-md border border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-slate-400 text-xs font-mono">careersync.sh</span>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <p className="text-emerald-400">$ init <span className="text-slate-300">career_search</span></p>
                        <p className="text-indigo-400">Loading profiles...</p>
                        <p className="text-slate-300">Found 3 matching roles for: <span className="text-white font-bold">Senior Full Stack</span></p>
                        <div className="bg-slate-800 p-3 rounded text-slate-300 border-l-2 border-indigo-500">
                            → TechCorp Inc. (Offer: $150k - $180k)
                        </div>
                        <div className="bg-slate-800 p-3 rounded text-slate-300 border-l-2 border-slate-600">
                            → NextGen Startups (Offer: $140k + Equity)
                        </div>
                        <p className="text-emerald-400">$ apply <span className="text-slate-300">--all</span></p>
                        <p className="text-indigo-400 animate-pulse">Applications submitted successfully_</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Dark Mode Masonry */}
        <section id="categories" className="py-24 px-6 lg:px-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold font-serif mb-4">Discover Your Domain</h2>
                <p className="text-lg text-slate-400">Leverage our semantic matching to find the exact role that fits your tech stack and career trajectory.</p>
              </div>
              <Link href="/services">
                <Button variant="ghost" className="text-indigo-400 hover:text-white hover:bg-slate-800 font-medium rounded-none border-b border-indigo-400">
                  View All Roles →
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceCategories.map((category) => (
                <Link key={category.id} href="/services" className="group">
                  <div className="bg-slate-800/50 rounded-none p-8 h-full border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-2">
                    <div className="text-4xl mb-6">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {category.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-12 bg-indigo-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Ready to Accelerate Your Hiring?</h2>
            <p className="text-xl text-indigo-100 mb-10">Join top tech companies recruiting on CareerSync.</p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link href="/partner/onboard">
                <Button className="bg-white text-indigo-900 hover:bg-slate-100 rounded-none px-10 py-6 text-lg font-bold shadow-lg">
                  Post a Role
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-2 border-white text-slate-900 hover:bg-white hover:text-indigo-900 rounded-none px-10 py-6 text-lg font-bold">
                  Join as Candidate
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
                  <div className="w-8 h-8 bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-serif font-bold">C</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 font-serif">CareerSync</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  The premier synchronization point for outstanding engineering talent and forward-thinking companies.
                </p>
              </div>
              
              <div>
                <h4 className="text-slate-900 font-bold mb-6 tracking-wide text-sm uppercase">Platform</h4>
                <ul className="space-y-4 text-slate-500 text-sm">
                  <li><Link href="/about" className="hover:text-indigo-700 transition-colors">About Us</Link></li>
                  <li><Link href="/services" className="hover:text-indigo-700 transition-colors">Browse Jobs</Link></li>
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
                {/* Social Placeholders */}
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
