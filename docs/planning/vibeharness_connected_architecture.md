# VibeHarness: A Connected Harness Engineering Architecture

> Non-authoritative vision/source note. This file preserves the broader architecture discussion and may contain older naming such as `vibe` or `.vibe`. The normative planning contract lives in `PLANNING_INDEX.md`, `PRD.md`, `MVP_SCOPE.md`, `ARCHITECTURE.md`, and `WORKFLOW_SPEC.md`.

**Document purpose:** This document consolidates the full discussion into one connected architecture narrative. It explains Harness Engineering, compares Archon, ECC, OpenHands, and Hermes, and turns the resulting decisions into a coherent blueprint for an ultimate Vibe Coding assistant ecosystem.

**Working project name:** `VibeHarness`

**North star:**

> **GitHub Actions for AI coding workflows, powered by an agent operating system, governed by an operator/security layer, and improved by a long-term memory and learning loop.**

---

## 1. Executive Summary

The best architecture is not one giant fork of every AI coding repository. The best architecture is a **universal harness standard** that composes the strongest parts of multiple systems.

The final recommendation is:

```text
VibeHarness = the universal harness standard
OpenHands   = the primary coding-agent control plane and execution platform
Archon      = the deterministic workflow engine / workflow spec runner
ECC         = the operator, security, skills, hooks, and memory-policy layer
Hermes      = the long-term memory, self-improving skills, cron, messaging, and Kanban layer
Spec Kit    = the spec-driven development engine
Matt skills = senior-engineering behavior pack
BMAD        = product, architecture, development, and QA agent-team method
Aider/Cline/Plandex/Codex/Claude Code = optional specialized implementation backends
LangGraph/CrewAI = optional custom multi-agent orchestration backends
```

The clean mental model is:

```text
OpenHands runs the workshop.
Archon defines the assembly line.
ECC supplies the rules, safety gear, specialist skills, and memory policy.
Hermes remembers what happened, learns from it, schedules follow-ups, and coordinates over time.
VibeHarness connects everything through one portable schema.
```

The architecture should support the full product lifecycle:

```text
Idea
  -> Clarify
  -> Spec
  -> Plan
  -> Tasks
  -> Worktree
  -> Implement
  -> Test
  -> Review
  -> Secure
  -> Document
  -> PR
  -> Learn
```

The critical design choice is to keep each system in its best role. OpenHands should be the primary platform where coding agents run. Archon should not disappear; it should provide deterministic workflows. ECC should not become the workflow engine; it should become the behavior and safety layer attached to every execution step. Hermes should not replace OpenHands for repo execution; it should become the outer memory, learning, cron, messaging, and coordination loop.

---

## 2. Harness Engineering in Plain English

Harness Engineering is the work of building the **wrapper around an AI model** so the model behaves reliably in real-world tasks.

The model is the brain. The harness is everything around the brain:

```text
instructions
rules
tools
memory
workflow steps
tests
approval gates
security checks
monitoring
logs
policies
runtime limits
human handoff
```

A simple formula:

```text
Agent = Model + Harness
```

A raw model can answer questions or generate code. A harness turns it into a more dependable working agent by telling it:

- what context to use
- what tools it can access
- what process to follow
- what it is not allowed to do
- when to ask for approval
- how to validate its output
- how to remember decisions
- how to recover when something fails

### Example: fixing a checkout bug

Without a harness, an AI coding agent might jump into random files, skip tests, make a messy patch, and open an unclear pull request.

With a harness, the agent follows a process:

1. Read the issue and project rules.
2. Inspect relevant files.
3. Reproduce or understand the bug.
4. Create a plan.
5. Create an isolated branch or worktree.
6. Implement a focused fix.
7. Run tests and linters.
8. Run security or code review.
9. Ask for human approval when required.
10. Open a pull request with the right summary and evidence.

That process is the harness.

### Prompt Engineering vs Harness Engineering

Prompt Engineering asks:

> What should I say to the AI?

Harness Engineering asks:

> What system should the AI run inside so it does the right thing again and again?

| Concept | Simple meaning |
|---|---|
| Model | The AI brain: GPT, Claude, Gemini, etc. |
| Prompt | A single instruction given to the model. |
| Context | The information the model sees: docs, code, memories, APIs. |
| Harness | The full operating environment: prompts, tools, workflows, tests, rules, memory, approvals, and security. |
| Harness Engineering | Designing and improving that operating environment. |

---

## 3. The Starting Comparison: Archon vs ECC

Archon and ECC both belong in the Harness Engineering universe, but they solve different problems.

### Simple distinction

```text
Archon = workflow discipline
ECC    = agent operating discipline
```

Archon asks:

> What exact steps should the AI agent follow from task to finished PR?

ECC asks:

> What rules, skills, memory, hooks, safety checks, and tool configurations should the agent have while doing the work?

### Archon

Archon is mainly a **workflow engine for AI coding agents**. It is useful when the main problem is inconsistent process.

Archon is strongest at:

```text
YAML workflows
DAG-style process definition
planning nodes
implementation loops
validation gates
approval gates
worktree isolation
PR creation
workflow monitoring
repeatable coding processes
```

Use Archon when you want rules like:

```text
Every bug fix must create a plan, use a clean worktree, run tests, get reviewed, and create a PR.
```

### ECC

ECC is mainly a **harness-native operator system**. It is useful when the main problem is inconsistent agent behavior across tools.

ECC is strongest at:

```text
skills
rules
hooks
memory behavior
security checks
AgentShield
MCP configuration
cross-harness adapters
research-first development
operator profiles
```

Use ECC when you want rules like:

```text
No matter whether I use Claude Code, Cursor, Codex, OpenHands, Cline, or another tool, the agent should follow my standards, remember useful patterns, run checks, and avoid unsafe behavior.
```

### Side-by-side

| Question | Archon | ECC |
|---|---|---|
| Main job | Run repeatable AI coding workflows. | Standardize and improve agent behavior across tools. |
| Mental model | GitHub Actions / n8n for AI coding agents. | Agent OS / operator pack / skills-and-hooks system. |
| Primary layer | Workflow orchestration. | Agent behavior, rules, hooks, memory, safety. |
| What it defines | Plan, implement, test, review, approve, PR. | Skills, hooks, rules, MCP configs, memory, security. |
| Best for | Repeatable end-to-end processes. | Consistent behavior across coding agents. |
| Control style | Macro-control: the big process. | Micro/mid-level control: how the agent thinks and acts. |
| Can they work together? | Yes. Archon runs the workflow. | Yes. ECC governs the agent inside each workflow step. |

### Initial merge idea

The first proposed integration was:

```text
Archon orchestrates. ECC enriches.
```

That means:

```text
Archon owns process.
ECC owns agent behavior.
The bridge owns translation.
```

The bridge could be called `archon-ecc` or `ECC Operator Pack for Archon`.

---

## 4. The Evolution of the Architecture

The discussion evolved through several design decisions.

### Decision 1: Do not smash Archon and ECC together

A literal repo merge would be messy. It would blur responsibilities and create duplicate control systems.

Better:

```text
Archon stays the workflow engine.
ECC becomes an operator pack attached to workflow nodes.
```

Example:

```yaml
nodes:
  - id: plan
    ecc_profile: planning

  - id: implement
    ecc_profile: implementation

  - id: validate
    ecc_profile: validation

  - id: security
    ecc_profile: security

  - id: review
    ecc_profile: safe-review
```

### Decision 2: Build a universal meta-harness, not just an Archon/ECC bridge

The uploaded pipeline and research suggested a bigger opportunity: build an ultimate vibe-coding harness that can compose multiple tools.

That led to `VibeHarness`:

> A universal Harness Engineering ecosystem for vibe coding, spec-driven development, agent orchestration, skills, memory, safety, and multi-agent implementation.

This changes the design from:

```text
Archon + ECC only
```

to:

```text
VibeHarness + OpenHands + Archon + ECC + Hermes + Spec Kit + skills + coding agents
```

### Decision 3: OpenHands should be primary control plane

The AI agent suggested using OpenHands as primary. That is reasonable.

There are two meanings of control plane:

| Meaning | Best owner |
|---|---|
| Where agents actually run, edit files, execute commands, use sandboxes, open sessions, and expose UI/API. | OpenHands |
| What deterministic process the agent must follow. | Archon |
| What rules, skills, hooks, memory, and security behavior the agent uses. | ECC |
| What schema connects all tools. | VibeHarness |

Therefore:

```text
OpenHands becomes the main platform.
Archon becomes the deterministic workflow engine inside or beside that platform.
```

### Decision 4: ECC resides as the operator layer

ECC should not be treated as a workflow runner or a coding runtime.

ECC lives horizontally across the workflow as the operator layer:

```text
ECC = skills + rules + hooks + memory behavior + security + MCP + cross-harness profiles
```

It answers:

> Given this workflow step, what rules, skills, hooks, memory, security checks, MCP configs, and agent behavior should be active?

### Decision 5: Hermes is valuable, but should not replace OpenHands

Hermes is strong for:

```text
persistent memory
self-created skills
skill self-improvement
cross-session recall
messaging gateway
cron jobs
long-running goals
Kanban multi-agent task board
worktrees
checkpoints and rollback
trajectory export
```

But the core system is a software-engineering harness. For repo execution, sandboxed code work, PR workflows, and software-agent runtime, OpenHands should remain primary.

Therefore:

```text
OpenHands = primary coding control plane
Hermes    = outer memory, learning, messaging, cron, and Kanban layer
```

---

## 5. Final System Architecture

### Final stack

```text
VibeHarness
  = universal schema, profiles, adapters, workflow definitions, memory contracts

OpenHands
  = primary coding-agent control plane and execution platform

Archon
  = deterministic workflow runner: plan -> build -> test -> review -> PR

ECC
  = operator/security/skills/hooks/memory-policy layer

Hermes
  = self-improving memory, skills evolution, messaging gateway, cron, long-running coordination

Spec Kit
  = spec-driven development: constitution, clarify, specify, plan, tasks, analyze, checklist

Matt Pocock skills
  = senior engineering habits: grill, PRD, TDD, diagnose, zoom-out, architecture improvement, handoff

BMAD
  = product, architecture, development, QA, and agile agent-team lifecycle

Aider / Cline / Plandex / Claude Code / Codex
  = optional specialized implementation backends

LangGraph / CrewAI
  = optional custom stateful or multi-agent orchestration
```

### Architecture diagram

```text
User / Team
   |
   v
VibeHarness CLI / UI / API
   |
   v
Project profile + workflow router
   |
   v
OpenHands control plane
   |  - sessions
   |  - tools
   |  - sandbox/workspace
   |  - GUI/CLI/API/cloud
   |
   v
Workflow execution path
   |-- Archon-compatible deterministic workflow
   |-- Native OpenHands automation
   |-- LangGraph/CrewAI graph when custom orchestration is needed
   |
   v
Each workflow node loads an ECC operator profile
   |  - skills
   |  - rules
   |  - hooks
   |  - MCP profile
   |  - memory behavior
   |  - security gates
   |
   v
Implementation runtime
   |-- OpenHands native agent
   |-- Aider
   |-- Cline
   |-- Plandex
   |-- Claude Code
   |-- Codex
   |
   v
Code, tests, docs, PR, handoff
   |
   v
Hermes outer loop
   |  - remembers preferences
   |  - proposes learned skills
   |  - schedules follow-ups
   |  - coordinates Kanban work
   |  - sends messages/approvals
   |  - proposes memory updates
```

### Slogan

```text
OpenHands runs the workshop.
Archon defines the assembly line.
ECC supplies the operator behavior and safety policy.
Hermes remembers, learns, schedules, and coordinates over time.
VibeHarness connects everything.
```

---

## 6. Layer Ownership Rules

Clear ownership prevents systems from fighting each other.

| Layer | Owns | Should not own |
|---|---|---|
| VibeHarness | Schemas, profiles, adapters, workflow definitions, capability registry, memory formats, safety policies. | Low-level repo execution or tool-specific behavior. |
| OpenHands | Agent sessions, workspaces, sandboxes, tools, CLI/GUI/API/cloud, execution runtime. | The only workflow language or all agent behavior policies. |
| Archon | Deterministic workflows, DAGs, approval gates, worktree workflows, validation loops, PR flows. | Global skills, all hooks, all coding rules, long-term memory. |
| ECC | Skills, rules, hooks, AgentShield, MCP configs, memory behavior, operator profiles, cross-agent consistency. | Overall workflow state or primary control-plane UI/runtime. |
| Hermes | Long-term memory, skill incubation, messaging, cron, Kanban, scheduled coordination. | Primary repo execution for serious coding workflows. |
| Spec Kit | Specs, plans, tasks, constitution, checklists, consistency analysis. | Code execution runtime. |
| Matt skills | Senior-engineering habits and reusable behaviors. | Global orchestration platform. |
| BMAD | Product/architecture/QA lifecycle agents. | Low-level execution sandbox. |

### Most important ownership rule

```text
VibeHarness defines the standard.
OpenHands executes.
Archon sequences.
ECC governs.
Hermes remembers and coordinates.
```

---

## 7. ECC's Exact Place in the Workflow

ECC resides as the **operator layer** across the whole workflow.

It is not:

```text
the primary control plane
the workflow engine
just a skill pack
just a hook pack
```

It is:

```text
the layer that decides how the agent behaves in each workflow step
```

### ECC should appear in three forms

#### 1. ECC as an OpenHands plugin

Because OpenHands is the primary control plane, ECC should first be delivered as an OpenHands plugin or plugin-like integration.

```text
openhands-plugin-ecc/
  skills/
  hooks/
  commands/
  agents/
  mcp/
  rules/
  security/
```

In VibeHarness config:

```yaml
operator_layer:
  primary: ecc
  delivery:
    - openhands_plugin
    - openhands_skills
    - openhands_hooks
    - mcp_profiles
    - agentshield_gate
```

#### 2. ECC as Archon node profiles

When an Archon-compatible workflow runs, each node should activate a specific ECC profile.

```yaml
ecc_profiles:
  planning:
    skills:
      - research-first
      - architecture-planning
    hooks:
      - read-only
    memory:
      read:
        - CONTEXT.md
        - docs/adr/

  implementation:
    skills:
      - coding-standards
      - tdd
      - search-first
    hooks:
      - no-secret-read
      - no-dangerous-shell
      - format-after-edit
    tools:
      shell: limited
      file_edit: allowed

  security:
    gates:
      - agentshield
      - secrets-scan
      - mcp-permission-audit
    hooks:
      - strict
```

#### 3. ECC as cross-agent compatibility layer

Different tools use different configuration formats:

```text
OpenHands plugins/skills
Claude Code skills/hooks
Cline rules/skills
Cursor rules/hooks
Codex AGENTS.md
Archon node profiles
```

VibeHarness should normalize ECC capabilities into one schema, then compile them into the target format.

```text
ECC source capability
   -> VibeHarness adapter
   -> OpenHands plugin
   -> Archon profile
   -> Claude/Cline/Codex/Cursor config
```

### ECC by workflow phase

| Phase | Main owner | ECC role |
|---|---|---|
| Idea clarification | Spec Kit / Matt skills / BMAD | Load memory, clarification rules, research-first behavior. |
| Requirements/spec | Spec Kit | Enforce spec quality and acceptance criteria discipline. |
| Planning | Spec Kit / Archon / BMAD | Activate planning profile, architecture rules, risk checks, approval policy. |
| Architecture | BMAD / architecture agent | Inject architecture-review skills, ADR rules, context memory. |
| UI/UX | design tools / frontend agent | Apply design system rules, accessibility checks, frontend conventions. |
| Scaffolding | OpenHands / Aider / Cline | Apply repo setup rules, package-manager detection, file structure policy. |
| Backend implementation | OpenHands / Aider / Cline / Plandex | Activate coding standards, TDD behavior, safe tool hooks. |
| Frontend implementation | OpenHands / Cline / Aider | Activate frontend rules, component conventions, accessibility checks. |
| API/Auth | implementation agent | Apply secrets policy, auth/security rules, env-file guardrails. |
| Testing/QA | Archon validation / QA agent | Enforce test-required policy, TDD loops, QA checklist. |
| Debug/refactor | Matt skills / coding agent | Activate diagnose, regression-test, refactor-after-green behavior. |
| Documentation | docs agent / handoff skills | Update CONTEXT.md, ADRs, handoffs, specs, review notes. |
| CI/CD | Archon / GitHub Actions | Add safety gates, pre-commit rules, PR checks. |
| Security/release | ECC + scanners | Run AgentShield, secret scan, MCP audit, security review. |

---

## 8. OpenHands vs Hermes: Final Decision

OpenHands and Hermes are both valuable, but for different jobs.

### One-sentence comparison

```text
OpenHands is the coding workshop.
Hermes is the long-term apprentice that remembers, learns, schedules, and communicates.
```

### Why OpenHands is primary

Our goal is a serious software-engineering harness:

```text
vague idea
-> clarified product intent
-> spec
-> plan
-> tasks
-> code
-> tests
-> review
-> security
-> PR
-> handoff
-> memory
```

This is fundamentally a software-development lifecycle. Therefore the primary platform should be the system best suited for running coding agents on real repos with tools, sandboxes, sessions, and team interfaces.

That role belongs to OpenHands.

OpenHands is better for:

```text
repo editing
sandboxed code execution
multi-agent coding sessions
PR review workflows
CLI/GUI/cloud operation
team use
software-agent SDK integration
```

### Why Hermes is still essential

Hermes is valuable for the outer loop:

```text
persistent memory
self-improving skills
skill incubation
cross-session recall
messaging gateway
cron jobs
long-running goals
Kanban coordination
checkpoints and rollback
trajectory export
```

Hermes should wrap the software-engineering loop, not replace the main execution platform.

### Recommended division

| Area | OpenHands | Hermes | Decision |
|---|---|---|---|
| Primary coding platform | Strong | Useful but broader | OpenHands |
| Repo execution | Strong | Possible | OpenHands |
| Sandboxed coding work | Strong | Strong, but less central to our target | OpenHands |
| Long-term personal/team memory | Good | Strong | Hermes |
| Self-created skills | Plugin-based and controlled | Strong self-improvement | Hermes as incubator, VibeHarness as approver |
| Messaging/cron | Good with automation paths | Strong | Hermes |
| Kanban coordination | Useful | Strong | Hermes for outer backlog |
| Deterministic workflow | Needs workflow layer | Not the main job | Archon/VibeHarness |
| Operator/security policy | Plugin support | Not core | ECC |

### Hermes integration pattern

```text
Hermes memory
  -> proposes update
  -> VibeHarness review gate
  -> approved CONTEXT.md / ADR / skill / workflow profile
```

```text
Hermes-created skill
  -> quarantine / review
  -> ECC safety review
  -> VibeHarness skill schema normalization
  -> approved skill registry
  -> compile to OpenHands / Claude / Cline / Codex / Cursor
```

```text
Hermes cron
  -> triggers VibeHarness run
  -> OpenHands executes in sandbox
  -> Archon controls deterministic workflow
  -> ECC applies safety/security policy
  -> Hermes sends summary to Slack/Telegram/Discord/etc.
```

### When Hermes would be primary

Hermes should be primary only if the product is less like:

```text
AI coding platform for serious software workflows
```

and more like:

```text
always-on personal AI operator that remembers me, talks to me across messaging apps, creates its own skills, runs cron jobs, and occasionally codes
```

For VibeHarness, the first description is the goal. Therefore:

```text
OpenHands primary.
Hermes outer loop.
```

---

## 9. Universal Capability Schema

Every library has different names for similar things:

```text
skills
commands
rules
hooks
agents
workflows
tools
MCP servers
prompts
personas
memory
policies
validation gates
```

VibeHarness needs a common internal format.

### Example capability schema

```yaml
capability:
  id: tdd
  name: Test-Driven Development
  type: skill
  source: mattpocock/skills
  purpose: "Drive red-green-refactor implementation."
  stage:
    - implementation
    - testing
  inputs:
    - spec
    - target_files
  outputs:
    - failing_test
    - implementation
    - passing_tests
  safety:
    requires_tests: true
    allow_file_edits: true
    allow_shell: limited
  supported_targets:
    - openhands
    - claude-code
    - codex
    - cursor
    - cline
    - aider
```

### Compile targets

```text
VibeHarness capability
  -> OpenHands plugin / skill / hook
  -> Archon workflow node profile
  -> ECC operator profile
  -> Claude Code skill or hook
  -> Cline skill or .clinerules entry
  -> Cursor rule or hook
  -> Codex AGENTS.md or codex.md
  -> Aider instructions
  -> Plandex plan pattern
```

This is the actual merge:

> Translate every useful capability into one portable contract.

---

## 10. Project Configuration

Each project should get a `vibeharness.yaml` file.

```yaml
project:
  name: my-app
  mode: production

control_plane:
  primary: openhands
  interfaces:
    - cli
    - headless
    - local_gui
    - agent_canvas
    - cloud
    - sdk

workflow_engine:
  primary: vibeharness
  compile_targets:
    - archon
    - openhands_automation
    - langgraph
  default_target: archon_for_deterministic_workflows

execution:
  default_runtime: openhands
  sandbox:
    preferred: docker
    alternatives:
      - process
      - remote

operator_layer:
  primary: ecc
  delivery:
    - openhands_plugin
    - openhands_skill
    - hooks
    - agentshield_gate

memory_and_coordination:
  outer_loop: hermes
  delivery:
    - memory_sidecar
    - skill_incubator
    - cron
    - messaging
    - kanban

spec_layer:
  primary: spec-kit

skill_layer:
  sources:
    - mattpocock-skills
    - ecc-skills
    - bmad
    - superclaude

implementation_agents:
  - openhands
  - aider
  - cline
  - plandex
  - claude-code
  - codex

safety:
  security_scan: ecc-agentshield
  tests_required: true
  approval_required_before_pr: true
  global_hooks_default: false

memory:
  context_file: CONTEXT.md
  adr_dir: docs/adr
  spec_dir: specs
  plan_dir: plans
  task_dir: tasks
  handoff_dir: .vibe/handoffs
  run_log_dir: .vibe/runs
  eval_dir: .vibe/evals
```

---

## 11. Recommended Repository Structure

```text
vibeharness/
|
|-- packages/
|   |-- core/                     # Schemas, config loader, router, planner
|   |-- cli/                      # vibe init, vibe run, vibe doctor, vibe install
|   |-- workflow-engine/          # DAG runner, state machine, retries, approvals
|   |-- skill-registry/           # Capability metadata, loader, compiler
|   |-- memory/                   # CONTEXT.md, ADRs, session history, handoffs
|   |-- safety/                   # Policies, gates, hooks, test/security adapters
|   |-- evals/                    # Agent runs, scorecards, regression tests
|   |-- dashboard/                # Optional local UI
|
|-- adapters/
|   |-- openhands/                # Primary control plane integration
|   |-- archon/                   # Compile Vibe workflows to Archon workflows
|   |-- ecc/                      # Profiles, hooks, skills, AgentShield
|   |-- hermes/                   # Memory, skill incubation, messaging, cron, Kanban
|   |-- spec-kit/                 # Spec/plan/tasks/analyze/checklist integration
|   |-- matt-skills/              # Grill, TDD, diagnose, zoom-out, handoff
|   |-- bmad/                     # PM/architect/dev/QA lifecycle agents
|   |-- aider/                    # Terminal implementation adapter
|   |-- cline/                    # IDE/CLI rules and skills adapter
|   |-- plandex/                  # Large-task implementation adapter
|   |-- langgraph/                # Durable stateful graph adapter
|   |-- crewai/                   # Crews/Flows adapter
|   |-- swe-agent/                # Issue-fixing/eval trajectory adapter
|
|-- skills/
|   |-- product/
|   |-- planning/
|   |-- architecture/
|   |-- frontend/
|   |-- backend/
|   |-- testing/
|   |-- debugging/
|   |-- security/
|   |-- docs/
|   |-- release/
|
|-- workflows/
|   |-- idea-to-pr.yaml
|   |-- spec-to-issues.yaml
|   |-- issue-to-pr.yaml
|   |-- tdd-feature.yaml
|   |-- diagnose-bug.yaml
|   |-- refactor-safely.yaml
|   |-- security-review.yaml
|   |-- ui-prototype.yaml
|   |-- production-release.yaml
|
|-- profiles/
|   |-- solo-dev.yaml
|   |-- startup-fast.yaml
|   |-- enterprise-safe.yaml
|   |-- autonomous-lab.yaml
|   |-- local-only.yaml
|   |-- claude-code-first.yaml
|   |-- openhands-primary.yaml
|
|-- templates/
|   |-- CONTEXT.md
|   |-- ADR.md
|   |-- PRD.md
|   |-- SPEC.md
|   |-- PLAN.md
|   |-- TASKS.md
|   |-- HANDOFF.md
|   |-- REVIEW.md
|
|-- examples/
|   |-- nextjs-saas/
|   |-- python-api/
|   |-- mobile-app/
|   |-- data-pipeline/
|   |-- ai-agent-product/
```

---

## 12. The Main Workflows

### 12.1 `idea-to-pr`

For building from a rough idea.

```text
grill idea
-> write PRD
-> create spec
-> create plan
-> create tasks
-> approve plan
-> create worktree
-> implement slice-by-slice
-> run tests
-> review
-> security scan
-> create PR
-> handoff
-> learn
```

Detailed flow:

1. Clarify the idea with product-discovery skills.
2. Write a PRD with user stories and acceptance criteria.
3. Generate a Spec Kit-style specification.
4. Generate a technical plan.
5. Generate vertical-slice tasks.
6. Ask for human approval before implementation.
7. Create an isolated worktree.
8. Implement one slice at a time through OpenHands or another runtime.
9. Run tests, linting, type checks, and build.
10. Run ECC AgentShield and secret/dependency scans.
11. Run multi-review: code, security, architecture, QA.
12. Fix findings.
13. Ask for final human approval.
14. Create a PR.
15. Update CONTEXT.md, ADRs, handoff docs, run logs, and evals.

### 12.2 `issue-to-pr`

For GitHub issues.

```text
classify issue
-> reproduce
-> diagnose
-> plan fix
-> write regression test
-> implement
-> run validation
-> review
-> open PR
```

Use:

```text
SWE-agent-style issue fixing
Archon-style deterministic PR workflow
Matt diagnose/TDD skills
OpenHands/Aider/Cline/Plandex implementation
ECC safety and memory profiles
```

### 12.3 `tdd-feature`

For serious feature work.

```text
read spec
-> pick next behavior
-> write failing test
-> implement minimum code
-> run tests
-> refactor
-> repeat
-> document
```

Use:

```text
Matt TDD discipline
OpenHands execution
Aider lint/test feedback loop
Cline Plan/Act interaction when IDE-native work is useful
Archon workflow gates
ECC implementation profile
```

### 12.4 `large-refactor`

For risky multi-file work.

```text
zoom out
-> map architecture
-> propose refactor
-> create safety tests
-> split into slices
-> implement slice-by-slice
-> validate each slice
-> review architecture
```

Use:

```text
Plandex or OpenHands for large-context work
Archon for workflow control
ECC for rules/hooks/security
Matt zoom-out and architecture-improvement skills
```

### 12.5 `security-review`

For production readiness.

```text
static scan
-> secret scan
-> dependency scan
-> prompt/tool/hook scan
-> AI security review
-> remediation plan
-> fix
-> verify
```

Use:

```text
ECC AgentShield
deterministic scanners
AI security reviewer
human approval before merge/deploy
```

---

## 13. Example `idea-to-pr` Workflow Spec

This is conceptual YAML for the VibeHarness workflow. It can later compile to Archon, OpenHands automation, or LangGraph.

```yaml
workflow:
  id: idea-to-pr
  name: Idea to Pull Request
  description: Convert a rough product idea into a reviewed pull request.
  default_profile: solo-dev

nodes:
  - id: clarify
    type: agent
    capability_profile:
      - grill-me
      - grill-with-docs
    output:
      - clarified_idea
      - assumptions
      - open_questions

  - id: prd
    type: agent
    depends_on:
      - clarify
    capability_profile:
      - to-prd
    output:
      - PRD.md

  - id: specify
    type: spec
    depends_on:
      - prd
    commands:
      - speckit.specify
    output:
      - specs/feature.md

  - id: plan
    type: spec
    depends_on:
      - specify
    commands:
      - speckit.plan
    output:
      - plans/implementation.md

  - id: tasks
    type: spec
    depends_on:
      - plan
    commands:
      - speckit.tasks
    output:
      - tasks/feature-tasks.md

  - id: approve_plan
    type: approval
    depends_on:
      - tasks
    message: "Approve this plan before implementation?"

  - id: implement
    type: implementation
    depends_on:
      - approve_plan
    runtime_router:
      prefer:
        - openhands
        - aider
        - cline
        - plandex
    operator_profile: ecc-implementation
    skills:
      - tdd
      - coding-standards
      - search-first
    loop:
      strategy: vertical_slice
      stop_when: all_tasks_complete

  - id: validate
    type: deterministic
    depends_on:
      - implement
    commands:
      - npm test
      - npm run lint
      - npm run typecheck
      - npm run build

  - id: security
    type: gate
    depends_on:
      - validate
    operator_profile: ecc-security
    commands:
      - ecc-agentshield scan --json
      - secret-scan
      - dependency-scan

  - id: review
    type: multi_review
    depends_on:
      - security
    reviewers:
      - code-reviewer
      - security-reviewer
      - architecture-reviewer
      - qa-reviewer

  - id: fix_findings
    type: implementation
    depends_on:
      - review
    runtime_router:
      prefer:
        - openhands
        - aider
        - cline
    loop:
      strategy: fix_review_findings
      stop_when: review_findings_resolved

  - id: final_approval
    type: approval
    depends_on:
      - fix_findings
    message: "Approve final changes before PR?"

  - id: create_pr
    type: pr
    depends_on:
      - final_approval
    output:
      - pull_request_url
      - summary
      - tests_run
      - security_findings

  - id: learn
    type: memory
    depends_on:
      - create_pr
    updates:
      - CONTEXT.md
      - docs/adr/
      - .vibe/handoff/
      - .vibe/runs/
      - .vibe/evals/
```

---

## 14. Agent Router

The system should not force one implementation agent.

It should choose the best runtime for the task.

```yaml
routing:
  small_precise_edit:
    prefer:
      - aider
      - cline
      - openhands

  ide_interactive_work:
    prefer:
      - cline
      - cursor

  sandboxed_autonomous_work:
    prefer:
      - openhands

  huge_multifile_change:
    prefer:
      - plandex
      - openhands

  deterministic_workflow:
    prefer:
      - archon

  custom_stateful_orchestration:
    prefer:
      - langgraph

  role_based_collaboration:
    prefer:
      - crewai
      - bmad

  long_running_memory_or_cron:
    prefer:
      - hermes
```

Routing rules:

```text
Small focused edit       -> Aider, Cline, or OpenHands
IDE interactive work     -> Cline or Cursor
Full autonomous coding   -> OpenHands
Huge multi-file change   -> Plandex or OpenHands
Deterministic workflow   -> Archon-compatible workflow
Custom stateful graph    -> LangGraph
Multi-role collaboration -> CrewAI or BMAD
Long-running assistant   -> Hermes
```

---

## 15. Memory System

Most vibe-coding systems fail because they do not preserve useful memory in a readable way.

VibeHarness should store memory in human-readable, commit-friendly artifacts.

```text
CONTEXT.md          Shared project glossary and domain language
docs/adr/*.md      Architecture decisions
specs/*.md         Product specs and acceptance criteria
plans/*.md         Technical plans
tasks/*.md         Implementation task lists
.vibe/runs/*.json  Workflow execution logs
.vibe/evals/*.json Agent performance and regression checks
.vibe/handoff/*.md Session continuation summaries
```

### Rules

```text
Memory must be readable by humans.
Memory must be portable across agents.
Memory must be commit-friendly.
Memory must not live only in a hidden vector database.
Important decisions must become ADRs.
Important product behavior must become specs.
Important continuation context must become handoffs.
Hermes may propose memory updates, but VibeHarness approves committed project memory.
```

### Memory flow

```text
Agent session
  -> run log
  -> handoff summary
  -> proposed memory updates
  -> review gate
  -> CONTEXT.md / ADR / spec / skill registry update
```

---

## 16. Safety Model

The safety model should have five gates.

```text
1. Pre-flight gate
   Check repo status, dirty files, branch, secrets, env files, package manager.

2. Plan gate
   No implementation until spec/plan/tasks are good enough for the selected profile.

3. Tool gate
   Restrict tools per workflow node: read-only, edit-only, shell-limited, network-limited.

4. Validation gate
   Tests, lint, typecheck, build, security scan, dependency scan.

5. Human approval gate
   Required before destructive changes, deployment, production secrets, or PR creation.
```

### Node-scoped hooks, not global hooks

Global hooks create unpredictable behavior and conflicts across tools.

Use node-scoped hook profiles:

```yaml
hooks:
  planning:
    mode: read-only

  implementation:
    mode: edit-safe
    checks:
      - no-secrets
      - no-env-read
      - format-after-edit
      - safe-shell

  validation:
    mode: deterministic
    checks:
      - tests-required
      - lint-required
      - typecheck-required

  security:
    mode: strict
    checks:
      - agentshield
      - dependency-risk
      - prompt-injection
      - mcp-permission-audit
```

### Safety principle

```text
Autonomy is allowed only inside a bounded, observable, reversible harness.
```

---

## 17. Profiles

Profiles make the ecosystem usable without manual assembly.

### `solo-dev`

Fast, practical, low ceremony.

```yaml
spec_depth: medium
approval: before_pr
agent: openhands_or_aider_or_cline
security: standard
memory: CONTEXT.md + handoff
```

### `startup-fast`

Good for MVPs and fast prototyping.

```yaml
spec_depth: light
ui_prototype: enabled
agent: openhands_or_cline
validation: critical_paths_only
security: basic
```

### `enterprise-safe`

For serious production systems.

```yaml
spec_depth: strict
approval: every_phase
agent: openhands_sandboxed
security: strict
tests: full
adr_required: true
ci_required: true
node_scoped_hooks: true
```

### `autonomous-lab`

For experimentation.

```yaml
approval: minimal
agent: openhands_or_plandex
multi_agent: enabled
evals: enabled
rollback: required
hermes_outer_loop: enabled
```

### `local-only`

For privacy.

```yaml
network: disabled
local_models: preferred
cloud_tools: disabled
memory: local_only
```

---

## 18. CLI Shape

The CLI should be simple.

```bash
vibe init
vibe doctor
vibe profile use enterprise-safe
vibe run idea-to-pr "Build a customer support dashboard"
vibe run fix-issue 42
vibe run tdd-feature specs/billing.md
vibe run security-review
vibe handoff
vibe eval last-run
```

Under the hood, a command may call:

```text
Matt skill: grill-with-docs
Spec Kit: specify -> plan -> tasks
BMAD: PM / Architect / QA agents
OpenHands: primary execution session
Archon: deterministic workflow
ECC: operator profile + AgentShield + hooks
Aider/Cline/Plandex: optional implementation runtime
Hermes: memory, cron, messaging, Kanban
LangGraph/CrewAI: optional advanced orchestration
```

---

## 19. MVP Build Plan

### MVP 1: Core and project structure

Deliver:

```text
vibe init
vibeharness.yaml
profiles/
workflows/
skills/
memory/
```

### MVP 2: Capability and skill registry

Normalize capabilities from:

```text
Matt Pocock skills
ECC skills
BMAD skills
SuperClaude-style commands/personas
Spec Kit commands
custom local project skills
```

Deliver:

```text
capability schema
skill metadata loader
stage-based skill selection
target compiler
```

### MVP 3: Workflow compiler

Compile one VibeHarness workflow into:

```text
OpenHands automation/plugin inputs
Archon workflow
Claude Code commands/skills
Cline rules/skills
Codex AGENTS.md/codex.md
Cursor rules/agents/hooks
ECC profiles/hooks
```

### MVP 4: Three flagship workflows

Deliver:

```text
idea-to-pr
issue-to-pr
tdd-feature
```

### MVP 5: Safety gates

Deliver:

```text
git status guard
worktree isolation
test/lint/typecheck gate
ECC AgentShield gate
human approval gate
node-scoped hooks
```

### MVP 6: Agent router

Support:

```text
OpenHands
Aider
Cline
Plandex
Claude Code
Codex
```

### MVP 7: Memory and learning

Generate and update:

```text
CONTEXT.md
ADRs
PRDs
specs
plans
tasks
handoffs
run logs
evals
Hermes proposed memory updates
```

### MVP 8: Hermes sidecar

Deliver:

```text
Hermes memory adapter
Hermes skill-incubation quarantine
Hermes cron trigger adapter
Hermes messaging notification adapter
Hermes Kanban sync adapter
```

---

## 20. Implementation Order for an AI Coding Agent

If an AI agent is building VibeHarness, it should work in this order:

1. Create the repository scaffold.
2. Define the core schemas: project config, workflow, node, capability, profile, memory artifact, safety gate.
3. Implement `vibe init` to create a project-local `.vibe/` structure and `vibeharness.yaml`.
4. Implement the capability registry loader.
5. Implement the profile loader and resolver.
6. Implement the `idea-to-pr` workflow as a static built-in workflow.
7. Implement dry-run rendering of the workflow plan.
8. Implement compile target 1: Archon-compatible YAML.
9. Implement compile target 2: OpenHands plugin/session inputs.
10. Implement ECC profile attachment to each node.
11. Implement deterministic validation gates.
12. Implement memory artifact generation.
13. Implement a minimal Hermes adapter for memory proposals and notifications.
14. Add examples and tests.
15. Add documentation for adding new skills, agents, hooks, workflows, and profiles.

For each implementation stage, the agent should report:

```text
files created or changed
why each file exists
how to run it
how to test it
known limitations
next recommended step
```

---

## 21. Anti-Patterns to Avoid

### 1. Do not load all skills at once

Bad:

```text
Load every skill, every hook, every agent, and every command into one session.
```

Good:

```text
Discovery stage -> product/clarification skills
Planning stage  -> spec/planning skills
Coding stage    -> TDD/backend/frontend skills
Bug stage       -> diagnose/debug skills
Review stage    -> security/review/architecture skills
Release stage   -> docs/deployment/CI skills
```

### 2. Do not make everything autonomous

The best harness is not the one that removes the human.

It is the one that knows when to ask for approval.

### 3. Do not make global hooks the default

Use:

```text
project-scoped hooks
node-scoped hook profiles
explicit safety modes
clear audit logs
```

### 4. Do not make one agent runtime mandatory

Aider, Cline, OpenHands, Plandex, Claude Code, Codex, Cursor, LangGraph, CrewAI, and Hermes should be targets or integrations, not hard dependencies.

### 5. Do not hide memory only in a database

The best memory is committed project knowledge:

```text
specs
ADRs
CONTEXT.md
issue threads
run logs
handoff docs
review notes
```

### 6. Do not let self-improving skills bypass review

Hermes-created or agent-created skills should go through:

```text
quarantine
review
ECC safety check
schema normalization
approval
registry inclusion
```

---

## 22. Final Connected Mental Model

The final system should feel like this:

```text
Spec Kit gives it discipline about what to build.
Matt Pocock skills give it senior-engineer habits.
BMAD gives it product, architecture, development, and QA team thinking.
OpenHands gives it a real coding-agent workshop.
Archon gives it deterministic workflow rails.
ECC gives it operator behavior, hooks, memory policy, and security.
Hermes gives it long-term memory, self-improvement, cron, messaging, and coordination.
Aider, Cline, Plandex, Claude Code, and Codex give it specialized implementation hands.
LangGraph and CrewAI give it custom orchestration muscles.
VibeHarness ties everything together into one portable standard.
```

Or shorter:

> **VibeHarness = OpenHands control plane + Archon workflows + ECC operator policy + Hermes outer memory loop + Spec Kit specs + senior engineering skills + pluggable coding agents + safety gates + persistent memory.**

---

## 23. Final Recommendation

Build VibeHarness as the universal Harness Engineering ecosystem.

Do not make it a monolithic mega-agent. Make it a schema, CLI, profile system, workflow compiler, adapter layer, and memory/safety standard.

The recommended product hierarchy is:

```text
1. VibeHarness
   Universal schema, profiles, adapters, workflows, capability registry, memory and safety contracts.

2. OpenHands
   Primary coding-agent control plane and execution platform.

3. Archon
   Deterministic workflow runner and compile target.

4. ECC
   Operator, security, skills, hooks, MCP, and memory-policy layer.

5. Hermes
   Adaptive memory, skill-learning, messaging, cron, and Kanban coordination sidecar.

6. Spec Kit / Matt skills / BMAD
   Spec, engineering discipline, product thinking, architecture, QA, and handoff.

7. Aider / Cline / Plandex / Claude Code / Codex
   Optional specialized coding backends.
```

The core design rule:

```text
VibeHarness defines.
OpenHands executes.
Archon sequences.
ECC governs.
Hermes remembers.
Spec Kit specifies.
Skills discipline.
Agents implement.
Humans approve.
```

---

## 24. Source Notes

This connected document consolidates the discussion and uploaded notes around:

- Harness Engineering basics and the Archon vs ECC comparison.
- The Archon/ECC integration strategy.
- The prompt-to-code pipeline from idea clarification through production review.
- The GitHub research scan of agentic AI, spec-driven development, reusable skills, coding-agent runtimes, and multi-agent orchestration.
- The revised control-plane decision placing OpenHands as primary.
- The placement of ECC as an operator/security/skills layer.
- The OpenHands vs Hermes comparison, with Hermes retained as the outer learning and coordination layer.

Key referenced ecosystems:

```text
Archon:       https://github.com/coleam00/Archon
ECC:          https://github.com/affaan-m/ECC
OpenHands:    https://github.com/OpenHands/OpenHands
Hermes:       https://hermes-agent.nousresearch.com/docs
Spec Kit:     https://github.com/github/spec-kit
Matt skills:  https://github.com/mattpocock/skills
BMAD:         https://github.com/bmad-code-org/BMAD-METHOD
Aider:        https://github.com/aider-ai/aider
Cline:        https://github.com/Cline/cline
Plandex:      https://github.com/plandex-ai/plandex
LangGraph:    https://github.com/langchain-ai/langgraph
CrewAI:       https://github.com/crewAIInc/crewAI
SWE-agent:    https://github.com/SWE-agent/SWE-agent
```
