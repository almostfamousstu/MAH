"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getProjectById } from "@/lib/maru-projects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

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

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-4 text-slate-300 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <span className="font-semibold text-slate-200">{children}</span>
  ),
  em: ({ children }) => <em className="text-slate-200 italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-4 list-disc list-inside space-y-1 text-slate-300 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal list-inside space-y-1 text-slate-300 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sm text-slate-100">{children}</code>
    ) : (
      <pre className="mb-4 rounded-lg border border-slate-700 bg-slate-900/80 p-4 text-sm text-slate-200 last:mb-0">
        <code>{children}</code>
      </pre>
    ),
  h3: ({ children }) => (
    <h3 className="mb-3 text-base font-semibold text-slate-200 last:mb-3">{children}</h3>
  ),
};

function MarkdownContent({ content }: { content?: string }) {
  if (!content || !content.trim()) {
    return <p className="text-sm text-slate-500">Details will be added soon.</p>;
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}

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

  const displayName = project.sections?.solutionName ?? project.name;
  const overviewContent = project.sections?.overview ?? project.summary;
  const objectiveSummary = project.sections?.objective?.summary ?? project.objective;
  const objectiveSteps = project.sections?.objective?.steps ?? project.steps.map((step) => step.description).filter(Boolean);
  const architectureComponents = project.sections?.architecture?.components ?? project.components;
  const flowSteps = project.sections?.architecture?.flow ?? project.steps.map((step) => step.description).filter(Boolean);
  const referenceDocs = project.sections?.referenceDocs ?? [];
  const developmentEnvironment = project.sections?.developmentEnvironment;
  const testingInfo = project.sections?.testing ?? { coverage: [] };
  const testingInstructions = testingInfo.instructions;
  const testingCommand = testingInfo.command;
  const testingCoverage = testingInfo.coverage ?? [];
  const deploymentInfo = project.sections?.deployment ?? [
    project.executionMode,
    project.targetEnvironment,
    project.outputDestination,
  ]
    .filter(Boolean)
    .join(" • ");
  const securityNotes = project.sections?.security ?? [];
  const repoBaseUrl = project.repoUrl.replace(/\/$/, "");
  const defaultBranch = project.sections?.defaultBranch ?? "main";
  const resolveReferenceUrl = (url: string) => {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    const sanitized = url.replace(/^\.\//, "");
    return `${repoBaseUrl}/blob/${defaultBranch}/${sanitized}`;
  };

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
            {displayName}
          </h1>
          {project.summary && (
            <p className="text-lg text-slate-300 max-w-3xl">{project.summary}</p>
          )}
          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="space-y-8">
          {/* Overview Section */}
          <CollapsibleSection title="Overview" emoji="📄" defaultOpen={false}>
            <MarkdownContent content={overviewContent} />
          </CollapsibleSection>

          {/* Objective Section */}
          <CollapsibleSection title="Solution Objective" emoji="🧭" defaultOpen={false}>
            <div className="space-y-4">
              <MarkdownContent content={objectiveSummary} />
              {objectiveSteps.length > 0 ? (
                <ol className="list-decimal list-inside ml-4 space-y-2 text-slate-300">
                  {objectiveSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">Step-by-step objectives will be provided soon.</p>
              )}
            </div>
          </CollapsibleSection>

          {/* Architecture Section */}
          <CollapsibleSection title="Architecture & Solution Design" emoji="🧩" defaultOpen={false}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Components</h3>
                {architectureComponents.length > 0 ? (
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
                        {architectureComponents.map((component, index) => (
                          <tr key={`${component.name}-${index}`} className="bg-surface/40">
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
                ) : (
                  <p className="text-sm text-slate-500">Component details will be added soon.</p>
                )}
              </div>

              {flowSteps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-3">Flow</h3>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300">
                    {flowSteps.map((step, index) => (
                      <li key={`${step}-${index}`}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Development Environment Section */}
          <CollapsibleSection title="Development Environment" emoji="⚙️" defaultOpen={false}>
            <div className="space-y-6">
              <MarkdownContent content={developmentEnvironment} />
              <div className="rounded-xl bg-slate-900/60 p-6 border border-slate-700">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Repository
                </h3>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-accent hover:text-accent-muted underline"
                >
                  {project.repoUrl}
                  <span>↗</span>
                </a>
              </div>
            </div>
          </CollapsibleSection>

          {/* Testing Section */}
          <CollapsibleSection title="Testing" emoji="🧪" defaultOpen={false}>
            <div className="space-y-6">
              {testingInstructions ? (
                <MarkdownContent content={testingInstructions} />
              ) : (
                <p className="text-sm text-slate-500">Testing guidance will be documented soon.</p>
              )}

              {testingCommand && (
                <div className="rounded-lg bg-slate-900/80 p-4 border border-slate-700 text-sm text-slate-200">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Command</span>
                  <pre className="overflow-x-auto font-mono text-sm text-slate-100">
                    <code>{testingCommand}</code>
                  </pre>
                </div>
              )}

              {testingCoverage.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Coverage Includes
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {testingCoverage.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </CollapsibleSection>

          {/* Deployment Section */}
          <CollapsibleSection title="Deployment / Delivery" emoji="🚀" defaultOpen={false}>
            <MarkdownContent content={deploymentInfo} />
          </CollapsibleSection>

          {/* Security Section */}
          <CollapsibleSection title="Security & Access" emoji="🔒" defaultOpen={false}>
            {securityNotes.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {securityNotes.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Security notes will be added as the project evolves.</p>
            )}
          </CollapsibleSection>

          {/* Reference Documentation Section */}
          <CollapsibleSection title="Reference Documentation" emoji="🧰" defaultOpen={false}>
            {referenceDocs.length > 0 ? (
              <ul className="space-y-3">
                {referenceDocs.map((doc, index) => (
                  <li key={`${doc.label}-${index}`}>
                    <a
                      href={resolveReferenceUrl(doc.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-accent transition-colors"
                    >
                      <span className="text-accent">→</span>
                      {doc.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No additional references provided.</p>
            )}
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
