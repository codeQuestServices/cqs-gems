/**
 * Property Details representing physical and market asset characteristics
 */
export interface PropertyDetails {
  propertyAddress?: string;
  purchasePrice: number;
  appraisedValue?: number;
  annualPropertyTax?: number;
  annualHomeownersInsurance?: number;
  monthlyHOA?: number;
}

/**
 * Mortgage Terms & parameters for loan financing
 */
export interface MortgageTerms {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number; // e.g. 6.5 for 6.5%
  loanTermYears: number;      // e.g. 15, 20, 30
  annualPropertyTax?: number;
  annualHomeownersInsurance?: number;
  monthlyHOA?: number;
}

/**
 * Result of Mortgage breakdown and amortization calculations
 */
export interface MortgageCalculationResult {
  loanAmount: number;
  downPaymentPercent: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterestPaid: number;
  totalCostOfLoan: number;
}

/**
 * Single period entry in an amortization schedule
 */
export interface AmortizationPeriod {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

/**
 * Loan-To-Value (LTV) inputs
 */
export interface LTVInput {
  loanAmount: number;
  appraisedValue: number;
  annualPMIRatePercent?: number;
}

/**
 * Loan-To-Value (LTV) & PMI analysis results
 */
export interface LTVResult {
  ltvRatio: number; // percentage e.g. 80.0
  requiresPMI: boolean;
  equityValue: number;
  equityPercent: number;
  estimatedMonthlyPMI: number;
  amountNeededToReach80LTV: number;
}

/**
 * Cash Flow & Real Estate Investment Analysis inputs
 */
export interface CashFlowInput {
  grossMonthlyRentalIncome: number;
  otherMonthlyIncome?: number;
  monthlyMortgagePayment: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA?: number;
  monthlyMaintenanceReserve?: number;
  monthlyVacancyReserve?: number;
  propertyManagementFeePercent?: number; // e.g. 8 for 8%
  totalInitialInvestment?: number;       // Down payment + closing costs + initial repairs
  propertyPurchasePrice?: number;
}

/**
 * Cash Flow & Real Estate Investment Analysis results
 */
export interface CashFlowResult {
  totalMonthlyIncome: number;
  operatingExpenses: number;
  netOperatingIncomeMonthly: number; // NOI (Monthly, before debt service)
  netOperatingIncomeAnnual: number;  // NOI (Annual, before debt service)
  monthlyCashFlow: number;           // Net cash flow (after debt service)
  annualCashFlow: number;            // Net annual cash flow
  capRate?: number;                  // Capitalization Rate % (Annual NOI / Purchase Price)
  cashOnCashReturn?: number;         // Cash on Cash Return % (Annual Cash Flow / Total Invested)
}

/**
 * Managed Portfolio Property model
 */
export type PropertyType = 'PRIMARY' | 'RENTAL' | 'COMMERCIAL';

export interface PortfolioProperty {
  id: string;
  name: string;
  address: string;
  propertyType: PropertyType;
  marketValue: number;
  loanBalance: number;
  monthlyMortgagePAndI: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  monthlyMaintenance: number;
  monthlyRentIncome: number;
  purchaseDate?: string;
  financedDate?: string;
  tenantName?: string;
}

/**
 * Aggregate summary across a collection of properties in a portfolio
 */
export interface PortfolioSummary {
  totalAssetValue: number;
  totalMortgageDebt: number;
  netRealEstateEquity: number;
  equitySharePercent: number;
  blendedLTV: number;
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netMonthlyCashFlow: number;
  netAnnualCashFlow: number;
  annualizedNOI: number;
  portfolioCapRate: number;
  breakdown: {
    rentIncome: number;
    mortgagePAndI: number;
    taxes: number;
    insurance: number;
    hoaAndMaintenance: number;
    netCashFlow: number;
  };
}

// Aliases for backward compatibility
export type MortgageInput = MortgageTerms;
