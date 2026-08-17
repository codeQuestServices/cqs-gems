import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { calculateCashFlow } from '@cqs/finance-logic';

export default function CashFlowScreen() {
  const [rent, setRent] = useState('3200');
  const [mortgage, setMortgage] = useState('1850');
  const [tax, setTax] = useState('350');
  const [insurance, setInsurance] = useState('100');
  const [hoa, setHoa] = useState('0');
  const [maintenance, setMaintenance] = useState('150');
  const [vacancy, setVacancy] = useState('150');
  const [mgmtFeePercent, setMgmtFeePercent] = useState('8');
  const [purchasePrice, setPurchasePrice] = useState('420000');
  const [initialInvestment, setInitialInvestment] = useState('95000');

  const result = useMemo(() => {
    return calculateCashFlow({
      grossMonthlyRentalIncome: parseFloat(rent) || 0,
      monthlyMortgagePayment: parseFloat(mortgage) || 0,
      monthlyPropertyTax: parseFloat(tax) || 0,
      monthlyInsurance: parseFloat(insurance) || 0,
      monthlyHOA: parseFloat(hoa) || 0,
      monthlyMaintenanceReserve: parseFloat(maintenance) || 0,
      monthlyVacancyReserve: parseFloat(vacancy) || 0,
      propertyManagementFeePercent: parseFloat(mgmtFeePercent) || 0,
      propertyPurchasePrice: parseFloat(purchasePrice) || 0,
      totalInitialInvestment: parseFloat(initialInvestment) || 0,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Highlight Result Card */}
        <View style={styles.cardHighlight}>
          <Text style={styles.highlightLabel}>NET MONTHLY CASH FLOW</Text>
          <Text
            style={[
              styles.highlightValue,
              { color: isPositiveCashFlow ? '#4ADE80' : '#F87171' },
            ]}
          >
            {isPositiveCashFlow ? '+' : ''}${result.monthlyCashFlow.toLocaleString()}
          </Text>
          <Text style={styles.highlightSub}>
            Annual Cash Flow: ${result.annualCashFlow.toLocaleString()} / yr
          </Text>
        </View>

        {/* Performance Metrics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Investment Return Metrics</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Cap Rate</Text>
              <Text style={styles.metricValue}>
                {result.capRate !== undefined ? `${result.capRate}%` : 'N/A'}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Cash on Cash</Text>
              <Text style={styles.metricValue}>
                {result.cashOnCashReturn !== undefined ? `${result.cashOnCashReturn}%` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Monthly Income</Text>
            <Text style={styles.breakdownValue}>${result.totalMonthlyIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Monthly Operating Expenses</Text>
            <Text style={styles.breakdownValue}>${result.operatingExpenses.toLocaleString()}</Text>
          </View>
          <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.breakdownLabel}>Monthly NOI (pre-debt)</Text>
            <Text style={styles.breakdownValueBold}>${result.netOperatingIncomeMonthly.toLocaleString()}</Text>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Property & Financial Inputs</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gross Monthly Rent ($)</Text>
            <TextInput
              style={styles.input}
              value={rent}
              onChangeText={setRent}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Mortgage P&I ($)</Text>
            <TextInput
              style={styles.input}
              value={mortgage}
              onChangeText={setMortgage}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Property Tax ($/mo)</Text>
              <TextInput
                style={styles.input}
                value={tax}
                onChangeText={setTax}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Insurance ($/mo)</Text>
              <TextInput
                style={styles.input}
                value={insurance}
                onChangeText={setInsurance}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Maintenance ($/mo)</Text>
              <TextInput
                style={styles.input}
                value={maintenance}
                onChangeText={setMaintenance}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Vacancy Reserve ($/mo)</Text>
              <TextInput
                style={styles.input}
                value={vacancy}
                onChangeText={setVacancy}
                keyboardType="numeric"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Management Fee (%)</Text>
            <TextInput
              style={styles.input}
              value={mgmtFeePercent}
              onChangeText={setMgmtFeePercent}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Price ($)</Text>
            <TextInput
              style={styles.input}
              value={purchasePrice}
              onChangeText={setPurchasePrice}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Initial Investment ($)</Text>
            <TextInput
              style={styles.input}
              value={initialInvestment}
              onChangeText={setInitialInvestment}
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
    fontSize: 36,
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
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '800',
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
