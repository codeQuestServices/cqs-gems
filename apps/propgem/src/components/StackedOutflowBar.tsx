import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface OutflowBreakdownItem {
  id: string;
  label: string;
  amount: number;
  color: string;
}

export interface StackedOutflowBarProps {
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  pmi?: number;
  totalMonthlyPayment: number;
}

export const StackedOutflowBar: React.FC<StackedOutflowBarProps> = ({
  principalAndInterest,
  propertyTax,
  insurance,
  hoa,
  pmi = 0,
  totalMonthlyPayment,
}) => {
  const items: OutflowBreakdownItem[] = [
    { id: 'pi', label: 'Principal & Interest', amount: principalAndInterest, color: '#38BDF8' }, // Sky Blue
    { id: 'tax', label: 'Property Tax', amount: propertyTax, color: '#F59E0B' }, // Amber
    { id: 'ins', label: 'Home Insurance', amount: insurance, color: '#818CF8' }, // Indigo
    { id: 'hoa', label: 'HOA Dues', amount: hoa, color: '#A78BFA' }, // Purple
  ];

  if (pmi > 0) {
    items.push({ id: 'pmi', label: 'Private Mortgage Ins. (PMI)', amount: pmi, color: '#F43F5E' }); // Rose
  }

  const safeTotal = Math.max(1, totalMonthlyPayment);

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>Monthly Outflow Breakdown</Text>
      
      {/* Horizontal Stacked Bar */}
      <View style={styles.barContainer}>
        {items.map((item) => {
          if (item.amount <= 0) return null;
          const percentage = (item.amount / safeTotal) * 100;
          return (
            <View
              key={item.id}
              style={[
                styles.barSegment,
                {
                  width: `${percentage}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Breakdown Items List */}
      <View style={styles.itemsList}>
        {items.map((item) => {
          if (item.amount <= 0) return null;
          const percentage = Math.round((item.amount / safeTotal) * 100);
          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemPercent}>({percentage}%)</Text>
              </View>
              <Text style={styles.itemAmount}>
                ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardTitle: {
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#27272A',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemLabel: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '500',
  },
  itemPercent: {
    color: '#71717A',
    fontSize: 12,
  },
  itemAmount: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
  },
});
