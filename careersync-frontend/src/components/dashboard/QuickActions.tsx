"use client";

import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  icon: string;
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
      icon: "🔍",
      href: "/services",
      color: "indigo",
      cta: "Browse roles"
    },
    {
      title: "My Applications",
      description: "Track interview progress and responses",
      icon: "📅",
      href: "/my-bookings",
      color: "slate",
      cta: "View tracker"
    },
    {
      title: "Profile Settings",
      description: "Update account, resume and salary preference",
      icon: "⚙️",
      href: "/profile",
      color: "slateDark",
      cta: "Update profile"
    }
  ];

  const partnerActions: QuickAction[] = [
    {
      title: "Post a Job",
      description: "Publish openings for talent across India",
      icon: "➕",
      href: "/partner/services/create",
      color: "indigo",
      cta: "Create posting"
    },
    {
      title: "Manage Postings",
      description: "Monitor active listings and hiring pipeline",
      icon: "📋",
      href: "/partner/services",
      color: "slate",
      cta: "Manage roles"
    },
    {
      title: "Profile Settings",
      description: "Manage company account",
      icon: "⚙️",
      href: "/profile",
      color: "slateDark",
      cta: "Open settings"
    }
  ];

  const actions = userRole === 'partner' ? partnerActions : customerActions;

  const colorClasses = {
    indigo: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:border-blue-500',
    slate: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:border-slate-400',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-500',
    slateDark: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-emerald-500 text-white'
  };

  const textClasses = {
    indigo: 'text-blue-900',
    slate: 'text-slate-900',
    emerald: 'text-emerald-900',
    slateDark: 'text-white'
  };

  const descClasses = {
    indigo: 'text-blue-700',
    slate: 'text-slate-600',
    emerald: 'text-emerald-700',
    slateDark: 'text-slate-400'
  };

  const ctaClasses = {
    indigo: 'text-blue-800',
    slate: 'text-slate-800',
    emerald: 'text-emerald-800',
    slateDark: 'text-emerald-300'
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-serif text-slate-900">Quick Actions</h3>
        <span className="text-xs uppercase tracking-wide text-slate-500">Jump faster</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg block h-full cursor-pointer ${colorClasses[action.color]}`}>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 text-2xl mb-4 shadow-sm">{action.icon}</div>
              <h4 className={`font-bold mb-2 ${textClasses[action.color]}`}>{action.title}</h4>
              <p className={`text-sm ${descClasses[action.color]}`}>{action.description}</p>
              <p className={`mt-4 text-sm font-semibold ${ctaClasses[action.color]}`}>{action.cta} →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
