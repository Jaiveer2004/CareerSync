"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 group-hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">C</span>
              </div>
              <span className="font-serif font-bold text-2xl text-slate-900 tracking-tight">
                CareerSync
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">
              Browse Roles
            </Link>
            <Link href="/companies" className="text-sm font-medium text-slate-600 hover:text-indigo-700 transition-colors">
              Companies
            </Link>
            {user ? (
              <div className="flex items-center space-x-6 pl-6 border-l border-slate-200">
                <Link href="/dashboard" className="text-sm font-medium text-slate-900 hover:text-indigo-700 transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <img src={user.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName)} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                  <Button variant="ghost" onClick={logout} className="text-slate-500 hover:text-red-600 ml-2">
                    <span className="sr-only">Logout</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-slate-900 hover:bg-indigo-700 text-white rounded-none px-6">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav... */}
    </nav>
  );
}
