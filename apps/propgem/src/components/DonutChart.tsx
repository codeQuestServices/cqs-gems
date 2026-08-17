import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DonutChartProps {
  equityPercent: number; // e.g. 34 for 34%
  equityValue: number;
  debtValue: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  equityPercent,
  equityValue,
  debtValue,
}) => {
  const formattedEquity = `$${Math.round(equityValue / 1000)}k`;
  const formattedDebt = `$${Math.round(debtValue / 1000)}k`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equity vs. Debt Ratio</Text>
      
      <View style={styles.chartWrapper}>
        <View style={styles.donutOuter}>
          {/* Circular Ring Accent */}
          <View style={styles.donutRing}>
            <View
              style={[
                styles.equityArc,
                {
                  borderTopColor: '#EAB308', // Gold / Amber for equity
                  borderRightColor: '#EAB308',
                  borderBottomColor: '#3B82F6', // Blue for debt
                  borderLeftColor: '#3B82F6',
                },
              ]}
            />
            {/* Center Inner Hole */}
            <View style={styles.donutCenter}>
              <Text style={styles.percentText}>{Math.round(equityPercent)}%</Text>
              <Text style={styles.subText}>Equity Share</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Legend Footer */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EAB308' }]} />
          <Text style={styles.legendLabel}>Equity: <Text style={styles.legendBold}>{formattedEquity}</Text></Text>
        </View>
        <Text style={styles.legendDivider}>|</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendLabel}>Debt: <Text style={styles.legendBold}>{formattedDebt}</Text></Text>
        </View>
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
    alignItems: 'center',
    flex: 1,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  donutOuter: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 14,
    borderColor: '#3B82F6',
    borderTopColor: '#EAB308',
    borderRightColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotateZ: '-45deg' }],
  },
  equityArc: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  donutCenter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#131D2F',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotateZ: '45deg' }],
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  subText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  legendBold: {
    color: '#F1F5F9',
    fontWeight: '700',
  },
  legendDivider: {
    color: '#475569',
    fontSize: 12,
  },
});
