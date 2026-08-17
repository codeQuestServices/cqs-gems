# Project Brief: cqs-gems

## Overview
`cqs-gems` is a cross-platform mobile application monorepo ecosystem targeting real estate finance, analytics, and portfolio dashboard applications.

## Initial App
- **PropGem (`apps/propgem`)**: Real Estate Investment & Expense Dashboard + Calculators (Mortgage, LTV, Cash Flow, Amortizations).

## Future Roadmap
- Scaling to a complex real estate portfolio dashboard, multi-property management, and financial modeling tools under a unified domain.

## Core Architectural Decisions
- **Workspace Tooling**: Turborepo with Yarn Workspaces (Node / TypeScript).
- **Routing Strategy**: Expo Router (file-based routing, deep linking, cross-platform layouts).
- **CI/CD**: EAS (Expo Application Services) CLI orchestrated via GitHub Actions.
- **Shared Logic**: Isolated TypeScript/JavaScript libraries under `packages/` (starting with `cqs-finance-logic`).
