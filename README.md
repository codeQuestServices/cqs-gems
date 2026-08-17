# CQS-GEMS Monorepo

Cross-platform mobile application monorepo ecosystem targeting real estate finance, analytics, and portfolio dashboard applications. Built with **React Native**, **Expo (Expo Router)**, **Turborepo**, and **Yarn Workspaces**, with CI/CD automated via **GitHub Actions** and **EAS (Expo Application Services)**.

---

## 🏛 Workspace Architecture

```
cqs-gems/
├── .github/
│   └── workflows/
│       └── main.yml                  # CI/CD: lint, test, typecheck & EAS build preview
├── apps/
│   └── propgem/                      # PropGem Expo App with Expo Router (Bottom Tabs)
│       ├── app/
│       │   ├── (tabs)/               # Bottom Tab routes (Portfolio, Mortgage, LTV, Cash Flow)
│       │   ├── _layout.tsx           # Dark theme Stack layout & Context Provider
│       │   └── add-property.tsx      # Add property modal sheet
│       ├── app.json                  # Expo config with scheme & bundle identifiers
│       ├── eas.json                  # EAS build configurations (dev, preview, prod)
│       └── metro.config.js           # Monorepo-aware Metro configuration
├── packages/
│   └── cqs-finance-logic/            # Pure TypeScript financial calculation engine
│       └── src/
│           ├── types.ts              # Financial domain types & portfolio models
│           ├── mortgage.ts           # P&I, amortization schedules, taxes, insurance
│           ├── ltv.ts                # LTV calculations & PMI requirements
│           ├── cashFlow.ts           # NOI, Cap Rate, Cash-on-Cash return
│           ├── portfolio.ts          # Multi-property portfolio summary aggregator
│           └── index.ts              # Public library exports
├── .agents/memory/                   # Autonomous context tracking bank
├── package.json                      # Monorepo root with Yarn Workspaces
├── turbo.json                        # Turborepo task pipeline graph
└── tsconfig.base.json                # Shared TypeScript base configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18 (Node 20 recommended)
- Yarn v1 (`1.22.x`)

### Installation
```bash
# Install dependencies across all workspaces
yarn install
```

### Development
```bash
# Run all workspaces in dev mode
yarn dev

# Run only the PropGem app
yarn dev --filter=propgem
# or
yarn workspace propgem start
```

### Validation
```bash
# Typecheck all workspaces
yarn typecheck

# Run tests
yarn test

# Linting
yarn lint
```

---

## 📱 Apps

| App Name | Description | Routing |
|---|---|---|
| **PropGem (`apps/propgem`)** | Native Real Estate Investment & Expense Dashboard + Calculators (Mortgage, LTV, Cash Flow) | Expo Router (Bottom Tabs) |

---

## 📦 Packages

| Package | Description | Target |
|---|---|---|
| **@cqs/finance-logic** | Isolated mathematical engines for mortgages, amortization, LTV, and rental cash flows | Pure TypeScript (Node/Web/Native) |

---

## ⚙️ CI/CD & Cloud Builds

Continuous integration is handled by **GitHub Actions** (`.github/workflows/main.yml`):
- **Validation**: Parallel typechecking, linting, and testing across workspaces on all PRs and pushes.
- **EAS Build**: Automated preview cloud builds on push to `main` when `EXPO_TOKEN` secret is configured in GitHub repository settings.
