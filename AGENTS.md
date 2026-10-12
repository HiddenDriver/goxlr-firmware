## CI cost policy — owner decision 2026-10-13 (takes precedence)

Read [.github/CI_POLICY.md](.github/CI_POLICY.md). Full test suites run locally,
including before production acceptance; never in hosted CI, including manual or
informational runs. Ordinary CI jobs are capped at 5 minutes. Do not add/re-enable
workflows, increase limits, run old branch workflows, repeatedly dispatch unchanged
checks or update the approved workflow inventory without explicit owner permission.
Run `node .github/verify-ci-policy.cjs` before pushing workflow changes and record
exact-SHA local validation evidence in the PR. Existing deployment authorizations
and local migration/security/acceptance gates still apply.

