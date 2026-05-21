import { Navbar } from "@/components/shared/Navbar";

const clauses = [
  {
    title: "Acceptance of terms",
    content:
      "By using CareerSync, you agree to these terms, applicable policies, and any related legal notices provided on the platform.",
  },
  {
    title: "Account responsibilities",
    content:
      "You are responsible for keeping account credentials secure and ensuring profile information is accurate and lawful.",
  },
  {
    title: "Permitted use",
    content:
      "You may use the platform for legitimate hiring and career activities only. Misuse, scraping, fraud, and abuse are prohibited.",
  },
  {
    title: "Content and conduct",
    content:
      "Users must not submit misleading, harmful, infringing, or unlawful content. We may remove violating content without notice.",
  },
  {
    title: "Service availability",
    content:
      "We aim for reliable availability but cannot guarantee uninterrupted service. Features may evolve or change over time.",
  },
  {
    title: "Limitation of liability",
    content:
      "CareerSync is provided as-is to the extent permitted by law. We are not liable for indirect, incidental, or consequential losses.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-white px-6 pb-12 pt-32 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900 md:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: 31 March 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl space-y-5 px-6 pb-16 lg:px-12">
        {clauses.map((clause) => (
          <article key={clause.title} className="border border-slate-200 bg-white p-6 md:p-7">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">{clause.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{clause.content}</p>
          </article>
        ))}
      </main>
    </div>
  );
}
