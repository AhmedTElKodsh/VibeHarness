import { join } from "node:path";
import {
  eccImplementationProfileYaml,
  eccPlanningProfileYaml,
  eccReviewProfileYaml,
  exampleIdea,
  mockAdapterYaml,
  mockPartialFailureWorkflowYaml,
  openHandsAdapterExampleYaml,
  policyBlockedWorkflowYaml,
  policyDeniedWorkflowYaml,
  policyQuarantinedWorkflowYaml,
  policyWarnWorkflowYaml,
  policyYaml,
  projectYaml,
  workflowYaml
} from "./templates";
import { ensureDir, writeText } from "./fs-utils";

export function writeStarterProject(root: string, overwrite = false): void {
  writeText(join(root, ".vibeharness", "project.yaml"), projectYaml, overwrite);
  writeText(join(root, ".vibeharness", "policy.yaml"), policyYaml, overwrite);
  writeText(join(root, ".vibeharness", "workflows", "default-feature.yaml"), workflowYaml, overwrite);
  writeText(join(root, ".vibeharness", "adapters", "mock.yaml"), mockAdapterYaml, overwrite);
  writeText(join(root, ".vibeharness", "profiles", "ecc-planning.yaml"), eccPlanningProfileYaml, overwrite);
  writeText(join(root, ".vibeharness", "profiles", "ecc-implementation.yaml"), eccImplementationProfileYaml, overwrite);
  writeText(join(root, ".vibeharness", "profiles", "ecc-review.yaml"), eccReviewProfileYaml, overwrite);
  writeText(
    join(root, ".vibeharness", "adapters", "openhands.yaml.example"),
    openHandsAdapterExampleYaml,
    overwrite
  );
  writeText(join(root, "docs", "example-idea.md"), exampleIdea, overwrite);
}

export function writeValidationFixtures(workspaceRoot: string): void {
  const validRoot = join(workspaceRoot, "fixtures", "vibeharness-starter");
  const invalidRoot = join(workspaceRoot, "fixtures", "vibeharness-missing-name");
  const policyBlockedRoot = join(workspaceRoot, "fixtures", "vibeharness-policy-blocked");
  const policyDeniedRoot = join(workspaceRoot, "fixtures", "vibeharness-policy-denied");
  const policyQuarantinedRoot = join(workspaceRoot, "fixtures", "vibeharness-policy-quarantined");
  const policyWarnRoot = join(workspaceRoot, "fixtures", "vibeharness-policy-warn");
  const partialFailureRoot = join(workspaceRoot, "fixtures", "vibeharness-mock-partial-failure");
  const defaultRunRoot = join(workspaceRoot, "fixtures", "vibeharness-mock-run");
  const reviewHandoffRoot = join(workspaceRoot, "fixtures", "vibeharness-review-handoff");

  writeStarterProject(validRoot, true);
  writeText(
    join(invalidRoot, ".vibeharness", "project.yaml"),
    projectYaml.replace("name: vibeharness-starter\n", ""),
    true
  );
  writeText(join(invalidRoot, ".vibeharness", "policy.yaml"), policyYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "workflows", "default-feature.yaml"), workflowYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "adapters", "mock.yaml"), mockAdapterYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "profiles", "ecc-planning.yaml"), eccPlanningProfileYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "profiles", "ecc-implementation.yaml"), eccImplementationProfileYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "profiles", "ecc-review.yaml"), eccReviewProfileYaml, true);

  writeStarterProject(policyBlockedRoot, true);
  writeText(
    join(policyBlockedRoot, ".vibeharness", "workflows", "policy-blocked.yaml"),
    policyBlockedWorkflowYaml,
    true
  );
  writeStarterProject(policyDeniedRoot, true);
  writeText(
    join(policyDeniedRoot, ".vibeharness", "workflows", "policy-denied.yaml"),
    policyDeniedWorkflowYaml,
    true
  );
  writeStarterProject(policyQuarantinedRoot, true);
  writeText(
    join(policyQuarantinedRoot, ".vibeharness", "workflows", "policy-quarantined.yaml"),
    policyQuarantinedWorkflowYaml,
    true
  );
  writeStarterProject(policyWarnRoot, true);
  writeText(
    join(policyWarnRoot, ".vibeharness", "workflows", "policy-warn.yaml"),
    policyWarnWorkflowYaml,
    true
  );
  writeStarterProject(partialFailureRoot, true);
  writeText(
    join(partialFailureRoot, ".vibeharness", "workflows", "mock-partial-failure.yaml"),
    mockPartialFailureWorkflowYaml,
    true
  );
  writeStarterProject(defaultRunRoot, true);
  writeStarterProject(reviewHandoffRoot, true);
}
