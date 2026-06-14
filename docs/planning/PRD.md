# Product Requirements Document: VibeHarness Engine

Generated: 2026-06-13

## 1. Product overview

VibeHarness Engine is a local-first, extensible orchestration and standards layer for AI-assisted software engineering. It defines project schemas, workflow profiles, agent adapter contracts, memory contracts, policy gates, and generated planning artifacts so that teams can run predictable idea-to-production workflows across AI coding backends.

The initial implementation proves the local kernel with a mock adapter. OpenHands is the first real repo-execution control-plane integration after the adapter contract, run manifest, policy decisions, and review artifacts are stable. Archon-compatible workflows define deterministic stages. ECC provides operator policy, security gates, skills governance, hooks, and approvals. Hermes acts as the adaptive outer loop for memory, skill incubation, cron, messaging, and long-running Kanban coordination.

## 2. Background and rationale

The current project direction is that VibeHarness should be a software-engineering harness, not merely a personal assistant. The discussion established VibeHarness as the local contract and orchestration kernel, OpenHands as the first real coding control-plane integration, Archon as the deterministic workflow model, ECC as the security/operator policy layer, and Hermes as the memory, skills, cron, messaging, and Kanban sidecar.

This separation matters because direct repo execution, long-term memory, workflow determinism, and safety policy are different concerns. Bundling them into one agent makes the system harder to audit and easier to drift.

## 3. Problem statement

Modern AI-assisted development often fails in five ways:

1. Context is inconsistent between tools and sessions.
2. Workflows are implicit, fragile, and hard to reproduce.
3. Agent-created skills and memories can become unreviewed project truth.
4. Security boundaries around tools, secrets, sandboxes, and destructive commands are unclear.
5. Outputs are not consistently packaged into PRDs, plans, ADRs, test evidence, reviews, PRs, and handoffs.

## 4. Goals

### Product goals

- Provide a universal project schema for AI software-engineering workflows.
- Convert vague intent into structured PRD, architecture, task, test, review, and handoff artifacts.
- Run deterministic staged workflows with explicit gates and artifacts.
- Use a mock adapter first to prove the execution contract, then OpenHands for sandboxed coding-agent execution.
- Provide adapter contracts for future backends such as Aider, Cline, Plandex, Claude Code, Codex, and Cursor-like environments.
- Use Hermes for memory proposals, skill incubation, long-running coordination, messaging, and scheduled work.
- Enforce ECC-style policy gates for tools, skills, secrets, approvals, and security checks.
- Make every run auditable through logs, artifacts, decisions, and generated summaries.

### User goals

- Start from an idea and receive a clear implementation-ready plan.
- Reuse project standards across agents without rewriting context each time.
- Run coding work in a controlled, reviewable, testable workflow.
- Understand what the agent changed, why it changed it, and what remains.
- Keep useful long-term memory without letting agents silently rewrite project truth.

## 5. Non-goals

- VibeHarness will not attempt to replace all coding agents.
- The MVP will not implement every possible adapter.
- The MVP will not auto-approve destructive commands, credential access, dependency installation, or production deployment.
- The MVP will not rely on hidden memory as the source of truth.
- The MVP will not ship a hosted multi-tenant service before the local CLI, schema, workflow, and adapter model are stable.

## 6. Personas

### Persona A: Solo AI-native builder

Needs to convert ideas into production-quality code without losing discipline. Values speed, generated docs, runnable code, and clear next steps.

### Persona B: Senior engineer / tech lead

Needs repeatable workflows, architecture decisions, test gates, review evidence, and clean PRs. Values determinism, auditability, and policy.

### Persona C: Agent workflow designer

Needs reusable workflow profiles, adapter contracts, skill packs, and evaluation results. Values composability and backend neutrality.

### Persona D: Security/operator owner

Needs approval gates, secret handling, tool restrictions, sandbox boundaries, and audit trails. Values least privilege and traceability.

## 7. Product principles

1. Workflow over wandering: agents operate inside explicit stages.
2. Project truth is committed, reviewable, and versioned.
3. Memory proposes; humans or policy gates approve.
4. Skills incubate before promotion.
5. Execution is sandboxed by default.
6. Every run leaves artifacts.
7. Adapters are replaceable; contracts are stable.
8. Human approval is required for high-impact actions.
9. The harness should improve agent output quality without hiding complexity.
10. Local-first comes before hosted complexity.

## 8. MVP scope

### MVP capabilities

- `vibeharness init` creates a project structure and starter config.
- `vibeharness validate` validates project, workflow, adapter, and policy files.
- `vibeharness plan` turns product intent into PRD, architecture notes, task plan, and risk list.
- `vibeharness run` executes a deterministic workflow profile against a repo through the mock adapter.
- `vibeharness review` collects test results, diffs, review notes, policy violations, and handoff content.
- Generated handoff files include export-ready content; a separate `export` command is deferred.
- Basic ECC policy gates for filesystem access, shell commands, secrets, dependency changes, destructive operations, and external network use.
- Hermes memory proposal file format, but not automatic memory writes.
- Draft skill quarantine and review workflow.

### Deferred capabilities

- OpenHands adapter as the first real coding backend after the mock adapter proves the contract.
- `vibeharness export` for PRs, issue trackers, docs, or Hermes ingestion.
- Full hosted dashboard.
- Multi-tenant auth and organization management.
- Deep Slack/Telegram/Discord integrations.
- Full Hermes Kanban synchronization.
- Production deployment automation.
- Comprehensive adapter parity across every coding backend.
- Automatic skill publishing without review.

## 9. Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---:|---|
| FR-001 | Project schema | P0 | A project can define name, repo, stack, constraints, agents, policies, memory contracts, outputs, and workflows in a versioned schema. |
| FR-002 | Workflow profile schema | P0 | A workflow can define stages, inputs, outputs, gates, adapter calls, retry rules, and handoff artifacts. |
| FR-003 | Adapter contract and mock adapter | P0 | The mock adapter validates the common adapter request/response shape and returns deterministic passing, failing, and policy-blocked fixture results. |
| FR-004 | CLI init | P0 | Running `vibeharness init` creates a valid starter project with docs, schemas, profiles, and examples. |
| FR-005 | CLI validation | P0 | Invalid config fails with actionable errors; valid sample projects pass. |
| FR-006 | Planning artifact generation | P0 | From a product idea, the system generates PRD, architecture draft, task plan, risk list, and acceptance criteria. |
| FR-007 | Archon-compatible stage runner | P0 | The runner executes ordered workflow stages and stops on failed required gates. |
| FR-008 | ECC-lite policy decisions | P0 | Tool, file, network, secret, dependency, and destructive-operation checks emit `allow`, `warn`, `approval_required`, `deny`, or `quarantine`. |
| FR-009 | Run artifacts | P0 | Every run emits a manifest, stage logs, generated files, policy decisions, test results, review summary, and handoff. |
| FR-010 | Handoff generation | P0 | The system generates a final handoff with changes, tests, risks, follow-ups, and proposal references. |
| FR-011 | Evaluation fixtures | P0 | The project includes valid, invalid, passing-run, failing-run, and policy-blocked fixtures that prove the MVP loop. |
| FR-012 | OpenHands adapter | P1 | A workflow stage can submit a coding task to OpenHands using the stable adapter contract and capture outputs, logs, diffs, and test evidence. |
| FR-013 | Memory proposal contract | P1 | Hermes or a workflow stage can propose memory updates without committing them automatically. |
| FR-014 | Skill incubation workflow | P1 | New or modified skills enter draft/quarantine and require policy review before promotion. |
| FR-015 | Export command | P2 | Artifacts can be exported for PRs, issue trackers, docs, or Hermes ingestion. |

## 10. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-001 | Reproducibility | Same inputs and workflow profile should produce comparable stage structure, artifacts, and gates. |
| NFR-002 | Auditability | Every stage must emit timestamped logs and artifact references. |
| NFR-003 | Security | Default deny for secrets, destructive commands, and external side effects unless configured. |
| NFR-004 | Extensibility | New adapters and workflow profiles must be addable without rewriting the core engine. |
| NFR-005 | Local-first | MVP works on a local machine and local repo before hosted operation. |
| NFR-006 | Portability | Config files use plain text formats: Markdown, YAML, JSON. |
| NFR-007 | Testability | Core logic is covered by unit tests, integration tests, and fixture workflows. |
| NFR-008 | Human readability | Generated planning artifacts must be understandable without knowing the internal engine. |
| NFR-009 | Safety | The system must stop on policy violations and summarize why. |
| NFR-010 | Modularity | VibeHarness core must not depend on Hermes for direct code execution. |

## 11. Key user journeys

### Journey 1: Idea to implementation plan

1. User writes a short idea.
2. VibeHarness clarifies assumptions and produces PRD, architecture, tasks, risks, and acceptance criteria.
3. User approves or edits the plan.
4. Workflow profile is selected.
5. VibeHarness generates an implementation-ready task package.

### Journey 2: Plan to deterministic run

1. User runs `vibeharness run --workflow default-feature --adapter mock`.
2. Stage runner validates inputs and policy.
3. The mock adapter receives the same bounded task package a real adapter will later consume.
4. Fixture execution produces changed-artifact references, command output, test evidence, and policy decisions.
5. Results are packaged into a review and handoff bundle.

### Journey 3: Memory and skill learning

1. A run identifies repeated project preferences, useful fixes, or workflow improvements.
2. Hermes or the runner emits a memory or skill proposal.
3. ECC validates whether the proposal is safe and scoped.
4. Human or configured policy approves promotion.
5. Approved updates are committed to project truth.

## 12. UX surfaces

### CLI

Primary MVP surface.

Commands:

```text
vibeharness init
vibeharness validate
vibeharness plan
vibeharness run
vibeharness review
vibeharness explain
```

Deferred command:

```text
vibeharness export
```

### Filesystem artifacts

Human-readable, version-controlled project files:

```text
.vibeharness/project.yaml
.vibeharness/policy.yaml
.vibeharness/workflows/*.yaml
.vibeharness/adapters/*.yaml
docs/prd.md
docs/architecture.md
docs/tasks.md
docs/risk-register.md
docs/handoff.md
.vibeharness/runs/<run_id>/run-manifest.json
.vibeharness/runs/<run_id>/adapter-task.yaml
.vibeharness/runs/<run_id>/policy-decisions/*.json
```

### Future UI

A local or hosted dashboard can show workflow status, approvals, diffs, logs, run history, and memory/skill proposals.

## 13. Integration requirements

### OpenHands

- First real coding adapter after the MVP mock adapter proves the contract.
- Receives bounded repo tasks and context bundles.
- Returns logs, files changed, diffs, command outputs, tests, and final summary.

### Archon-compatible workflows

- VibeHarness workflow profile maps to deterministic stages.
- Stages have explicit inputs, outputs, gates, retries, and artifacts.

### ECC policy layer

- Enforces security and operator rules before and during execution.
- Owns tool permissions, hooks, skills, approval gates, and policy reporting.

### Hermes

- Receives run summaries, handoffs, memory proposals, and scheduled task opportunities.
- Coordinates long-running backlog or messaging workflows.
- Does not directly update committed project truth without review.

## 14. Data model overview

Core entities:

- Project
- WorkflowProfile
- Stage
- Gate
- Adapter
- AgentTask
- Policy
- Run
- Artifact
- Review
- Handoff
- MemoryProposal
- SkillProposal
- DecisionRecord

## 15. Success metrics

### Activation metrics

- Time from `init` to first validated workflow.
- Percentage of generated projects that pass validation without manual schema edits.
- Percentage of users who complete idea -> plan -> mock run -> handoff.

### Quality metrics

- Percentage of runs with complete PRD, task, test, review, and handoff artifacts.
- Percentage of workflow runs that pass required tests and policy gates.
- Human acceptance rate of generated plans and PR summaries.
- Number of security policy violations caught before execution.

### Fixture metrics

- `fixtures/minimal-valid-project` validates with zero errors.
- `fixtures/invalid-project-missing-name` fails with a field-path error.
- `fixtures/example-idea-simple-feature` produces the required planning packet.
- `fixtures/default-feature-run-mock` produces a valid run manifest.
- `fixtures/policy-blocked-command` emits `approval_required` or `deny`.
- `fixtures/review-handoff-basic` produces complete review and handoff artifacts.

### Engineering metrics

- Adapter test pass rate.
- Fixture workflow regression pass rate.
- Mean failed-stage diagnosis time.
- Number of backend-specific assumptions leaking into core schema.

### Learning metrics

- Memory proposal acceptance rate.
- Skill proposal acceptance rate after review.
- Reduction in repeated manual project-context corrections.

## 16. Launch criteria

MVP is ready when:

- The sample project can run idea -> PRD -> task plan -> mock adapter execution -> tests -> review -> handoff.
- All P0 schemas are documented and validated.
- At least one fixture workflow runs end-to-end in CI.
- ECC policy can block or require approval for sensitive actions.
- Run artifacts are complete enough for a human reviewer to understand what happened.
- Memory and skill proposals exist as files only; no automatic promotion or hidden memory mutation is allowed.

## 17. Open assumptions

- Initial users are technical and comfortable with CLI and Git.
- OpenHands can expose the adapter hooks VibeHarness needs, but MVP success does not depend on that integration.
- Archon compatibility means deterministic workflow semantics, not necessarily a hard dependency on a specific external runtime for MVP.
- ECC is implemented first as policy files, hooks, and gates; deeper operator runtime can evolve later.
- Hermes begins as a sidecar contract and optional integration, not as a required dependency for core runs.
