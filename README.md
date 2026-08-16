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
│   └── calculator-app/               # Expo app with Expo Router
│       ├── app/
│       │   ├── _layout.tsx           # Dark theme Stack layout
│       │   ├── index.tsx             # Mortgage & monthly payment calculator
│       │   ├── ltv.tsx               # Loan-To-Value & PMI analysis
│       │   └── cash-flow.tsx         # Real estate cash flow & Cap Rate engine
│       ├── app.json                  # Expo config with typed routes & scheme
│       ├── eas.json                  # EAS build configurations (dev, preview, prod)
│       └── metro.config.js           # Monorepo-aware Metro configuration
├── packages/
│   └── cqs-finance-logic/            # Pure TypeScript financial calculation engine
│       └── src/
│           ├── types.ts              # Financial domain types
│           ├── mortgage.ts           # P&I, amortization schedules, taxes, insurance
│           ├── ltv.ts                # LTV calculations & PMI requirements
│           ├── cashFlow.ts           # NOI, Cap Rate, Cash-on-Cash return
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

# Run only the calculator app
yarn dev --filter=calculator-app
# or
cd apps/calculator-app && yarn start
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
| **calculator-app** | Homeownership & Payment Calculator (Mortgage, LTV, Cash Flow) | Expo Router (file-based) |

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
