import { join } from "node:path";
import { writeText } from "./fs-utils";
import { loadOperatorProfileConfig, loadWorkflowConfig } from "./validation";

function yamlList(values: string[], indent: string): string {
  if (values.length === 0) {
    return `${indent}[]`;
  }
  return values.map((value) => `${indent}- ${value}`).join("\n");
}

export function compileWorkflow(root: string, workflowName: string, target: string): string {
  if (target !== "archon") {
    throw new Error("Only the archon compile target is supported.");
  }

  const workflow = loadWorkflowConfig(root, workflowName);
  const outputPath = join(root, ".vibeharness", "compiled", "archon", `${workflow.name}.yaml`);
  const nodes = workflow.stages
    .map((stage) => {
      const profileName = stage.operatorProfile ?? "ecc-implementation";
      const profile = loadOperatorProfileConfig(root, profileName);
      return `  - id: ${stage.id}
    name: ${stage.name}
    required: ${stage.required}
    adapter: ${stage.adapter ?? "none"}
    ecc_profile:
      name: ${profile.name}
      memory_mode: ${profile.memory.mode}
      approved_skills:
${yamlList(profile.skills.approved, "        ")}
      pre_stage_hooks:
${yamlList(profile.hooks.pre_stage, "        ")}
      post_stage_hooks:
${yamlList(profile.hooks.post_stage, "        ")}
    outputs:
${yamlList(stage.outputs, "      ")}`;
    })
    .join("\n");

  writeText(
    outputPath,
    `schemaVersion: v1alpha1
target: archon
workflow: ${workflow.name}
nodes:
${nodes}
`,
    true
  );
  return outputPath;
}
