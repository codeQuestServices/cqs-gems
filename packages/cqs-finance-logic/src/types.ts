export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number; // percentage, e.g. 6.5 for 6.5%
  loanTermYears: number;      // e.g. 15 or 30
  annualPropertyTax?: number;
  annualHomeownersInsurance?: number;
  monthlyHOA?: number;
}

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

export interface AmortizationPeriod {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface LTVInput {
  loanAmount: number;
  appraisedValue: number;
}

export interface LTVResult {
  ltvRatio: number; // percentage e.g. 80
  requiresPMI: boolean;
  equityValue: number;
  equityPercent: number;
}

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
  totalInitialInvestment?: number;       // Down payment + closing costs + rehab
  propertyPurchasePrice?: number;
}

export interface CashFlowResult {
  totalMonthlyIncome: number;
  operatingExpenses: number;
  netOperatingIncomeMonthly: number; // NOI without debt service
  netOperatingIncomeAnnual: number;
  monthlyCashFlow: number;           // Net cash flow after mortgage/debt service
  annualCashFlow: number;
  capRate?: number;                  // Capitalization Rate %
  cashOnCashReturn?: number;         // Cash on Cash Return %
}
