# VibeHarness Engine

Local-first Bun + TypeScript CLI for proving a deterministic AI-development workflow harness.

VibeHarness currently focuses on the P0 contract loop: initialize project files, validate contracts, generate planning docs, execute a deterministic mock adapter, and produce review/handoff evidence. OpenCode is the planned first real coding backend after the local contract stays stable; OpenHands remains a secondary adapter target.

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
bun src/cli.ts compile --workflow default-feature --target archon
bun src/cli.ts run --workflow default-feature --adapter mock
bun src/cli.ts approve --run latest --decision destructive-command --outcome rejected --actor reviewer
bun src/cli.ts review --run latest
```

## CLI

```bash
bun src/cli.ts init [--fixture <path>] [--force]
bun src/cli.ts validate <path>
bun src/cli.ts fixtures
bun src/cli.ts plan --idea <path>
bun src/cli.ts compile --workflow <name> --target archon
bun src/cli.ts run --workflow <name> --adapter <name>
bun src/cli.ts approve --run <latest|run_id> --decision <id> --outcome <approved|rejected> --actor <name> [--reason <text>]
bun src/cli.ts review --run <latest|run_id>
```

## Project Contracts

Starter projects use `.vibeharness/`:

```text
.vibeharness/
  project.yaml
  policy.yaml
  workflows/default-feature.yaml
  profiles/ecc-planning.yaml
  profiles/ecc-implementation.yaml
  profiles/ecc-review.yaml
  adapters/mock.yaml
  adapters/openhands.yaml.example
  compiled/archon/<workflow>.yaml
  runs/<run_id>/
  runs/latest/
```

Generated planning docs are written under `docs/`. Compile artifacts are written under `.vibeharness/compiled/` and can be validated with `validate`. Run artifacts include validated `run-manifest.json`, `adapter-task.yaml`, policy decisions, optional approval requests and outcomes, review, handoff, policy audit, and stage log files.

## Development

```bash
bun run type-check
bun run test
bun run validate
```

The implementation is intentionally dependency-light and deterministic. Keep new behavior backed by a fixture or test, and update `AGENTS.md` plus the relevant docs when changing CLI behavior.
