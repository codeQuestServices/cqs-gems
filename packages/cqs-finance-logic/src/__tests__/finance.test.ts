import {
  calculateMortgage,
  generateAmortizationSchedule,
  calculateLTV,
  calculateCashFlow,
} from '../index';

describe('@cqs/finance-logic Test Suite', () => {
  describe('Mortgage & Amortization Calculations', () => {
    it('should correctly calculate standard 30-year fixed rate mortgage', () => {
      const result = calculateMortgage({
        homePrice: 400000,
        downPayment: 80000, // 20% down, 320,000 loan
        annualInterestRate: 6.0,
        loanTermYears: 30,
        annualPropertyTax: 4800, // 400 / mo
        annualHomeownersInsurance: 1200, // 100 / mo
        monthlyHOA: 50,
      });

      expect(result.loanAmount).toBe(320000);
      expect(result.downPaymentPercent).toBe(20);
      expect(result.monthlyPrincipalAndInterest).toBe(1918.56);
      expect(result.monthlyPropertyTax).toBe(400);
      expect(result.monthlyInsurance).toBe(100);
      expect(result.monthlyHOA).toBe(50);
      expect(result.totalMonthlyPayment).toBe(2468.56);
      expect(result.totalInterestPaid).toBe(370682.26);
      expect(result.totalCostOfLoan).toBe(690682.26);
    });

    it('should handle zero interest rate or zero loan amount edge cases', () => {
      const zeroLoan = calculateMortgage({
        homePrice: 300000,
        downPayment: 300000,
        annualInterestRate: 5.0,
        loanTermYears: 30,
      });

      expect(zeroLoan.loanAmount).toBe(0);
      expect(zeroLoan.monthlyPrincipalAndInterest).toBe(0);
      expect(zeroLoan.totalInterestPaid).toBe(0);
    });

    it('should generate an accurate amortization schedule', () => {
      const schedule = generateAmortizationSchedule(
        {
          homePrice: 300000,
          downPayment: 60000, // 240,000 loan
          annualInterestRate: 6.0,
          loanTermYears: 30,
        },
        12 // First 12 months
      );

      expect(schedule).toHaveLength(12);
      expect(schedule[0].month).toBe(1);
      expect(schedule[0].interestPayment).toBe(1200); // 240,000 * 0.06 / 12
      expect(schedule[0].remainingBalance).toBeLessThan(240000);
      expect(schedule[11].month).toBe(12);
    });
  });

  describe('Loan-to-Value (LTV) & PMI Analysis', () => {
    it('should require PMI when LTV > 80%', () => {
      const result = calculateLTV({
        loanAmount: 360000,
        appraisedValue: 400000, // 90% LTV
      });

      expect(result.ltvRatio).toBe(90);
      expect(result.requiresPMI).toBe(true);
      expect(result.equityValue).toBe(40000);
      expect(result.equityPercent).toBe(10);
    });

    it('should not require PMI when LTV <= 80%', () => {
      const result = calculateLTV({
        loanAmount: 320000,
        appraisedValue: 400000, // 80% LTV
      });

      expect(result.ltvRatio).toBe(80);
      expect(result.requiresPMI).toBe(false);
      expect(result.equityValue).toBe(80000);
      expect(result.equityPercent).toBe(20);
    });

    it('should handle zero appraised value gracefully', () => {
      const result = calculateLTV({
        loanAmount: 100000,
        appraisedValue: 0,
      });

      expect(result.ltvRatio).toBe(0);
      expect(result.requiresPMI).toBe(false);
      expect(result.equityValue).toBe(0);
    });
  });

  describe('Cash Flow, NOI & Cap Rate Analysis', () => {
    it('should calculate accurate positive cash flow and returns', () => {
      const result = calculateCashFlow({
        grossMonthlyRentalIncome: 3000,
        otherMonthlyIncome: 100, // Total 3100
        monthlyMortgagePayment: 1500,
        monthlyPropertyTax: 300,
        monthlyInsurance: 100,
        monthlyHOA: 50,
        monthlyMaintenanceReserve: 150,
        monthlyVacancyReserve: 150,
        propertyManagementFeePercent: 8, // 8% of 3100 = 248
        propertyPurchasePrice: 400000,
        totalInitialInvestment: 90000,
      });

      // Operating expenses = 300 + 100 + 50 + 150 + 150 + 248 = 998
      expect(result.totalMonthlyIncome).toBe(3100);
      expect(result.operatingExpenses).toBe(998);
      expect(result.netOperatingIncomeMonthly).toBe(2102); // 3100 - 998
      expect(result.netOperatingIncomeAnnual).toBe(25224); // 2102 * 12
      expect(result.monthlyCashFlow).toBe(602); // 2102 - 1500
      expect(result.annualCashFlow).toBe(7224); // 602 * 12
      expect(result.capRate).toBe(6.31); // (25224 / 400000) * 100
      expect(result.cashOnCashReturn).toBe(8.03); // (7224 / 90000) * 100
    });

    it('should handle negative cash flow correctly', () => {
      const result = calculateCashFlow({
        grossMonthlyRentalIncome: 1500,
        monthlyMortgagePayment: 1800,
        monthlyPropertyTax: 250,
        monthlyInsurance: 100,
      });

      expect(result.totalMonthlyIncome).toBe(1500);
      expect(result.operatingExpenses).toBe(350);
      expect(result.netOperatingIncomeMonthly).toBe(1150);
      expect(result.monthlyCashFlow).toBe(-650); // 1150 - 1800
      expect(result.annualCashFlow).toBe(-7800);
    });
  });
});
