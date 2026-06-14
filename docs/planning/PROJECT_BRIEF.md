# VibeHarness Engine - Project Brief

Generated: 2026-06-13

## One-line summary

VibeHarness Engine is a local-first software-engineering harness that turns vague product intent into validated plans, deterministic workflow runs, auditable artifacts, and reviewable handoffs across coding-agent backends.

## Problem

AI coding tools are powerful but fragmented. Each tool has its own prompts, project context, workflow assumptions, skills, memory model, safety posture, and output format. This creates repeated setup work, inconsistent quality, weak auditability, and risky autonomy.

Teams need a reusable harness that can:

- convert vague intent into specs, plans, tasks, code, tests, review, PR, and handoff;
- preserve project context and decisions across agents and sessions;
- apply deterministic workflow stages instead of unstructured agent wandering;
- enforce security, approval, and skill policies;
- route work to the right execution backend without locking into one agent;
- keep long-running memory and coordination separate from direct repo execution.

## Product thesis

The winning architecture is not one all-powerful agent. It is a governed harness with a small kernel and replaceable integrations:

```text
VibeHarness = schemas, workflows, adapters, artifact contracts, policy decisions
Mock adapter = MVP execution proof for deterministic contracts
OpenHands   = first real coding-agent control-plane integration after the kernel works
Archon      = deterministic workflow semantics and optional compatible runtime
ECC         = security, operator policy, hooks, approvals, skills governance
Hermes      = adaptive memory, skills incubation, messaging, cron, Kanban
```

## Primary users

- Solo founders and vibe coders who need reliable idea-to-production execution.
- Senior engineers who want agentic workflows that preserve engineering discipline.
- Team leads who need auditable task decomposition, review, testing, and handoff.
- AI-tool builders who want adapters and reusable workflow profiles.
- Security-conscious operators who need policy gates around autonomous agents.

## MVP outcome

A developer can initialize a VibeHarness project, describe an idea, generate a validated PRD/plan/tasks packet, run a deterministic workflow through the mock adapter, collect policy/test/review evidence, and produce a final handoff with optional memory or skill proposals. OpenHands becomes the first real coding adapter after this contract-proving loop is stable.

## Non-goals for MVP

- Building a full IDE.
- Replacing OpenHands as the coding platform.
- Letting Hermes directly mutate project truth without review.
- Supporting every coding agent adapter at launch.
- Building a multi-tenant SaaS control plane before the local-first developer workflow works.
- Auto-merging PRs without human approval.
- Treating conceptual source notes or raw research exports as normative implementation contracts.
