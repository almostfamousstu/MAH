"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const sections = [
  { href: "/", label: "Home" },
  { href: "/automations", label: "Micro-Automations" },
  { href: "/failure-atlas", label: "Failure Atlas" },
  { href: "/training", label: "Training & Culture" },
  { href: "/explore", label: "3D Explorer" }
];

export function TopNav() {
  const pathname = usePathname();
  const activeSection = useMemo(() => {
    const match = sections
      .filter((section) => section.href !== "/")
      .find((section) => pathname.startsWith(section.href));
    return match?.label ?? "Home";
  }, [pathname]);

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-surface/70 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent shadow-glow">MA</span>
          <span>Micro Automation Hub</span>
        </Link>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-widest text-slate-400">
          {activeSection}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex">
          <label htmlFor="global-search" className="sr-only">
            Search automations and content
          </label>
          <div className="relative">
            <input
              id="global-search"
              className="w-64 rounded-full border border-slate-700 bg-surface px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              placeholder="Search automations, runbooks, media..."
              type="search"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-900 px-1.5 text-[10px] text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>
        <button className="rounded-full border border-slate-700 bg-surface px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-accent hover:text-accent">
          Command Palette
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-surface text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
        >
          JD
        </button>
      </div>
    </header>
  );
}
