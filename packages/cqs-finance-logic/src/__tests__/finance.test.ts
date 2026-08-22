import {
  calculateMortgage,
  calculateAmortizationSchedule,
  generateAmortizationSchedule,
  calculateLTV,
  calculateCashFlow,
  calculatePortfolioSummary,
  defaultPortfolioProperties,
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
      expect(result.totalInterestPaid).toBe(370681.60);
      expect(result.totalCostOfLoan).toBe(690681.60);
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
      expect(schedule[0].interestPayment).toBe(1200);
      expect(schedule[0].remainingBalance).toBeLessThan(240000);
      expect(schedule[11].month).toBe(12);
    });

    it('should calculate full 30-year and 15-year schedules with exact array lengths and zero final balance', () => {
      const schedule30 = calculateAmortizationSchedule({
        loanAmount: 320000,
        annualInterestRate: 6.0,
        loanTermYears: 30,
        propertyValue: 400000,
      });

      const schedule15 = calculateAmortizationSchedule({
        loanAmount: 320000,
        annualInterestRate: 5.5,
        loanTermYears: 15,
        propertyValue: 400000,
      });

      expect(schedule30).toHaveLength(360);
      expect(schedule15).toHaveLength(180);

      expect(schedule30[359].month).toBe(360);
      expect(schedule30[359].remainingBalance).toBe(0);

      expect(schedule15[179].month).toBe(180);
      expect(schedule15[179].remainingBalance).toBe(0);
    });

    it('should correctly calculate cumulative interest across the loan duration', () => {
      const mortgage = calculateMortgage({
        homePrice: 400000,
        downPayment: 80000,
        annualInterestRate: 6.0,
        loanTermYears: 30,
      });

      const schedule = calculateAmortizationSchedule({
        loanAmount: 320000,
        annualInterestRate: 6.0,
        loanTermYears: 30,
        propertyValue: 400000,
      });

      const finalMonth = schedule[schedule.length - 1];
      // Verify cumulative interest matches mortgage total interest paid within standard penny rounding drift (< $2 across 360 months)
      expect(Math.abs(finalMonth.cumulativeInterest - mortgage.totalInterestPaid)).toBeLessThan(2);
      expect(finalMonth.cumulativeInterest).toBeGreaterThan(370000);
    });

    it('should track exact PMI drop-off month for 90% LTV vs 80% LTV loans', () => {
      // 90% LTV loan: Property $400k, Loan $360k. 80% threshold = $320,000.
      const schedule90 = calculateAmortizationSchedule({
        loanAmount: 360000,
        annualInterestRate: 6.0,
        loanTermYears: 30,
        propertyValue: 400000,
        pmiMonthly: 150,
        pmiDropOffLtv: 0.80,
      });

      expect(schedule90).toHaveLength(360);
      expect(schedule90[0].isPmiActive).toBe(true);
      expect(schedule90[0].pmi).toBe(150);
      expect(schedule90[0].totalPayment).toBe(schedule90[0].payment + 150);

      // Find the first month where PMI drops off
      const firstPmiOffMonth = schedule90.find((m) => !m.isPmiActive);
      expect(firstPmiOffMonth).toBeDefined();
      expect(firstPmiOffMonth!.pmi).toBe(0);
      expect(firstPmiOffMonth!.remainingBalance).toBeLessThanOrEqual(320000);

      // Verify the month immediately preceding drop-off had active PMI and balance > $320,000
      const prevMonth = schedule90[firstPmiOffMonth!.month - 2];
      expect(prevMonth.isPmiActive).toBe(true);
      expect(prevMonth.pmi).toBe(150);
      expect(prevMonth.remainingBalance).toBeGreaterThan(320000);

      // 80% LTV loan: Property $400k, Loan $320k. Never requires PMI.
      const schedule80 = calculateAmortizationSchedule({
        loanAmount: 320000,
        annualInterestRate: 6.0,
        loanTermYears: 30,
        propertyValue: 400000,
        pmiMonthly: 150,
        pmiDropOffLtv: 0.80,
      });

      expect(schedule80).toHaveLength(360);
      // From month 1, remainingBalance is strictly <= 320,000
      expect(schedule80.every((m) => !m.isPmiActive)).toBe(true);
      expect(schedule80.every((m) => m.pmi === 0)).toBe(true);
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
      expect(result.estimatedMonthlyPMI).toBe(150);
      expect(result.amountNeededToReach80LTV).toBe(40000);
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
      expect(result.estimatedMonthlyPMI).toBe(0);
      expect(result.amountNeededToReach80LTV).toBe(0);
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
        propertyManagementFeePercent: 8,
        propertyPurchasePrice: 400000,
        totalInitialInvestment: 90000,
      });

      expect(result.totalMonthlyIncome).toBe(3100);
      expect(result.operatingExpenses).toBe(998);
      expect(result.netOperatingIncomeMonthly).toBe(2102);
      expect(result.netOperatingIncomeAnnual).toBe(25224);
      expect(result.monthlyCashFlow).toBe(602);
      expect(result.annualCashFlow).toBe(7224);
      expect(result.capRate).toBe(6.31);
      expect(result.cashOnCashReturn).toBe(8.03);
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
      expect(result.monthlyCashFlow).toBe(-650);
      expect(result.annualCashFlow).toBe(-7800);
    });
  });

  describe('Portfolio Aggregation Engine', () => {
    it('should calculate exact summary for default 3-property portfolio', () => {
      const summary = calculatePortfolioSummary(defaultPortfolioProperties);

      // Asset Value = 675,000 + 465,000 + 320,000 = 1,460,000
      expect(summary.totalAssetValue).toBe(1460000);
      // Mortgage Debt = 428,000 + 324,000 + 216,500 = 968,500
      expect(summary.totalMortgageDebt).toBe(968500);
      // Net Equity = 1,460,000 - 968,500 = 491,500
      expect(summary.netRealEstateEquity).toBe(491500);
      // Equity Share = 491,500 / 1,460,000 = ~33.7% -> 33.7%
      expect(summary.equitySharePercent).toBe(33.7);
      // Rent Income = 0 + 2,850 + 2,100 = 4,950
      expect(summary.totalMonthlyIncome).toBe(4950);
      // Mortgage P&I = 2,037 + 1,961 + 1,398 = 5,396
      expect(summary.breakdown.mortgagePAndI).toBe(5396);
    });

    it('should handle empty portfolio safely', () => {
      const summary = calculatePortfolioSummary([]);
      expect(summary.totalAssetValue).toBe(0);
      expect(summary.netRealEstateEquity).toBe(0);
      expect(summary.portfolioCapRate).toBe(0);
    });
  });
});
