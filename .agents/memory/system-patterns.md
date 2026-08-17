# System Patterns: cqs-gems

## Monorepo Architecture
- **Package Manager**: Yarn Workspaces (`package.json` workspaces: `["apps/*", "packages/*"]`)
- **Orchestration & Caching**: Turborepo (`turbo.json`)
- **Structure**:
  ```
  cqs-gems/
  ├── .github/
  │   └── workflows/
  │       └── main.yml        # CI/CD: lint, test, typecheck & EAS build preview/production
  ├── apps/
  │   └── propgem/            # PropGem Expo application with Expo Router (Bottom Tabs)
  ├── packages/
  │   └── cqs-finance-logic/  # Shared TypeScript financial calculation engines (LTV, cash flow, amortization)
  ├── package.json            # Root workspace configuration
  ├── turbo.json              # Turborepo task graph pipeline
  └── tsconfig.base.json      # Shared TypeScript base config
  ```

## Codebase Standards
- Pure domain logic must reside in `packages/*` without UI dependencies to maximize testability and reusability across apps.
- UI components, screens, and platform integrations reside in `apps/*`.
- Use TypeScript strict mode across all workspaces.
- Monorepo package resolution uses workspace protocols (e.g. `"@cqs/finance-logic": "workspace:*"` or `"*"`).
