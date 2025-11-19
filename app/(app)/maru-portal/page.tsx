"use client";

import { useState, useEffect } from "react";
import {
  projects as initialProjects,
  ProjectStatus,
  Project,
  getAllProjects,
  saveCustomProjects,
} from "@/lib/maru-projects";
import type { ProjectSections } from "@/lib/maru-projects";
import { ProjectCard } from "@/components/project-card";
import { Loader2, Plus, X } from "lucide-react";

type FilterOption = "all" | ProjectStatus;

type NewProjectForm = {
  projectName: string;
  status: ProjectStatus;
  repoUrl: string;
};

const DEFAULT_FORM_STATE: NewProjectForm = {
  projectName: "",
  status: "upcoming",
  repoUrl: "",
};

export default function MaruPortalPage() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState<NewProjectForm>(DEFAULT_FORM_STATE);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    setProjectsList(getAllProjects());
    setIsLoaded(true);
  }, []);

  // Save custom projects to localStorage whenever projectsList changes
  useEffect(() => {
    if (!isLoaded) return;
    
    const customProjects = projectsList.filter(
      (project) => !initialProjects.find((p) => p.id === project.id)
    );
    saveCustomProjects(customProjects);
  }, [projectsList, isLoaded]);

  const filteredProjects = filter === "all" 
    ? projectsList 
    : projectsList.filter((p) => p.status === filter);

  // Show loading state while projects are being loaded
  if (!isLoaded) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-400">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setNewProject({ ...DEFAULT_FORM_STATE });
    setCreationError(null);
  };

  const handleCreateProject = async () => {
    const trimmedName = newProject.projectName.trim();
    const trimmedRepoUrl = newProject.repoUrl.trim();

    if (!trimmedName) {
      setCreationError("Project name is required.");
      return;
    }

    if (!trimmedRepoUrl) {
      setCreationError("Repository URL is required.");
      return;
    }

    setIsCreatingProject(true);
    setCreationError(null);

    try {
      const response = await fetch(
        `/api/github/readme?repoUrl=${encodeURIComponent(trimmedRepoUrl)}`
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to parse repository README.");
      }

      const rawSections = (payload?.data?.sections ?? {}) as ProjectSections;
      const sections: ProjectSections = {
        ...rawSections,
        objective: {
          summary: rawSections.objective?.summary,
          steps: rawSections.objective?.steps ?? [],
        },
        architecture: {
          components: rawSections.architecture?.components ?? [],
          flow: rawSections.architecture?.flow ?? [],
        },
        referenceDocs: rawSections.referenceDocs ?? [],
        developmentEnvironment: rawSections.developmentEnvironment,
        testing: rawSections.testing
          ? {
              instructions: rawSections.testing.instructions,
              command: rawSections.testing.command,
              coverage: rawSections.testing.coverage ?? [],
            }
          : { coverage: [] },
        deployment: rawSections.deployment,
        security: rawSections.security ?? [],
        solutionName: rawSections.solutionName,
        rawReadme: rawSections.rawReadme,
      };
      const objectiveSteps = sections.objective?.steps ?? [];
      const flowSteps = sections.architecture?.flow ?? [];

      let stepDescriptions = objectiveSteps.length ? objectiveSteps : flowSteps;
      const parsedComponents = sections.architecture?.components ?? [];
      let normalizedComponents = parsedComponents;

      if (!normalizedComponents.length && flowSteps.length) {
        normalizedComponents = flowSteps.map((description, index) => ({
          name: `Flow Step ${index + 1}`,
          description,
        }));
      }

      if (!normalizedComponents.length) {
        normalizedComponents = [{
          name: "Repository",
          description: "Refer to the repository README for detailed component information.",
        }];
      }

      if (!stepDescriptions.length) {
        stepDescriptions = normalizedComponents
          .map((component) => component.description)
          .filter(Boolean);
      }

      if (!stepDescriptions.length) {
        stepDescriptions = ["Refer to the repository README for workflow details."];
      }

      const hydratedSections: ProjectSections = {
        ...sections,
        defaultBranch: sections.defaultBranch ?? payload?.data?.defaultBranch,
        objective: {
          summary: sections.objective?.summary,
          steps: stepDescriptions,
        },
        architecture: {
          components: normalizedComponents,
          flow: flowSteps.length ? flowSteps : stepDescriptions,
        },
      };

      const deploymentText =
        sections.deployment?.trim() || "Refer to the repository README for deployment details.";

      const baseId = trimmedName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      let uniqueId = baseId || `project-${Date.now()}`;
      let counter = 1;

      while (projectsList.find((project) => project.id === uniqueId)) {
        uniqueId = `${baseId || "project"}-${counter}`;
        counter += 1;
      }

      const project: Project = {
        id: uniqueId,
        name: trimmedName,
        status: newProject.status,
        summary: hydratedSections.overview?.trim() || "Overview not provided.",
        objective: hydratedSections.objective?.summary?.trim() || "Objective not provided.",
        steps: stepDescriptions.map((description) => ({ description })),
        components: normalizedComponents,
        repoUrl: trimmedRepoUrl,
        executionMode: deploymentText,
        targetEnvironment: "See README",
        outputDestination: "See README",
        tags: [],
        lastUpdated: new Date().toISOString().split("T")[0],
        sections: hydratedSections,
      };

      const updatedProjects = [...projectsList, project];
      setProjectsList(updatedProjects);
      setShowNewProjectForm(false);
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the project.";
      setCreationError(message);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowNewProjectForm(false);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🚀</div>
            <h1 className="text-4xl font-bold text-slate-100">
              MARU Portal
            </h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Welcome to the <span className="text-accent font-semibold">MARU Portal</span>.
            Your gateway to streamlined developer onboarding and frictionless development environments.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Browse ongoing and upcoming micro automation solutions. Each project includes everything you need to get started—standardized environments, clear documentation, and pre-configured dependencies.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Filter:
          </span>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All Projects" },
              { value: "in-progress", label: "In Progress" },
              { value: "upcoming", label: "Upcoming" },
              { value: "completed", label: "Completed" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as FilterOption)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  filter === option.value
                    ? "bg-accent text-slate-900"
                    : "bg-slate-900/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-surface/40 p-12 text-center">
            <p className="text-lg text-slate-400">
              No projects found matching the selected filter.
            </p>
          </div>
        )}

        {/* Add New Project Button */}
        {!showNewProjectForm && (
          <div className="mt-12">
            <button
              onClick={() => {
                resetForm();
                setShowNewProjectForm(true);
              }}
              className="flex items-center gap-2 px-6 py-4 rounded-lg border-2 border-accent/50 bg-accent/10 hover:bg-accent/20 text-accent transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Project</span>
            </button>
          </div>
        )}

        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="mt-12 rounded-2xl border border-slate-700 bg-slate-900/80 p-8">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Create New Project</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Provide the repository details and we'll import the standardized README to auto-populate your MARU Portal entry.
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.projectName}
                  onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                  placeholder="e.g., Customer Data Sync"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value as ProjectStatus })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-accent"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Repository URL *
                </label>
                <input
                  type="url"
                  value={newProject.repoUrl}
                  onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                  placeholder="https://github.com/org/repo"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent"
                />
                <p className="mt-2 text-xs text-slate-500">
                  The repository must use the standardized MARU README template.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-200">What happens next?</p>
              <ol className="mt-3 list-decimal list-inside space-y-1 text-slate-400">
                <li>We fetch the README from GitHub.</li>
                <li>The standardized sections are mapped to the MARU Portal layout.</li>
                <li>The project is saved immediately to your library.</li>
              </ol>
            </div>

            {creationError && (
              <div className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {creationError}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreatingProject}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-slate-900 font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingProject ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {isCreatingProject ? "Creating" : "Create Project"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
