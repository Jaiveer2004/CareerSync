"use client";

import Link from "next/link";
import { Building2, Globe2, Rocket, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

const featuredCompanies = [
  {
    name: "Aether Labs",
    hiring: "Platform Engineers, AI Infra",
    type: "Series C",
    location: "Bengaluru + Remote",
  },
  {
    name: "Northstar Systems",
    hiring: "Backend, SRE, Security",
    type: "Enterprise",
    location: "Pune, Hyderabad",
  },
  {
    name: "Pulse Commerce",
    hiring: "Product, Frontend, Data",
    type: "Growth Stage",
    location: "Mumbai + Remote",
  },
  {
    name: "Vertex Cloud",
    hiring: "DevOps, Cloud Architects",
    type: "Unicorn",
    location: "Delhi NCR",
  },
  {
    name: "Nimbus HealthTech",
    hiring: "Full Stack, QA Automation",
    type: "Scale-up",
    location: "Chennai + Remote",
  },
  {
    name: "Craft Ledger",
    hiring: "Data Engineers, Analysts",
    type: "FinTech",
    location: "Bengaluru",
  },
];

const pillars = [
  {
    title: "Verified hiring teams",
    description: "Each company profile is validated before posting to keep quality consistently high.",
    icon: ShieldCheck,
  },
  {
    title: "Faster shortlisting",
    description: "Role-specific workflows reduce noisy applications and improve interview conversion.",
    icon: Rocket,
  },
  {
    title: "Global-ready talent",
    description: "Access candidate pools across India and remote-ready regions for modern teams.",
    icon: Globe2,
  },
];

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-32 pb-20 px-6 lg:px-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <span className="inline-flex items-center gap-2 border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold tracking-widest text-indigo-300 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Hiring Network
          </span>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
                Meet companies that hire for real engineering impact
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-300">
                CareerSync helps ambitious teams discover strong technical talent faster, with cleaner workflows and better signal.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-700 bg-slate-800/70 p-5">
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="mt-1 text-xs tracking-wider text-slate-400 uppercase">Hiring companies</p>
              </div>
              <div className="border border-slate-700 bg-slate-800/70 p-5">
                <p className="text-3xl font-bold text-indigo-300">10k+</p>
                <p className="mt-1 text-xs tracking-wider text-slate-400 uppercase">Placements/month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center bg-indigo-50 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-slate-900">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">Featured hiring partners</h2>
              <p className="mt-2 text-slate-600">A sample of teams actively recruiting through CareerSync.</p>
            </div>
            <Link href="/jobs" className="text-sm font-semibold text-indigo-700 hover:text-slate-900">
              Explore open roles →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCompanies.map((company) => (
              <article key={company.name} className="border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-300">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-serif text-2xl font-semibold text-slate-900">{company.name}</h3>
                  <span className="border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    {company.type}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{company.hiring}</p>
                <div className="mt-5 flex items-center gap-2 text-xs tracking-wide text-slate-500 uppercase">
                  <Building2 className="h-3.5 w-3.5" />
                  {company.location}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-16 lg:px-12">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-serif text-3xl font-bold text-slate-900">How companies hire on CareerSync</h2>
            <p className="mt-3 text-slate-600">
              A practical workflow focused on speed, candidate quality, and hiring team efficiency.
            </p>
          </div>

          <ol className="space-y-5">
            <li className="border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold tracking-wide text-indigo-700 uppercase">Step 1</p>
              <p className="mt-1 font-medium text-slate-900">Create your company hiring profile</p>
              <p className="mt-2 text-sm text-slate-600">Share your stack, interview stages, and hiring priorities.</p>
            </li>
            <li className="border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold tracking-wide text-indigo-700 uppercase">Step 2</p>
              <p className="mt-1 font-medium text-slate-900">Publish role requirements</p>
              <p className="mt-2 text-sm text-slate-600">Target engineering domains, experience, and compensation clearly.</p>
            </li>
            <li className="border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold tracking-wide text-indigo-700 uppercase">Step 3</p>
              <p className="mt-1 font-medium text-slate-900">Shortlist with better candidate signal</p>
              <p className="mt-2 text-sm text-slate-600">Use profile depth and relevance signals to prioritize interview slots.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-7xl mx-auto border border-slate-200 bg-white p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl font-bold text-slate-900 md:text-4xl">
                Build your next high-performing engineering team
              </h2>
              <p className="mt-3 text-slate-600">
                Start with a verified profile and begin hiring in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/employer/onboard">
                <Button className="w-full rounded-none bg-slate-900 px-8 py-6 text-white hover:bg-indigo-700 sm:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Start Hiring
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  variant="outline"
                  className="w-full rounded-none border-2 border-slate-900 px-8 py-6 text-slate-900 hover:bg-slate-900 hover:text-white sm:w-auto"
                >
                  View Candidate Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
