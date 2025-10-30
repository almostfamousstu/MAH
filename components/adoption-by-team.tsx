"use client";

import { useState } from "react";
import type { InsightAdoption } from "@prisma/client";

interface AdoptionByTeamProps {
  adoption: InsightAdoption[];
}

const TEAM_NAMES = [
  "Loading and Processing",
  "Collection",
  "Customization",
  "Assembly",
  "Analysis",
  "Client Service",
  "Quality Control",
  "Issue Resolution",
  "Data Protection"
];

export function AdoptionByTeam({ adoption }: AdoptionByTeamProps) {
  const [selectedTeam, setSelectedTeam] = useState(TEAM_NAMES[0]);

  // Generate mock metrics for each team (in production, this would come from the database)
  const getMetricsForTeam = (teamName: string) => {
    // Use a simple hash to generate consistent but varied percentages
    const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const userAcceptance = 75 + (hash % 20);
    const userAdoption = 70 + ((hash * 2) % 25);
    const roi = 50 + ((hash * 3) % 30);
    
    return {
      userAcceptance: `${userAcceptance}%`,
      userAdoption: `${userAdoption}%`,
      roi: `${roi}%`
    };
  };

  const metrics = getMetricsForTeam(selectedTeam);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-100">Adoption by team</h2>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {TEAM_NAMES.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-300">
        <li className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
          <div>
            <p className="text-slate-200">User Acceptance</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Adopted at least one automation</p>
          </div>
          <span className="font-mono text-accent">{metrics.userAcceptance}</span>
        </li>
        <li className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
          <div>
            <p className="text-slate-200">User Adoption</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Weekly active analysts</p>
          </div>
          <span className="font-mono text-accent">{metrics.userAdoption}</span>
        </li>
        <li className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4">
          <div>
            <p className="text-slate-200">ROI</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Playbook completion</p>
          </div>
          <span className="font-mono text-accent">{metrics.roi}</span>
        </li>
      </ul>
    </div>
  );
}
