"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubmitIdeaFormProps {
  onClose: () => void;
}

export function SubmitIdeaForm({ onClose }: SubmitIdeaFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [state, setState] = useState("Under review");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a title for your idea");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), state })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to submit idea");
        setIsSubmitting(false);
        return;
      }

      // Success - refresh the page to show the new idea
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      setError("Failed to submit idea. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Submit an idea</h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-200"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Idea title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Slack integration"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-2">
              Initial state
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isSubmitting}
            >
              <option value="Under review">Under review</option>
              <option value="Accepted">Accepted</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Not planned">Not planned</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full border border-slate-700 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:border-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full border border-accent bg-accent/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.3em] text-accent transition hover:bg-accent/20 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
