import {
  ProjectComponent,
  ProjectSections,
  ReferenceDoc,
} from "./project-types";

const SECTION_HEADERS = [
  "## 📄 Overview",
  "## 🧭 Solution Objective",
  "## 🧩 Architecture & Solution Design",
  "## 🧰 Reference Documentation",
  "## ⚙️ Development Environment",
  "## 🧪 Testing",
  "## 🚀 Deployment / Delivery",
  "## 🔒 Security & Access",
];

function normalizeNewlines(input: string): string {
  return input.replace(/\r\n/g, "\n");
}

function cleanSection(section: string): string {
  return section.replace(/^---$/gm, "").trim();
}

function extractSection(markdown: string, header: string, headers: string[]): string {
  const startIndex = markdown.indexOf(header);
  if (startIndex === -1) {
    return "";
  }

  const start = startIndex + header.length;
  let end = markdown.length;

  for (const nextHeader of headers) {
    if (nextHeader === header) {
      continue;
    }
    const idx = markdown.indexOf(nextHeader, start);
    if (idx !== -1 && idx < end) {
      end = idx;
    }
  }

  return cleanSection(markdown.slice(start, end));
}

function extractSubSection(section: string, header: string, siblingHeaders: string[]): string {
  const startIndex = section.indexOf(header);
  if (startIndex === -1) {
    return "";
  }

  const start = startIndex + header.length;
  let end = section.length;

  for (const sibling of siblingHeaders) {
    if (sibling === header) {
      continue;
    }
    const idx = section.indexOf(sibling, start);
    if (idx !== -1 && idx < end) {
      end = idx;
    }
  }

  return cleanSection(section.slice(start, end));
}

function parseObjective(section: string) {
  const lines = section.split("\n");
  const steps: string[] = [];
  const descriptionLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const stepMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (stepMatch) {
      steps.push(stepMatch[1].trim());
    } else {
      descriptionLines.push(trimmed);
    }
  }

  const summary = descriptionLines.join(" ").replace(/\s+/g, " ").trim();

  return {
    summary: summary || undefined,
    steps,
  };
}

function parseComponents(tableSection: string): ProjectComponent[] {
  if (!tableSection.includes("|")) {
    return [];
  }

  const lines = tableSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 2) {
    return [];
  }

  const dataLines = lines.filter((line) => line.startsWith("|")).slice(2);

  const components: ProjectComponent[] = [];

  for (const line of dataLines) {
    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter((_, index, array) => !(index === 0 || index === array.length - 1));

    if (cells.length < 2) {
      continue;
    }

    const name = cells[0].replace(/\*\*/g, "").trim();
    const description = cells[1].trim();

    if (name) {
      components.push({ name, description });
    }
  }

  return components;
}

function parseOrderedList(section: string): string[] {
  const matches = Array.from(section.matchAll(/^\s*\d+\.\s+(.*)$/gm));
  return matches.map((match) => match[1].trim());
}

function parseReferenceDocs(section: string): ReferenceDoc[] {
  const matches = Array.from(section.matchAll(/^[\*\-]\s+\[(.+?)\]\((.+?)\)/gm));
  return matches.map((match) => ({
    label: match[1].trim(),
    url: match[2].trim(),
  }));
}

function stripListItems(section: string): string {
  return section
    .split("\n")
    .filter((line) => !/^\s*[\*\-]\s+/.test(line) && !/^\s*\d+\./.test(line))
    .join("\n")
    .trim();
}

function parseTesting(section: string) {
  if (!section) {
    return { instructions: undefined, command: undefined, coverage: [] };
  }

  const codeMatch = section.match(/```(?:\w+)?\n([\s\S]*?)```/);
  const command = codeMatch ? codeMatch[1].trim() : undefined;
  const withoutCode = codeMatch ? section.replace(codeMatch[0], "").trim() : section;

  const coverage = Array.from(withoutCode.matchAll(/^[\*\-]\s+(.*)$/gm)).map((match) => match[1].trim());
  const instructions = stripListItems(withoutCode).replace(/\s+/g, " ").trim() || undefined;

  return {
    instructions,
    command,
    coverage,
  };
}

function parseSecurity(section: string): string[] {
  const matches = Array.from(section.matchAll(/^[\*\-]\s+(.*)$/gm));
  return matches.map((match) => match[1].trim());
}

export function parseStandardizedReadme(readme: string): ProjectSections {
  const normalized = normalizeNewlines(readme);

  const solutionMatch = normalized.match(/^#\s+(.+)$/m);
  const solutionName = solutionMatch ? solutionMatch[1].replace(/\*\*/g, "").trim() : undefined;

  const overview = extractSection(normalized, SECTION_HEADERS[0], SECTION_HEADERS);
  const objectiveSection = extractSection(normalized, SECTION_HEADERS[1], SECTION_HEADERS);
  const architectureSection = extractSection(normalized, SECTION_HEADERS[2], SECTION_HEADERS);
  const referenceSection = extractSection(normalized, SECTION_HEADERS[3], SECTION_HEADERS);
  const developmentSection = extractSection(normalized, SECTION_HEADERS[4], SECTION_HEADERS);
  const testingSection = extractSection(normalized, SECTION_HEADERS[5], SECTION_HEADERS);
  const deploymentSection = extractSection(normalized, SECTION_HEADERS[6], SECTION_HEADERS);
  const securitySection = extractSection(normalized, SECTION_HEADERS[7], SECTION_HEADERS);

  const objective = parseObjective(objectiveSection);

  const componentsSection = extractSubSection(
    architectureSection,
    "### Components",
    ["### Components", "### Flow"],
  );
  const flowSection = extractSubSection(
    architectureSection,
    "### Flow",
    ["### Components", "### Flow"],
  );

  const components = parseComponents(componentsSection);
  const flow = parseOrderedList(flowSection);
  const referenceDocs = parseReferenceDocs(referenceSection);
  const testing = parseTesting(testingSection);
  const security = parseSecurity(securitySection);

  return {
    solutionName,
    overview: overview || undefined,
    objective,
    architecture: {
      components,
      flow,
    },
    referenceDocs,
    developmentEnvironment: developmentSection || undefined,
    testing,
    deployment: deploymentSection || undefined,
    security,
    rawReadme: readme,
  };
}

export function parseGitHubRepoUrl(repoUrl: string): { owner: string; repo: string } | null {
  if (!repoUrl) {
    return null;
  }

  if (repoUrl.startsWith("git@github.com:")) {
    const path = repoUrl.replace("git@github.com:", "").replace(/\.git$/, "");
    const [owner, repo] = path.split("/");
    if (owner && repo) {
      return { owner, repo };
    }
    return null;
  }

  try {
    const parsed = new URL(repoUrl);
    if (parsed.hostname !== "github.com") {
      return null;
    }

    const parts = parsed.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (parts.length < 2) {
      return null;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");

    if (!owner || !repo) {
      return null;
    }

    return { owner, repo };
  } catch (error) {
    return null;
  }
}
