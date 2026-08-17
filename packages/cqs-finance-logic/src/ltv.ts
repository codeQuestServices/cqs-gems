import { LTVInput, LTVResult } from './types';

/**
 * Calculates Loan-To-Value (LTV) ratio and identifies Private Mortgage Insurance (PMI) requirement.
 */
export function calculateLTV(input: LTVInput): LTVResult {
  const { loanAmount, appraisedValue, annualPMIRatePercent = 0.5 } = input;

  if (appraisedValue <= 0) {
    return {
      ltvRatio: 0,
      requiresPMI: false,
      equityValue: 0,
      equityPercent: 0,
      estimatedMonthlyPMI: 0,
      amountNeededToReach80LTV: 0,
    };
  }

  const ltvRatio = (loanAmount / appraisedValue) * 100;
  const requiresPMI = ltvRatio > 80;
  const equityValue = Math.max(0, appraisedValue - loanAmount);
  const equityPercent = Math.max(0, 100 - ltvRatio);

  const maxLoanForNoPMI = appraisedValue * 0.8;
  const amountNeededToReach80LTV = requiresPMI ? Math.max(0, loanAmount - maxLoanForNoPMI) : 0;
  const estimatedMonthlyPMI = requiresPMI ? (loanAmount * (annualPMIRatePercent / 100)) / 12 : 0;

  return {
    ltvRatio: round(ltvRatio, 2),
    requiresPMI,
    equityValue: round(equityValue, 2),
    equityPercent: round(equityPercent, 2),
    estimatedMonthlyPMI: round(estimatedMonthlyPMI, 2),
    amountNeededToReach80LTV: round(amountNeededToReach80LTV, 2),
  };
}

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
