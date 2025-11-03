"use client";

import { useState, useEffect } from "react";
import { 
  projects as initialProjects, 
  ProjectStatus, 
  Project, 
  getAllProjects, 
  saveCustomProjects 
} from "@/lib/maru-projects";
import { ProjectCard } from "@/components/project-card";
import { Trash2, Plus, X } from "lucide-react";

type FilterOption = "all" | ProjectStatus;

interface ProjectSection {
  title: string;
  content: string;
  bulletPoints: string[];
}

interface NewProjectForm {
  projectName: string;
  status: ProjectStatus;
  repoUrl: string;
  sections: {
    overview: ProjectSection;
    objective: ProjectSection;
    architecture: ProjectSection;
    devEnvironment: ProjectSection;
    testing: ProjectSection;
    deployment: ProjectSection;
    governance: ProjectSection;
    reference: ProjectSection;
  };
}

const SECTION_TEMPLATES = [
  {
    key: "overview" as const,
    emoji: "📄",
    title: "Overview",
    placeholder: "Provide a high-level summary of the project, its purpose, and key value propositions.",
  },
  {
    key: "objective" as const,
    emoji: "🧭",
    title: "Objective",
    placeholder: "Define the specific goals and success criteria for this automation project.",
  },
  {
    key: "architecture" as const,
    emoji: "🧩",
    title: "Architecture & Solution Design",
    placeholder: "Outline the technical architecture, data flow, and integration patterns used in this solution.",
  },
  {
    key: "devEnvironment" as const,
    emoji: "⚙️",
    title: "Development Environment",
    placeholder: "Details on setting up and working with the development environment for this project.",
  },
  {
    key: "testing" as const,
    emoji: "🧪",
    title: "Testing",
    placeholder: "Testing strategy, coverage, and procedures to ensure code quality and reliability.",
  },
  {
    key: "deployment" as const,
    emoji: "🚀",
    title: "Deployment / Delivery",
    placeholder: "Deployment procedures, environments, and delivery mechanisms for this automation.",
  },
  {
    key: "governance" as const,
    emoji: "🧭",
    title: "Governance & Review",
    placeholder: "Governance framework, review processes, and compliance requirements for this project.",
  },
  {
    key: "reference" as const,
    emoji: "🧰",
    title: "Reference Documentation",
    placeholder: "Links to additional documentation, resources, and references for this project.",
  },
];

export default function MaruPortalPage() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newProject, setNewProject] = useState<NewProjectForm>({
    projectName: "",
    status: "upcoming",
    repoUrl: "",
    sections: {
      overview: { title: "", content: "", bulletPoints: [""] },
      objective: { title: "", content: "", bulletPoints: [""] },
      architecture: { title: "", content: "", bulletPoints: [""] },
      devEnvironment: { title: "", content: "", bulletPoints: [""] },
      testing: { title: "", content: "", bulletPoints: [""] },
      deployment: { title: "", content: "", bulletPoints: [""] },
      governance: { title: "", content: "", bulletPoints: [""] },
      reference: { title: "", content: "", bulletPoints: [""] },
    },
  });

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

  const handleAddBulletPoint = (sectionKey: keyof NewProjectForm["sections"]) => {
    setNewProject({
      ...newProject,
      sections: {
        ...newProject.sections,
        [sectionKey]: {
          ...newProject.sections[sectionKey],
          bulletPoints: [...newProject.sections[sectionKey].bulletPoints, ""],
        },
      },
    });
  };

  const handleUpdateBulletPoint = (
    sectionKey: keyof NewProjectForm["sections"],
    index: number,
    value: string
  ) => {
    const updatedBulletPoints = [...newProject.sections[sectionKey].bulletPoints];
    updatedBulletPoints[index] = value;
    setNewProject({
      ...newProject,
      sections: {
        ...newProject.sections,
        [sectionKey]: {
          ...newProject.sections[sectionKey],
          bulletPoints: updatedBulletPoints,
        },
      },
    });
  };

  const handleRemoveBulletPoint = (
    sectionKey: keyof NewProjectForm["sections"],
    index: number
  ) => {
    const updatedBulletPoints = newProject.sections[sectionKey].bulletPoints.filter(
      (_, i) => i !== index
    );
    setNewProject({
      ...newProject,
      sections: {
        ...newProject.sections,
        [sectionKey]: {
          ...newProject.sections[sectionKey],
          bulletPoints: updatedBulletPoints.length > 0 ? updatedBulletPoints : [""],
        },
      },
    });
  };

  const handleSectionContentChange = (
    sectionKey: keyof NewProjectForm["sections"],
    content: string
  ) => {
    setNewProject({
      ...newProject,
      sections: {
        ...newProject.sections,
        [sectionKey]: {
          ...newProject.sections[sectionKey],
          content,
        },
      },
    });
  };

  const handleNextStep = () => {
    if (currentStep < SECTION_TEMPLATES.length + 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = () => {
    if (!newProject.projectName.trim()) {
      return;
    }

    // Generate unique ID
    const baseId = newProject.projectName.toLowerCase().replace(/\s+/g, "-");
    let uniqueId = baseId;
    let counter = 1;
    while (projectsList.find((p) => p.id === uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }

    const project: Project = {
      id: uniqueId,
      name: newProject.projectName,
      status: newProject.status,
      summary: newProject.sections.overview.content || "No summary provided",
      objective: newProject.sections.objective.content || "No objective provided",
      steps: newProject.sections.architecture.bulletPoints
        .filter((bp) => bp.trim() !== "")
        .map((bp) => ({ description: bp })),
      components: newProject.sections.devEnvironment.bulletPoints
        .filter((bp) => bp.trim() !== "")
        .map((bp) => ({ name: bp, description: bp })),
      repoUrl: newProject.repoUrl || "https://github.com/deepcurrents/new-project",
      executionMode: newProject.sections.deployment.bulletPoints[0] || "TBD",
      targetEnvironment: newProject.sections.deployment.bulletPoints[1] || "TBD",
      outputDestination: newProject.sections.deployment.bulletPoints[2] || "TBD",
      tags: [],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    console.log("Creating project:", project);
    const updatedProjects = [...projectsList, project];
    setProjectsList(updatedProjects);
    
    // Reset form
    setShowNewProjectForm(false);
    setCurrentStep(0);
    setNewProject({
      projectName: "",
      status: "upcoming",
      repoUrl: "",
      sections: {
        overview: { title: "", content: "", bulletPoints: [""] },
        objective: { title: "", content: "", bulletPoints: [""] },
        architecture: { title: "", content: "", bulletPoints: [""] },
        devEnvironment: { title: "", content: "", bulletPoints: [""] },
        testing: { title: "", content: "", bulletPoints: [""] },
        deployment: { title: "", content: "", bulletPoints: [""] },
        governance: { title: "", content: "", bulletPoints: [""] },
        reference: { title: "", content: "", bulletPoints: [""] },
      },
    });

    // Scroll to top to see the updated library
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowNewProjectForm(false);
    setCurrentStep(0);
    setNewProject({
      projectName: "",
      status: "upcoming",
      repoUrl: "",
      sections: {
        overview: { title: "", content: "", bulletPoints: [""] },
        objective: { title: "", content: "", bulletPoints: [""] },
        architecture: { title: "", content: "", bulletPoints: [""] },
        devEnvironment: { title: "", content: "", bulletPoints: [""] },
        testing: { title: "", content: "", bulletPoints: [""] },
        deployment: { title: "", content: "", bulletPoints: [""] },
        governance: { title: "", content: "", bulletPoints: [""] },
        reference: { title: "", content: "", bulletPoints: [""] },
      },
    });
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
              onClick={() => setShowNewProjectForm(true)}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Create New Project</h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Project Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
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
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Repository URL
                  </label>
                  <input
                    type="text"
                    value={newProject.repoUrl}
                    onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {/* Section Forms */}
            {currentStep > 0 && currentStep <= SECTION_TEMPLATES.length && (
              <>
                {SECTION_TEMPLATES.map((template, index) => {
                  if (index !== currentStep - 1) return null;
                  const sectionKey = template.key;
                  const section = newProject.sections[sectionKey];

                  return (
                    <div key={template.key} className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                        <span className="text-3xl">{template.emoji}</span>
                        <h3 className="text-xl font-semibold text-slate-100">{template.title}</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Description
                        </label>
                        <p className="text-sm text-slate-400 mb-3">{template.placeholder}</p>
                        <textarea
                          value={section.content}
                          onChange={(e) => handleSectionContentChange(sectionKey, e.target.value)}
                          placeholder="Enter section content..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent resize-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-slate-300">
                            Key Points
                          </label>
                          <button
                            onClick={() => handleAddBulletPoint(sectionKey)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border border-accent/50 text-accent hover:bg-accent/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            Add Point
                          </button>
                        </div>
                        <div className="space-y-3">
                          {section.bulletPoints.map((point, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={point}
                                onChange={(e) =>
                                  handleUpdateBulletPoint(sectionKey, idx, e.target.value)
                                }
                                placeholder="Enter bullet point..."
                                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent"
                              />
                              {section.bulletPoints.length > 1 && (
                                <button
                                  onClick={() => handleRemoveBulletPoint(sectionKey, idx)}
                                  className="p-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                  title="Remove bullet point"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Final Review Step */}
            {currentStep > SECTION_TEMPLATES.length && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                  <span className="text-3xl">✅</span>
                  <h3 className="text-xl font-semibold text-slate-100">Review & Create</h3>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-6">
                  <p className="text-lg text-slate-200 mb-4">
                    <strong>Project Name:</strong> {newProject.projectName}
                  </p>
                  <p className="text-sm text-slate-300 mb-2">
                    <strong>Status:</strong> {newProject.status}
                  </p>
                  <p className="text-sm text-slate-300">
                    <strong>Repository:</strong> {newProject.repoUrl || "Not specified"}
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-sm text-slate-400">
                      Click "Create Project" below to add this project to your MARU Portal library.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="mt-8 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">
                  Step {currentStep + 1} of {SECTION_TEMPLATES.length + 2}
                </span>
                <span className="text-sm text-slate-400">
                  {currentStep === 0
                    ? "Basic Info"
                    : currentStep > SECTION_TEMPLATES.length
                    ? "Review & Create"
                    : SECTION_TEMPLATES[currentStep - 1]?.title}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / (SECTION_TEMPLATES.length + 2)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                {currentStep < SECTION_TEMPLATES.length + 1 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={currentStep === 0 && !newProject.projectName.trim()}
                    className="px-6 py-3 rounded-lg bg-accent text-slate-900 font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === SECTION_TEMPLATES.length ? "Continue to Review" : "Next"}
                  </button>
                ) : (
                  <button
                    onClick={handleCreateProject}
                    disabled={!newProject.projectName.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                    Create Project
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
