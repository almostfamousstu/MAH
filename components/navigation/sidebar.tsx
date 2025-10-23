"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  description: string;
};

const primaryNav: NavItem[] = [
  {
    href: "/automations",
    label: "Micro-Automations",
    description: "Curated workflows, trigger policies, run history"
  },
  {
    href: "/failure-atlas",
    label: "Failure Atlas",
    description: "Shared taxonomy of incidents, fixes, and prevention"
  },
  {
    href: "/training",
    label: "Training & Culture",
    description: "Videos, playbooks, and adoption campaigns"
  },
  {
    href: "/explore",
    label: "DC MA System Development",
    description: "Micro-automation system development and tracking"
  }
];

const secondaryNav: NavItem[] = [
  {
    href: "/chat",
    label: "AI Assistant",
    description: "Chat with AI about automation and best practices"
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    description: "What's shipping next, feedback backlog"
  },
  {
    href: "/insights",
    label: "Insights",
    description: "Usage metrics, adoption trends, system health"
  }
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                className={`block rounded-xl border px-4 py-3 transition ${
                  isActive
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-transparent bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
                href={item.href}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <p className="text-xs text-slate-400">{item.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-slate-800 bg-surface/80 px-6 py-8">
      <div className="space-y-8">
        <nav className="space-y-10">
          <NavSection title="Workspace" items={primaryNav} />
          <NavSection title="Intelligence" items={secondaryNav} />
        </nav>
        <div className="rounded-2xl border border-accent/50 bg-accent/10 p-4 text-sm text-slate-200 shadow-glow">
          <p className="font-semibold">Today’s system pulse</p>
          <p className="text-xs text-slate-300">
            No incidents. <span className="text-accent">5 automations</span> ran successfully in the last hour.
          </p>
        </div>
      </div>
      <div className="space-y-3 text-xs text-slate-500">
        <p>Need a new automation?</p>
        <button className="w-full rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-accent hover:text-accent">
          Submit Request
        </button>
      </div>
    </aside>
  );
}
