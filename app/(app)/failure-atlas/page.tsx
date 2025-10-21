const taxonomy = [
  {
    path: "llm/latency",
    title: "Latency spikes",
    description: "Detection rules for elevated provider latency across regions.",
    playbooks: 3
  },
  {
    path: "prompt/drift",
    title: "Prompt drift",
    description: "Outputs deviate from acceptance tests; includes rollback checklist.",
    playbooks: 4
  },
  {
    path: "data/schema-drift",
    title: "Schema drift",
    description: "Source schema changes that break ingestion or transformation steps.",
    playbooks: 2
  }
];

const activity = [
  {
    actor: "Casey",
    action: "Linked incident #483 to `llm/latency`",
    timestamp: "Today 09:36"
  },
  {
    actor: "Riya",
    action: "Proposed new symptom: `incomplete payload`",
    timestamp: "Today 08:04"
  },
  {
    actor: "Morgan",
    action: "Published remediation playbook for `prompt/drift`",
    timestamp: "Yesterday 17:21"
  }
];

export default function FailureAtlasPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Ontology</p>
            <h1 className="text-3xl font-semibold text-slate-100">Failure Atlas</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              The shared knowledge base of automation failure modes, detection signals, and guided remediation. Curate the taxonomy, link incidents, and surface proactive guardrails back into each workflow.
            </p>
          </div>
          <div className="space-y-3">
            <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
              Add failure mode
            </button>
            <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
              Import incident log
            </button>
          </div>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Taxonomy slices</h2>
              <p className="text-xs text-slate-400">Prioritized by recent activity</p>
            </div>
            <button className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
              Visualize graph
            </button>
          </div>
          <ul className="space-y-3">
            {taxonomy.map((item) => (
              <li key={item.path} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.path}</p>
                    <p className="text-sm font-semibold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-slate-400">
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">
                      {item.playbooks} playbooks
                    </span>
                    <button className="mt-2 rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
                      Open detail
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-sm font-semibold text-slate-200">Recent contributions</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-300">
              {activity.map((entry) => (
                <li key={entry.action} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3">
                  <p className="text-slate-200">{entry.actor}</p>
                  <p>{entry.action}</p>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{entry.timestamp}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-accent/40 bg-accent/10 p-6 shadow-glow">
            <h3 className="text-sm font-semibold text-accent">Sync with automation runs</h3>
            <p className="mt-2 text-xs text-accent/90">
              Use embeddings to auto-suggest failure modes when automation logs resemble past incidents. Manual review required before publishing.
            </p>
            <button className="mt-4 w-full rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent hover:text-slate-950">
              Configure signals
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
