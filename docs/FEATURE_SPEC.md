# PropGem Mobile App: Feature Specification & Architecture Guide

## Overview
**PropGem** is a mobile real estate finance and investment portfolio application built inside the `cqs-gems` monorepo. It empowers homeowners, prospective buyers, and real estate investors to analyze property financing, calculate loan metrics, monitor cash flow, evaluate risk, and manage portfolio equity.

---

## 1. Core UI/UX Foundation

### 1.1 Safe Area & Dynamic Soft-Key Handling
- **Integration**: `react-native-safe-area-context` wraps the root application layout (`<SafeAreaProvider>`) and is consumed via `useSafeAreaInsets()`.
- **Dynamic Inset Computation**:
  - **Bottom Tab Bar**: Dynamically adjusts height and bottom padding based on `insets.bottom`. On devices with physical/software 3-button navigation bars (Android soft-keys), it provides explicit baseline padding (`Math.max(insets.bottom, 12)`). On edge-to-edge gesture navigations and iOS Home Indicators, it smoothly avoids touch collision.
  - **Sticky Action Buttons & Modal Footers**: Floating action buttons (`Add Property`, `Calculate`, `Export`) and modal dismissal footers calculate `paddingBottom: insets.bottom + 16` to prevent clipped touch targets.
  - **Header & Status Bar Alignment**: Top padding dynamically adapts to notches, Dynamic Island, and Android status bars.
- **Orientation & Viewport Safety**: All scroll views include `contentContainerStyle` with bottom insets to ensure content never scrolls behind system navigation bars.

### 1.2 Design System & Visual Identity
- **High-Contrast Dark Theme**:
  - Background Base: Zinc `#09090B` / `#090D16`
  - Surface Containers: `#18181B` / `#131D2F`
  - Subtle Borders: Zinc `#27272A` / `#1E293B`
  - Accent Palette:
    - **Gold / Amber (`#F59E0B` / `#FBBF24`)**: Net Equity, Primary Highlights, Accent CTA
    - **Emerald / Green (`#10B981` / `#4ADE80`)**: Positive Cash Flow, Cap Rate, Safe LTV
    - **Rose / Red (`#EF4444` / `#F87171`)**: Negative Outflow, Debt Service, PMI Warning
    - **Sky / Blue (`#38BDF8` / `#60A5FA`)**: Metric Accents, Active Tabs, Sliders
- **Haptic Feedback (`expo-haptics`)**:
  - `Haptics.selectionAsync()` triggered on slider adjustments and filter tab switches.
  - `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on quick down payment chips and calculation resets.
  - `Haptics.notificationAsync(NotificationFeedbackType.Success)` upon adding or deleting properties.

---

## 2. Homeowner & Homebuyer Calculator Focus

### 2.1 Hybrid Slider & Numerical Text Inputs
- **Bi-directional Synchronization**: Sliders update numerical text boxes in real time; direct keyboard typing immediately adjusts slider track positions.
- **Smart Formatting**: Currency inputs automatically format with localized commas (`$450,000`), percentages display with precision suffixes (`6.5%`), and loan terms toggle between standard 15-year and 30-year presets.
- **Granular Step Intervals**: Configurable step increments ($5,000 for home price, 0.125% for mortgage interest rates).

### 2.2 Stacked Outflow Breakdown Chart
- **Visual Composition**: Horizontal stacked progress bar illustrating monthly outlay components:
  1. Principal & Interest (P&I)
  2. Property Tax
  3. Homeowner's Insurance
  4. HOA Dues
  5. Private Mortgage Insurance (PMI)
- **Interactive Legend**: Displays exact dollar amount and percentage share of total monthly payment for each expense category.

### 2.3 PMI Auto-Detection & Equity Milestone Indicator
- **LTV Rule Engine**: Utilizes `@cqs/finance-logic` `calculateLTV` to evaluate Loan-to-Value ratios.
- **PMI Warning Threshold**:
  - **LTV > 80%**: Displays amber/red warning banner, calculates estimated monthly PMI fee, and shows dollar amount needed to eliminate PMI.
  - **LTV ≤ 80%**: Displays emerald badge confirming conventional equity safety without PMI requirements.

---

## 3. Investor Portfolio & Dashboard Focus

### 3.1 Cash Flow & Return On Investment Engine
- **Net Operating Income (NOI)**: Gross rental income minus operating expenses (property taxes, insurance, HOA, maintenance reserve, vacancy reserve, and management fees), computed both monthly and annualized.
- **Capitalization Rate (Cap Rate %)**: Annual NOI divided by property purchase price.
- **Cash-on-Cash Return (CoC %)**: Annual net cash flow divided by total initial investment (down payment + closing costs + renovation).
- **Interactive Expense Controls**: Sliders and numerical inputs for vacancy rates (3–10%), maintenance reserves (5–10%), and property management fees (0–12%).

### 3.2 Sticky Portfolio KPI Summary
- **Persistent Header/Footer Strip**: High-contrast summary bar displaying:
  - **Net Real Estate Equity**: Aggregated market value minus outstanding loan balances.
  - **Total Mortgage Debt**: Total outstanding debt across active holdings.
  - **Net Monthly Cash Flow**: Portfolio-wide net monthly cash distribution.
  - **Blended LTV & Cap Rate**: Portfolio-wide risk and return metrics.
- **Filterable Asset Views**: Dynamic segmentation by `All`, `Owner Occupied (Primary)`, and `Rentals`.

### 3.3 Property CRUD & Real-Time Portfolio Recalculation
- Seamless property addition modal with immediate reactive recalculation of portfolio metrics.
- Support for property metadata: rental income, tenant name, purchase date, and financing parameters.
