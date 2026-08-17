import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PortfolioSummary } from '@cqs/finance-logic';

export interface PortfolioKpiSummaryProps {
  summary: PortfolioSummary;
  totalPropertiesCount: number;
}

export const PortfolioKpiSummary: React.FC<PortfolioKpiSummaryProps> = ({
  summary,
  totalPropertiesCount,
}) => {
  const isPositiveCashFlow = summary.netMonthlyCashFlow >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.indicatorDot} />
          <Text style={styles.headerTitle}>PORTFOLIO SUMMARY</Text>
        </View>
        <Text style={styles.propertyCountBadge}>
          {totalPropertiesCount} {totalPropertiesCount === 1 ? 'Asset' : 'Assets'}
        </Text>
      </View>

      <View style={styles.gridRow}>
        {/* Metric 1: Net Real Estate Equity */}
        <View style={[styles.kpiCell, styles.cellBorderRight]}>
          <Text style={styles.kpiLabel}>NET REAL ESTATE EQUITY</Text>
          <Text style={styles.kpiValueGold}>
            ${summary.netRealEstateEquity.toLocaleString()}
          </Text>
          <Text style={styles.kpiSub}>
            {summary.equitySharePercent}% Equity ({summary.blendedLTV}% LTV)
          </Text>
        </View>

        {/* Metric 2: Total Mortgage Debt */}
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>TOTAL MORTGAGE DEBT</Text>
          <Text style={styles.kpiValue}>
            ${summary.totalMortgageDebt.toLocaleString()}
          </Text>
          <Text style={styles.kpiSub}>
            Asset: ${summary.totalAssetValue.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.gridRow}>
        {/* Metric 3: Net Monthly Cash Flow */}
        <View style={[styles.kpiCell, styles.cellBorderRight]}>
          <Text style={styles.kpiLabel}>NET MONTHLY CASH FLOW</Text>
          <Text
            style={[
              styles.kpiValue,
              { color: isPositiveCashFlow ? '#4ADE80' : '#F87171' },
            ]}
          >
            {isPositiveCashFlow ? '+' : ''}${summary.netMonthlyCashFlow.toLocaleString()}
            <Text style={styles.unitText}>/mo</Text>
          </Text>
          <Text style={styles.kpiSub}>
            ${(summary.netMonthlyCashFlow * 12).toLocaleString()}/yr
          </Text>
        </View>

        {/* Metric 4: Portfolio Cap Rate */}
        <View style={styles.kpiCell}>
          <Text style={styles.kpiLabel}>PORTFOLIO CAP RATE</Text>
          <Text style={styles.kpiValueSky}>
            {summary.portfolioCapRate}%
          </Text>
          <Text style={styles.kpiSub}>
            Annual NOI: ${summary.annualizedNOI.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#09090B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  headerTitle: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  propertyCountBadge: {
    backgroundColor: '#18181B',
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272A',
    marginVertical: 12,
  },
  kpiCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  cellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: '#27272A',
    marginRight: 10,
  },
  kpiLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  kpiValue: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  kpiValueGold: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  kpiValueSky: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A1A1AA',
  },
  kpiSub: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
  },
});
