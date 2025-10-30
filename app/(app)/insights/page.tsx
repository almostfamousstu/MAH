import type { InsightAdoption, InsightIncident, InsightKpi } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AdoptionByTeam } from "@/components/adoption-by-team";

export default async function InsightsPage() {
  const [kpis, adoption, incidents]: [InsightKpi[], InsightAdoption[], InsightIncident[]] = await Promise.all([
    prisma.insightKpi.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
    prisma.insightAdoption.findMany({
      orderBy: [{ sortOrder: "asc" }, { team: "asc" }]
    }),
    prisma.insightIncident.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
    })
  ]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">Insights & telemetry</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Unified view of automation performance, adoption, and incident response.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-3">
  {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{kpi.title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-100">{kpi.value}</p>
            <p className="text-xs text-emerald-400">{kpi.delta}</p>
            <p className="mt-1 text-xs text-slate-400">{kpi.description}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <AdoptionByTeam adoption={adoption} />
        <aside className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <h3 className="text-sm font-semibold text-slate-200">Incident queue</h3>
          <ul className="mt-3 space-y-3 text-xs text-slate-300">
            {incidents.map((incident) => (
              <li key={incident.id} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-slate-200">{incident.label}</p>
                  <span className="font-mono text-amber-400">{incident.count}</span>
                </div>
                <p className="text-[11px] text-slate-400">{incident.description}</p>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
            Open incident log
          </button>
        </aside>
      </section>
    </div>
  );
}
