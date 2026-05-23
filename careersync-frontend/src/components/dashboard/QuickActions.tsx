"use client";

import Link from "next/link";
import React from "react";
import { Search, Calendar, Settings, PlusCircle, Briefcase } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: 'indigo' | 'slate' | 'emerald' | 'slateDark';
  cta: string;
}

interface QuickActionsProps {
  userRole: string;
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const customerActions: QuickAction[] = [
    {
      title: "Find Jobs",
      description: "Discover top product and startup roles in India",
      icon: Search,
      href: "/jobs",
      color: "indigo",
      cta: "Browse roles"
    },
    {
      title: "My Applications",
      description: "Track interview progress and responses",
      icon: Calendar,
      href: "/applications",
      color: "slate",
      cta: "View tracker"
    },
    {
      title: "Profile Settings",
      description: "Update account, resume and salary preference",
      icon: Settings,
      href: "/profile",
      color: "slateDark",
      cta: "Update profile"
    }
  ];

  const partnerActions: QuickAction[] = [
    {
      title: "Post a Job",
      description: "Publish openings for talent across India",
      icon: PlusCircle,
      href: "/employer/jobs/create",
      color: "indigo",
      cta: "Create posting"
    },
    {
      title: "Manage Postings",
      description: "Monitor active listings and hiring pipeline",
      icon: Briefcase,
      href: "/employer/jobs",
      color: "slate",
      cta: "Manage roles"
    },
    {
      title: "Profile Settings",
      description: "Manage company account",
      icon: Settings,
      href: "/profile",
      color: "slateDark",
      cta: "Open settings"
    }
  ];

  const actions = userRole === 'partner' ? partnerActions : customerActions;

  const colorClasses = {
    indigo: 'bg-gradient-to-br from-indigo-50/80 to-blue-50/30 border-indigo-100 hover:border-indigo-400 hover:shadow-indigo-100/40',
    slate: 'bg-gradient-to-br from-slate-50/80 to-zinc-50/30 border-slate-200/80 hover:border-indigo-400/80 hover:shadow-indigo-100/40',
    emerald: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/30 border-emerald-100 hover:border-emerald-400 hover:shadow-emerald-100/40',
    slateDark: 'bg-gradient-to-br from-slate-900 to-indigo-950 border-slate-850 hover:border-indigo-500 shadow-md shadow-slate-950/10 hover:shadow-indigo-500/10 text-white'
  };

  const textClasses = {
    indigo: 'text-slate-900',
    slate: 'text-slate-900',
    emerald: 'text-slate-900',
    slateDark: 'text-white'
  };

  const descClasses = {
    indigo: 'text-slate-600/85 text-xs',
    slate: 'text-slate-600/85 text-xs',
    emerald: 'text-slate-600/85 text-xs',
    slateDark: 'text-indigo-200/70 text-xs'
  };

  const ctaClasses = {
    indigo: 'text-indigo-600 group-hover:text-indigo-700',
    slate: 'text-indigo-600 group-hover:text-indigo-700',
    emerald: 'text-emerald-600 group-hover:text-emerald-700',
    slateDark: 'text-indigo-300 group-hover:text-indigo-250'
  };

  const iconWrapperClasses = {
    indigo: 'bg-indigo-50 border-indigo-100/80 text-indigo-600',
    slate: 'bg-indigo-50 border-indigo-100/80 text-indigo-600',
    emerald: 'bg-emerald-50 border-emerald-100/80 text-emerald-600',
    slateDark: 'bg-white/10 border-white/10 text-indigo-300'
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shortcuts</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} className="block h-full">
              <div className={`border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm flex flex-col justify-between h-full cursor-pointer group ${colorClasses[action.color]}`}>
                <div>
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border mb-3.5 shadow-sm group-hover:scale-105 transition-transform ${iconWrapperClasses[action.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className={`font-bold text-base mb-1.5 ${textClasses[action.color]}`}>{action.title}</h4>
                  <p className={`leading-relaxed ${descClasses[action.color]}`}>{action.description}</p>
                </div>
                <p className={`mt-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${ctaClasses[action.color]}`}>
                  {action.cta} 
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


