# VibeHarness Engine

Local-first Bun + TypeScript CLI for proving a deterministic AI-development workflow harness.

VibeHarness currently focuses on the P0 contract loop: initialize project files, validate contracts, generate planning docs, execute a deterministic mock adapter, and produce review/handoff evidence. Real coding backends such as OpenHands are deferred until this local contract is stable.

## Quick Start

```bash
bun install
bun run validate
```

Create and run a starter VibeHarness project:

```bash
bun src/cli.ts init
bun src/cli.ts validate .
bun src/cli.ts plan --idea docs/example-idea.md
bun src/cli.ts run --workflow default-feature --adapter mock
bun src/cli.ts review --run latest
```

## CLI

```bash
bun src/cli.ts init [--fixture <path>] [--force]
bun src/cli.ts validate <path>
bun src/cli.ts fixtures
bun src/cli.ts plan --idea <path>
bun src/cli.ts run --workflow <name> --adapter <name>
bun src/cli.ts review --run <latest|run_id>
```

## Project Contracts

Starter projects use `.vibeharness/`:

```text
.vibeharness/
  project.yaml
  policy.yaml
  workflows/default-feature.yaml
  adapters/mock.yaml
  adapters/openhands.yaml.example
  runs/<run_id>/
  runs/latest/
```

Generated planning docs are written under `docs/`. Run artifacts include `run-manifest.json`, `adapter-task.yaml`, stage logs, policy decisions, optional approval requests, review, handoff, and policy audit files.

## Development

```bash
bun run type-check
bun run test
bun run validate
```

The implementation is intentionally dependency-light and deterministic. Keep new behavior backed by a fixture or test, and update `AGENTS.md` plus the relevant docs when changing CLI behavior.
