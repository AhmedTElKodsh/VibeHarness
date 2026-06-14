import { join } from "node:path";
import { writeText } from "./fs-utils";
import { loadRunManifest } from "./validation";

export function generateReview(root: string, runRef: string): string[] {
  const runRoot = join(root, ".vibeharness", "runs", runRef);
  const manifest = loadRunManifest(join(runRoot, "run-manifest.json"));
  const changedArtifacts = manifest.artifacts.join("\n- ");
  const tests = manifest.tests.map((test) => `${test.command}: ${test.status}`).join("\n- ");
  const risks = manifest.policyDecisions.map((decision) => `${decision.id}: ${decision.decision} - ${decision.reason}`).join("\n- ");

  const reviewPath = join(runRoot, "review.md");
  const handoffPath = join(runRoot, "handoff.md");
  const policyAuditPath = join(runRoot, "policy-audit.md");

  writeText(
    reviewPath,
    `# Review

## Scope Implemented

Workflow \`${manifest.workflow}\` ran with adapter \`${manifest.adapter}\` and ended as \`${manifest.status}\`.

## Changed Artifacts

- ${changedArtifacts}

## Tests

- ${tests}

## Risks

- ${risks}

## Next Actions

- Inspect any approval-required policy decision before running a real adapter.
`,
    true
  );
  writeText(
    handoffPath,
    `# Handoff

## Summary

Run \`${manifest.runId}\` completed the P0 mock-adapter path with status \`${manifest.status}\`.

## Tests Run

- ${tests}

## Files Changed

- ${changedArtifacts}

## Risks and Follow-ups

- ${risks}
`,
    true
  );
  writeText(
    policyAuditPath,
    `# Policy Audit

- ${risks}
`,
    true
  );

  return [reviewPath, handoffPath, policyAuditPath];
}
