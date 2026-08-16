# Cloud Architecture & Infrastructure: cqs-gems

## CI/CD & Deployment Pipeline
- **Platform**: GitHub Actions + EAS (Expo Application Services)
- **CI Workflow** (`.github/workflows/main.yml`):
  - Triggers: Push to `main`, Pull Requests to `main`
  - Jobs:
    1. **Validate**: Yarn install with caching, Turborepo lint, typecheck, and unit test execution across all workspaces.
    2. **EAS Build / Preview**: Trigger EAS build using `expo/expo-github-action` when `EXPO_TOKEN` is configured.

## Required Environment Variables & Secrets
- `EXPO_TOKEN`: Personal / Robot access token from expo.dev for EAS automated builds.
