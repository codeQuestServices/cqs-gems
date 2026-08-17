import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { calculateLTV } from '@cqs/finance-logic';

export default function LTVScreen() {
  const [loanAmount, setLoanAmount] = useState('360000');
  const [appraisedValue, setAppraisedValue] = useState('450000');

  const result = useMemo(() => {
    return calculateLTV({
      loanAmount: parseFloat(loanAmount) || 0,
      appraisedValue: parseFloat(appraisedValue) || 0,
    });
  }, [loanAmount, appraisedValue]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Highlight Result Card */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>LOAN-TO-VALUE RATIO (LTV)</Text>
          <Text style={styles.highlightValue}>{result.ltvRatio}%</Text>
          <View style={[styles.pmiBadge, result.requiresPMI ? styles.pmiWarning : styles.pmiSafe]}>
            <Text style={styles.pmiBadgeText}>
              {result.requiresPMI ? 'PMI Required (LTV > 80%)' : 'No PMI Required (LTV <= 80%)'}
            </Text>
          </View>
        </View>

        {/* Equity Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Home Equity Analysis</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Home Appraised Value</Text>
            <Text style={styles.breakdownValue}>${(parseFloat(appraisedValue) || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Outstanding Loan Balance</Text>
            <Text style={styles.breakdownValue}>${(parseFloat(loanAmount) || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Homeowner Equity ($)</Text>
            <Text style={styles.breakdownValueGold}>${result.equityValue.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.breakdownLabel}>Homeowner Equity Share (%)</Text>
            <Text style={styles.breakdownValueGold}>{result.equityPercent}%</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Appraisal & Loan Inputs</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Appraised Property Value ($)</Text>
            <TextInput
              style={styles.input}
              value={appraisedValue}
              onChangeText={setAppraisedValue}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loan Principal Balance ($)</Text>
            <TextInput
              style={styles.input}
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardHighlight: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#F8FAFC',
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 12,
  },
  pmiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pmiWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  pmiSafe: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: '#22C55E',
    borderWidth: 1,
  },
  pmiBadgeText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#131D2F',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  breakdownLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  breakdownValue: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownValueGold: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
});
