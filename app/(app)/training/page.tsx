const spotlight = {
  title: "From idea to production: blueprinting micro-automations",
  duration: "14 min video",
  description: "Learn how to translate a business objective into a governed automation with guardrails, prompts, and success metrics.",
  tags: ["Blueprint", "Governance", "AI Adoption"]
};

const collections = [
  {
    title: "Executive briefing",
    description: "Seven episodes to align leadership on GenAI guardrails and investment.",
    items: 7,
    format: "Podcast series"
  },
  {
    title: "Prompt craft lab",
    description: "Hands-on tutorials for writing resilient prompts and evaluation harnesses.",
    items: 12,
    format: "Interactive tutorials"
  },
  {
    title: "Change management",
    description: "Workshops and playbooks to scale AI literacy across teams.",
    items: 9,
    format: "Article & workshop mix"
  }
];

const upcoming = [
  {
    title: "Live lab: automation observability",
    date: "May 8",
    host: "Ops Guild",
    status: "RSVP open"
  },
  {
    title: "Office hours: prompt evaluation",
    date: "May 10",
    host: "Applied AI",
    status: "Waitlist"
  }
];

export default function TrainingPage() {
  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Enablement</p>
            <h1 className="text-3xl font-semibold text-slate-100">Training & Culture Library</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Centralize learning paths, campaigns, and culture content to keep teams sharp on GenAI best practices. Track completion, surface transcripts, and connect insights back to automation performance.
            </p>
          </div>
          <div className="space-y-3">
            <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
              Upload media
            </button>
            <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
              Create pathway
            </button>
          </div>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-slate-900/60 to-slate-950/80 p-6 shadow-glow">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Spotlight</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">{spotlight.title}</h2>
            <p className="mt-2 text-sm text-slate-200">{spotlight.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-accent/80">
              <span>{spotlight.duration}</span>
              {spotlight.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-accent/40 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <button className="mt-6 rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-slate-950">
              Watch now
            </button>
          </article>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-100">Collections</h3>
              <button className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
                Manage tags
              </button>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {collections.map((collection) => (
                <li key={collection.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{collection.title}</p>
                      <p className="text-xs text-slate-400">{collection.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>{collection.items} items</p>
                      <p>{collection.format}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-sm font-semibold text-slate-200">Upcoming live sessions</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-300">
              {upcoming.map((session) => (
                <li key={session.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3">
                  <p className="text-slate-200">{session.title}</p>
                  <p>{session.date} · {session.host}</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{session.status}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-sm font-semibold text-slate-200">Enablement metrics</h3>
            <dl className="mt-3 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <dt>Completion (last 30d)</dt>
                <dd className="font-mono text-emerald-400">82%</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Avg. session rating</dt>
                <dd className="font-mono text-accent">4.7 / 5</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Net new participants</dt>
                <dd className="font-mono text-slate-200">164</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
