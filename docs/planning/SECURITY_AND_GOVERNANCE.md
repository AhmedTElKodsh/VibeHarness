# Security and Governance Plan

Generated: 2026-06-13

## Security objective

Make AI-assisted software development auditable, least-privilege, and policy-governed without destroying the speed benefits of coding agents.

## Threat model

### Assets

- Source code.
- Credentials and secrets.
- Production systems.
- Customer/user data.
- Project memory and skills.
- CI/CD configuration.
- Dependency supply chain.
- Run logs and artifacts.

### Risks

- Agent reads or leaks secrets.
- Agent executes destructive commands.
- Agent installs malicious or unnecessary dependencies.
- Agent changes CI/CD or deployment config without review.
- Agent-generated skill introduces unsafe behavior.
- Memory drift causes future incorrect actions.
- Adapter backend performs unlogged actions.
- Human reviewer cannot reconstruct what happened.

## Default policy posture

- Secrets: deny by default.
- Destructive commands: require approval.
- Dependency changes: require approval.
- External network actions: require approval unless explicitly allowed.
- Production deploys: deny in MVP.
- Skill activation: approved skills only.
- New skills: quarantine.
- Memory writes: proposal-only.
- File writes: allowed only inside repo/workspace unless policy expands scope.

## ECC policy responsibilities

ECC owns:

- pre-flight policy checks;
- runtime approval prompts where supported;
- post-run policy audit;
- skills governance;
- hook governance;
- tool permissions;
- sandbox posture;
- risk reporting.

## Policy gates by stage

| Stage | Required gate |
|---|---|
| Intake | Repo and config allowed. |
| Planning | No secret ingestion. |
| Architecture | Public contract changes require ADR proposal. |
| Task packaging | Agent context is least-privilege. |
| Build | Commands and file access comply with policy. |
| Test | Test commands are allowed. |
| Review | Policy violations are summarized. |
| Handoff | Sensitive information is redacted. |
| Memory/skills | Proposal-only unless approved. |

## Policy decision contract

Every policy check emits one of five decisions:

| Decision | Meaning |
|---|---|
| `allow` | Action can proceed and is recorded. |
| `warn` | Action can proceed but the run records a non-blocking finding. |
| `approval_required` | Workflow pauses until a human approves or rejects the action. |
| `deny` | Action is blocked and the stage fails unless the workflow explicitly handles the denial. |
| `quarantine` | Proposed memory, skill, hook, or generated behavior is isolated for review and cannot become active automatically. |

Minimum decision fields:

- decision ID;
- run ID;
- stage ID;
- action type;
- resource;
- decision;
- reason;
- policy rule ID;
- requested approval actor when applicable;
- timestamp;
- artifact/log references.

## MVP policy behavior mapping

The MVP policy classifier must use this default mapping unless `.vibeharness/policy.yaml` explicitly narrows or expands a rule:

| Action class | Default decision | Required runner behavior |
|---|---|---|
| Read project docs and non-sensitive source files inside the repo | `allow` | Continue and record the decision. |
| Generate or edit non-sensitive docs/artifacts inside the repo | `allow` | Continue and record changed artifact references. |
| Run configured validation commands from project config | `allow` | Continue and record command output. |
| Access files outside the repo/workspace | `deny` | Block the action and mark the stage `blocked` or `failed` with a policy violation. |
| Read secrets, env files, tokens, private keys, or credential stores | `deny` | Block the action and redact any attempted resource value. |
| Execute destructive shell commands | `approval_required` | Pause or return an approval-required result; do not execute until approved. |
| Add or upgrade dependencies | `approval_required` | Pause or return an approval-required result; record requested package names when known. |
| Use external network actions not explicitly allowed | `approval_required` | Pause or return an approval-required result. |
| Access production systems or deploy | `deny` | Block the action in MVP. |
| Activate approved skills | `allow` | Continue and record skill name/version. |
| Activate draft, unknown, or modified skills | `quarantine` | Do not activate; emit a skill proposal or quarantine artifact. |
| Commit memory updates automatically | `quarantine` | Do not write committed project truth; emit a memory proposal. |
| Adapter returns malformed or missing required artifacts | `deny` | Fail normalization and mark the stage `failed`. |

`approval_required` is P0 behavior. The MVP must produce a deterministic approval artifact and state transition even if interactive approval handling is minimal.

## Approval classes

### Low risk

- Reading project docs.
- Editing non-sensitive source files within task scope.
- Running configured test commands.
- Generating docs.

### Medium risk

- Adding dependencies.
- Modifying build config.
- Changing public APIs.
- Modifying CI workflows.
- Writing new skills.

### High risk

- Reading secrets.
- Running destructive commands.
- Modifying deployment config.
- Accessing production systems.
- Publishing packages.
- Auto-merging PRs.

## Minimum audit log

Every run should capture:

- run ID;
- user intent;
- workflow profile;
- adapter used;
- stage states;
- approvals requested and outcome;
- commands run;
- files changed;
- policy violations;
- tests run;
- artifacts generated;
- handoff summary.

## Secret handling

- Never embed secrets in project files.
- Never include secrets in task packages.
- Redact sensitive environment variables in logs.
- Require explicit policy for any secret reference.
- Prefer short-lived scoped credentials where integrations eventually need them.

## Skill governance

Skill lifecycle:

```text
draft -> quarantined -> reviewed -> approved -> active -> deprecated -> removed
```

Promotion requires:

- clear purpose;
- bounded trigger conditions;
- no broad dangerous instructions;
- test example or fixture;
- owner approval;
- ECC review.

## Memory governance

Memory lifecycle:

```text
observed -> proposed -> reviewed -> accepted/rejected -> committed project truth
```

Memory proposals must include:

- source run;
- evidence;
- proposed text;
- scope;
- risk rating;
- expiration/review date when applicable.

## CI/security checks for MVP

- Schema validation.
- Unit tests.
- Fixture workflow tests.
- Static checks for secrets in generated artifacts.
- Policy simulation tests.
- Adapter contract tests.
- Policy decision schema tests.

## Governance principle

The system should make safe paths fast and unsafe paths explicit, reviewable, and blocked until approved.
