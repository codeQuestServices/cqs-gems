import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { calculateMortgage, calculateLTV, generateAmortizationSchedule } from '@cqs/finance-logic';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { SliderInput } from '../../src/components/SliderInput';
import { StackedOutflowBar } from '../../src/components/StackedOutflowBar';
import { PmiIndicator } from '../../src/components/PmiIndicator';
import { CollapsibleSection } from '../../src/components/CollapsibleSection';
import { triggerLightImpact } from '../../src/utils/haptics';

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

  const totalMonthlyWithPmi = result.totalMonthlyPayment + (ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0);
  const monthlyEscrows = result.monthlyPropertyTax + result.monthlyInsurance + result.monthlyHOA;

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(
      {
        homePrice,
        downPayment,
        annualInterestRate: interestRate,
        loanTermYears: loanTerm,
      },
      12 // First 12 months preview
    );
  }, [homePrice, downPayment, interestRate, loanTerm]);

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
            ${totalMonthlyWithPmi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.highlightSub}>
            P&I: ${result.monthlyPrincipalAndInterest.toLocaleString()}/mo | Lifetime Interest: ${result.totalInterestPaid.toLocaleString()}
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
          badge={`$${monthlyEscrows}/mo`}
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
            helperText={`$${Math.round(propertyTax / 12)}/mo`}
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
            helperText={`$${Math.round(insurance / 12)}/mo`}
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

        {/* Progressive Disclosure: Amortization Schedule (Year 1) */}
        <CollapsibleSection
          title="Amortization Schedule (Year 1)"
          subtitle="Monthly breakdown of principal paydown vs interest allocation"
          badge="12 Months"
          icon="calendar-outline"
        >
          <View style={styles.scheduleTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, { flex: 0.8 }]}>Mo</Text>
              <Text style={[styles.colHeader, { flex: 1.2 }]}>Principal</Text>
              <Text style={[styles.colHeader, { flex: 1.2 }]}>Interest</Text>
              <Text style={[styles.colHeader, { flex: 1.4 }]}>Balance</Text>
            </View>

            {schedule.map((row) => (
              <View key={row.month} style={styles.tableRow}>
                <Text style={[styles.colCell, { flex: 0.8 }]}>{row.month}</Text>
                <Text style={[styles.colCellGreen, { flex: 1.2 }]}>${row.principalPayment.toLocaleString()}</Text>
                <Text style={[styles.colCell, { flex: 1.2 }]}>${row.interestPayment.toLocaleString()}</Text>
                <Text style={[styles.colCellBold, { flex: 1.4 }]}>${row.remainingBalance.toLocaleString()}</Text>
              </View>
            ))}
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
    height: 46, // Exceeds 44x44 dp standard
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
  scheduleTable: {
    backgroundColor: '#09090B',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingBottom: 8,
    marginBottom: 6,
  },
  colHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
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
  colCellBold: {
    color: '#FAFAFA',
    fontSize: 12,
    fontWeight: '600',
  },
});

