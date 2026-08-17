import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePortfolio } from '../src/context/PortfolioContext';
import { PropertyType } from '@cqs/finance-logic';

export default function AddPropertyModal() {
  const router = useRouter();
  const { addProperty } = usePortfolio();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('RENTAL');
  const [marketValue, setMarketValue] = useState('400000');
  const [loanBalance, setLoanBalance] = useState('300000');
  const [monthlyMortgagePAndI, setMonthlyMortgagePAndI] = useState('1800');
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState('300');
  const [monthlyInsurance, setMonthlyInsurance] = useState('100');
  const [monthlyHOA, setMonthlyHOA] = useState('50');
  const [monthlyMaintenance, setMonthlyMaintenance] = useState('150');
  const [monthlyRentIncome, setMonthlyRentIncome] = useState('2600');
  const [tenantName, setTenantName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;

    addProperty({
      name: name.trim(),
      address: address.trim() || 'Unspecified Address',
      propertyType,
      marketValue: parseFloat(marketValue) || 0,
      loanBalance: parseFloat(loanBalance) || 0,
      monthlyMortgagePAndI: parseFloat(monthlyMortgagePAndI) || 0,
      monthlyPropertyTax: parseFloat(monthlyPropertyTax) || 0,
      monthlyInsurance: parseFloat(monthlyInsurance) || 0,
      monthlyHOA: parseFloat(monthlyHOA) || 0,
      monthlyMaintenance: parseFloat(monthlyMaintenance) || 0,
      monthlyRentIncome: propertyType === 'PRIMARY' ? 0 : parseFloat(monthlyRentIncome) || 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      financedDate: new Date().toISOString().split('T')[0],
      tenantName: tenantName.trim() || undefined,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Property Identity</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Title / Nickname *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Henderson Rental Home"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 123 Main St, Las Vegas, NV"
              placeholderTextColor="#64748B"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Type</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  propertyType === 'PRIMARY' && styles.typeBtnActivePrimary,
                ]}
                onPress={() => setPropertyType('PRIMARY')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    propertyType === 'PRIMARY' && styles.typeBtnTextActive,
                  ]}
                >
                  Owner Occupied (Live In)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  propertyType === 'RENTAL' && styles.typeBtnActiveRental,
                ]}
                onPress={() => setPropertyType('RENTAL')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    propertyType === 'RENTAL' && styles.typeBtnTextActive,
                  ]}
                >
                  Rental Investment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Valuation & Debt</Text>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Current Market Value ($)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={marketValue}
                onChangeText={setMarketValue}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Remaining Loan ($)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={loanBalance}
                onChangeText={setLoanBalance}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly Mortgage P&I ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={monthlyMortgagePAndI}
              onChangeText={setMonthlyMortgagePAndI}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Income & Expenses</Text>
          
          {propertyType === 'RENTAL' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monthly Gross Rent Income ($)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={monthlyRentIncome}
                  onChangeText={setMonthlyRentIncome}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tenant Name (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#64748B"
                  value={tenantName}
                  onChangeText={setTenantName}
                />
              </View>
            </>
          )}

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Tax ($/mo)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyPropertyTax}
                onChangeText={setMonthlyPropertyTax}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Insurance ($/mo)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyInsurance}
                onChangeText={setMonthlyInsurance}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>HOA ($/mo)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyHOA}
                onChangeText={setMonthlyHOA}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Maintenance ($/mo)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyMaintenance}
                onChangeText={setMonthlyMaintenance}
              />
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!name.trim()}
        >
          <Text style={styles.saveBtnText}>Save Property to Portfolio</Text>
        </TouchableOpacity>
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
  inputGroup: {
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
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
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  typeBtnActivePrimary: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  typeBtnActiveRental: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  typeBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#EAB308',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#090D16',
    fontSize: 16,
    fontWeight: '800',
  },
});
