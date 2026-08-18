# Cloud Architecture & Infrastructure: cqs-gems

## CI/CD & Deployment Pipeline
- **Platform**: GitHub Actions + EAS (Expo Application Services)
- **Runner Environment**: Node.js 22 LTS on `ubuntu-latest`
- **CI Workflow** (`.github/workflows/main.yml`):
  - Triggers: Push to `main`, Pull Requests to `main`
  - Jobs:
    1. **Validate**: Yarn install with caching, Turborepo lint, typecheck, and unit test execution across all workspaces.
    2. **EAS Build / Preview & Production**:
       - Preview APK: `eas build --profile preview --platform android --non-interactive`
       - Production AAB (`app-bundle`): `eas build --profile production --platform android` for `apps/propgem` using `expo/expo-github-action@v8` when `EXPO_TOKEN` secret is configured.


## Required Environment Variables & Secrets
- `EXPO_TOKEN`: Personal / Robot access token from expo.dev for EAS automated builds.
