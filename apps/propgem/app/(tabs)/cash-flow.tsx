import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateCashFlow } from '@cqs/finance-logic';
import { usePortfolio } from '../../src/context/PortfolioContext';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { PortfolioKpiSummary } from '../../src/components/PortfolioKpiSummary';
import { SliderInput } from '../../src/components/SliderInput';
import { CollapsibleSection } from '../../src/components/CollapsibleSection';
import { triggerLightImpact, triggerSuccessHaptic } from '../../src/utils/haptics';

export default function InvestorCashFlowScreen() {
  const { screenBottomPadding } = useSafeInsets();
  const { summary, properties } = usePortfolio();

  // Investor Calculation State
  const [rent, setRent] = useState(3200);
  const [mortgage, setMortgage] = useState(1850);
  const [tax, setTax] = useState(350);
  const [insurance, setInsurance] = useState(100);
  const [hoa, setHoa] = useState(50);
  const [maintenance, setMaintenance] = useState(150);
  const [vacancy, setVacancy] = useState(150);
  const [mgmtFeePercent, setMgmtFeePercent] = useState(8);
  const [purchasePrice, setPurchasePrice] = useState(420000);
  const [initialInvestment, setInitialInvestment] = useState(95000);

  const result = useMemo(() => {
    return calculateCashFlow({
      grossMonthlyRentalIncome: rent,
      monthlyMortgagePayment: mortgage,
      monthlyPropertyTax: tax,
      monthlyInsurance: insurance,
      monthlyHOA: hoa,
      monthlyMaintenanceReserve: maintenance,
      monthlyVacancyReserve: vacancy,
      propertyManagementFeePercent: mgmtFeePercent,
      propertyPurchasePrice: purchasePrice,
      totalInitialInvestment: initialInvestment,
    });
  }, [
    rent,
    mortgage,
    tax,
    insurance,
    hoa,
    maintenance,
    vacancy,
    mgmtFeePercent,
    purchasePrice,
    initialInvestment,
  ]);

  const isPositiveCashFlow = result.monthlyCashFlow >= 0;

  const handleResetDefaults = () => {
    triggerLightImpact();
    setRent(3200);
    setMortgage(1850);
    setTax(350);
    setInsurance(100);
    setHoa(50);
    setMaintenance(150);
    setVacancy(150);
    setMgmtFeePercent(8);
    setPurchasePrice(420000);
    setInitialInvestment(95000);
    triggerSuccessHaptic();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: screenBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Portfolio KPI Summary */}
        <PortfolioKpiSummary
          summary={summary}
          totalPropertiesCount={properties.length}
        />

        {/* Section Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.mainTitle}>Investor Return Engine</Text>
            <Text style={styles.subTitle}>
              Real-time Net Operating Income (NOI), Cap Rate, and Cash-on-Cash modeling
            </Text>
          </View>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetDefaults}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color="#A1A1AA" />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Highlight Cash Flow Hero Card: 1 Primary Hero Metric */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>NET MONTHLY CASH FLOW</Text>
          <Text
            style={[
              styles.highlightValue,
              { color: isPositiveCashFlow ? '#4ADE80' : '#F87171' },
            ]}
          >
            {isPositiveCashFlow ? '+' : ''}${result.monthlyCashFlow.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.highlightSub}>
            Annualized Net Cash Flow: ${(result.annualCashFlow).toLocaleString()}/yr
          </Text>
        </View>

        {/* 3-Pillar Investment Return Metrics (Max 3 Secondary Metrics) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Return Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>CAP RATE</Text>
              <Text style={styles.metricValueSky}>
                {result.capRate !== undefined ? `${result.capRate}%` : 'N/A'}
              </Text>
              <Text style={styles.metricSub}>NOI / Price</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>CASH-ON-CASH</Text>
              <Text style={styles.metricValueGold}>
                {result.cashOnCashReturn !== undefined ? `${result.cashOnCashReturn}%` : 'N/A'}
              </Text>
              <Text style={styles.metricSub}>Cash Flow / Inv.</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>ANNUAL NOI</Text>
              <Text style={styles.metricValueEmerald}>
                ${result.netOperatingIncomeAnnual.toLocaleString()}
              </Text>
              <Text style={styles.metricSub}>Pre-Debt Service</Text>
            </View>
          </View>
        </View>

        {/* Primary Investment Drivers (4 Visible Core Controls) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Core Deal Parameters</Text>

          <SliderInput
            label="Gross Monthly Rental Income"
            value={rent}
            onChange={setRent}
            min={500}
            max={20000}
            step={50}
            prefix="$"
            accentColor="#10B981"
          />

          <SliderInput
            label="Property Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={50000}
            max={3000000}
            step={10000}
            prefix="$"
            accentColor="#38BDF8"
          />

          <SliderInput
            label="Total Initial Cash Invested"
            value={initialInvestment}
            onChange={setInitialInvestment}
            min={5000}
            max={1000000}
            step={5000}
            prefix="$"
            helperText="Down payment + closing + rehab"
            accentColor="#F59E0B"
          />

          <SliderInput
            label="Monthly Mortgage Debt Service (P&I)"
            value={mortgage}
            onChange={setMortgage}
            min={0}
            max={15000}
            step={50}
            prefix="$"
            accentColor="#818CF8"
          />
        </View>

        {/* Progressive Disclosure: Operating Expenses & Reserves Accordion */}
        <CollapsibleSection
          title="Operating Expenses & Reserves"
          subtitle="Taxes, insurance, HOA, maintenance, vacancy & management"
          badge={`-$${result.operatingExpenses.toLocaleString()}/mo`}
          icon="shield-outline"
        >
          <SliderInput
            label="Monthly Property Tax"
            value={tax}
            onChange={setTax}
            min={0}
            max={3000}
            step={25}
            prefix="$"
            accentColor="#F59E0B"
          />

          <SliderInput
            label="Monthly Insurance"
            value={insurance}
            onChange={setInsurance}
            min={0}
            max={1500}
            step={10}
            prefix="$"
            accentColor="#818CF8"
          />

          <SliderInput
            label="Monthly HOA Fees"
            value={hoa}
            onChange={setHoa}
            min={0}
            max={1500}
            step={25}
            prefix="$"
            accentColor="#A78BFA"
          />

          <SliderInput
            label="Maintenance & Repairs Reserve"
            value={maintenance}
            onChange={setMaintenance}
            min={0}
            max={1500}
            step={25}
            prefix="$"
            helperText={`${rent > 0 ? Math.round((maintenance / rent) * 100) : 0}% of rent`}
            accentColor="#F43F5E"
          />

          <SliderInput
            label="Vacancy Reserve"
            value={vacancy}
            onChange={setVacancy}
            min={0}
            max={1500}
            step={25}
            prefix="$"
            helperText={`${rent > 0 ? Math.round((vacancy / rent) * 100) : 0}% of rent`}
            accentColor="#F43F5E"
          />

          <SliderInput
            label="Property Management Fee (%)"
            value={mgmtFeePercent}
            onChange={setMgmtFeePercent}
            min={0}
            max={20}
            step={0.5}
            suffix="%"
            helperText={`$${Math.round((rent * mgmtFeePercent) / 100)}/mo`}
            accentColor="#38BDF8"
          />
        </CollapsibleSection>

        {/* Progressive Disclosure: Operating Statement Breakdown */}
        <CollapsibleSection
          title="Operating Statement Breakdown"
          subtitle="Itemized revenue, operating outflow, and net cash flow"
          badge={isPositiveCashFlow ? 'Profitable' : 'Cash Drain'}
          icon="document-text-outline"
        >
          <View style={styles.statementCard}>
            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Gross Monthly Income</Text>
              <Text style={styles.statementValueGreen}>+${result.totalMonthlyIncome.toLocaleString()}</Text>
            </View>

            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Operating Expenses</Text>
              <Text style={styles.statementValueRed}>-${result.operatingExpenses.toLocaleString()}</Text>
            </View>

            <View style={[styles.statementRow, styles.statementHighlightRow]}>
              <Text style={styles.statementLabelBold}>Monthly NOI (Pre-Debt Service)</Text>
              <Text style={styles.statementValueBold}>${result.netOperatingIncomeMonthly.toLocaleString()}</Text>
            </View>

            <View style={styles.statementRow}>
              <Text style={styles.statementLabel}>Debt Service (Mortgage P&I)</Text>
              <Text style={styles.statementValueRed}>-${mortgage.toLocaleString()}</Text>
            </View>

            <View style={[styles.statementRow, styles.statementFinalRow]}>
              <Text style={styles.statementLabelFinal}>Net Monthly Cash Flow</Text>
              <Text
                style={[
                  styles.statementValueFinal,
                  { color: isPositiveCashFlow ? '#4ADE80' : '#F87171' },
                ]}
              >
                {isPositiveCashFlow ? '+' : ''}${result.monthlyCashFlow.toLocaleString()}
              </Text>
            </View>
          </View>
        </CollapsibleSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scrollContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  subTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    minHeight: 44, // Exceeds 44x44 dp standard
  },
  resetBtnText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600',
  },
  cardHighlight: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  highlightLabel: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  highlightValue: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 6,
  },
  highlightSub: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  sectionTitle: {
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  metricLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValueSky: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricValueGold: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricValueEmerald: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricSub: {
    color: '#71717A',
    fontSize: 9,
    textAlign: 'center',
  },
  statementCard: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  statementHighlightRow: {
    backgroundColor: '#18181B',
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  statementFinalRow: {
    borderBottomWidth: 0,
    paddingTop: 8,
  },
  statementLabel: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  statementLabelBold: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
  },
  statementLabelFinal: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '800',
  },
  statementValueGreen: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  statementValueRed: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  statementValueBold: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  statementValueFinal: {
    fontSize: 15,
    fontWeight: '900',
  },
});

