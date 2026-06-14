import { readdirSync } from "node:fs";
import { join } from "node:path";
import { exists, readText } from "./fs-utils";
import { parseYaml } from "./simple-yaml";
import type { AdapterConfig, PolicyConfig, ProjectConfig, RunManifest, ValidationIssue, ValidationResult, WorkflowConfig } from "./types";

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

function requireSchemaVersion(object: Record<string, unknown>, file: string, issues: ValidationIssue[]): void {
  if (object.schemaVersion !== "v1alpha1") {
    issues.push(issue(file, "schemaVersion", "Expected schemaVersion v1alpha1."));
  }
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
  for (const key of ["stages", "policyDecisions", "tests", "artifacts"] as const) {
    if (!Array.isArray(value[key])) {
      issues.push(issue(file, key, "Expected array."));
    }
  }
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

export function loadRunManifest(file: string): RunManifest {
  return parseConfigFile(file) as RunManifest;
}

export function validateTarget(target: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (target.endsWith("run-manifest.json")) {
    issues.push(...validateRunManifest(target));
    return { ok: issues.length === 0, issues };
  }

  const configRoot = exists(join(target, ".vibeharness")) ? join(target, ".vibeharness") : target;
  const projectFile = join(configRoot, "project.yaml");
  const policyFile = join(configRoot, "policy.yaml");
  const workflowDir = join(configRoot, "workflows");
  const adapterDir = join(configRoot, "adapters");

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
      issues.push(...validateWorkflowConfig(join(workflowDir, file)));
    }
  }

  if (!exists(adapterDir)) {
    issues.push(issue(adapterDir, "$", "Missing adapter directory."));
  } else {
    for (const file of readdirSync(adapterDir).filter((name: string): boolean => name.endsWith(".yaml"))) {
      issues.push(...validateAdapterConfig(join(adapterDir, file)));
    }
  }

  return { ok: issues.length === 0, issues };
}
