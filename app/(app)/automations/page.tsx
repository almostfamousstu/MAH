import Link from "next/link";
import type { Automation } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const failureHighlights = [
  {
    title: "LLM provider latency",
    description: "Spikes in completion time when region=us-west; auto-switched to backup model tier.",
    impact: "5 delayed runs",
    severity: "Medium"
  },
  {
    title: "Schema drift detected",
    description: "Upstream marketing form changed field mapping; hotfix pushed with validation guard.",
    impact: "2 failed payloads",
    severity: "High"
  }
];

const playbooks = [
  {
    title: "Author a new micro-automation",
    steps: ["Start from blueprint", "Define trigger + guardrails", "Draft prompt instructions", "Request security review"],
    cta: "Launch authoring flow"
  },
  {
    title: "Update failure ontology",
    steps: ["Search existing taxonomy", "Link incident evidence", "Submit for MARU review"],
    cta: "Open Failure Atlas"
  }
];

export default async function AutomationsPage() {
  const automations: Automation[] = await prisma.automation.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Workspace</p>
          <h1 className="text-3xl font-semibold text-slate-100">Micro-Automation Library</h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Browse every micro-automation, inspect guardrails, and monitor run health. Trigger ad-hoc executions when policy allows and capture any new failure learnings in the shared ontology.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">Active Micro-Automations</p>
            <p className="text-2xl font-semibold text-accent">4</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">On-call MARU</p>
            <p className="text-xl font-semibold text-slate-200">Stu H</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs text-slate-400">Avg. runtime</p>
            <p className="text-xl font-semibold text-slate-200">1m 18s</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2">
            <p className="text-xs text-slate-400">SLA adherence</p>
            <p className="text-xl font-semibold text-emerald-400">98.4%</p>
          </div>
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Recently active</h2>
              <p className="text-xs text-slate-400">Pulse of the last 24 hours</p>
            </div>
            <Link
              href="/automations/new"
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent"
            >
              New automation
            </Link>
          </div>
          <ul className="space-y-3">
            {automations.map((automation) => (
              <li
                key={automation.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-accent/60 hover:bg-slate-900/80"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-200">{automation.name}</p>
                    <p className="max-w-xl text-sm text-slate-400">{automation.summary}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
                      <span>{automation.owner}</span>
                      <span aria-hidden>•</span>
                      <span>{automation.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-xs text-slate-400">
                    <span className="font-mono text-accent">{automation.runRate}</span>
                    <span>Last run {automation.lastRunRelative}</span>
                    <button className="mt-3 rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
                      Trigger run
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
            <h3 className="text-sm font-semibold text-amber-200">Failure highlights</h3>
            <ul className="mt-3 space-y-3 text-xs text-amber-100">
              {failureHighlights.map((failure) => (
                <li key={failure.title} className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                  <p className="font-semibold">{failure.title}</p>
                  <p className="text-amber-100/80">{failure.description}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em]">{failure.impact}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <h3 className="text-sm font-semibold text-slate-200">Playbooks</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-300">
              {playbooks.map((playbook) => (
                <li key={playbook.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-slate-100">{playbook.title}</p>
                  <ol className="mt-2 space-y-1 text-[11px] text-slate-400">
                    {playbook.steps.map((step) => (
                      <li key={step} className="flex items-center gap-2">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                        {step}
                      </li>
                    ))}
                  </ol>
                  <Link
                    href="/automations/new"
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent"
                  >
                    {playbook.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
