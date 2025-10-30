import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const automations = [
    {
      name: "Atttribute lookup by SKU",
      summary: "Updates item attributes in Magelen based on SKU from NAV.",
      owner: "Gen Merch`",
      status: "Stable",
      lastRunRelative: "3m ago",
      runRate: "148 runs / wk"
    },
    {
      name: "Item Coding Q&A",
      summary:
        "Get answers to all your item coding questions. Pulls from the latest sharepoint documentation.",
      owner: "Customer Success",
      status: "Advisory",
      lastRunRelative: "11m ago",
      runRate: "93 runs / wk"
    },
    {
      name: "Invoice Exception Resolver",
      summary:
        "GenAI agent triages failed invoices, drafts outreach, and updates ERP with resolution.",
      owner: "Finance Ops",
      status: "Pilot",
      lastRunRelative: "42m ago",
      runRate: "37 runs / wk"
    }
  ];

  await Promise.all(
    automations.map((automation, index) =>
      prisma.automation.upsert({
        where: { name: automation.name },
        create: { ...automation, sortOrder: index },
        update: { ...automation, sortOrder: index }
      })
    )
  );

  const kpis = [
    {
      title: "Automation runs",
      value: "1,482",
      delta: "+12%",
      description: "vs. prior 7 days"
    },
    {
      title: "Interventions avoided",
      value: "286",
      delta: "+6%",
      description: "LLM handled without analyst escalation"
    },
    {
      title: "Median run cost",
      value: "$0.42",
      delta: "-9%",
      description: "Weighted across providers"
    }
  ];

  await Promise.all(
    kpis.map((kpi, index) =>
      prisma.insightKpi.upsert({
        where: { title: kpi.title },
        create: { ...kpi, sortOrder: index },
        update: { ...kpi, sortOrder: index }
      })
    )
  );

  const adoption = [
    {
      team: "Gen Merch",
      metric: "94%",
      detail: "Adopted at least one automation"
    },
    {
      team: "Customer Success",
      metric: "88%",
      detail: "Weekly active analysts"
    },
    {
      team: "Finance",
      metric: "61%",
      detail: "Playbook completion"
    }
  ];

  await Promise.all(
    adoption.map((entry, index) =>
      prisma.insightAdoption.upsert({
        where: { team: entry.team },
        create: { ...entry, sortOrder: index },
        update: { ...entry, sortOrder: index }
      })
    )
  );

  const incidents = [
    {
      label: "P0",
      count: 0,
      description: "Zero critical failures in rolling 30 days"
    },
    {
      label: "P1",
      count: 2,
      description: "Schema drift (resolved), Provider latency (mitigated)"
    },
    {
      label: "P2",
      count: 9,
      description: "Low impact warnings awaiting steward triage"
    }
  ];

  await Promise.all(
    incidents.map((incident, index) =>
      prisma.insightIncident.upsert({
        where: { label: incident.label },
        create: { ...incident, sortOrder: index },
        update: { ...incident, sortOrder: index }
      })
    )
  );

  const milestones = [
    {
      quarter: "Q4",
      focus: "MARU Developer Portal",
      detail: "A portal for developers to onboard, test, and deploy micro-automations.",
      status: "In progress"
    },
    {
      quarter: "Q4",
      focus: "Idea Funnel: Flow Chart Builder",
      detail: "Define automation logic visually with a drag-and-drop interface.",
      status: "In design"
    },
    {
      quarter: "Q1",
      focus: "MCP Library",
      detail: "Library of available MCP connectors for common enterprise systems.",
      status: "Planned"
    }
  ];

  await Promise.all(
    milestones.map((milestone, index) =>
      prisma.roadmapMilestone.upsert({
        where: { focus: milestone.focus },
        create: { ...milestone, sortOrder: index },
        update: { ...milestone, sortOrder: index }
      })
    )
  );

  const feedback = [
    {
      title: "Automatic prompt optimization",
      votes: 24,
      state: "Accepted"
    },
    {
      title: "JIRA ticket agent",
      votes: 18,
      state: "Accepted"
    },
    {
      title: "Integration with monday.com",
      votes: 12,
      state: "Under review"
    }
  ];

  await Promise.all(
    feedback.map((item, index) =>
      prisma.feedbackItem.upsert({
        where: { title: item.title },
        create: { ...item, sortOrder: index },
        update: { ...item, sortOrder: index }
      })
    )
  );
}

main()
  .catch((error) => {
    console.error("Seed error", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
