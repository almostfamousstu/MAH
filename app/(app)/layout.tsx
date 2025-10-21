import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export default function ApplicationLayout({
  children
}: {
  children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
