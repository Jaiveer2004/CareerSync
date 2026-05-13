import { Navbar } from "@/components/shared/Navbar";

const channels = [
  {
    title: "General support",
    value: "support@careersync.dev",
    note: "For login, account, and product usage issues.",
  },
  {
    title: "Recruiter onboarding",
    value: "partners@careersync.dev",
    note: "For team setup, hiring workflows, and role publishing help.",
  },
  {
    title: "Security concerns",
    value: "security@careersync.dev",
    note: "For reporting suspicious activity or vulnerability disclosures.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-white px-6 pb-12 pt-32 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Support</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-900 md:text-5xl">We are here to help</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Reach out through the right channel and our team will respond as quickly as possible.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pb-16 lg:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel) => (
            <article key={channel.title} className="border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{channel.title}</h2>
              <p className="mt-3 text-base font-semibold text-indigo-700">{channel.value}</p>
              <p className="mt-3 text-sm text-slate-600">{channel.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="border border-slate-200 bg-white p-6">
            <h3 className="font-serif text-2xl font-semibold text-slate-900">Response targets</h3>
            <p className="mt-3 text-sm text-slate-600">General inquiries: within 24 business hours.</p>
            <p className="mt-2 text-sm text-slate-600">Security concerns: same business day priority triage.</p>
          </div>
          <div className="border border-slate-200 bg-white p-6">
            <h3 className="font-serif text-2xl font-semibold text-slate-900">Include in your message</h3>
            <p className="mt-3 text-sm text-slate-600">Account email, issue summary, steps to reproduce, and screenshots when possible.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
