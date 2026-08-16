import { MortgageInput, MortgageCalculationResult, AmortizationPeriod } from './types';

/**
 * Calculates monthly mortgage payments, including P&I, taxes, insurance, and HOA.
 */
export function calculateMortgage(input: MortgageInput): MortgageCalculationResult {
  const {
    homePrice,
    downPayment,
    annualInterestRate,
    loanTermYears,
    annualPropertyTax = 0,
    annualHomeownersInsurance = 0,
    monthlyHOA = 0,
  } = input;

  const loanAmount = Math.max(0, homePrice - downPayment);
  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const totalMonths = loanTermYears * 12;

  const monthlyTax = annualPropertyTax / 12;
  const monthlyInsurance = annualHomeownersInsurance / 12;

  if (loanAmount === 0 || totalMonths === 0) {
    return {
      loanAmount: 0,
      downPaymentPercent,
      monthlyPrincipalAndInterest: 0,
      monthlyPropertyTax: round(monthlyTax),
      monthlyInsurance: round(monthlyInsurance),
      monthlyHOA: round(monthlyHOA),
      totalMonthlyPayment: round(monthlyTax + monthlyInsurance + monthlyHOA),
      totalInterestPaid: 0,
      totalCostOfLoan: 0,
    };
  }

  const monthlyRate = (annualInterestRate / 100) / 12;

  let monthlyPAndI = 0;
  if (monthlyRate === 0) {
    monthlyPAndI = loanAmount / totalMonths;
  } else {
    monthlyPAndI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalCostOfLoan = monthlyPAndI * totalMonths;
  const totalInterestPaid = Math.max(0, totalCostOfLoan - loanAmount);
  const totalMonthlyPayment = monthlyPAndI + monthlyTax + monthlyInsurance + monthlyHOA;

  return {
    loanAmount: round(loanAmount),
    downPaymentPercent: round(downPaymentPercent, 2),
    monthlyPrincipalAndInterest: round(monthlyPAndI),
    monthlyPropertyTax: round(monthlyTax),
    monthlyInsurance: round(monthlyInsurance),
    monthlyHOA: round(monthlyHOA),
    totalMonthlyPayment: round(totalMonthlyPayment),
    totalInterestPaid: round(totalInterestPaid),
    totalCostOfLoan: round(totalCostOfLoan),
  };
}

/**
 * Generates an amortization schedule for a given mortgage.
 */
export function generateAmortizationSchedule(
  input: MortgageInput,
  maxPeriods?: number
): AmortizationPeriod[] {
  const {
    homePrice,
    downPayment,
    annualInterestRate,
    loanTermYears,
  } = input;

  const loanAmount = Math.max(0, homePrice - downPayment);
  const totalMonths = loanTermYears * 12;
  const monthlyRate = (annualInterestRate / 100) / 12;

  const schedule: AmortizationPeriod[] = [];
  let remainingBalance = loanAmount;

  if (loanAmount === 0 || totalMonths === 0) return schedule;

  let monthlyPAndI = 0;
  if (monthlyRate === 0) {
    monthlyPAndI = loanAmount / totalMonths;
  } else {
    monthlyPAndI =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const limit = maxPeriods ? Math.min(totalMonths, maxPeriods) : totalMonths;

  for (let month = 1; month <= limit; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = Math.min(remainingBalance, monthlyPAndI - interestPayment);
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      month,
      principalPayment: round(principalPayment),
      interestPayment: round(interestPayment),
      totalPayment: round(principalPayment + interestPayment),
      remainingBalance: round(remainingBalance),
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
}

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
