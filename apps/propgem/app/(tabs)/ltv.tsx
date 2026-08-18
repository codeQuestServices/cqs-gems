import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { calculateLTV } from '@cqs/finance-logic';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { SliderInput } from '../../src/components/SliderInput';
import { PmiIndicator } from '../../src/components/PmiIndicator';
import { triggerLightImpact } from '../../src/utils/haptics';

export default function LTVScreen() {
  const { screenBottomPadding } = useSafeInsets();

  const [loanAmount, setLoanAmount] = useState(360000);
  const [appraisedValue, setAppraisedValue] = useState(450000);

  const setTargetLTV = (targetPercent: number) => {
    triggerLightImpact();
    const calculatedLoan = Math.round((appraisedValue * targetPercent) / 100);
    setLoanAmount(calculatedLoan);
  };

  const result = useMemo(() => {
    return calculateLTV({
      loanAmount,
      appraisedValue,
    });
  }, [loanAmount, appraisedValue]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: screenBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Highlight Result Card */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>LOAN-TO-VALUE RATIO (LTV)</Text>
          <Text style={styles.highlightValue}>{result.ltvRatio}%</Text>
          <View style={[styles.pmiBadge, result.requiresPMI ? styles.pmiWarning : styles.pmiSafe]}>
            <Text style={styles.pmiBadgeText}>
              {result.requiresPMI ? 'PMI Required (LTV > 80%)' : 'Conventional Equity Safe (LTV <= 80%)'}
            </Text>
          </View>
        </View>

        {/* PMI Auto Detection Alert */}
        <PmiIndicator loanAmount={loanAmount} homePrice={appraisedValue} />

        {/* Equity Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Homeowner Equity Position</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Home Appraised Value</Text>
            <Text style={styles.breakdownValue}>${appraisedValue.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Outstanding Loan Principal</Text>
            <Text style={styles.breakdownValue}>${loanAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Homeowner Equity ($)</Text>
            <Text style={styles.breakdownValueGold}>${result.equityValue.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.breakdownLabel}>Equity Share (%)</Text>
            <Text style={styles.breakdownValueGold}>{result.equityPercent}%</Text>
          </View>
        </View>

        {/* Target LTV Preset Chips & Inputs */}
        <View style={styles.card}>
          <View style={styles.presetHeaderRow}>
            <Text style={styles.sectionTitle}>Appraisal & Financing Sliders</Text>
            <View style={styles.chipRow}>
              {[70, 80, 90, 95].map((target) => (
                <TouchableOpacity
                  key={target}
                  style={[
                    styles.chip,
                    Math.abs(result.ltvRatio - target) < 0.5 && styles.chipActive,
                  ]}
                  onPress={() => setTargetLTV(target)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      Math.abs(result.ltvRatio - target) < 0.5 && styles.chipTextActive,
                    ]}
                  >
                    {target}% LTV
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <SliderInput
            label="Appraised Property Value"
            value={appraisedValue}
            onChange={(val) => {
              setAppraisedValue(val);
              if (loanAmount > val) setLoanAmount(val);
            }}
            min={50000}
            max={2500000}
            step={5000}
            prefix="$"
            accentColor="#F59E0B"
          />

          <SliderInput
            label="Loan Principal Balance"
            value={loanAmount}
            onChange={setLoanAmount}
            min={0}
            max={appraisedValue}
            step={2500}
            prefix="$"
            accentColor="#38BDF8"
          />
        </View>
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
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  highlightValue: {
    color: '#FAFAFA',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 12,
  },
  pmiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pmiWarning: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderColor: '#F43F5E',
    borderWidth: 1,
  },
  pmiSafe: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  pmiBadgeText: {
    color: '#FAFAFA',
    fontSize: 12,
    fontWeight: '600',
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
  presetHeaderRow: {
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
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

  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  breakdownLabel: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  breakdownValue: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownValueGold: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '700',
  },
});
