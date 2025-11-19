import { NextRequest, NextResponse } from "next/server";
import { parseGitHubRepoUrl, parseStandardizedReadme } from "@/lib/readme-parser";

const GITHUB_API_BASE = "https://api.github.com";

export async function GET(request: NextRequest) {
  const repoUrl = request.nextUrl.searchParams.get("repoUrl");

  if (!repoUrl) {
    return NextResponse.json({ error: "Missing repoUrl query parameter." }, { status: 400 });
  }

  const repoInfo = parseGitHubRepoUrl(repoUrl);

  if (!repoInfo) {
    return NextResponse.json({ error: "Invalid GitHub repository URL." }, { status: 400 });
  }

  const { owner, repo } = repoInfo;

  try {
    const baseHeaders: Record<string, string> = {
      "User-Agent": "maru-portal",
    };

    const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_PERSONAL_ACCESS_TOKEN ?? process.env.GH_TOKEN;
    if (token) {
      baseHeaders.Authorization = `Bearer ${token}`;
    }

    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: {
        ...baseHeaders,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });

    if (!repoResponse.ok) {
      const status = repoResponse.status;
      const message =
        status === 404
          ? "Repository not found. Please check the URL."
          : status === 403
          ? "GitHub API rate limit reached. Please try again later or configure a GITHUB_TOKEN."
          : "Unable to fetch repository metadata from GitHub.";

      return NextResponse.json({ error: message }, { status });
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData?.default_branch ?? "main";

    const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
      headers: {
        ...baseHeaders,
        Accept: "application/vnd.github.raw",
      },
      cache: "no-store",
    });

    if (!readmeResponse.ok) {
      const status = readmeResponse.status;
      const message =
        status === 404
          ? "README.md not found for the provided repository."
          : status === 403
          ? "GitHub API rate limit reached. Please try again later or configure a GITHUB_TOKEN."
          : "Unable to fetch README.md from GitHub.";

      return NextResponse.json({ error: message }, { status });
    }

    const readmeContent = await readmeResponse.text();
    const sections = parseStandardizedReadme(readmeContent);
    sections.defaultBranch = defaultBranch;

    return NextResponse.json({
      data: {
        owner,
        repo,
        defaultBranch,
        sections,
      },
    });
  } catch (error) {
    console.error("Failed to fetch README:", error);
    return NextResponse.json({ error: "Unexpected error fetching README." }, { status: 500 });
  }
}
