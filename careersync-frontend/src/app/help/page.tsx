import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";

const topics = [
  {
    title: "Account setup",
    details: "Create your profile, verify email, and configure your candidate or company preferences.",
  },
  {
    title: "Applications and bookings",
    details: "Track role applications, service bookings, and status updates in your dashboard.",
  },
  {
    title: "Security and privacy",
    details: "Use 2FA, reset passwords safely, and review our legal and privacy controls.",
  },
  {
    title: "Partner onboarding",
    details: "For hiring teams, set up your organization and publish verified openings quickly.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="px-6 pb-14 pt-32 lg:px-12">
        <div className="mx-auto max-w-5xl border border-slate-200 bg-white p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Help Center</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900 md:text-5xl">How can we help you today?</h1>
          <p className="mt-4 text-slate-600">
            Explore quick guides and support resources for candidates, recruiters, and service partners.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pb-16 lg:px-12">
        <div className="grid gap-5 md:grid-cols-2">
          {topics.map((topic) => (
            <article key={topic.title} className="border border-slate-200 bg-white p-6">
              <h2 className="font-serif text-2xl font-semibold text-slate-900">{topic.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{topic.details}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-none border border-indigo-200 bg-indigo-50 p-6 text-sm text-indigo-900">
          Still need assistance? Reach us directly on the
          <Link href="/support" className="ml-1 font-semibold underline underline-offset-2 hover:text-slate-900">
            Support page
          </Link>
          .
        </div>
      </main>
    </div>
  );
}
