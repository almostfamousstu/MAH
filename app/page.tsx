import Link from "next/link";

const pillars = [
  {
    title: "Micro-Automations",
    description: "Composable workflows with guardrails, live run insights, and curated failure knowledge.",
    href: "/automations"
  },
  {
    title: "Failure Atlas",
    description: "Evolving ontology of incidents, remediation playbooks, and detection signals.",
    href: "/failure-atlas"
  },
  {
    title: "Training & Culture",
    description: "Bite-sized tutorials, podcast episodes, and resources to scale AI literacy.",
    href: "/training"
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8 pb-16 pt-24">
        <div className="space-y-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-accent">
            Pre-Launch Alpha
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-100 md:text-6xl">
            Deep Currents Micro-Automation Hub
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300 md:text-lg">
            Discover, govern, and grow your catalogue of GenAI-powered micro-automations. Explore training and adoption playbooks while keeping failure modes transparent and actionable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              className="rounded-full border border-accent bg-accent px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-accent-muted hover:text-slate-900"
              href="/automations"
            >
              Enter the Workspace
            </Link>
            <Link
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
              href="/explore"
            >
              Preview 3D Explorer
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Link
              key={pillar.title}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-accent/60 hover:bg-slate-900/80"
              href={pillar.href}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{pillar.title}</p>
                <h3 className="text-xl font-semibold text-slate-100">{pillar.title}</h3>
                <p className="text-sm text-slate-300">{pillar.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Enter <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <section className="mt-20 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-100">Why a hybrid 2D/3D interface?</h2>
            <p className="text-sm text-slate-300">
              The core app shell remains fast, accessible, and enterprise-ready. When your device supports it, optional 3D explorations help teams understand automation estates, dependencies, and live health at a glance.
            </p>
            <ul className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <li className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <p className="font-semibold text-slate-200">Progressive enhancement</p>
                <p className="text-xs text-slate-400">Graceful fallbacks keep the mission-critical tasks in a lightweight UI.</p>
              </li>
              <li className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <p className="font-semibold text-slate-200">Explorable automation maps</p>
                <p className="text-xs text-slate-400">Spline scenes and Three.js charts highlight flows without blocking work.</p>
              </li>
              <li className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <p className="font-semibold text-slate-200">Insight-first runbooks</p>
                <p className="text-xs text-slate-400">Blend documentation, live metrics, and failure ontology updates in one place.</p>
              </li>
              <li className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <p className="font-semibold text-slate-200">Adoption analytics</p>
                <p className="text-xs text-slate-400">Track training completions, automation usage, and sentiment.</p>
              </li>
            </ul>
          </div>
          <div className="space-y-4 rounded-3xl border border-accent/40 bg-slate-950/80 p-6 shadow-glow">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">System snapshot</p>
            <dl className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <dt>Active automations</dt>
                <dd className="font-mono text-accent">26</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Open failure modes</dt>
                <dd className="font-mono text-amber-400">3</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Training completion</dt>
                <dd className="font-mono text-emerald-400">82%</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Last refresh</dt>
                <dd className="font-mono text-slate-400">2m ago</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-400">
              Syncs nightly with production orchestration. Real-time telemetry surfaces in the workspace views.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
