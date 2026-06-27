# MVP Scope

Generated: 2026-06-13

## MVP promise

A developer can use VibeHarness to turn a vague idea into a structured, validated, deterministic software-development run with planning artifacts, a mock-adapter execution proof, policy gates, test/review evidence, and a final handoff.

## MVP user story

As a developer, I want to initialize a project, describe a feature, generate a high-quality plan, run the default workflow through a deterministic adapter contract, and receive a reviewable handoff so that I can prove the harness before trusting it with a real coding backend.

## Included in MVP

### 1. Project initialization

- Create `.vibeharness/` directory.
- Generate starter `project.yaml`, `policy.yaml`, `workflows/default-feature.yaml`, `adapters/mock.yaml`, and `adapters/openhands.yaml.example`.
- Generate docs directory with starter PRD, architecture, task list, risks, and handoff files.

### 2. Schema validation

- Validate project config.
- Validate workflow profiles.
- Validate ECC operator profiles.
- Validate adapter contracts.
- Validate policy config.
- Emit actionable errors with file path and field path.

### 3. Planning artifact generation

- Generate PRD from an idea.
- Generate architecture sketch.
- Generate milestone/task plan.
- Generate acceptance criteria and risk list.
- Generate unresolved-question list.

### 4. Deterministic workflow execution

- Implement a staged runner with explicit states:
  - pending
  - running
  - blocked
  - failed
  - passed
  - skipped
- Stop on failed required gates.
- Persist run manifests and artifacts.

### 5. Mock adapter

- Package bounded coding tasks through the same adapter contract future coding agents will use.
- Return deterministic fixture outputs for passing, failing, and policy-blocked runs.
- Emit a deterministic Archon-compatible compile artifact with node-scoped ECC operator profiles.
- Capture changed-file references, command outputs, tests, and summary from fixtures.
- Normalize outputs into VibeHarness artifacts.

### 6. ECC-lite policy layer

MVP policy gates:

- deny secrets access by default;
- require approval for destructive commands;
- require approval for dependency additions;
- require approval for networked production actions;
- log all shell commands and file writes;
- validate skill source and status before activation.

### 7. Handoff and review

- Summarize scope implemented.
- Summarize tests run and results.
- Summarize files changed.
- Summarize risks and follow-ups.
- Emit memory and skill proposals without auto-committing them.

## MVP+1 integrations

- OpenCode adapter that consumes the stable `adapter-task.yaml` contract.
- OpenHands adapter as a secondary backend after OpenCode proves the adapter seam.
- Mem0 sidecar export beyond proposal files.
- PR creation/export automation.
- First non-OpenCode adapter proof.

## Excluded from MVP

- Hosted web app.
- Full organization/user management.
- Deep Slack/Telegram/Discord integration.
- Direct production deploys.
- Automatic PR merge.
- Multi-agent autonomous project management without human approval.
- Full adapter parity across all coding tools.
- Automatic Mem0/Hermes memory writes.
- Automatic skill promotion.

## MVP acceptance test

Given a sample repo and a feature idea, when the user runs:

```text
vibeharness init
vibeharness plan --idea docs/example-idea.md
vibeharness run --workflow default-feature --adapter mock
vibeharness review --run latest
```

Then VibeHarness should produce:

- validated config;
- generated PRD;
- generated architecture note;
- generated task plan;
- adapter task package;
- run manifest;
- policy gate results;
- test evidence;
- review summary;
- handoff document;
- optional memory proposal.

## MVP acceptance IDs

| ID | Acceptance test |
|---|---|
| AC-MVP-001 | `vibeharness init` creates the canonical `.vibeharness/` structure without overwriting existing files unless forced. |
| AC-MVP-002 | `vibeharness validate` accepts the minimal valid fixture and rejects invalid project, workflow, adapter, and policy fixtures with file and field paths. |
| AC-MVP-003 | `vibeharness plan --idea docs/example-idea.md` emits PRD, architecture, `tasks.md`, `risk-register.md`, and unresolved-question artifacts with no schema errors. |
| AC-MVP-004 | `vibeharness run --workflow default-feature --adapter mock` writes `.vibeharness/runs/<run_id>/run-manifest.json` and required stage artifacts. |
| AC-MVP-005 | Policy fixtures return and record `allow`, `warn`, `approval_required`, `deny`, and `quarantine` decisions. |
| AC-MVP-006 | `vibeharness review --run latest` produces `review.md` and `handoff.md` that cite changed artifacts, tests, risks, and next actions. |

## MVP quality bar

- No hidden side effects.
- No unlogged commands.
- No direct secret reads without explicit policy.
- No destructive command execution without approval.
- No adapter-specific fields in core schema unless namespaced.
- Every generated artifact has a clear owner and lifecycle.
- Implement and test P0 first: `AC-MVP-001` through `AC-MVP-006` must pass on the mock-adapter path before OpenCode, OpenHands, export, Mem0/Hermes sidecars, adapter expansion, hosted UI, or automatic memory/skill promotion work begins.
