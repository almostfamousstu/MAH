"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";

type Stage = "select" | "configure" | "review";
type BlueprintKey = "rag" | "chain";

type RagFormState = {
  name: string;
  summary: string;
  owner: string;
  guardrails: string;
  urls: string[];
  uploads: File[];
  refreshCadence: string;
  chunkSize: number;
  topK: number;
};

type ChainStep = {
  id: string;
  title: string;
  prompt: string;
  handoffNotes: string;
};

type ChainFormState = {
  name: string;
  summary: string;
  trigger: string;
  evaluation: string;
  steps: ChainStep[];
};

type BlueprintDefinition = {
  key: BlueprintKey;
  title: string;
  blurb: string;
  highlights: string[];
  badge: string;
};

const blueprintOptions: BlueprintDefinition[] = [
  {
    key: "rag",
    title: "Retrieval-Augmented Knowledge Agent",
    blurb: "Ground responses in curated knowledge sources. Configure link crawlers and document uploads in a single flow.",
    highlights: [
      "Blend live web references with controlled document uploads",
      "Tune chunking + top-k retrieval parameters per collection",
      "Document guardrails and human handoff plan"
    ],
    badge: "Knowledge Ops"
  },
  {
    key: "chain",
    title: "Agentic Prompt Chain",
    blurb: "Compose multi-step prompt workflows with explicit handoffs so teams can automate complex playbooks.",
    highlights: [
      "Define trigger context and downstream success signal",
      "Author iterative prompt stages with reviewer notes",
      "Capture evaluation rubric for safe launch"
    ],
    badge: "Workflow Design"
  }
];

function createInitialRagForm(): RagFormState {
  return {
    name: "",
    summary: "",
    owner: "",
    guardrails: "",
    urls: [],
    uploads: [],
    refreshCadence: "Weekly",
    chunkSize: 800,
    topK: 4
  };
}

function createInitialChainForm(): ChainFormState {
  const timestamp = Date.now();
  return {
    name: "",
    summary: "",
    trigger: "",
    evaluation: "",
    steps: [
      {
        id: `step-${timestamp}`,
        title: "Step 1",
        prompt: "",
        handoffNotes: ""
      }
    ]
  };
}

function StagePills({
  activeStage,
  blueprintLabel
}: {
  activeStage: Stage;
  blueprintLabel?: string;
}) {
  const stages = useMemo(
    () => [
      { id: "select" as Stage, label: "Select blueprint" },
      { id: "configure" as Stage, label: blueprintLabel ? `Configure ${blueprintLabel}` : "Configure" },
      { id: "review" as Stage, label: "Review & handoff" }
    ],
    [blueprintLabel]
  );

  return (
    <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
      {stages.map((stage) => {
        const isActive = stage.id === activeStage;
        const isCompleted =
          stages.findIndex((s) => s.id === activeStage) > stages.findIndex((s) => s.id === stage.id);
        return (
          <span
            key={stage.id}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 transition ${
              isActive
                ? "border-accent/60 bg-accent/10 text-accent"
                : isCompleted
                ? "border-slate-700 bg-slate-900/50 text-slate-300"
                : "border-slate-800 bg-slate-900/20 text-slate-500"
            }`}
          >
            {stage.label}
          </span>
        );
      })}
    </div>
  );
}

function RagConfigurator({
  value,
  onChange
}: {
  value: RagFormState;
  onChange: (next: RagFormState) => void;
}) {
  const [linkInput, setLinkInput] = useState("");

  const handleInput = (field: keyof RagFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue =
        field === "chunkSize" || field === "topK"
          ? Number(event.target.value)
          : event.target.value;
      onChange({ ...value, [field]: nextValue });
    };

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    if (value.urls.includes(trimmed)) {
      setLinkInput("");
      return;
    }
    onChange({ ...value, urls: [...value.urls, trimmed] });
    setLinkInput("");
  };

  const handleRemoveLink = (target: string) => {
    onChange({ ...value, urls: value.urls.filter((url) => url !== target) });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    onChange({ ...value, uploads: [...value.uploads, ...files] });
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    onChange({ ...value, uploads: value.uploads.filter((_, fileIndex) => fileIndex !== index) });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Automation metadata</h2>
            <p className="text-sm text-slate-400">Name the automation and describe the customer problem it solves.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-4 text-[11px] uppercase tracking-[0.3em] text-slate-400">
            Required
          </span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Automation name</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="e.g. Catalog Accuracy Advisor"
              value={value.name}
              onChange={handleInput("name")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Primary owner</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Team or MARU"
              value={value.owner}
              onChange={handleInput("owner")}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Problem statement</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="What does this automation do? Which users rely on it?"
              value={value.summary}
              onChange={handleInput("summary")}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Guardrails & human handoff</label>
            <textarea
              className="min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Capture limits, escalation routes, and monitoring signals."
              value={value.guardrails}
              onChange={handleInput("guardrails")}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Knowledge bank</h2>
            <p className="text-sm text-slate-400">Blend crawled links with uploaded documents to ground responses.</p>
          </div>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-4 text-[11px] uppercase tracking-[0.3em] text-accent">
            Dual source
          </span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1.4fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Approved web references</label>
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="https://..."
                  value={linkInput}
                  onChange={(event) => setLinkInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddLink();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="rounded-xl border border-accent/40 bg-accent/10 px-5 text-sm font-semibold text-accent transition hover:bg-accent/20"
                >
                  Add link
                </button>
              </div>
            </div>
            {value.urls.length > 0 ? (
              <ul className="space-y-2">
                {value.urls.map((url) => (
                  <li
                    key={url}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-200"
                  >
                    <span className="truncate pr-4">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(url)}
                      className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-red-500/60 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
                No links added yet. Capture internal SharePoint, supplier portals, or trusted docs.
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Upload documents</label>
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 text-center text-sm text-slate-400 transition hover:border-accent/40 hover:bg-slate-900/60">
                <span className="text-slate-200">Drop files or browse</span>
                <span className="text-xs text-slate-500">PDF, DOCX, CSV supported</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            {value.uploads.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-200">
                {value.uploads.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
                  >
                    <div className="flex flex-col">
                      <span>{file.name}</span>
                      <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-red-500/60 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
                No documents uploaded. Attach policy PDFs, SOP decks, or schema tables to ground responses.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Retrieval tuning</h2>
            <p className="text-sm text-slate-400">Control how aggressively the agent chunks context and how much evidence is surfaced.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Refresh cadence</label>
            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              value={value.refreshCadence}
              onChange={(event) => onChange({ ...value, refreshCadence: event.target.value })}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Chunk size (tokens)</label>
            <input
              type="number"
              min={200}
              max={2000}
              step={50}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              value={value.chunkSize}
              onChange={handleInput("chunkSize")}
            />
            <p className="text-xs text-slate-500">Smaller chunks = higher recall, larger chunks = more context per chunk.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Top-k retrieval</label>
            <input
              type="number"
              min={1}
              max={10}
              step={1}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              value={value.topK}
              onChange={handleInput("topK")}
            />
            <p className="text-xs text-slate-500">How many chunks are passed into the model per query.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChainConfigurator({
  value,
  onChange
}: {
  value: ChainFormState;
  onChange: (next: ChainFormState) => void;
}) {
  const handleField = (field: keyof ChainFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...value, [field]: event.target.value });
    };

  const handleStepChange = (
    id: string,
    field: keyof ChainStep,
    nextValue: string
  ) => {
    onChange({
      ...value,
      steps: value.steps.map((step) => (step.id === id ? { ...step, [field]: nextValue } : step))
    });
  };

  const addStep = () => {
    const index = value.steps.length + 1;
    onChange({
      ...value,
      steps: [
        ...value.steps,
        {
          id: `step-${Date.now()}-${index}`,
          title: `Step ${index}`,
          prompt: "",
          handoffNotes: ""
        }
      ]
    });
  };

  const removeStep = (id: string) => {
    if (value.steps.length === 1) return;
    onChange({ ...value, steps: value.steps.filter((step) => step.id !== id) });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Automation metadata</h2>
            <p className="text-sm text-slate-400">Capture purpose, triggering context, and launch evaluation signals.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
            Required
          </span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Automation name</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="e.g. Supplier Discrepancy Agent"
              value={value.name}
              onChange={handleField("name")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Trigger condition</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="When does this chain fire?"
              value={value.trigger}
              onChange={handleField("trigger")}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Problem statement</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Which personas are supported? What outcome should the chain deliver?"
              value={value.summary}
              onChange={handleField("summary")}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Evaluation rubric</label>
            <textarea
              className="min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Define success criteria, sandbox tests, and escalation guardrails."
              value={value.evaluation}
              onChange={handleField("evaluation")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Prompt chain design</h2>
            <p className="text-sm text-slate-400">Author sequential steps, capturing model instructions and handoff notes.</p>
          </div>
          <button
            type="button"
            onClick={addStep}
            className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20"
          >
            Add step
          </button>
        </div>
        <ol className="space-y-4">
          {value.steps.map((step, index) => (
            <li
              key={step.id}
              className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                    {index + 1}
                  </span>
                  <input
                    className="w-48 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none"
                    value={step.title}
                    onChange={(event) => handleStepChange(step.id, "title", event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 transition hover:border-red-500/60 hover:text-red-300 disabled:opacity-40"
                  disabled={value.steps.length === 1}
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Prompt instructions</label>
                <textarea
                  className="min-h-[140px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="Provide the system and user prompts the agent should follow at this step."
                  value={step.prompt}
                  onChange={(event) => handleStepChange(step.id, "prompt", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Handoff / tooling notes</label>
                <textarea
                  className="min-h-[100px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  placeholder="What context should the next step receive? Which APIs or checks execute?"
                  value={step.handoffNotes}
                  onChange={(event) => handleStepChange(step.id, "handoffNotes", event.target.value)}
                />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ReviewPanel({
  blueprint,
  ragData,
  chainData,
  onEdit,
  onReset,
  onSubmit,
  submitted
}: {
  blueprint: BlueprintKey;
  ragData: RagFormState;
  chainData: ChainFormState;
  onEdit: () => void;
  onReset: () => void;
  onSubmit: () => void;
  submitted: boolean;
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-accent/40 bg-accent/5 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Authoring checklist</h2>
        <p className="mt-2 text-sm text-slate-300">
          This summary captures blueprint inputs so the MARU team can wire the backend later. Nothing is persisted yet.
        </p>
      </section>

      {blueprint === "rag" ? (
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Automation overview</h3>
              <p className="text-sm text-slate-400">Grounded retrieval agent configuration</p>
            </div>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-accent">
              RAG
            </span>
          </div>
          <dl className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</dt>
              <dd className="text-sm text-slate-200">{ragData.name || "—"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Owner</dt>
              <dd className="text-sm text-slate-200">{ragData.owner || "—"}</dd>
            </div>
            <div className="md:col-span-2 space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Problem statement</dt>
              <dd className="text-sm text-slate-200">{ragData.summary || "—"}</dd>
            </div>
            <div className="md:col-span-2 space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Guardrails</dt>
              <dd className="text-sm text-slate-200">{ragData.guardrails || "—"}</dd>
            </div>
          </dl>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">Approved links</h4>
              {ragData.urls.length ? (
                <ul className="space-y-2 text-sm text-slate-300">
                  {ragData.urls.map((url) => (
                    <li key={url} className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2">
                      {url}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
                  No web links supplied.
                </p>
              )}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">Document uploads</h4>
              {ragData.uploads.length ? (
                <ul className="space-y-2 text-sm text-slate-300">
                  {ragData.uploads.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2">
                      <span>{file.name}</span>
                      <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
                  No documents uploaded.
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Refresh cadence</p>
              <p className="text-sm text-slate-200">{ragData.refreshCadence}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Chunk size</p>
              <p className="text-sm text-slate-200">{ragData.chunkSize} tokens</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Top-k</p>
              <p className="text-sm text-slate-200">{ragData.topK}</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Automation overview</h3>
              <p className="text-sm text-slate-400">Prompt chain plan</p>
            </div>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-accent">
              Prompt chain
            </span>
          </div>
          <dl className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</dt>
              <dd className="text-sm text-slate-200">{chainData.name || "—"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Trigger</dt>
              <dd className="text-sm text-slate-200">{chainData.trigger || "—"}</dd>
            </div>
            <div className="md:col-span-2 space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Problem statement</dt>
              <dd className="text-sm text-slate-200">{chainData.summary || "—"}</dd>
            </div>
            <div className="md:col-span-2 space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Evaluation rubric</dt>
              <dd className="text-sm text-slate-200">{chainData.evaluation || "—"}</dd>
            </div>
          </dl>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-200">Prompt steps</h4>
            <ol className="space-y-3">
              {chainData.steps.map((step, index) => (
                <li key={step.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-200">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>
                      Step {index + 1}: {step.title || "Untitled"}
                    </span>
                    <span>Handoff notes</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[2fr,1fr] md:gap-6">
                    <p className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                      {step.prompt || "No prompt supplied."}
                    </p>
                    <p className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                      {step.handoffNotes || "No handoff notes."}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {submitted ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-sm text-emerald-200">
          <p className="font-semibold">Plan captured</p>
          <p className="mt-1 text-emerald-100/80">
            This blueprint has been staged locally. Connect the persistence layer to finalize publishing.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
        >
          Back to editing
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitted}
          className={`rounded-full border px-6 py-2 text-sm font-semibold transition ${
            submitted
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
          }`}
        >
          Stage blueprint
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
        >
          Start over
        </button>
        <Link
          href="/automations"
          className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
        >
          Return to library
        </Link>
      </div>
    </div>
  );
}

export default function NewAutomationPage() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintKey | null>(null);
  const [ragForm, setRagForm] = useState<RagFormState>(() => createInitialRagForm());
  const [chainForm, setChainForm] = useState<ChainFormState>(() => createInitialChainForm());
  const [submitted, setSubmitted] = useState(false);

  const blueprintLabel = useMemo(() => {
    return selectedBlueprint ? blueprintOptions.find((item) => item.key === selectedBlueprint)?.title : undefined;
  }, [selectedBlueprint]);

  const canAdvance = useMemo(() => {
    if (stage !== "configure" || !selectedBlueprint) return false;
    if (selectedBlueprint === "rag") {
      return Boolean(ragForm.name.trim()) && (ragForm.urls.length > 0 || ragForm.uploads.length > 0);
    }
    const hasPrompts = chainForm.steps.every((step) => step.prompt.trim().length > 0);
    return Boolean(chainForm.name.trim()) && hasPrompts;
  }, [chainForm, ragForm, selectedBlueprint, stage]);

  const handleSelectBlueprint = (key: BlueprintKey) => {
    setSelectedBlueprint(key);
    setStage("configure");
    setSubmitted(false);
  };

  const handleResetFlow = () => {
    setStage("select");
    setSelectedBlueprint(null);
    setRagForm(createInitialRagForm());
    setChainForm(createInitialChainForm());
    setSubmitted(false);
  };

  const handleStageBlueprint = () => {
    setSubmitted(true);
  };

  const renderBody = () => {
    if (stage === "select") {
      return (
        <div className="grid gap-6 md:grid-cols-2">
          {blueprintOptions.map((blueprint) => (
            <button
              key={blueprint.key}
              type="button"
              onClick={() => handleSelectBlueprint(blueprint.key)}
              className="relative flex h-full flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-8 text-left transition hover:border-accent/60 hover:bg-slate-950/80"
            >
              <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                {blueprint.badge}
              </span>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-100">{blueprint.title}</h2>
                <p className="text-sm text-slate-300">{blueprint.blurb}</p>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {blueprint.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                Configure blueprint →
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (stage === "configure" && selectedBlueprint === "rag") {
      return <RagConfigurator key="rag" value={ragForm} onChange={setRagForm} />;
    }

    if (stage === "configure" && selectedBlueprint === "chain") {
      return <ChainConfigurator key="chain" value={chainForm} onChange={setChainForm} />;
    }

    if (stage === "review" && selectedBlueprint) {
      return (
        <ReviewPanel
          blueprint={selectedBlueprint}
          ragData={ragForm}
          chainData={chainForm}
          onEdit={() => {
            setSubmitted(false);
            setStage("configure");
          }}
          onReset={handleResetFlow}
          onSubmit={handleStageBlueprint}
          submitted={submitted}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/60 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Authoring</p>
            <h1 className="text-3xl font-semibold text-slate-100">New Micro-Automation</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Start from a blueprint, capture knowledge sources, and leave notes for the implementation team.
            </p>
          </div>
          <Link
            href="/automations"
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
          >
            Back to library
          </Link>
        </div>
        <div className="mt-6">
          <StagePills activeStage={stage} blueprintLabel={blueprintLabel} />
        </div>
      </header>

      {renderBody()}

      {stage === "configure" && selectedBlueprint ? (
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setStage("select");
              setSelectedBlueprint(null);
              setSubmitted(false);
            }}
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent hover:text-accent"
          >
            Change blueprint
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStage("review");
            }}
            disabled={!canAdvance}
            className={`rounded-full border px-6 py-2 text-sm font-semibold transition ${
              canAdvance
                ? "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
                : "border-slate-800 bg-slate-900/40 text-slate-500"
            }`}
          >
            Review handoff
          </button>
        </div>
      ) : null}
    </div>
  );
}
