"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles?: string[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'My Applications', href: '/my-bookings', icon: '📅' },
  { name: 'Messages', href: '/messages', icon: '💬' },
  { 
    name: 'Browse Roles', 
    href: '/services', 
    icon: '🔍',
    roles: ['customer']
  },
  { 
    name: 'Manage Roles', 
    href: '/partner/services', 
    icon: '🛠️',
    roles: ['partner']
  },
  { 
    name: 'Post a Role', 
    href: '/partner/services/create', 
    icon: '➕',
    roles: ['partner']
  },
  { 
    name: 'Company Profile', 
    href: '/partner/onboard', 
    icon: '⚙️',
    roles: ['customer']
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || 'customer');
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto shadow-xl border-r border-slate-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <h2 className="text-2xl font-bold font-serif text-slate-900">CareerSync</h2>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-3 space-y-2">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-700 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="mr-3 text-lg" aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            {/* User info at bottom */}
            <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-gray-200">
                      {user?.fullName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-600 capitalize">
                      {user?.role === "customer" ? "Candidate" : "Company"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          {/* Top Navbar */}
          <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="h-16 flex items-center justify-between">
                <div className="md:hidden flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">CareerSync</h2>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <Link href="/services" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Browse Roles</Link>
                  <Link href="/companies" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Companies</Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role === 'customer' ? 'Candidate' : 'Company'}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="w-9 h-9 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                  >
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-600 transition-colors"
                    aria-label="Logout"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="md:hidden bg-white shadow-sm p-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          </div>
          
          {/* Main content area */}
          <main className="flex-1 bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
