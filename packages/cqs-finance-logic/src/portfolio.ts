import { PortfolioProperty, PortfolioSummary } from './types';

/**
 * Calculates portfolio-wide aggregates including total equity, debt, cash flows, and blended Cap Rate.
 */
export function calculatePortfolioSummary(properties: PortfolioProperty[]): PortfolioSummary {
  if (!properties || properties.length === 0) {
    return {
      totalAssetValue: 0,
      totalMortgageDebt: 0,
      netRealEstateEquity: 0,
      equitySharePercent: 0,
      blendedLTV: 0,
      totalMonthlyIncome: 0,
      totalMonthlyExpenses: 0,
      netMonthlyCashFlow: 0,
      netAnnualCashFlow: 0,
      annualizedNOI: 0,
      portfolioCapRate: 0,
      breakdown: {
        rentIncome: 0,
        mortgagePAndI: 0,
        taxes: 0,
        insurance: 0,
        hoaAndMaintenance: 0,
        netCashFlow: 0,
      },
    };
  }

  let totalAssetValue = 0;
  let totalMortgageDebt = 0;
  let totalRentIncome = 0;
  let totalMortgagePAndI = 0;
  let totalTaxes = 0;
  let totalInsurance = 0;
  let totalHoaAndMaintenance = 0;

  for (const property of properties) {
    totalAssetValue += property.marketValue;
    totalMortgageDebt += property.loanBalance;
    totalRentIncome += property.monthlyRentIncome;
    totalMortgagePAndI += property.monthlyMortgagePAndI;
    totalTaxes += property.monthlyPropertyTax;
    totalInsurance += property.monthlyInsurance;
    totalHoaAndMaintenance += property.monthlyHOA + property.monthlyMaintenance;
  }

  const netRealEstateEquity = Math.max(0, totalAssetValue - totalMortgageDebt);
  const equitySharePercent = totalAssetValue > 0 ? (netRealEstateEquity / totalAssetValue) * 100 : 0;
  const blendedLTV = totalAssetValue > 0 ? (totalMortgageDebt / totalAssetValue) * 100 : 0;

  // Operating Expenses = Taxes + Insurance + HOA + Maintenance
  const totalOperatingExpenses = totalTaxes + totalInsurance + totalHoaAndMaintenance;
  // Total Expenses = Operating Expenses + Debt Service (Mortgage P&I)
  const totalMonthlyExpenses = totalOperatingExpenses + totalMortgagePAndI;

  const netOperatingIncomeMonthly = totalRentIncome - totalOperatingExpenses;
  const annualizedNOI = netOperatingIncomeMonthly * 12;

  const netMonthlyCashFlow = totalRentIncome - totalMonthlyExpenses;
  const netAnnualCashFlow = netMonthlyCashFlow * 12;

  const portfolioCapRate =
    totalAssetValue > 0 ? (annualizedNOI / totalAssetValue) * 100 : 0;

  return {
    totalAssetValue: round(totalAssetValue),
    totalMortgageDebt: round(totalMortgageDebt),
    netRealEstateEquity: round(netRealEstateEquity),
    equitySharePercent: round(equitySharePercent, 1),
    blendedLTV: round(blendedLTV, 1),
    totalMonthlyIncome: round(totalRentIncome),
    totalMonthlyExpenses: round(totalMonthlyExpenses),
    netMonthlyCashFlow: round(netMonthlyCashFlow),
    netAnnualCashFlow: round(netAnnualCashFlow),
    annualizedNOI: round(annualizedNOI),
    portfolioCapRate: round(portfolioCapRate, 2),
    breakdown: {
      rentIncome: round(totalRentIncome),
      mortgagePAndI: round(totalMortgagePAndI),
      taxes: round(totalTaxes),
      insurance: round(totalInsurance),
      hoaAndMaintenance: round(totalHoaAndMaintenance),
      netCashFlow: round(netMonthlyCashFlow),
    },
  };
}

/**
 * Default starter portfolio matching the high-impact dashboard reference
 */
export const defaultPortfolioProperties: PortfolioProperty[] = [
  {
    id: 'prop-1',
    name: 'Primary Residence - Inspirada Henderson',
    address: '2415 Bicentennial Pkwy, Henderson, NV 89044',
    propertyType: 'PRIMARY',
    marketValue: 675000,
    loanBalance: 428000,
    monthlyMortgagePAndI: 2037,
    monthlyPropertyTax: 450,
    monthlyInsurance: 120,
    monthlyHOA: 175,
    monthlyMaintenance: 246,
    monthlyRentIncome: 0,
    purchaseDate: '2021-06-15',
    financedDate: '2021-06-15',
  },
  {
    id: 'prop-2',
    name: 'Summerlin Rental Townhome',
    address: '10240 Park Run Dr, Las Vegas, NV 89144',
    propertyType: 'RENTAL',
    marketValue: 465000,
    loanBalance: 324000,
    monthlyMortgagePAndI: 1961,
    monthlyPropertyTax: 213,
    monthlyInsurance: 89,
    monthlyHOA: 190,
    monthlyMaintenance: 400,
    monthlyRentIncome: 2850,
    purchaseDate: '2022-11-10',
    financedDate: '2022-11-10',
    tenantName: 'Marcus Vance',
  },
  {
    id: 'prop-3',
    name: 'Enterprise Investment Condo',
    address: '7820 S Jones Blvd, Las Vegas, NV 89139',
    propertyType: 'RENTAL',
    marketValue: 320000,
    loanBalance: 216500,
    monthlyMortgagePAndI: 1398,
    monthlyPropertyTax: 120,
    monthlyInsurance: 70,
    monthlyHOA: 210,
    monthlyMaintenance: 311,
    monthlyRentIncome: 2100,
    purchaseDate: '2023-08-01',
    financedDate: '2023-08-01',
    tenantName: 'Sarah Jenkins',
  },
];

function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
