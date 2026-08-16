## Immediate State
- Upgrading `apps/calculator-app` from Expo SDK 51 to the latest SDK version to align with Expo Go client on mobile.
- Retaining pure `@cqs/finance-logic` workspace boundary and Metro monorepo resolver.
- Clearing Watchman, Metro, Turborepo, and Yarn lock caches to prevent version mismatch hoisting.

## Recent Decisions
- Chosen Workspace Tooling: Turborepo + Yarn Workspaces
- Chosen Routing Strategy: Expo Router
- Chosen CI/CD Strategy: EAS CLI via GitHub Actions
