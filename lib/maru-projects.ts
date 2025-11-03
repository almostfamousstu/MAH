export type ProjectStatus = "upcoming" | "in-progress" | "completed";

export type ProjectStep = {
  description: string;
};

export type Component = {
  name: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  summary: string;
  objective: string;
  steps: ProjectStep[];
  components: Component[];
  repoUrl: string;
  executionMode: string;
  targetEnvironment: string;
  outputDestination: string;
  tags: string[];
  lastUpdated: string;
};

export const projects: Project[] = [
  {
    id: "salesforce-sync",
    name: "Salesforce Data Sync",
    status: "in-progress",
    summary: "Automated synchronization of customer data between Salesforce and internal database",
    objective: "Automatically sync customer records from Salesforce to our internal PostgreSQL database on a scheduled basis",
    steps: [
      { description: "Authenticate with Salesforce API using OAuth 2.0" },
      { description: "Query customer records modified in the last 24 hours" },
      { description: "Transform Salesforce schema to internal database schema" },
      { description: "Upsert records into PostgreSQL with conflict resolution" }
    ],
    components: [
      { name: "Salesforce API Client", description: "OAuth-based connector to Salesforce REST API" },
      { name: "main.py", description: "Entry point that orchestrates the sync process" },
      { name: "config.yaml", description: "Environment-specific credentials and sync parameters" },
      { name: "Dev Container", description: "Prebuilt environment with Python 3.11, dependencies, and database drivers" },
      { name: "Tests", description: "Unit tests for transformation logic and integration tests for API connectivity" }
    ],
    repoUrl: "https://github.com/deepcurrents/salesforce-sync",
    executionMode: "Scheduled (Daily at 2 AM UTC)",
    targetEnvironment: "Airflow / Kubernetes CronJob",
    outputDestination: "Internal PostgreSQL Database",
    tags: ["CRM", "Data Sync", "Python", "Salesforce"],
    lastUpdated: "2025-10-28"
  },
  {
    id: "slack-alert-dispatcher",
    name: "Slack Alert Dispatcher",
    status: "in-progress",
    summary: "Intelligent alert routing system that sends critical system events to appropriate Slack channels",
    objective: "Monitor system health endpoints and dispatch formatted alerts to designated Slack channels based on severity",
    steps: [
      { description: "Poll health check endpoints across all production services" },
      { description: "Classify alerts by severity (info, warning, critical)" },
      { description: "Format alert messages with context and actionable links" },
      { description: "Send to appropriate Slack channels via webhook" }
    ],
    components: [
      { name: "Health Monitor", description: "Polls various service endpoints for status checks" },
      { name: "main.py", description: "Core script that orchestrates monitoring and alerting" },
      { name: "config.yaml", description: "Webhook URLs, channel mappings, and polling intervals" },
      { name: "Dev Container", description: "Python environment with requests, aiohttp, and testing tools" },
      { name: "Tests", description: "Mock endpoint tests and webhook delivery verification" }
    ],
    repoUrl: "https://github.com/deepcurrents/slack-alert-dispatcher",
    executionMode: "Continuous (runs every 5 minutes)",
    targetEnvironment: "Kubernetes Deployment",
    outputDestination: "Slack Channels via Webhooks",
    tags: ["Monitoring", "Alerts", "Python", "Slack"],
    lastUpdated: "2025-10-30"
  },
  {
    id: "invoice-processor",
    name: "Invoice Data Processor",
    status: "upcoming",
    summary: "Extract, validate, and process invoice data from uploaded PDF documents",
    objective: "Automatically process invoice PDFs, extract key information, validate against purchase orders, and store in finance system",
    steps: [
      { description: "Monitor S3 bucket for new invoice PDF uploads" },
      { description: "Extract text and structured data using OCR and pattern matching" },
      { description: "Validate invoice details against purchase order database" },
      { description: "Store processed invoices in finance system with approval workflow" }
    ],
    components: [
      { name: "S3 Event Listener", description: "Monitors S3 bucket for new invoice uploads" },
      { name: "main.py", description: "Orchestrates PDF processing and data extraction pipeline" },
      { name: "config.yaml", description: "S3 bucket paths, API credentials, and validation rules" },
      { name: "Dev Container", description: "Python with PyPDF2, Tesseract OCR, and finance API clients" },
      { name: "Tests", description: "PDF parsing tests, validation logic, and integration checks" }
    ],
    repoUrl: "https://github.com/deepcurrents/invoice-processor",
    executionMode: "Event-triggered (S3 upload)",
    targetEnvironment: "AWS Lambda / Codespace for development",
    outputDestination: "Finance System API + Archive S3 Bucket",
    tags: ["Finance", "OCR", "Python", "AWS Lambda"],
    lastUpdated: "2025-10-15"
  },
  {
    id: "jira-github-bridge",
    name: "Jira-GitHub Bridge",
    status: "upcoming",
    summary: "Bidirectional synchronization between Jira tickets and GitHub issues",
    objective: "Keep Jira and GitHub in sync by automatically creating, updating, and linking tickets based on changes in either system",
    steps: [
      { description: "Listen to webhooks from both Jira and GitHub" },
      { description: "Parse event payloads and determine sync action needed" },
      { description: "Transform data between Jira and GitHub formats" },
      { description: "Create or update tickets in target system with reference links" }
    ],
    components: [
      { name: "Webhook Server", description: "Express.js server listening to Jira and GitHub webhooks" },
      { name: "main.ts", description: "Entry point that handles webhook routing and processing" },
      { name: "config.yaml", description: "API credentials, field mappings, and sync rules" },
      { name: "Dev Container", description: "Node.js 20 with TypeScript, API clients, and testing framework" },
      { name: "Tests", description: "Webhook payload tests, API integration tests, and sync logic validation" }
    ],
    repoUrl: "https://github.com/deepcurrents/jira-github-bridge",
    executionMode: "API-triggered (webhook-based)",
    targetEnvironment: "Kubernetes Service / Cloud Run",
    outputDestination: "Jira API and GitHub API",
    tags: ["Integration", "TypeScript", "Jira", "GitHub"],
    lastUpdated: "2025-10-20"
  },
  {
    id: "report-generator",
    name: "Weekly Analytics Report Generator",
    status: "upcoming",
    summary: "Generate and distribute weekly analytics reports with charts and insights",
    objective: "Automatically compile data from various sources, generate visualizations, and email formatted reports to stakeholders",
    steps: [
      { description: "Query analytics database for weekly metrics" },
      { description: "Generate charts and visualizations using matplotlib/plotly" },
      { description: "Compile data into HTML report template" },
      { description: "Send formatted email reports to distribution list" }
    ],
    components: [
      { name: "Data Aggregator", description: "Queries multiple data sources and aggregates metrics" },
      { name: "main.py", description: "Orchestrates report generation and distribution" },
      { name: "config.yaml", description: "Database connections, email recipients, and report settings" },
      { name: "Dev Container", description: "Python with pandas, matplotlib, jinja2, and email libraries" },
      { name: "Tests", description: "Data aggregation tests, chart generation, and email formatting checks" }
    ],
    repoUrl: "https://github.com/deepcurrents/report-generator",
    executionMode: "Scheduled (Weekly on Monday at 8 AM)",
    targetEnvironment: "Airflow / GitHub Actions",
    outputDestination: "Email (via SendGrid) + Archive S3 Bucket",
    tags: ["Analytics", "Reporting", "Python", "Email"],
    lastUpdated: "2025-10-10"
  }
];

export function getProjectById(id: string): Project | undefined {
  const allProjects = getAllProjects();
  return allProjects.find((project) => project.id === id);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  const allProjects = getAllProjects();
  return allProjects.filter((project) => project.status === status);
}

const PROJECTS_STORAGE_KEY = "maru-portal-projects";

export function getAllProjects(): Project[] {
  // Return only initial projects if on server or localStorage is not available
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return [...projects];
  }

  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  const customProjects = stored ? JSON.parse(stored) : [];
  
  // Combine initial and custom projects, ensuring no duplicates by ID
  const combined = [...customProjects, ...projects];
  const uniqueProjects = Array.from(new Map(combined.map(p => [p.id, p])).values());
  
  return uniqueProjects;
}

export function saveCustomProjects(customProjects: Project[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(customProjects));
  }
}
