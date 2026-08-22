import {
  MortgageInput,
  MortgageCalculationResult,
  AmortizationPeriod,
  AmortizationMonth,
  AmortizationScheduleInput,
} from './types';

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

  const roundedMonthlyPAndI = round(monthlyPAndI);
  const roundedMonthlyTax = round(monthlyTax);
  const roundedMonthlyInsurance = round(monthlyInsurance);
  const roundedMonthlyHOA = round(monthlyHOA);

  const totalCostOfLoan = round(roundedMonthlyPAndI * totalMonths);
  const totalInterestPaid = Math.max(0, round(totalCostOfLoan - loanAmount));
  const totalMonthlyPayment = round(
    roundedMonthlyPAndI + roundedMonthlyTax + roundedMonthlyInsurance + roundedMonthlyHOA
  );

  return {
    loanAmount: round(loanAmount),
    downPaymentPercent: round(downPaymentPercent, 2),
    monthlyPrincipalAndInterest: roundedMonthlyPAndI,
    monthlyPropertyTax: roundedMonthlyTax,
    monthlyInsurance: roundedMonthlyInsurance,
    monthlyHOA: roundedMonthlyHOA,
    totalMonthlyPayment,
    totalInterestPaid,
    totalCostOfLoan,
  };
}

/**
 * Calculates a comprehensive month-by-month amortization schedule with dynamic PMI drop-off tracking.
 */
export function calculateAmortizationSchedule(
  input: AmortizationScheduleInput
): AmortizationMonth[] {
  const {
    loanAmount,
    annualInterestRate,
    loanTermYears,
    propertyValue,
    pmiMonthly = 0,
    pmiDropOffLtv = 0.80,
  } = input;

  const totalMonths = Math.max(0, loanTermYears * 12);
  const schedule: AmortizationMonth[] = [];

  if (loanAmount <= 0 || totalMonths <= 0) {
    return schedule;
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

  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (remainingBalance <= 0) {
      schedule.push({
        month,
        payment: 0,
        principal: 0,
        interest: 0,
        pmi: 0,
        totalPayment: 0,
        remainingBalance: 0,
        cumulativeInterest: round(cumulativeInterest),
        isPmiActive: false,
      });
      continue;
    }

    const interest = remainingBalance * monthlyRate;
    let principal = monthlyPAndI - interest;

    if (month === totalMonths || principal >= remainingBalance) {
      principal = remainingBalance;
      remainingBalance = 0;
    } else {
      remainingBalance = Math.max(0, remainingBalance - principal);
    }

    cumulativeInterest += interest;

    const currentLtv = propertyValue > 0 ? remainingBalance / propertyValue : 0;
    const isPmiActive = propertyValue > 0 && currentLtv > (pmiDropOffLtv + 1e-9);
    const activePmi = isPmiActive ? pmiMonthly : 0;

    const roundedPrincipal = round(principal);
    const roundedInterest = round(interest);
    const roundedPayment = round(roundedPrincipal + roundedInterest);
    const roundedPmi = round(activePmi);
    const roundedTotalPayment = round(roundedPayment + roundedPmi);
    const roundedBalance = round(remainingBalance);
    const roundedCumulativeInterest = round(cumulativeInterest);

    schedule.push({
      month,
      payment: roundedPayment,
      principal: roundedPrincipal,
      interest: roundedInterest,
      pmi: roundedPmi,
      totalPayment: roundedTotalPayment,
      remainingBalance: roundedBalance,
      cumulativeInterest: roundedCumulativeInterest,
      isPmiActive,
    });
  }

  return schedule;
}

/**
 * Generates an amortization schedule for a given mortgage (legacy helper).
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
