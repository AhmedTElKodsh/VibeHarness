# AGENTS.md

## Project Overview

VibeHarness Engine is a local-first Bun + TypeScript CLI for proving a deterministic AI-development workflow harness. The current implementation initializes `.vibeharness/` project contracts, validates YAML/JSON configs, generates planning artifacts, runs a deterministic mock adapter, and writes review/handoff evidence.

This repository is the VibeHarness Engine. Do not add legacy remote-agent platform modules, chat adapters, database services, web UI surfaces, OpenAPI servers, worktree-isolation packages, or external package assumptions unless the VibeHarness codebase actually grows those modules.

## Current Scope

Implemented CLI commands:

```bash
bun src/cli.ts init [--fixture <path>] [--force]
bun src/cli.ts validate <path>
bun src/cli.ts fixtures
bun src/cli.ts plan --idea <path>
bun src/cli.ts run --workflow <name> --adapter <name>
bun src/cli.ts review --run <latest|run_id>
```

Implemented runtime path:

1. `init` writes `.vibeharness/project.yaml`, `.vibeharness/policy.yaml`, `.vibeharness/workflows/default-feature.yaml`, `.vibeharness/adapters/mock.yaml`, `.vibeharness/adapters/openhands.yaml.example`, and `docs/example-idea.md`.
2. `validate` checks project, workflow, adapter, policy, and run-manifest contracts.
3. `plan` converts an idea markdown file into `docs/prd.md`, `docs/architecture.md`, `docs/tasks.md`, `docs/risk-register.md`, and `docs/unresolved-questions.md`.
4. `run` executes the P0 mock-adapter path and writes `.vibeharness/runs/<run_id>/` plus a mirrored `.vibeharness/runs/latest/`.
5. `review` writes `review.md`, `handoff.md`, and `policy-audit.md` for a run.

## Core Principles

- Keep the engine deterministic and local-first.
- Prefer explicit typed data structures over dynamic behavior.
- Treat schemas, fixtures, and generated artifacts as the public contract.
- Keep P0 focused on the mock adapter until the contract is stable.
- Fail loudly for unsupported adapters or invalid config.
- Do not silently broaden policy permissions.
- Keep generated project files simple enough to inspect and edit by hand.

## TypeScript Standards

- Strict TypeScript is enabled; preserve explicit return types for exported functions and helpers with non-obvious inference.
- Avoid `any`. Use `unknown` plus narrowing when parsing untrusted YAML/JSON.
- Use `import type` for type-only imports.
- Keep runtime dependencies minimal. This package currently has no production dependencies.
- Stay compatible with Bun's ESM runtime.

## Repository Layout

```text
src/          CLI entry point and engine modules
tests/        Bun tests for structure, validation, and the P0 CLI loop
schemas/      JSON Schema contracts for project files and run artifacts
docs/         Generated/current project docs plus planning bundle
workflows/    Workflow documentation placeholder
adapters/     Adapter documentation placeholder
profiles/     Profile documentation placeholder
examples/     Example inputs and usage notes
fixtures/     Generated validation and run fixtures
```

Important source modules:

- `src/cli.ts`: command dispatch and CLI argument parsing.
- `src/fixtures.ts`: starter project and validation fixture generation.
- `src/templates.ts`: canonical starter YAML and example idea templates.
- `src/validation.ts`: YAML/JSON parsing and validation checks.
- `src/plan.ts`: generated planning artifacts.
- `src/run.ts`: deterministic mock-adapter run execution.
- `src/review.ts`: review, handoff, and policy audit generation.
- `src/types.ts`: shared contract types.

## Essential Commands

```bash
bun install
bun run type-check
bun run test
bun run validate
```

Useful local flows:

```bash
# Create starter contracts in the current directory.
bun src/cli.ts init

# Rebuild repository fixtures.
bun src/cli.ts fixtures

# Validate this repository or a fixture project.
bun src/cli.ts validate .
bun src/cli.ts validate fixtures/vibeharness-starter

# Run the P0 workflow loop in a VibeHarness project.
bun src/cli.ts plan --idea docs/example-idea.md
bun src/cli.ts run --workflow default-feature --adapter mock
bun src/cli.ts review --run latest
```

## Documentation Rules

- `docs/planning/PLANNING_INDEX.md` owns the source-of-truth order for planning docs.
- `docs/planning/vibeharness_connected_architecture.md` is a vision/source note, not an implementation contract.
- Keep active docs aligned with implemented CLI commands. Mark future work as deferred instead of documenting it as available.
- When command behavior changes, update `AGENTS.md`, `README.md`, the relevant directory README, and the planning docs that mention that command.
- Do not edit generated run artifacts under `.vibeharness/runs/` as source-of-truth docs.

## Git and Safety

- Preserve user changes. Do not revert unrelated work.
- Never run `git clean -fd`.
- Keep documentation-only changes separate from source behavior changes when practical.
- Before claiming a code or docs cleanup is complete, run `bun run validate` unless the change is prose-only and the user explicitly skips validation.
