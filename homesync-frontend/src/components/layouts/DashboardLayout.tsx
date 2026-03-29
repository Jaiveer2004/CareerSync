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
  { name: 'My Bookings', href: '/my-bookings', icon: '📅' },
  { name: 'Messages', href: '/messages', icon: '💬' },
  { 
    name: 'Browse Services', 
    href: '/services', 
    icon: '🔍',
    roles: ['customer']
  },
  { 
    name: 'My Services', 
    href: '/partner/services', 
    icon: '🛠️',
    roles: ['partner']
  },
  { 
    name: 'Create Service', 
    href: '/partner/services/create', 
    icon: '➕',
    roles: ['partner']
  },
  { 
    name: 'Become Partner', 
    href: '/partner/onboard', 
    icon: '⚙️',
    roles: ['customer']
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
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
              <h2 className="text-xl font-bold text-slate-900">HomeSync</h2>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-[#1e40af] text-white shadow-lg'
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
                  <div className="w-10 h-10 bg-[#1e40af] rounded-full flex items-center justify-center">
                    <span className="text-slate-900 font-semibold text-sm">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-gray-200">
                      {user?.fullName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-600 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="md:hidden bg-white shadow-lg p-4 border-b border-slate-200 mt-16">
            <h2 className="text-xl font-bold text-slate-900">HomeSync</h2>
          </div>
          
          {/* Main content area */}
          <main className="flex-1 bg-slate-50 pt-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
