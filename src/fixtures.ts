import { join } from "node:path";
import {
  exampleIdea,
  mockAdapterYaml,
  openHandsAdapterExampleYaml,
  policyBlockedWorkflowYaml,
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
  writeText(
    join(root, ".vibeharness", "adapters", "openhands.yaml.example"),
    openHandsAdapterExampleYaml,
    overwrite
  );
  writeText(join(root, "docs", "example-idea.md"), exampleIdea, overwrite);
}

export function writeValidationFixtures(workspaceRoot: string): void {
  const validRoot = join(workspaceRoot, "fixtures", "minimal-valid-project");
  const invalidRoot = join(workspaceRoot, "fixtures", "invalid-project-missing-name");
  const policyBlockedRoot = join(workspaceRoot, "fixtures", "policy-blocked-command");
  const defaultRunRoot = join(workspaceRoot, "fixtures", "default-feature-run-mock");
  const reviewHandoffRoot = join(workspaceRoot, "fixtures", "review-handoff-basic");

  writeStarterProject(validRoot, true);
  writeText(
    join(invalidRoot, ".vibeharness", "project.yaml"),
    projectYaml.replace("name: minimal-valid-project\n", ""),
    true
  );
  writeText(join(invalidRoot, ".vibeharness", "policy.yaml"), policyYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "workflows", "default-feature.yaml"), workflowYaml, true);
  writeText(join(invalidRoot, ".vibeharness", "adapters", "mock.yaml"), mockAdapterYaml, true);

  writeStarterProject(policyBlockedRoot, true);
  writeText(
    join(policyBlockedRoot, ".vibeharness", "workflows", "policy-blocked.yaml"),
    policyBlockedWorkflowYaml,
    true
  );
  writeStarterProject(defaultRunRoot, true);
  writeStarterProject(reviewHandoffRoot, true);
}
