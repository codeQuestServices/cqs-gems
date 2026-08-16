import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { calculateMortgage } from '@cqs/finance-logic';

export default function MortgageScreen() {
  const [homePrice, setHomePrice] = useState('450000');
  const [downPayment, setDownPayment] = useState('90000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTax, setPropertyTax] = useState('4200');
  const [insurance, setInsurance] = useState('1200');
  const [hoa, setHoa] = useState('150');

  const result = useMemo(() => {
    return calculateMortgage({
      homePrice: parseFloat(homePrice) || 0,
      downPayment: parseFloat(downPayment) || 0,
      annualInterestRate: parseFloat(interestRate) || 0,
      loanTermYears: parseFloat(loanTerm) || 30,
      annualPropertyTax: parseFloat(propertyTax) || 0,
      annualHomeownersInsurance: parseFloat(insurance) || 0,
      monthlyHOA: parseFloat(hoa) || 0,
    });
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoa]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Tabs */}
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnActive]}>
            <Text style={styles.navBtnTextActive}>Mortgage</Text>
          </TouchableOpacity>
          <Link href="/ltv" asChild>
            <TouchableOpacity style={styles.navBtn}>
              <Text style={styles.navBtnText}>LTV Calc</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/cash-flow" asChild>
            <TouchableOpacity style={styles.navBtn}>
              <Text style={styles.navBtnText}>Cash Flow</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Highlight Result Card */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>TOTAL ESTIMATED MONTHLY PAYMENT</Text>
          <Text style={styles.highlightValue}>
            ${result.totalMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.highlightSub}>
            Principal & Interest: ${result.monthlyPrincipalAndInterest.toLocaleString()} / mo
          </Text>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Loan Amount</Text>
            <Text style={styles.breakdownValue}>${result.loanAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Down Payment ({result.downPaymentPercent}%)</Text>
            <Text style={styles.breakdownValue}>${(parseFloat(downPayment) || 0).toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Monthly Property Tax</Text>
            <Text style={styles.breakdownValue}>${result.monthlyPropertyTax.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Monthly Home Insurance</Text>
            <Text style={styles.breakdownValue}>${result.monthlyInsurance.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Monthly HOA</Text>
            <Text style={styles.breakdownValue}>${result.monthlyHOA.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownTotalRow]}>
            <Text style={styles.breakdownLabelBold}>Total Loan Interest</Text>
            <Text style={styles.breakdownValueBold}>${result.totalInterestPaid.toLocaleString()}</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Loan Parameters</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Home Purchase Price ($)</Text>
            <TextInput
              style={styles.input}
              value={homePrice}
              onChangeText={setHomePrice}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Down Payment ($)</Text>
            <TextInput
              style={styles.input}
              value={downPayment}
              onChangeText={setDownPayment}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Interest Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Term (Years)</Text>
              <TextInput
                style={styles.input}
                value={loanTerm}
                onChangeText={setLoanTerm}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Property Tax ($)</Text>
            <TextInput
              style={styles.input}
              value={propertyTax}
              onChangeText={setPropertyTax}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Homeowners Insurance ($)</Text>
            <TextInput
              style={styles.input}
              value={insurance}
              onChangeText={setInsurance}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly HOA Fees ($)</Text>
            <TextInput
              style={styles.input}
              value={hoa}
              onChangeText={setHoa}
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
  navRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    alignItems: 'center',
  },
  navBtnActive: {
    backgroundColor: '#3B82F6',
  },
  navBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  navBtnTextActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  highlightValue: {
    color: '#F8FAFC',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
  },
  highlightSub: {
    color: '#94A3B8',
    fontSize: 13,
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
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  breakdownTotalRow: {
    marginTop: 8,
    borderBottomWidth: 0,
    paddingTop: 10,
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
  breakdownLabelBold: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownValueBold: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
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
