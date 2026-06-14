#!/usr/bin/env bun

import { resolve } from "node:path";
import { writeValidationFixtures } from "./fixtures";
import { initProject } from "./init";
import { generatePlanArtifacts } from "./plan";
import { generateReview } from "./review";
import { executeRun } from "./run";
import { validateTarget } from "./validation";

const commandName = "vibeharness";

function printUsage(): void {
  console.log(`${commandName} <command>`);
  console.log("");
  console.log("Commands:");
  console.log("  init [--fixture <path>] [--force]");
  console.log("  validate <path>");
  console.log("  fixtures");
  console.log("  plan --idea <path>");
  console.log("  run --workflow <name> --adapter <name>");
  console.log("  review --run <latest|run_id>");
}

function readOption(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return args[index + 1];
}

function hasFlag(args: readonly string[], name: string): boolean {
  return args.includes(name);
}

function printValidation(result: ReturnType<typeof validateTarget>): void {
  if (result.ok) {
    console.log("Validation passed.");
    return;
  }

  console.error("Validation failed.");
  for (const validationIssue of result.issues) {
    console.error(`${validationIssue.file} ${validationIssue.path}: ${validationIssue.message}`);
  }
}

const [, , subcommand, ...args] = Bun.argv;

try {
  switch (subcommand) {
    case undefined:
    case "--help":
    case "-h":
      printUsage();
      process.exit(0);
      break;
    case "fixtures":
      writeValidationFixtures(process.cwd());
      console.log("Fixtures written.");
      process.exit(0);
      break;
    case "init": {
      const target = readOption(args, "--fixture") ?? ".";
      const root = initProject(target, hasFlag(args, "--force"));
      console.log(`Initialized VibeHarness project at ${root}`);
      process.exit(0);
      break;
    }
    case "validate": {
      const target = resolve(args[0] ?? ".");
      const result = validateTarget(target);
      printValidation(result);
      process.exit(result.ok ? 0 : 1);
      break;
    }
    case "plan": {
      const idea = readOption(args, "--idea");
      if (idea === undefined) {
        throw new Error("Missing required --idea <path>.");
      }
      const artifacts = generatePlanArtifacts(process.cwd(), resolve(idea));
      console.log(`Plan artifacts written: ${artifacts.length}`);
      process.exit(0);
      break;
    }
    case "run": {
      const workflow = readOption(args, "--workflow");
      const adapter = readOption(args, "--adapter");
      if (workflow === undefined || adapter === undefined) {
        throw new Error("Missing required --workflow <name> or --adapter <name>.");
      }
      const manifest = executeRun(process.cwd(), workflow, adapter);
      console.log(`Run ${manifest.runId} finished with status ${manifest.status}.`);
      process.exit(manifest.status === "failed" ? 1 : 0);
      break;
    }
    case "review": {
      const runRef = readOption(args, "--run") ?? "latest";
      const artifacts = generateReview(process.cwd(), runRef);
      console.log(`Review artifacts written: ${artifacts.length}`);
      process.exit(0);
      break;
    }
    default:
      console.error(`Unknown command: ${subcommand}`);
      printUsage();
      process.exit(1);
  }
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
