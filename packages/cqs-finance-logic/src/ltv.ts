import { LTVInput, LTVResult } from './types';

/**
 * Calculates Loan-To-Value (LTV) ratio and identifies Private Mortgage Insurance (PMI) requirement.
 */
export function calculateLTV(input: LTVInput): LTVResult {
  const { loanAmount, appraisedValue } = input;

  if (appraisedValue <= 0) {
    return {
      ltvRatio: 0,
      requiresPMI: false,
      equityValue: 0,
      equityPercent: 0,
    };
  }

  const ltvRatio = (loanAmount / appraisedValue) * 100;
  const requiresPMI = ltvRatio > 80;
  const equityValue = Math.max(0, appraisedValue - loanAmount);
  const equityPercent = Math.max(0, 100 - ltvRatio);

  return {
    ltvRatio: round(ltvRatio, 2),
    requiresPMI,
    equityValue: round(equityValue, 2),
    equityPercent: round(equityPercent, 2),
  };
}

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
