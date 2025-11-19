export type ProjectStatus = "upcoming" | "in-progress" | "completed";

export type ProjectStep = {
  description: string;
};

export type ProjectComponent = {
  name: string;
  description: string;
};

export type ReferenceDoc = {
  label: string;
  url: string;
};

export type ProjectTestingInfo = {
  instructions?: string;
  command?: string;
  coverage: string[];
};

export type ProjectSections = {
  overview?: string;
  objective?: {
    summary?: string;
    steps: string[];
  };
  architecture?: {
    components: ProjectComponent[];
    flow: string[];
  };
  referenceDocs?: ReferenceDoc[];
  developmentEnvironment?: string;
  testing?: ProjectTestingInfo;
  deployment?: string;
  security?: string[];
  solutionName?: string;
  rawReadme?: string;
  defaultBranch?: string;
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  summary: string;
  objective: string;
  steps: ProjectStep[];
  components: ProjectComponent[];
  repoUrl: string;
  executionMode: string;
  targetEnvironment: string;
  outputDestination: string;
  tags: string[];
  lastUpdated: string;
  sections?: ProjectSections;
};
