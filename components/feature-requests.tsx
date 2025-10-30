"use client";

import { useState } from "react";
import { VoteButton } from "./vote-button";
import { SubmitIdeaForm } from "./submit-idea-form";
import type { FeedbackItem } from "@prisma/client";

interface FeatureRequestsProps {
  feedback: FeedbackItem[];
}

export function FeatureRequests({ feedback }: FeatureRequestsProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <aside className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <h3 className="text-sm font-semibold text-slate-200">Feature Requests</h3>
        <ul className="mt-3 space-y-3 text-xs text-slate-300">
          {feedback.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3">
              <div className="flex-1">
                <p className="text-slate-200">{item.title}</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.state}</p>
              </div>
              <VoteButton feedbackId={item.id} initialVotes={item.votes} />
            </li>
          ))}
        </ul>
        <button 
          onClick={() => setShowForm(true)}
          className="mt-4 w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent"
        >
          Submit idea
        </button>
      </aside>

      {showForm && <SubmitIdeaForm onClose={() => setShowForm(false)} />}
    </>
  );
}
