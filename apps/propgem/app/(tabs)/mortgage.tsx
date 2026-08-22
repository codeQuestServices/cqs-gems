import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  calculateMortgage,
  calculateLTV,
  calculateAmortizationSchedule,
  AmortizationMonth,
} from '@cqs/finance-logic';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { SliderInput } from '../../src/components/SliderInput';
import { StackedOutflowBar } from '../../src/components/StackedOutflowBar';
import { PmiIndicator } from '../../src/components/PmiIndicator';
import { CollapsibleSection } from '../../src/components/CollapsibleSection';
import { triggerLightImpact } from '../../src/utils/haptics';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const currencyWithCentsFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (val: number) => currencyFormatter.format(val);
const formatCurrencyWithCents = (val: number) => currencyWithCentsFormatter.format(val);

const ROW_HEIGHT = 36;

export default function MortgageScreen() {
  const { screenBottomPadding } = useSafeInsets();

  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(4200);
  const [insurance, setInsurance] = useState(1200);
  const [hoa, setHoa] = useState(150);

  const setDownPaymentPercent = (percent: number) => {
    triggerLightImpact();
    const calculated = Math.round((homePrice * percent) / 100);
    setDownPayment(calculated);
  };

  const handleTermChange = (term: number) => {
    triggerLightImpact();
    setLoanTerm(term);
  };

  const result = useMemo(() => {
    return calculateMortgage({
      homePrice,
      downPayment,
      annualInterestRate: interestRate,
      loanTermYears: loanTerm,
      annualPropertyTax: propertyTax,
      annualHomeownersInsurance: insurance,
      monthlyHOA: hoa,
    });
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoa]);

  const ltvResult = useMemo(() => {
    return calculateLTV({
      loanAmount: result.loanAmount,
      appraisedValue: homePrice,
    });
  }, [result.loanAmount, homePrice]);

  const totalMonthlyWithPmi =
    result.totalMonthlyPayment + (ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0);
  const monthlyEscrows = result.monthlyPropertyTax + result.monthlyInsurance + result.monthlyHOA;

  const schedule = useMemo(() => {
    return calculateAmortizationSchedule({
      loanAmount: result.loanAmount,
      annualInterestRate: interestRate,
      loanTermYears: loanTerm,
      propertyValue: homePrice,
      pmiMonthly: ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0,
      pmiDropOffLtv: 0.80,
    });
  }, [result.loanAmount, interestRate, loanTerm, homePrice, ltvResult.requiresPMI, ltvResult.estimatedMonthlyPMI]);

  const pmiMilestone = useMemo(() => {
    if (!ltvResult.requiresPMI) {
      return {
        badge: 'NO PMI REQUIRED',
        title: 'LTV ≤ 80% at Origination',
        subtitle: 'Down payment meets the 20% equity threshold',
        isExempt: true,
      };
    }

    const dropMonth = schedule.find((m) => !m.isPmiActive);
    if (!dropMonth) {
      return {
        badge: 'PMI ACTIVE',
        title: 'Full Term Requirement',
        subtitle: 'Principal balance remains above 80% LTV',
        isExempt: false,
      };
    }

    const year = Math.floor((dropMonth.month - 1) / 12) + 1;
    const monthInYear = ((dropMonth.month - 1) % 12) + 1;

    return {
      badge: `DROPS AT MONTH ${dropMonth.month}`,
      title: `PMI drops off at Month ${dropMonth.month}`,
      subtitle: `Year ${year}, Mo ${monthInYear} • Balance: ${formatCurrency(dropMonth.remainingBalance)}`,
      isExempt: false,
    };
  }, [ltvResult.requiresPMI, schedule]);

  const crossoverMilestone = useMemo(() => {
    const crossover = schedule.find((m) => m.principal >= m.interest);
    if (!crossover) {
      return {
        badge: 'NO CROSSOVER',
        title: 'Interest Dominates',
        subtitle: 'Monthly interest exceeds principal throughout term',
      };
    }

    if (crossover.month === 1) {
      return {
        badge: 'CROSSOVER: MONTH 1',
        title: 'Equity Crossover: Month 1',
        subtitle: 'Principal exceeds interest from inception',
      };
    }

    const year = Math.floor((crossover.month - 1) / 12) + 1;
    const monthInYear = ((crossover.month - 1) % 12) + 1;

    return {
      badge: `CROSSOVER: MONTH ${crossover.month}`,
      title: `Equity Crossover at Month ${crossover.month}`,
      subtitle: `Year ${year}, Mo ${monthInYear} • Principal: ${formatCurrency(crossover.principal)} vs Int: ${formatCurrency(crossover.interest)}`,
    };
  }, [schedule]);

  const renderScheduleRow = useCallback(({ item }: { item: AmortizationMonth }) => {
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.colCell, { flex: 0.7 }]}>{item.month}</Text>
        <Text style={[styles.colCellGreen, { flex: 1.2 }]}>{formatCurrency(item.principal)}</Text>
        <Text style={[styles.colCellRose, { flex: 1.2 }]}>{formatCurrency(item.interest)}</Text>
        <Text style={[item.isPmiActive ? styles.colCellAmber : styles.colCellDim, { flex: 0.9 }]}>
          {item.isPmiActive ? formatCurrency(item.pmi) : '—'}
        </Text>
        <Text style={[styles.colCellBold, { flex: 1.3 }]}>{formatCurrency(item.remainingBalance)}</Text>
      </View>
    );
  }, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: screenBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Payment Hero Card: 1 Primary KPI */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>ESTIMATED TOTAL MONTHLY PAYMENT</Text>
          <Text style={styles.highlightValue}>
            {formatCurrencyWithCents(totalMonthlyWithPmi)}
          </Text>
          <Text style={styles.highlightSub}>
            P&I: {formatCurrency(result.monthlyPrincipalAndInterest)}/mo | Lifetime Interest: {formatCurrency(result.totalInterestPaid)}
          </Text>
        </View>

        {/* PMI Auto Detection Alert */}
        <PmiIndicator loanAmount={result.loanAmount} homePrice={homePrice} />

        {/* Stacked Outflow Bar */}
        <StackedOutflowBar
          principalAndInterest={result.monthlyPrincipalAndInterest}
          propertyTax={result.monthlyPropertyTax}
          insurance={result.monthlyInsurance}
          hoa={result.monthlyHOA}
          pmi={ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0}
          totalMonthlyPayment={totalMonthlyWithPmi}
        />

        {/* Primary Interactive Loan Parameters (4 Core Inputs) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mortgage & Down Payment</Text>
          
          <SliderInput
            label="Home Purchase Price"
            value={homePrice}
            onChange={(val) => {
              setHomePrice(val);
              const ratio = homePrice > 0 ? downPayment / homePrice : 0.2;
              setDownPayment(Math.round(val * ratio));
            }}
            min={50000}
            max={2500000}
            step={5000}
            prefix="$"
            accentColor="#F59E0B"
          />

          <View style={styles.downPaymentHeaderRow}>
            <Text style={styles.subLabel}>Down Payment ({result.downPaymentPercent}%)</Text>
            <View style={styles.chipRow}>
              {[5, 10, 20, 25].map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={[
                    styles.chip,
                    Math.abs(result.downPaymentPercent - pct) < 0.5 && styles.chipActive,
                  ]}
                  onPress={() => setDownPaymentPercent(pct)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      Math.abs(result.downPaymentPercent - pct) < 0.5 && styles.chipTextActive,
                    ]}
                  >
                    {pct}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <SliderInput
            label="Down Payment Amount"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={homePrice}
            step={1000}
            prefix="$"
            accentColor="#38BDF8"
          />

          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={1.0}
            max={15.0}
            step={0.125}
            suffix="%"
            accentColor="#818CF8"
          />

          <View style={styles.termContainer}>
            <Text style={styles.subLabel}>Loan Duration</Text>
            <View style={styles.termToggleRow}>
              <TouchableOpacity
                style={[styles.termBtn, loanTerm === 15 && styles.termBtnActive]}
                onPress={() => handleTermChange(15)}
                activeOpacity={0.8}
              >
                <Text style={[styles.termBtnText, loanTerm === 15 && styles.termBtnTextActive]}>
                  15-Year Fixed
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.termBtn, loanTerm === 30 && styles.termBtnActive]}
                onPress={() => handleTermChange(30)}
                activeOpacity={0.8}
              >
                <Text style={[styles.termBtnText, loanTerm === 30 && styles.termBtnTextActive]}>
                  30-Year Fixed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Progressive Disclosure: Taxes & Escrows */}
        <CollapsibleSection
          title="Taxes, Insurance & HOA Escrows"
          subtitle="Annual property tax, insurance, and recurring HOA fees"
          badge={`${formatCurrency(monthlyEscrows)}/mo`}
          icon="receipt-outline"
        >
          <SliderInput
            label="Annual Property Tax"
            value={propertyTax}
            onChange={setPropertyTax}
            min={0}
            max={25000}
            step={100}
            prefix="$"
            helperText={`${formatCurrency(Math.round(propertyTax / 12))}/mo`}
            accentColor="#F59E0B"
          />

          <SliderInput
            label="Annual Homeowners Insurance"
            value={insurance}
            onChange={setInsurance}
            min={0}
            max={10000}
            step={50}
            prefix="$"
            helperText={`${formatCurrency(Math.round(insurance / 12))}/mo`}
            accentColor="#818CF8"
          />

          <SliderInput
            label="Monthly HOA Dues"
            value={hoa}
            onChange={setHoa}
            min={0}
            max={2000}
            step={25}
            prefix="$"
            suffix="/mo"
            accentColor="#A78BFA"
          />
        </CollapsibleSection>

        {/* Progressive Disclosure: Full Amortization Schedule & PMI Timeline */}
        <CollapsibleSection
          title="Amortization Schedule & PMI Timeline"
          subtitle="Monthly breakdown of principal paydown, interest, and PMI drop-off"
          badge={`${schedule.length} Months`}
          icon="calendar-outline"
        >
          {/* Milestone Badges & Timeline Cards */}
          <View style={styles.milestonesContainer}>
            {/* PMI Milestone Badge */}
            <View style={[styles.milestoneCard, pmiMilestone.isExempt && styles.milestoneCardGreen]}>
              <View style={styles.milestoneHeader}>
                <Ionicons
                  name={pmiMilestone.isExempt ? 'shield-checkmark' : 'trending-down'}
                  size={15}
                  color={pmiMilestone.isExempt ? '#34D399' : '#38BDF8'}
                />
                <Text
                  style={[
                    styles.milestoneBadgeText,
                    pmiMilestone.isExempt ? styles.textGreen : styles.textCyan,
                  ]}
                >
                  {pmiMilestone.badge}
                </Text>
              </View>
              <Text style={styles.milestoneTitle}>{pmiMilestone.title}</Text>
              <Text style={styles.milestoneSubtitle}>{pmiMilestone.subtitle}</Text>
            </View>

            {/* Equity Crossover Milestone Badge */}
            <View style={styles.milestoneCard}>
              <View style={styles.milestoneHeader}>
                <Ionicons name="swap-vertical-outline" size={15} color="#818CF8" />
                <Text style={[styles.milestoneBadgeText, styles.textIndigo]}>
                  {crossoverMilestone.badge}
                </Text>
              </View>
              <Text style={styles.milestoneTitle}>{crossoverMilestone.title}</Text>
              <Text style={styles.milestoneSubtitle}>{crossoverMilestone.subtitle}</Text>
            </View>
          </View>

          {/* Virtualized Amortization Table */}
          <View style={styles.scheduleTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, { flex: 0.7 }]}>Mo</Text>
              <Text style={[styles.colHeader, { flex: 1.2 }]}>Principal</Text>
              <Text style={[styles.colHeader, { flex: 1.2 }]}>Interest</Text>
              <Text style={[styles.colHeader, { flex: 0.9 }]}>PMI</Text>
              <Text style={[styles.colHeader, { flex: 1.3 }]}>Balance</Text>
            </View>

            <View style={styles.listContainer}>
              <FlatList
                data={schedule}
                renderItem={renderScheduleRow}
                keyExtractor={(item) => item.month.toString()}
                initialNumToRender={12}
                maxToRenderPerBatch={24}
                windowSize={5}
                getItemLayout={getItemLayout}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                indicatorStyle="white"
              />
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
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  highlightValue: {
    color: '#FAFAFA',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 6,
  },
  highlightSub: {
    color: '#A1A1AA',
    fontSize: 12,
    textAlign: 'center',
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
  subLabel: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  downPaymentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  chipText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#09090B',
  },
  termContainer: {
    marginBottom: 8,
  },
  termToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#09090B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    height: 46,
  },
  termBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termBtnActive: {
    backgroundColor: '#3B82F6',
  },
  termBtnText: {
    color: '#71717A',
    fontWeight: '600',
    fontSize: 13,
  },
  termBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  milestonesContainer: {
    gap: 8,
    marginBottom: 12,
  },
  milestoneCard: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  milestoneCardGreen: {
    borderColor: 'rgba(52, 211, 153, 0.3)',
    backgroundColor: 'rgba(52, 211, 153, 0.04)',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  milestoneBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textCyan: {
    color: '#38BDF8',
  },
  textGreen: {
    color: '#34D399',
  },
  textIndigo: {
    color: '#818CF8',
  },
  milestoneTitle: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  milestoneSubtitle: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  scheduleTable: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  listContainer: {
    height: 320,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingBottom: 8,
    marginBottom: 4,
  },
  colHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  colCell: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  colCellGreen: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  colCellRose: {
    color: '#FB7185',
    fontSize: 12,
    fontWeight: '500',
  },
  colCellAmber: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '500',
  },
  colCellDim: {
    color: '#52525B',
    fontSize: 12,
  },
  colCellBold: {
    color: '#FAFAFA',
    fontSize: 12,
    fontWeight: '600',
  },
});


