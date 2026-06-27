# Memory and Skills Policy

Generated: 2026-06-13

## Purpose

Define how Mem0, Hermes-compatible exports, VibeHarness, and ECC should handle long-term memory and self-improving skills without corrupting project truth.

## Core rule

Mem0 can store reviewed project-truth memory and VibeHarness can emit memory or skill proposals. Hermes-compatible export is deferred. VibeHarness, ECC, and humans decide what becomes committed project truth.

## Memory types

### User preference memory

Examples:

- Preferred frameworks.
- Preferred code style.
- Communication preferences.
- Repeated review expectations.

### Project convention memory

Examples:

- Testing standards.
- Architecture constraints.
- Documentation style.
- Release process.

### Failure memory

Examples:

- Integration pitfalls.
- Known flaky commands.
- Repeated agent mistakes.
- Unsafe patterns to avoid.

### Workflow improvement memory

Examples:

- Better task decomposition pattern.
- Better test sequence.
- Missing gate discovered during a run.

## Memory storage principle

Committed project truth should live in version-controlled files, not hidden assistant memory.

Recommended committed files:

- `docs/CONTEXT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS/*.md`
- `.vibeharness/project.yaml`
- `.vibeharness/workflows/*.yaml`
- `.vibeharness/policy.yaml`
- `skills/approved/*`

Proposal artifacts are generated under `.vibeharness/runs/<run_id>/memory-proposals/` and `.vibeharness/runs/<run_id>/skill-proposals/` until a human or policy gate promotes them into committed project truth.

## Memory proposal requirements

A memory proposal must include:

- unique ID;
- source run;
- proposed memory text;
- target location;
- reason/evidence;
- scope;
- risk rating;
- owner/reviewer;
- status.

Suggested filename format:

```text
.vibeharness/runs/<run_id>/memory-proposals/<proposal-id>.md
```

## Skill types

### Planning skills

Help create PRDs, architecture notes, task breakdowns, and acceptance criteria.

### Engineering skills

Encode language, framework, testing, or refactoring conventions.

### Review skills

Check code against project standards and acceptance criteria.

### Security skills

Check policy-sensitive areas such as secrets, dependency changes, auth flows, and deployment configuration.

### Workflow skills

Improve stage execution, handoff quality, and artifact generation.

## Skill lifecycle

```text
observed need -> draft skill -> quarantine -> review -> fixture test -> approved -> active -> monitor -> deprecated
```

## Skill proposal requirements

A skill proposal must include:

- name;
- purpose;
- trigger conditions;
- explicit non-goals;
- required inputs;
- expected outputs;
- safety notes;
- example invocation;
- owner;
- review status;
- fixture test if applicable.

Suggested filename format:

```text
.vibeharness/runs/<run_id>/skill-proposals/<skill-name>.md
```

## Quarantine rules

Draft skills are not active by default. They may be stored under:

```text
skills/draft/<skill-name>/
```

Approved skills may be promoted to:

```text
skills/approved/<skill-name>/
```

Promotion requires:

- no broad unsafe permissions;
- no secret access by default;
- clear trigger conditions;
- successful review;
- owner approval;
- ECC policy approval.

## Mem0 responsibilities

Mem0 may:

- store reviewed project-truth facts;
- return relevant facts for stage context;
- reference accepted memories by ID;
- support proposal review without auto-committing new facts.

Mem0 may not, in MVP:

- silently edit committed project memory;
- activate new skills without review;
- bypass ECC policy;
- run direct production actions;
- overwrite architecture decisions.

## Hermes responsibilities

Hermes is a deferred export/interchange target. It may later receive run summaries, memory proposal exports, skill proposal exports, reminders, and coordination summaries after proposal formats are validated.

## VibeHarness responsibilities

VibeHarness must:

- export run summaries to Mem0/Hermes-compatible proposal formats;
- preserve traceability from proposal to evidence;
- validate proposal schema;
- keep committed project truth explicit;
- route proposals through review gates.

## ECC responsibilities

ECC must:

- classify memory/skill proposal risk;
- block unsafe skills;
- require human approval for broad behavioral changes;
- validate hooks and tool permissions;
- record approval/rejection decisions.

## Review cadence

Suggested cadence for early project:

- Memory proposals: review weekly or after every major run.
- Skill proposals: review only when a repeated pattern appears at least twice or a high-value workflow improvement is obvious.
- Approved skills: review monthly while the system is young.

## Anti-drift checks

- Compare Mem0/Hermes memory against committed project docs.
- Warn when hidden memory contradicts repository context.
- Prefer latest committed ADR over assistant memory.
- Expire stale preferences when they have not been reinforced.
- Require evidence for memory that affects future tool behavior.
