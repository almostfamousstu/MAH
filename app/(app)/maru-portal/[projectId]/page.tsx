"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getProjectById } from "@/lib/maru-projects";

type PageProps = {
  params: {
    projectId: string;
  };
};

type CollapsibleSectionProps = {
  title: string;
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function CollapsibleSection({ title, emoji, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-slate-800 bg-surface/60 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 text-left hover:bg-slate-900/20 transition-colors"
      >
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          {emoji} {title}
        </h2>
        <span className={`text-2xl text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-8 pb-8">
          {children}
        </div>
      )}
    </section>
  );
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = getProjectById(params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 py-12">
        {/* Back Button */}
        <Link
          href="/maru-portal"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors mb-8"
        >
          ← Back to MARU Portal
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-100 mb-4">
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="space-y-8">
          {/* Overview Section */}
          <CollapsibleSection title="Overview" emoji="📄" defaultOpen={false}>
            <div className="space-y-4 text-slate-300">
              <p>
                This project is part of the <span className="text-accent font-semibold">deepcurrents Internal Developer Portal</span> initiative.
                It is designed to provide a consistent, frictionless onboarding experience for our partner developers working within our standardized environment.
              </p>
              <p>
                Each project follows a common structure to ensure that developers can quickly understand:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                <li>What the solution does</li>
                <li>How it's designed</li>
                <li>How to get started (with minimal local setup)</li>
              </ul>
              <p className="text-slate-200 font-medium">
                This project specifically focuses on: <span className="text-accent">{project.summary.toLowerCase()}</span>
              </p>
            </div>
          </CollapsibleSection>

          {/* Objective Section */}
          <CollapsibleSection title="Objective" emoji="🧭" defaultOpen={false}>
            <div className="space-y-4 text-slate-300">
              <p>
                The goal of this project is to <span className="text-slate-200">{project.objective.toLowerCase()}</span>
              </p>
              <p className="font-medium text-slate-200">Specifically, the implementation should:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                {project.steps.map((step, index) => (
                  <li key={index} className="text-slate-300">
                    {step.description}
                  </li>
                ))}
              </ol>
            </div>
          </CollapsibleSection>

          {/* Architecture Section */}
          <CollapsibleSection title="Architecture & Solution Design" emoji="🧩" defaultOpen={false}>
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Components</h3>
              <div className="overflow-hidden rounded-xl border border-slate-700">
                <table className="w-full">
                  <thead className="bg-slate-900/60">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Component
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {project.components.map((component, index) => (
                      <tr key={index} className="bg-surface/40">
                        <td className="px-6 py-4 text-sm font-mono text-slate-200">
                          {component.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {component.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CollapsibleSection>

          {/* Development Environment Section */}
          <CollapsibleSection title="Development Environment" emoji="⚙️" defaultOpen={false}>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900/60 p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-accent mb-3">GitHub Codespaces</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Navigate to the following repo:{" "}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-accent hover:text-accent-muted underline"
                    >
                      {project.repoUrl}
                    </a>
                  </li>
                  <li>
                    Click <span className="font-mono bg-slate-800 px-2 py-1 rounded text-sm">Code → Open with Codespaces</span> to spin up a prebuilt environment containing all dependencies.
                  </li>
                </ol>
              </div>
            </div>
          </CollapsibleSection>

          {/* Testing Section */}
          <CollapsibleSection title="Testing" emoji="🧪" defaultOpen={false}>
            <div className="space-y-4 text-slate-300">
              <p>
                Run all tests before committing changes. Typical tests include:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                <li>Connectivity to internal APIs/services</li>
                <li>Validation of expected output formats</li>
                <li>Error handling and retries</li>
              </ul>
              <div className="rounded-lg bg-slate-900/80 p-4 border border-slate-700 font-mono text-sm text-slate-300">
                <span className="text-slate-500"># Run test suite</span>
                <br />
                <span className="text-accent">pytest</span> tests/ -v
              </div>
              <p className="text-sm text-slate-400">
                <strong>Note:</strong> Add test cases under <code className="bg-slate-900 px-2 py-1 rounded">/tests</code> as new functionality is introduced.
              </p>
            </div>
          </CollapsibleSection>

          {/* Deployment Section */}
          <CollapsibleSection title="Deployment / Delivery" emoji="🚀" defaultOpen={false}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-900/40 p-4 border border-slate-700">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Execution Mode
                  </div>
                  <div className="text-sm text-slate-200">{project.executionMode}</div>
                </div>
                <div className="rounded-xl bg-slate-900/40 p-4 border border-slate-700">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Target Environment
                  </div>
                  <div className="text-sm text-slate-200">{project.targetEnvironment}</div>
                </div>
                <div className="rounded-xl bg-slate-900/40 p-4 border border-slate-700">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Output Destination
                  </div>
                  <div className="text-sm text-slate-200">{project.outputDestination}</div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Governance Section */}
          <CollapsibleSection title="Governance & Review" emoji="🧭" defaultOpen={false}>
            <div className="space-y-3 text-slate-300">
              <p>All new repositories must adhere to the following standards:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-slate-300">
                <li>
                  Use the <span className="font-semibold text-accent">Developer Portal Repository Template</span> as the base.
                </li>
                <li>
                  Include a <code className="bg-slate-900 px-2 py-1 rounded font-mono text-sm">README.md</code>,{" "}
                  <code className="bg-slate-900 px-2 py-1 rounded font-mono text-sm">requirements.txt</code>,{" "}
                  <code className="bg-slate-900 px-2 py-1 rounded font-mono text-sm">devcontainer.json</code>, and{" "}
                  <code className="bg-slate-900 px-2 py-1 rounded font-mono text-sm">Dockerfile</code>.
                </li>
                <li>
                  Submit a PR to the <span className="font-semibold text-accent">DevOps Integration team</span> for code review prior to deployment.
                </li>
              </ul>
            </div>
          </CollapsibleSection>

          {/* Reference Documentation Section */}
          <CollapsibleSection title="Reference Documentation" emoji="🧰" defaultOpen={false}>
            <ul className="space-y-3">
              {[
                { label: "Internal API / Service Docs", url: "#" },
                { label: "Developer Portal Standards", url: "#" },
                { label: "Code Review & Contribution Guidelines", url: "#" },
                { label: "Container & Environment Setup", url: "#" }
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="flex items-center gap-2 text-slate-300 hover:text-accent transition-colors"
                  >
                    <span className="text-accent">→</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Action Button */}
          <div className="flex justify-center pt-8">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-slate-900 shadow-glow transition-all hover:bg-accent-muted"
            >
              <span>Open Repository in GitHub</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
