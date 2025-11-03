import Link from "next/link";
import { Project, ProjectStatus } from "@/lib/maru-projects";

type ProjectCardProps = {
  project: Project;
};

const statusColors: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
  upcoming: {
    bg: "bg-slate-900/40",
    text: "text-slate-400",
    border: "border-slate-700"
  },
  "in-progress": {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/50"
  },
  completed: {
    bg: "bg-green-900/20",
    text: "text-green-400",
    border: "border-green-700/50"
  }
};

const statusLabels: Record<ProjectStatus, string> = {
  upcoming: "Upcoming",
  "in-progress": "In Progress",
  completed: "Completed"
};

export function ProjectCard({ project }: ProjectCardProps) {
  const statusStyle = statusColors[project.status];

  return (
    <Link href={`/maru-portal/${project.id}`}>
      <div className="group h-full rounded-2xl border border-slate-800 bg-surface/60 p-6 transition-all hover:border-accent/60 hover:bg-surface/80 hover:shadow-glow">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Updated {new Date(project.lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {statusLabels[project.status]}
            </span>
          </div>

          {/* Summary */}
          <p className="mb-4 flex-1 text-sm text-slate-300 line-clamp-3">
            {project.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-900/60 px-2 py-1 text-xs font-mono text-slate-400"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="rounded-md bg-slate-900/60 px-2 py-1 text-xs font-mono text-slate-500">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 pt-4 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>📦 {project.components.length} components</span>
              <span className="text-accent group-hover:text-accent-muted transition-colors">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
