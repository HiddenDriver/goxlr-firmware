# CI cost policy — owner decision, 2026-10-13

This policy takes precedence over older CI/test-location instructions. Product,
local validation, staging acceptance, production authorization and rollback gates
remain mandatory. Moving tests offline does not waive those gates.

## Allowed in GitHub-hosted CI

- Syntax, lint, type checks, whitespace and policy verification.
- Small named smoke/contract tests only when explicitly allowlisted: no database,
  browser, hardware, live service or network fixtures; test step at most 60 seconds.
- Dependency audit when dependency manifests change or for a release candidate.
- One validation per source change: PR validation, no duplicate post-merge suite.
- Cached locked dependency installation only when the selected checks require it.

## Forbidden, including manual dispatch and informational steps

- Full test suites: npm test, pnpm test, unfiltered Vitest/PHPUnit, unittest discovery.
- E2E/browser/coverage/load/benchmark/fuzz/soak suites and test OS/version matrices.
- Full database integration suites, test migrations against live data, external
  API calls in tests, waiting/polling loops, automatic retries or repeated dispatch
  merely to reproduce unchanged local evidence.
- Non-blocking full suites (continue-on-error is not a cost exception).
- Automatic nightly/daily maintenance, sync or branch hygiene runs.
- Adding workflows, increasing runner size/time limits, re-enabling automatic CI
  or changing the approved-workflow inventory without explicit owner authorization.

## Hard limits and approved exceptions

- Ordinary hosted jobs: timeout-minutes at most 5. Aim for <2 actual minutes.
- Ordinary workflow total timeout budget: at most 10 runner-minutes. Superseded
  validations must use concurrency with cancel-in-progress: true.
- Hosted release packaging: at most 10 minutes/job, explicit release purpose,
  exact source SHA and immutable artifacts. No full tests hidden in build scripts.
- Wuxli is an existing combined release pipeline: production migration/schema,
  packaging and provenance checks are retained; total job timeout ceiling 30.
  Development artifact build/publish stays <=7 minutes combined. Release branch
  publication is serialized and is never cancelled halfway through publication.
- beebots tag/manual image release: three serialized image builds <=10 minutes
  each, plus a <=3 minute static check (33 total). No images on ordinary main pushes.
- SORVILO release candidate: provenance <=2, packaging/audit and named bounded
  release contracts <=10, READY status <=2 (14 total). Production gate <=2.
- Existing self-hosted guarded deployment/acceptance/backup operations are separate
  operational workflows. Their existing safety checks/timeouts remain; they are
  not permission to move full routine CI suites to a self-hosted server.
- PARRALAX automatic CI stays disabled. Manual checks also exclude full suites.
- Reference synchronization and branch hygiene are manual, <=5 minutes.
- Existing Windows bootstrap regression checks move offline; ordinary CI uses Linux.

## Local evidence is required

Before merge, record exact source SHA, local commands, results and limitations in
the PR. Run relevant unit/integration/browser/database tests locally; schema
changes still require a proven local development DB and migration verification.
Production acceptance still requires explicit approval and pinned release evidence.
Agents must not claim reduced CI proves full tests or live acceptance passed.

## Enforcement and changes

Run node .github/verify-ci-policy.cjs locally before pushing any workflow change.
Existing hosted workflows run the same dependency-free check after checkout.
.github/ci-workflows.json pins the approved workflow bytes: additions, removals and
edits fail until the inventory is deliberately updated with owner authorization.
CODEOWNERS routes policy/workflow changes to @HiddenDriver. This does not by itself
make review mandatory: branch protection/rulesets must require owner review and
the policy check to prevent bypass. Repository administrators can alter policies.
Repositories without Actions do not gain automatic CI from this policy.
Old task/release branches must receive the approved policy before any dispatch;
never dispatch old workflows as a workaround. A default-branch merge alone does
not rewrite workflows on other branches.

Billing is separate: a GitHub Actions $0 budget with stop-usage enabled is the
account-level monetary backstop. Do not enable paid usage to get a check through.
Review aggregate monthly usage; job timeouts alone cannot cap repeated runs.
