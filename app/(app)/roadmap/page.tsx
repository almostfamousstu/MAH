import type { FeedbackItem, RoadmapMilestone } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FeatureRequests } from "@/components/feature-requests";

export default async function RoadmapPage() {
  const [roadmap, feedback]: [RoadmapMilestone[], FeedbackItem[]] = await Promise.all([
    prisma.roadmapMilestone.findMany({
      orderBy: [{ sortOrder: "asc" }, { quarter: "asc" }]
    }),
    prisma.feedbackItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { votes: "desc" }]
    })
  ]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300";
      case "in design":
        return "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300";
      case "planned":
        return "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300";
      default:
        return "bg-gradient-to-br from-slate-700/20 to-slate-800/10 border-slate-700 text-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <h1 className="text-3xl font-semibold text-slate-100">Product roadmap</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Track what&apos;s in flight and up next. Drop feedback to influence priorities.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <h2 className="text-xl font-semibold text-slate-100">Milestones</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {roadmap.map((item) => (
              <li key={item.id} className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.quarter}</p>
                    <p className="text-sm font-semibold text-slate-100">{item.focus}</p>
                    <p>{item.detail}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${getStatusStyles(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <FeatureRequests feedback={feedback} />
      </section>
    </div>
  );
}
