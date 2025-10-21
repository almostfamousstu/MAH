import { ReactNode } from "react";
import { Sidebar } from "./navigation/sidebar";
import { TopNav } from "./navigation/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950/60 px-10 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
