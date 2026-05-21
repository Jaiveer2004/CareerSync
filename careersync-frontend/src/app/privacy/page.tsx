import { Navbar } from "@/components/shared/Navbar";

const sections = [
  {
    title: "Information we collect",
    content:
      "We collect account details, profile data, role preferences, communication records, and platform activity needed to operate CareerSync.",
  },
  {
    title: "How we use your information",
    content:
      "Data is used to deliver core platform features, improve matching quality, prevent abuse, and provide support when requested.",
  },
  {
    title: "Data sharing",
    content:
      "We share relevant profile data with verified recruiters or candidates only as needed for hiring and application workflows.",
  },
  {
    title: "Retention and security",
    content:
      "We retain data for legitimate business and legal needs, and protect it with access controls, encryption, and monitoring safeguards.",
  },
  {
    title: "Your rights",
    content:
      "You can request profile updates, data exports, or account deletion by contacting support from your registered email address.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="px-6 pb-12 pt-32 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Legal</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900 md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: 31 March 2026</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl space-y-5 px-6 pb-16 lg:px-12">
        {sections.map((section) => (
          <article key={section.title} className="border border-slate-200 bg-white p-6 md:p-7">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{section.content}</p>
          </article>
        ))}
      </main>
    </div>
  );
}
