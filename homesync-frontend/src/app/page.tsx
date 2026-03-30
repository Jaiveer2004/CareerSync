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

  // Show loader while initial loading
  if (showLoader) {
    return <Loader onLoadingComplete={handleLoadingComplete} />;
  }

  const serviceCategories = [
    {
      id: 1,
      title: "Software Engineering",
      icon: "💻",
      services: ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "DevOps Engineer"]
    },
    {
      id: 2,
      title: "Data & AI",
      icon: "🧠",
      services: ["Data Scientist", "Data Engineer", "Machine Learning", "AI Researcher"]
    },
    {
      id: 3,
      title: "Product & Design",
      icon: "🎨",
      services: ["Product Manager", "UI/UX Designer", "Product Designer", "User Researcher"]
    },
    {
      id: 4,
      title: "Infrastructure & Security",
      icon: "🛡️",
      services: ["Cloud Architect", "Security Engineer", "SRE", "Network Engineer"]
    }
  ];

  // Get featured services (most reviewed or highest rated)
  const featuredServices = services
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 4);

  // Get services by category
  const getServicesByCategory = (categoryName: string) => {
    const categoryMap: { [key: string]: string[] } = {
      'Software Engineering': ['Development', 'Engineering'],
      'Data & AI': ['Data', 'Machine Learning'],
      'Product & Design': ['Product', 'Design'],
      'Infrastructure & Security': ['Cloud', 'Security', 'DevOps']
    };
    
    const categories = categoryMap[categoryName] || [];
    return services.filter(service => 
      categories.some(cat => service.category.toLowerCase().includes(cat.toLowerCase()))
    ).slice(0, 6);
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <p className="text-sm font-semibold tracking-widest text-[#1e40af] uppercase mb-4">
            Top Tech Talent at Your Fingertips
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-serif leading-tight">
            Your Next Engineering Role,<br />
            <span className="text-[#1e40af]">Synchronized</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From junior developers to lead architects, CareerSync connects you with top-tier tech opportunities using our advanced ATS platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/services">
              <Button className="w-full sm:w-auto px-8 py-6 text-lg bg-[#1e40af] hover:bg-blue-900 text-white rounded-lg shadow-md transition-all">
                Find a Job
              </Button>
            </Link>
            <Link href="#categories">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
                Explore Roles
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">4.8</div>
              <div className="text-slate-500 font-medium">Average Service Rating</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">50K+</div>
              <div className="text-slate-500 font-medium">Hired Candidates</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 px-10 shadow-sm w-full sm:w-auto flex-1 max-w-[240px]">
              <div className="text-4xl font-bold text-[#1e40af] mb-2">1,200+</div>
              <div className="text-slate-500 font-medium">Verified Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What role are you looking for?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <Link key={category.id} href="/services" className="group">
                <div className="bg-white rounded-2xl p-6 text-center hover:bg-slate-100 transition-all duration-300 hover:scale-105 border border-slate-200">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-slate-900 font-semibold mb-2 group-hover:text-[#1e40af] transition-colors">
                    {category.title}
                  </h3>
                  <div className="text-sm text-slate-500">
                    {category.services.slice(0, 2).join(", ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Highest paying tech roles</h2>
            <Link href="/services" className="text-[#1e40af] hover:text-blue-300 font-medium">
              See all →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
                  <div className="h-48 bg-slate-100"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-100 rounded mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded mb-4 w-2/3"></div>
                    <div className="h-3 bg-slate-100 rounded mb-4 w-1/2"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-slate-100 rounded w-16"></div>
                      <div className="h-8 bg-slate-100 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <Link key={service._id} href={`/services/${service._id}`} className="group">
                  <div className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
                    <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                          {service.reviewCount > 100 ? 'Most Booked' : 'Popular'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-slate-900 font-semibold text-lg mb-2 group-hover:text-[#1e40af] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">{service.category}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-slate-900 font-medium ml-1">
                              {service.averageRating ? service.averageRating.toFixed(1) : '4.5'}
                            </span>
                          </div>
                          <span className="text-slate-500 text-sm">
                            ({formatReviewCount(service.reviewCount || 0)})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-slate-900">₹{service.price}</span>
                        <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-6 py-2 rounded-xl">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto space-y-16">
          {serviceCategories.map((category) => {
            const categoryServices = getServicesByCategory(category.title);
            return (
              <div key={category.id}>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">{category.title}</h2>
                  <Link href="/services" className="text-[#1e40af] hover:text-blue-300 font-medium">
                    See all →
                  </Link>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                        <div className="h-20 bg-slate-100 rounded-lg mb-3"></div>
                        <div className="h-4 bg-slate-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : categoryServices.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categoryServices.map((service) => (
                      <Link key={service._id} href={`/services/${service._id}`} className="group">
                        <div className="bg-white rounded-xl p-4 text-center hover:bg-slate-100 transition-all duration-300 border border-slate-200">
                          <div className={`h-20 rounded-lg mb-3 flex items-center justify-center ${
                            category.id === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            category.id === 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            category.id === 3 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                            'bg-gradient-to-br from-pink-500 to-pink-600'
                          }`}>
                            <span className="text-2xl">{category.icon}</span>
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 group-hover:text-[#1e40af] transition-colors mb-1">
                            {service.name}
                          </h3>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-xs text-slate-500">
                              {service.averageRating ? service.averageRating.toFixed(1) : '4.5'}
                            </span>
                          </div>
                          <p className="text-xs text-[#1e40af] font-medium">₹{service.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.services.map((service, index) => (
                      <Link key={index} href="/services" className="group">
                        <div className="bg-white rounded-xl p-4 text-center hover:bg-slate-100 transition-all duration-300 border border-slate-200">
                          <div className={`h-20 rounded-lg mb-3 flex items-center justify-center ${
                            category.id === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            category.id === 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            category.id === 3 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                            'bg-gradient-to-br from-pink-500 to-pink-600'
                          }`}>
                            <span className="text-2xl">{category.icon}</span>
                          </div>
                          <h3 className="text-sm font-medium text-slate-900 group-hover:text-[#1e40af] transition-colors">
                            {service}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied candidates who discovered their next big role on CareerSync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/services">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Book a Service
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link href="/partner/onboard">
                  <Button size="lg" variant="outline" className="border-white text-slate-900 hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                    Post a Role
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900">CareerSync</span>
              </div>
              <p className="text-slate-500 mb-4">
                Your trusted platform for top tech opportunities. Quality guaranteed.
              </p>
            </div>
            
            <div>
              <h3 className="text-slate-900 font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/about" className="hover:text-slate-900 transition-colors">About us</Link></li>
                <li><Link href="/careers" className="hover:text-slate-900 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 font-semibold mb-4">For Candidates</h3>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/services" className="hover:text-slate-900 transition-colors">All Roles</Link></li>
                <li><Link href="/reviews" className="hover:text-slate-900 transition-colors">Company Reviews</Link></li>
                <li><Link href="/help" className="hover:text-slate-900 transition-colors">Career Advice</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-slate-900 font-semibold mb-4">For Companies</h3>
              <ul className="space-y-3 text-slate-600">
                <li><Link href="/partner/onboard" className="hover:text-slate-900 transition-colors">Join as Recruiter</Link></li>
                <li><Link href="/partner/support" className="hover:text-slate-900 transition-colors">Company Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2025 CareerSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}
