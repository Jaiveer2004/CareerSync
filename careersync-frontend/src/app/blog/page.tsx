import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "How to stand out in engineering interviews",
    summary:
      "Prepare concise project narratives, map your impact to business outcomes, and practice system-thinking answers.",
    readTime: "6 min read",
  },
  {
    title: "Resume upgrades for 2026 tech hiring",
    summary:
      "Use role-relevant keywords, measurable impact, and clean structure to improve recruiter shortlisting rates.",
    readTime: "8 min read",
  },
  {
    title: "Negotiating compensation with confidence",
    summary:
      "Frame compensation conversations using market data, scope, and long-term value instead of emotion.",
    readTime: "7 min read",
  },
];

export default function CareerAdvicePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-slate-900 px-6 pb-16 pt-32 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Career Advice</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-white md:text-5xl">
            Practical guidance for every stage of your tech career
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Actionable resources to help you interview better, write stronger resumes, and make smarter role decisions.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14 lg:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">{article.readTime}</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-slate-900">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{article.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 border border-slate-200 bg-white p-8">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Need role-specific help?</h2>
          <p className="mt-3 text-slate-600">
            Browse current openings and apply advice directly to the roles you are targeting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button className="rounded-none bg-slate-900 px-7 text-white hover:bg-indigo-700">Browse Roles</Button>
            </Link>
            <Link href="/support">
              <Button
                variant="outline"
                className="rounded-none border-2 border-slate-900 px-7 text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
