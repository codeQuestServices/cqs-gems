import { CashFlowInput, CashFlowResult } from './types';

/**
 * Calculates rental property cash flow, NOI, Cap Rate, and Cash-on-Cash return.
 */
export function calculateCashFlow(input: CashFlowInput): CashFlowResult {
  const {
    grossMonthlyRentalIncome,
    otherMonthlyIncome = 0,
    monthlyMortgagePayment,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHOA = 0,
    monthlyMaintenanceReserve = 0,
    monthlyVacancyReserve = 0,
    propertyManagementFeePercent = 0,
    totalInitialInvestment = 0,
    propertyPurchasePrice = 0,
  } = input;

  const totalMonthlyIncome = grossMonthlyRentalIncome + otherMonthlyIncome;
  const managementFee = (totalMonthlyIncome * propertyManagementFeePercent) / 100;

  // Operating expenses (excluding debt service/mortgage principal & interest)
  const operatingExpenses =
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyHOA +
    monthlyMaintenanceReserve +
    monthlyVacancyReserve +
    managementFee;

  const netOperatingIncomeMonthly = totalMonthlyIncome - operatingExpenses;
  const netOperatingIncomeAnnual = netOperatingIncomeMonthly * 12;

  // Monthly cash flow after debt service
  const monthlyCashFlow = netOperatingIncomeMonthly - monthlyMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // Cap Rate = Annual NOI / Property Purchase Price * 100
  let capRate: number | undefined;
  if (propertyPurchasePrice > 0) {
    capRate = round((netOperatingIncomeAnnual / propertyPurchasePrice) * 100, 2);
  }

  // Cash on Cash Return = Annual Cash Flow / Total Initial Investment * 100
  let cashOnCashReturn: number | undefined;
  if (totalInitialInvestment > 0) {
    cashOnCashReturn = round((annualCashFlow / totalInitialInvestment) * 100, 2);
  }

  return {
    totalMonthlyIncome: round(totalMonthlyIncome),
    operatingExpenses: round(operatingExpenses),
    netOperatingIncomeMonthly: round(netOperatingIncomeMonthly),
    netOperatingIncomeAnnual: round(netOperatingIncomeAnnual),
    monthlyCashFlow: round(monthlyCashFlow),
    annualCashFlow: round(annualCashFlow),
    capRate,
    cashOnCashReturn,
  };
}

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
