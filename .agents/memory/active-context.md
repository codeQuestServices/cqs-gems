## Immediate State
- Implemented `@cqs/finance-logic` with domain types (`types.ts`), pure engines (`mortgage.ts`, `ltv.ts`, `cashFlow.ts`), clean entrypoint (`index.ts`), and Jest unit test suite (`finance.test.ts`).
- Configured Jest test environment in `packages/cqs-finance-logic` with `ts-jest`.
- Built dark-mode mobile UI for `calculator-app` using Expo Router with navigation across Mortgage, LTV, and Cash Flow calculators.
- Connected all UI screens directly to `@cqs/finance-logic`.

## Recent Decisions
- Chosen Workspace Tooling: Turborepo + Yarn Workspaces
- Chosen Routing Strategy: Expo Router
- Chosen CI/CD Strategy: EAS CLI via GitHub Actions
