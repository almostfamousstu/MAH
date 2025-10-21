const roadmap = [
  {
    quarter: "Q2",
    focus: "Authoring workbench",
    detail: "Visual builder for chaining services, versioned prompts, and simulation runs.",
    status: "In progress"
  },
  {
    quarter: "Q2",
    focus: "Telemetry sync",
    detail: "Real-time ingestion of automation logs and metrics into the insights layer.",
    status: "In design"
  },
  {
    quarter: "Q3",
    focus: "Lite mode",
    detail: "Automatic fallback to minimal UI and static visualizations for constrained devices.",
    status: "Planned"
  }
];

const feedback = [
  {
    title: "Bulk assign training",
    votes: 24,
    state: "Under review"
  },
  {
    title: "Webhook delivery for run events",
    votes: 18,
    state: "Accepted"
  },
  {
    title: "Service account usage insights",
    votes: 12,
    state: "Investigating"
  }
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">Product roadmap</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Track what's in flight and up next. Drop feedback to influence priorities.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="text-xl font-semibold text-slate-100">Milestones</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {roadmap.map((item) => (
              <li key={item.focus} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.quarter}</p>
                    <p className="text-sm font-semibold text-slate-100">{item.focus}</p>
                    <p>{item.detail}</p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200">
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <h3 className="text-sm font-semibold text-slate-200">Top feedback</h3>
          <ul className="mt-3 space-y-3 text-xs text-slate-300">
            {feedback.map((item) => (
              <li key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3">
                <div>
                  <p className="text-slate-200">{item.title}</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.state}</p>
                </div>
                <span className="font-mono text-accent">{item.votes}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
            Submit idea
          </button>
        </aside>
      </section>
    </div>
  );
}
