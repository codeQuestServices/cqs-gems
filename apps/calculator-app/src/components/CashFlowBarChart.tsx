import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CashFlowBarChartProps {
  rentIncome: number;
  mortgagePAndI: number;
  taxes: number;
  insurance: number;
  hoaAndMaint: number;
  netCashFlow: number;
}

export const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({
  rentIncome,
  mortgagePAndI,
  taxes,
  insurance,
  hoaAndMaint,
  netCashFlow,
}) => {
  const maxValue = Math.max(
    rentIncome,
    mortgagePAndI,
    taxes,
    insurance,
    hoaAndMaint,
    Math.abs(netCashFlow),
    1
  );

  const getBarHeight = (val: number) => {
    return Math.max(12, Math.min(100, (Math.abs(val) / maxValue) * 100));
  };

  const isPositiveCashFlow = netCashFlow >= 0;

  const barItems = [
    {
      label: 'Rent Income',
      value: `+$${rentIncome.toLocaleString()}`,
      color: '#10B981', // Emerald
      height: getBarHeight(rentIncome),
    },
    {
      label: 'Mortgage P&I',
      value: `-$${mortgagePAndI.toLocaleString()}`,
      color: '#3B82F6', // Blue
      height: getBarHeight(mortgagePAndI),
    },
    {
      label: 'Taxes',
      value: `-$${taxes.toLocaleString()}`,
      color: '#EF4444', // Red
      height: getBarHeight(taxes),
    },
    {
      label: 'Insurance',
      value: `-$${insurance.toLocaleString()}`,
      color: '#F97316', // Orange
      height: getBarHeight(insurance),
    },
    {
      label: 'HOA/Maint',
      value: `-$${hoaAndMaint.toLocaleString()}`,
      color: '#EAB308', // Yellow/Gold
      height: getBarHeight(hoaAndMaint),
    },
    {
      label: 'Net Flow',
      value: `${isPositiveCashFlow ? '+' : '-'}$${Math.abs(netCashFlow).toLocaleString()}`,
      color: isPositiveCashFlow ? '#10B981' : '#EF4444',
      height: getBarHeight(netCashFlow),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Monthly Financial Breakdown ($/mo)</Text>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendLabel}>Rent Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendLabel}>Mortgage</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendLabel}>Expenses</Text>
        </View>
      </View>

      {/* Bar Columns Container */}
      <View style={styles.chartBody}>
        {barItems.map((item, index) => (
          <View key={index} style={styles.columnWrapper}>
            <Text style={styles.barValue}>{item.value}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${item.height}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#131D2F',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  chartBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  columnWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    color: '#F1F5F9',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  barLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
