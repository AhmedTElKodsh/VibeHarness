import { basename, join } from "node:path";
import { exists, readText, writeText } from "./fs-utils";

function ideaTitle(ideaPath: string): string {
  if (!exists(ideaPath)) {
    throw new Error(`Idea file not found: ${ideaPath}`);
  }

  const firstHeading = readText(ideaPath)
    .split(/\r?\n/)
    .find((line: string): boolean => line.startsWith("# "));
  return firstHeading?.replace(/^#\s+/, "") ?? basename(ideaPath);
}

export function generatePlanArtifacts(root: string, ideaPath: string): string[] {
  const title = ideaTitle(ideaPath);
  const docsRoot = join(root, "docs");
  const prdPath = join(docsRoot, "prd.md");
  const architecturePath = join(docsRoot, "architecture.md");
  const tasksPath = join(docsRoot, "tasks.md");
  const riskPath = join(docsRoot, "risk-register.md");
  const questionsPath = join(docsRoot, "unresolved-questions.md");
  const artifacts = [prdPath, architecturePath, tasksPath, riskPath, questionsPath];

  writeText(
    prdPath,
    `# PRD: ${title}

## Goal

Deliver the requested feature through the VibeHarness P0 workflow.

## Acceptance Criteria

- The project validates before execution.
- The default mock workflow produces a run manifest.
- Review and handoff artifacts cite tests, risks, and next actions.
`,
    true
  );
  writeText(
    architecturePath,
    `# Architecture: ${title}

## Approach

Use the local VibeHarness kernel, default workflow, mock adapter, and policy gates.

## Boundaries

- No production network actions.
- No secret reads.
- Destructive commands require approval.
`,
    true
  );
  writeText(
    tasksPath,
    `# Tasks: ${title}

- Validate project contracts.
- Package implementation task for the mock adapter.
- Run deterministic fixture execution.
- Generate review and handoff artifacts.
`,
    true
  );
  writeText(
    riskPath,
    `# Risk Register

| Risk | Mitigation |
|---|---|
| Generated plan misses context | Keep unresolved questions visible in the handoff. |
| Unsafe command requested | Apply policy decision before execution. |
`,
    true
  );
  writeText(
    questionsPath,
    `# Unresolved Questions

- Confirm whether any project-specific coding standards should be added before a real adapter runs.
`,
    true
  );

  return artifacts;
}
