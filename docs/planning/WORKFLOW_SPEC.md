# Workflow Specification

Generated: 2026-06-13

## Purpose

Define the default idea-to-production workflow for VibeHarness Engine.

## MVP workflow

The MVP workflow proves the contract with the mock adapter:

```text
0. Intake
1. Planning packet
2. Architecture and task plan
3. Task packaging
4. Mock execution
5. Policy/test review
6. Handoff
7. Memory and skill proposals
```

## Full default workflow

The full workflow below is the target model after the MVP kernel is stable.

```text
0. Intake
1. Clarification
2. Requirements / PRD
3. Architecture
4. Implementation plan
5. Task packaging
6. Build / implementation
7. Test
8. Debug / fix loop
9. Review
10. Security / policy review
11. PR / release package
12. Handoff
13. Memory and skill proposals
```

## Stage 0: Intake

### Inputs

- User idea.
- Repo path.
- Project config.
- Existing docs.
- Constraints.

### Outputs

- Intake summary.
- Assumption list.
- Open questions.

### Gates

- Project config exists or can be initialized.
- Repo is accessible.

## Stage 1: Clarification

### Goal

Turn vague intent into explicit assumptions and decision points.

### Outputs

- Clarified problem.
- Target user.
- Desired outcome.
- Scope boundaries.
- Unresolved questions.

### Gate

If high-impact ambiguity remains, generate an explicit assumption rather than blocking by default for MVP.

## Stage 2: Requirements / PRD

### Goal

Create a product-quality PRD.

### Outputs

- Problem statement.
- Goals and non-goals.
- Personas.
- User stories.
- Functional requirements.
- Non-functional requirements.
- Acceptance criteria.
- Success metrics.

### Gate

PRD must include goals, non-goals, P0 requirements, and acceptance criteria.

## Stage 3: Architecture

### Goal

Define technical design before coding.

### Outputs

- Architecture summary.
- Component model.
- Data/contracts impacted.
- Integration points.
- Security considerations.
- ADR proposals if needed.

### Gate

Any public contract change requires an ADR proposal.

## Stage 4: Implementation plan

### Goal

Break the work into reviewable tasks.

### Outputs

- Task list.
- Dependency order.
- Test plan.
- Risk list.
- Rollback notes.

### Gate

Each P0 task must have acceptance criteria.

## Stage 5: Task packaging

### Goal

Create bounded agent tasks for the mock adapter in MVP and for real coding adapters such as OpenCode after the contract is stable.

### Outputs

- Adapter task package.
- Context bundle.
- Allowed commands.
- Forbidden actions.
- Expected artifacts.

### Gate

ECC policy check must pass before sending task to the adapter.

## Stage 6: Build / implementation

### Goal

Execute the coding task in a controlled backend.

### MVP adapter

- Mock adapter.

### Outputs

- Changed files.
- Diff or patch reference.
- Implementation summary.
- Commands run.
- Problems encountered.

### Gates

- No forbidden file access.
- No unapproved dependency or destructive operation.
- Adapter result must be normalized.

## Stage 7: Test

### Goal

Run configured checks.

### Outputs

- Test command log.
- Pass/fail summary.
- Coverage or relevant quality metrics when available.

### Gate

Required test commands pass or failure is documented with follow-up tasks.

## Stage 8: Debug / fix loop

### Goal

Allow controlled retries for test failures or review defects.

### Rules

- Retry count is workflow-defined.
- Each retry must include cause and fix summary.
- New policy-sensitive actions still require approval.

## Stage 9: Review

### Goal

Review implementation against PRD, architecture, and acceptance criteria.

### Outputs

- Review summary.
- Defects.
- Suggested fixes.
- PR readiness status.

### Gate

P0 acceptance criteria must be passed, waived, or explicitly deferred.

## Stage 10: Security / policy review

### Goal

Verify the run respected security and governance rules.

### Outputs

- Policy gate results.
- Secret exposure checks.
- Dependency risk notes.
- Destructive command summary.
- Approval log.

### Gate

No critical policy violations unresolved.

## Stage 11: PR / release package

### Goal

Prepare a human-reviewable package.

### Outputs

- PR title.
- PR description.
- Test evidence.
- Risk section.
- Rollback notes.
- Related issues/tasks.

## Stage 12: Handoff

### Goal

Tell the next human or agent exactly what happened.

### Outputs

- What changed.
- Why it changed.
- How it was tested.
- What remains.
- Known risks.
- Suggested next tasks.

## Stage 13: Memory and skill proposals

### Goal

Capture reusable learning safely.

### Outputs

- Memory proposals.
- Skill proposals.
- ADR proposals.
- Workflow improvement proposals.

### Gate

No memory or skill proposal is committed automatically in MVP.

## Default stage status machine

`ARCHITECTURE.md` owns the canonical run, stage, and policy decision states. This section shows the default stage flow only.

```text
pending -> running -> passed
              |
              +-----> failed
              +-----> approval_required
              +-----> blocked
              +-----> skipped
```

## Default required artifacts

- `prd.md`
- `architecture.md`
- `tasks.md`
- `risk-register.md`
- `adapter-task.yaml`
- `run-manifest.json`
- `policy-decisions/*.json`
- `test-results.md`
- `review.md`
- `handoff.md`

## Deferred optional artifacts

- `memory-proposals/*.md`
- `skill-proposals/*.md`
- `exports/*.md`
