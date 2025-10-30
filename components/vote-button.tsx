"use client";

import { useState, useEffect } from "react";

interface VoteButtonProps {
  feedbackId: number;
  initialVotes: number;
}

type VoteState = "upvote" | "downvote" | null;

export function VoteButton({ feedbackId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<VoteState>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user's previous vote from localStorage
    const storedVote = localStorage.getItem(`vote-${feedbackId}`);
    if (storedVote === "upvote" || storedVote === "downvote") {
      setUserVote(storedVote);
    }
  }, [feedbackId]);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // If user clicks the same vote type, remove their vote
      if (userVote === voteType) {
        const oppositeVote = voteType === "upvote" ? "downvote" : "upvote";
        const response = await fetch("/api/feedback/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedbackId, voteType: oppositeVote })
        });

        if (response.ok) {
          const data = await response.json();
          setVotes(data.votes);
          setUserVote(null);
          localStorage.removeItem(`vote-${feedbackId}`);
        }
      } 
      // If user switches from one vote to another
      else if (userVote) {
        // First undo the previous vote
        const undoVote = userVote === "upvote" ? "downvote" : "upvote";
        await fetch("/api/feedback/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedbackId, voteType: undoVote })
        });

        // Then apply the new vote
        const response = await fetch("/api/feedback/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedbackId, voteType })
        });

        if (response.ok) {
          const data = await response.json();
          setVotes(data.votes);
          setUserVote(voteType);
          localStorage.setItem(`vote-${feedbackId}`, voteType);
        }
      }
      // New vote
      else {
        const response = await fetch("/api/feedback/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedbackId, voteType })
        });

        if (response.ok) {
          const data = await response.json();
          setVotes(data.votes);
          setUserVote(voteType);
          localStorage.setItem(`vote-${feedbackId}`, voteType);
        }
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleVote("upvote")}
          disabled={isLoading}
          className={`transition-colors disabled:opacity-50 ${
            userVote === "upvote"
              ? "text-accent"
              : "text-slate-500 hover:text-slate-300"
          }`}
          aria-label="Upvote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <span className="font-mono text-sm text-accent">{votes}</span>
        <button
          onClick={() => handleVote("downvote")}
          disabled={isLoading}
          className={`transition-colors disabled:opacity-50 ${
            userVote === "downvote"
              ? "text-accent"
              : "text-slate-500 hover:text-slate-300"
          }`}
          aria-label="Downvote"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
