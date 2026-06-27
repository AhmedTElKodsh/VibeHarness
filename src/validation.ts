import { readdirSync } from "node:fs";
import { join } from "node:path";
import { exists, readText } from "./fs-utils";
import { parseYaml } from "./simple-yaml";
import type {
  AdapterConfig,
  AdapterTask,
  ApprovalOutcome,
  ApprovalRequest,
  CompiledArchonWorkflow,
  OperatorProfileConfig,
  PolicyConfig,
  PolicyDecision,
  ProjectConfig,
  RunManifest,
  ValidationIssue,
  ValidationResult,
  WorkflowConfig
} from "./types";

function issue(file: string, path: string, message: string): ValidationIssue {
  return { file, path, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(object: Record<string, unknown>, key: string, file: string, path: string, issues: ValidationIssue[]): void {
  if (typeof object[key] !== "string" || object[key] === "") {
    issues.push(issue(file, `${path}.${key}`, "Expected a non-empty string."));
  }
}

function requireBoolean(object: Record<string, unknown>, key: string, file: string, path: string, issues: ValidationIssue[]): void {
  if (typeof object[key] !== "boolean") {
    issues.push(issue(file, `${path}.${key}`, "Expected a boolean."));
  }
}

function requireStringArray(
  object: Record<string, unknown>,
  key: string,
  file: string,
  path: string,
  issues: ValidationIssue[]
): void {
  if (!Array.isArray(object[key]) || object[key].some((item: unknown): boolean => typeof item !== "string" || item === "")) {
    issues.push(issue(file, `${path}.${key}`, "Expected an array of non-empty strings."));
  }
}

function requirePolicyDecisionValue(
  value: unknown,
  file: string,
  path: string,
  issues: ValidationIssue[]
): void {
  if (
    value !== "allow" &&
    value !== "warn" &&
    value !== "approval_required" &&
    value !== "deny" &&
    value !== "quarantine"
  ) {
    issues.push(issue(file, path, "Expected allow, warn, approval_required, deny, or quarantine."));
  }
}

function requireActionType(value: unknown, file: string, path: string, issues: ValidationIssue[]): void {
  if (
    value !== "command" &&
    value !== "file" &&
    value !== "network" &&
    value !== "dependency" &&
    value !== "secret" &&
    value !== "skill" &&
    value !== "memory" &&
    value !== "adapter"
  ) {
    issues.push(issue(file, path, "Expected command, file, network, dependency, secret, skill, memory, or adapter."));
  }
}

function validatePolicyDecisionObject(
  value: Record<string, unknown>,
  file: string,
  path: string,
  issues: ValidationIssue[]
): void {
  for (const key of ["id", "runId", "stageId", "resource", "reason", "policyRuleId", "timestamp"] as const) {
    requireString(value, key, file, path, issues);
  }
  requireActionType(value.actionType, file, `${path}.actionType`, issues);
  requirePolicyDecisionValue(value.decision, file, `${path}.decision`, issues);
  if (value.decision === "approval_required") {
    requireString(value, "requestedApprovalActor", file, path, issues);
  }
  if (value.command !== undefined && typeof value.command !== "string") {
    issues.push(issue(file, `${path}.command`, "Expected a string when present."));
  }
  requireStringArray(value, "artifactReferences", file, path, issues);
}

function requireSchemaVersion(object: Record<string, unknown>, file: string, issues: ValidationIssue[]): void {
  if (object.schemaVersion !== "v1alpha1") {
    issues.push(issue(file, "schemaVersion", "Expected schemaVersion v1alpha1."));
  }
}

function validateMarkdownSections(file: string, sections: readonly string[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = readText(file);
  for (const section of sections) {
    if (!content.includes(section)) {
      issues.push(issue(file, section, `Missing required section ${section}.`));
    }
  }
  return issues;
}

export function parseConfigFile(path: string): Record<string, unknown> {
  if (path.endsWith(".json")) {
    return JSON.parse(readText(path)) as Record<string, unknown>;
  }
  return parseYaml(readText(path));
}

export function validateProjectConfig(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  requireString(value, "name", file, "$", issues);

  if (!isRecord(value.repo)) {
    issues.push(issue(file, "repo", "Expected repo object."));
  } else {
    requireString(value.repo, "path", file, "repo", issues);
  }

  if (!Array.isArray(value.stack) || value.stack.some((item: unknown): boolean => typeof item !== "string" || item === "")) {
    issues.push(issue(file, "stack", "Expected an array of non-empty strings."));
  }

  if (!isRecord(value.workflows)) {
    issues.push(issue(file, "workflows", "Expected workflows object."));
  } else {
    requireString(value.workflows, "default", file, "workflows", issues);
  }

  if (!isRecord(value.adapters)) {
    issues.push(issue(file, "adapters", "Expected adapters object."));
  } else {
    requireString(value.adapters, "default", file, "adapters", issues);
  }

  return issues;
}

export function validateWorkflowConfig(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  requireString(value, "name", file, "$", issues);

  if (!Array.isArray(value.stages) || value.stages.length === 0) {
    issues.push(issue(file, "stages", "Expected at least one stage."));
    return issues;
  }

  value.stages.forEach((stage: unknown, index: number): void => {
    const path = `stages.${index}`;
    if (!isRecord(stage)) {
      issues.push(issue(file, path, "Expected stage object."));
      return;
    }
    requireString(stage, "id", file, path, issues);
    requireString(stage, "name", file, path, issues);
    requireBoolean(stage, "required", file, path, issues);
    if (stage.operatorProfile !== undefined && (typeof stage.operatorProfile !== "string" || stage.operatorProfile === "")) {
      issues.push(issue(file, `${path}.operatorProfile`, "Expected a non-empty string when present."));
    }
    if (!Array.isArray(stage.outputs) || stage.outputs.some((item: unknown): boolean => typeof item !== "string" || item === "")) {
      issues.push(issue(file, `${path}.outputs`, "Expected output path strings."));
    }
  });

  return issues;
}

export function validateAdapterConfig(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  requireString(value, "name", file, "$", issues);
  if (value.type !== "mock" && value.type !== "openhands") {
    issues.push(issue(file, "type", "Expected adapter type mock or openhands."));
  }
  return issues;
}

export function validatePolicyConfig(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);

  if (!isRecord(value.secrets) || (value.secrets.default !== "deny" && value.secrets.default !== "allow")) {
    issues.push(issue(file, "secrets.default", "Expected deny or allow."));
  }

  if (!isRecord(value.commands)) {
    issues.push(issue(file, "commands", "Expected commands object."));
  } else {
    for (const key of ["destructive", "dependency_additions", "network_production"] as const) {
      const commandValue = value.commands[key];
      if (commandValue !== "approval_required" && commandValue !== "deny" && commandValue !== "allow") {
        issues.push(issue(file, `commands.${key}`, "Expected approval_required, deny, or allow."));
      }
    }
  }

  if (!isRecord(value.audit)) {
    issues.push(issue(file, "audit", "Expected audit object."));
  } else {
    requireBoolean(value.audit, "log_shell_commands", file, "audit", issues);
    requireBoolean(value.audit, "log_file_writes", file, "audit", issues);
  }

  return issues;
}

export function validateRunManifest(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  for (const key of ["runId", "workflow", "adapter", "startedAt", "completedAt"] as const) {
    requireString(value, key, file, "$", issues);
  }
  if (value.status !== "passed" && value.status !== "failed" && value.status !== "approval_required") {
    issues.push(issue(file, "status", "Expected passed, failed, or approval_required."));
  }
  if (!Array.isArray(value.stages)) {
    issues.push(issue(file, "stages", "Expected array."));
  } else {
    value.stages.forEach((stage: unknown, index: number): void => {
      const path = `stages.${index}`;
      if (!isRecord(stage)) {
        issues.push(issue(file, path, "Expected stage object."));
        return;
      }
      requireString(stage, "id", file, path, issues);
      if (
        stage.status !== "pending" &&
        stage.status !== "running" &&
        stage.status !== "blocked" &&
        stage.status !== "failed" &&
        stage.status !== "passed" &&
        stage.status !== "skipped"
      ) {
        issues.push(issue(file, `${path}.status`, "Expected pending, running, blocked, failed, passed, or skipped."));
      }
      requireStringArray(stage, "artifacts", file, path, issues);
    });
  }

  if (!Array.isArray(value.policyDecisions)) {
    issues.push(issue(file, "policyDecisions", "Expected array."));
  } else {
    value.policyDecisions.forEach((policyDecision: unknown, index: number): void => {
      const path = `policyDecisions.${index}`;
      if (!isRecord(policyDecision)) {
        issues.push(issue(file, path, "Expected policy decision object."));
        return;
      }
      validatePolicyDecisionObject(policyDecision, file, path, issues);
    });
  }

  if (!Array.isArray(value.tests)) {
    issues.push(issue(file, "tests", "Expected array."));
  } else {
    value.tests.forEach((testResult: unknown, index: number): void => {
      const path = `tests.${index}`;
      if (!isRecord(testResult)) {
        issues.push(issue(file, path, "Expected test result object."));
        return;
      }
      requireString(testResult, "command", file, path, issues);
      if (testResult.status !== "passed" && testResult.status !== "failed" && testResult.status !== "skipped") {
        issues.push(issue(file, `${path}.status`, "Expected passed, failed, or skipped."));
      }
    });
  }
  requireStringArray(value, "artifacts", file, "$", issues);
  return issues;
}

export function validateOperatorProfileConfig(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  requireString(value, "name", file, "$", issues);

  if (!isRecord(value.skills)) {
    issues.push(issue(file, "$.skills", "Expected skills object."));
  } else {
    requireStringArray(value.skills, "approved", file, "$.skills", issues);
  }

  if (!isRecord(value.hooks)) {
    issues.push(issue(file, "$.hooks", "Expected hooks object."));
  } else {
    requireStringArray(value.hooks, "pre_stage", file, "$.hooks", issues);
    requireStringArray(value.hooks, "post_stage", file, "$.hooks", issues);
  }

  if (!isRecord(value.memory)) {
    issues.push(issue(file, "$.memory", "Expected memory object."));
  } else if (value.memory.mode !== "proposal_only" && value.memory.mode !== "disabled") {
    issues.push(issue(file, "$.memory.mode", "Expected proposal_only or disabled."));
  }

  return issues;
}

export function validatePolicyDecision(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  validatePolicyDecisionObject(value, file, "$", issues);
  return issues;
}

export function validateAdapterTask(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  for (const key of ["runId", "workflow", "adapter", "task", "stageId", "operatorProfile"] as const) {
    requireString(value, key, file, "$", issues);
  }
  requireStringArray(value, "policyHints", file, "$", issues);
  requireStringArray(value, "expectedArtifacts", file, "$", issues);
  return issues;
}

export function validateApprovalRequest(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  for (const key of ["runId", "decisionId", "stageId", "resource", "reason", "policyRuleId", "requestedApprovalActor"] as const) {
    requireString(value, key, file, "$", issues);
  }
  requireActionType(value.actionType, file, "$.actionType", issues);
  if (value.command !== undefined && typeof value.command !== "string") {
    issues.push(issue(file, "$.command", "Expected a string when present."));
  }
  return issues;
}

export function validateApprovalOutcome(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  for (const key of ["runId", "decisionId", "actor", "reason", "recordedAt"] as const) {
    requireString(value, key, file, "$", issues);
  }
  if (value.outcome !== "approved" && value.outcome !== "rejected") {
    issues.push(issue(file, "$.outcome", "Expected approved or rejected."));
  }
  return issues;
}

export function validateReviewArtifact(file: string): ValidationIssue[] {
  return validateMarkdownSections(file, [
    "# Review",
    "## Scope Implemented",
    "## Changed Artifacts",
    "## Tests",
    "## Risks",
    "## Approval Status",
    "## Next Actions"
  ]);
}

export function validateHandoffArtifact(file: string): ValidationIssue[] {
  return validateMarkdownSections(file, [
    "# Handoff",
    "## Summary",
    "## Tests Run",
    "## Files Changed",
    "## Risks and Follow-ups",
    "## Approval Status"
  ]);
}

export function validatePolicyAuditArtifact(file: string): ValidationIssue[] {
  return validateMarkdownSections(file, ["# Policy Audit", "## Approval Status"]);
}

export function validateCompiledArchonWorkflow(file: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const value = parseConfigFile(file);
  requireSchemaVersion(value, file, issues);
  if (value.target !== "archon") {
    issues.push(issue(file, "$.target", "Expected archon."));
  }
  requireString(value, "workflow", file, "$", issues);
  if (!Array.isArray(value.nodes) || value.nodes.length === 0) {
    issues.push(issue(file, "$.nodes", "Expected at least one node."));
    return issues;
  }

  value.nodes.forEach((node: unknown, index: number): void => {
    const path = `nodes.${index}`;
    if (!isRecord(node)) {
      issues.push(issue(file, path, "Expected node object."));
      return;
    }
    requireString(node, "id", file, path, issues);
    requireString(node, "name", file, path, issues);
    requireBoolean(node, "required", file, path, issues);
    requireString(node, "adapter", file, path, issues);
    requireStringArray(node, "outputs", file, path, issues);
    if (!isRecord(node.ecc_profile)) {
      issues.push(issue(file, `${path}.ecc_profile`, "Expected ECC profile object."));
      return;
    }
    requireString(node.ecc_profile, "name", file, `${path}.ecc_profile`, issues);
    if (node.ecc_profile.memory_mode !== "proposal_only" && node.ecc_profile.memory_mode !== "disabled") {
      issues.push(issue(file, `${path}.ecc_profile.memory_mode`, "Expected proposal_only or disabled."));
    }
    requireStringArray(node.ecc_profile, "approved_skills", file, `${path}.ecc_profile`, issues);
    requireStringArray(node.ecc_profile, "pre_stage_hooks", file, `${path}.ecc_profile`, issues);
    requireStringArray(node.ecc_profile, "post_stage_hooks", file, `${path}.ecc_profile`, issues);
  });

  return issues;
}

export function loadProjectConfig(root: string): ProjectConfig {
  return parseConfigFile(join(root, ".vibeharness", "project.yaml")) as ProjectConfig;
}

export function loadWorkflowConfig(root: string, name: string): WorkflowConfig {
  return parseConfigFile(join(root, ".vibeharness", "workflows", `${name}.yaml`)) as WorkflowConfig;
}

export function loadAdapterConfig(root: string, name: string): AdapterConfig {
  return parseConfigFile(join(root, ".vibeharness", "adapters", `${name}.yaml`)) as AdapterConfig;
}

export function loadPolicyConfig(root: string): PolicyConfig {
  return parseConfigFile(join(root, ".vibeharness", "policy.yaml")) as PolicyConfig;
}

export function loadOperatorProfileConfig(root: string, name: string): OperatorProfileConfig {
  return parseConfigFile(join(root, ".vibeharness", "profiles", `${name}.yaml`)) as OperatorProfileConfig;
}

export function loadRunManifest(file: string): RunManifest {
  return parseConfigFile(file) as RunManifest;
}

export function loadPolicyDecision(file: string): PolicyDecision {
  return parseConfigFile(file) as PolicyDecision;
}

export function loadAdapterTask(file: string): AdapterTask {
  return parseConfigFile(file) as AdapterTask;
}

export function loadApprovalRequest(file: string): ApprovalRequest {
  return parseConfigFile(file) as ApprovalRequest;
}

export function loadApprovalOutcome(file: string): ApprovalOutcome {
  return parseConfigFile(file) as ApprovalOutcome;
}

export function loadCompiledArchonWorkflow(file: string): CompiledArchonWorkflow {
  return parseConfigFile(file) as CompiledArchonWorkflow;
}

export function validateTarget(target: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (target.endsWith("run-manifest.json")) {
    issues.push(...validateRunManifest(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("adapter-task.yaml")) {
    issues.push(...validateAdapterTask(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("approval-request.json")) {
    issues.push(...validateApprovalRequest(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("approval-outcome.json")) {
    issues.push(...validateApprovalOutcome(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("review.md")) {
    issues.push(...validateReviewArtifact(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("handoff.md")) {
    issues.push(...validateHandoffArtifact(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.endsWith("policy-audit.md")) {
    issues.push(...validatePolicyAuditArtifact(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.includes(`${join(".vibeharness", "compiled", "archon")}`) && target.endsWith(".yaml")) {
    issues.push(...validateCompiledArchonWorkflow(target));
    return { ok: issues.length === 0, issues };
  }

  if (target.includes("policy-decisions") && target.endsWith(".json")) {
    issues.push(...validatePolicyDecision(target));
    return { ok: issues.length === 0, issues };
  }

  const configRoot = exists(join(target, ".vibeharness")) ? join(target, ".vibeharness") : target;
  const projectFile = join(configRoot, "project.yaml");
  const policyFile = join(configRoot, "policy.yaml");
  const workflowDir = join(configRoot, "workflows");
  const adapterDir = join(configRoot, "adapters");
  const profileDir = join(configRoot, "profiles");

  if (!exists(projectFile)) {
    issues.push(issue(projectFile, "$", "Missing project config."));
  } else {
    issues.push(...validateProjectConfig(projectFile));
  }

  if (!exists(policyFile)) {
    issues.push(issue(policyFile, "$", "Missing policy config."));
  } else {
    issues.push(...validatePolicyConfig(policyFile));
  }

  if (!exists(workflowDir)) {
    issues.push(issue(workflowDir, "$", "Missing workflow directory."));
  } else {
    for (const file of readdirSync(workflowDir).filter((name: string): boolean => name.endsWith(".yaml"))) {
      const workflowFile = join(workflowDir, file);
      issues.push(...validateWorkflowConfig(workflowFile));
      const workflow = parseConfigFile(workflowFile);
      if (Array.isArray(workflow.stages)) {
        workflow.stages.forEach((stage: unknown, index: number): void => {
          if (!isRecord(stage) || typeof stage.operatorProfile !== "string") {
            return;
          }
          const profileFile = join(profileDir, `${stage.operatorProfile}.yaml`);
          if (!exists(profileFile)) {
            issues.push(issue(workflowFile, `stages.${index}.operatorProfile`, `Missing operator profile ${stage.operatorProfile}.`));
          }
        });
      }
    }
  }

  if (!exists(adapterDir)) {
    issues.push(issue(adapterDir, "$", "Missing adapter directory."));
  } else {
    for (const file of readdirSync(adapterDir).filter((name: string): boolean => name.endsWith(".yaml"))) {
      issues.push(...validateAdapterConfig(join(adapterDir, file)));
    }
  }

  if (!exists(profileDir)) {
    issues.push(issue(profileDir, "$", "Missing operator profile directory."));
  } else {
    for (const file of readdirSync(profileDir).filter((name: string): boolean => name.endsWith(".yaml"))) {
      issues.push(...validateOperatorProfileConfig(join(profileDir, file)));
    }
  }

  return { ok: issues.length === 0, issues };
}
