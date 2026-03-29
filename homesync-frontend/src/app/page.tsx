"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { FixoraLoader } from "@/components/shared/FixoraLoader";
import { PageTransition } from "@/components/shared/PageTransition";
import { useState, useEffect } from "react";

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
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  // Show loader while initial loading
  if (showLoader) {
    return <FixoraLoader onLoadingComplete={handleLoadingComplete} />;
  }

  const serviceCategories = [
    {
      id: 1,
      title: "Cleaning & Pest Control",
      icon: "🧽",
      services: ["Home Cleaning", "Bathroom Cleaning", "Kitchen Cleaning", "Pest Control"]
    },
    {
      id: 2,
      title: "Appliance Repair",
      icon: "🔧",
      services: ["AC Service", "Washing Machine", "TV Repair", "Refrigerator"]
    },
    {
      id: 3,
      title: "Home Repair & Installation",
      icon: "🔨",
      services: ["Plumber", "Electrician", "Carpenter", "Painter"]
    },
    {
      id: 4,
      title: "Beauty & Wellness",
      icon: "💄",
      services: ["Salon for Women", "Spa Services", "Men's Grooming", "Massage"]
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section with Search */}
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Home services at your 
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent block">
              doorstep
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Trusted professionals for all your home service needs
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">4.8</div>
              <div className="text-gray-400">Service Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">50K+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What are you looking for?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <Link key={category.id} href="/services" className="group">
                <div className="bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-700 transition-all duration-300 hover:scale-105 border border-gray-700">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {category.title}
                  </h3>
                  <div className="text-sm text-gray-400">
                    {category.services.slice(0, 2).join(", ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold text-white">Fixora</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted platform for professional home services. Quality guaranteed.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services" className="hover:text-white transition-colors">All Services</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">For Partners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/partner/onboard" className="hover:text-white transition-colors">Join as Partner</Link></li>
                <li><Link href="/partner/support" className="hover:text-white transition-colors">Partner Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Fixora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}
