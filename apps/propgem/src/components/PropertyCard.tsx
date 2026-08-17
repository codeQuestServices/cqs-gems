import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PortfolioProperty } from '@cqs/finance-logic';

interface PropertyCardProps {
  property: PortfolioProperty;
  onDelete?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete }) => {
  const equityNet = Math.max(0, property.marketValue - property.loanBalance);
  const equityPercent = property.marketValue > 0 ? Math.round((equityNet / property.marketValue) * 100) : 0;

  const totalMonthlyExpenses =
    property.monthlyMortgagePAndI +
    property.monthlyPropertyTax +
    property.monthlyInsurance +
    property.monthlyHOA +
    property.monthlyMaintenance;

  const netCashFlow = property.monthlyRentIncome - totalMonthlyExpenses;
  const isPrimary = property.propertyType === 'PRIMARY';
  const isPositiveCashFlow = netCashFlow >= 0;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.nameText}>{property.name}</Text>
          <Text style={styles.addressText}>{property.address}</Text>
        </View>
        <View
          style={[
            styles.typeBadge,
            isPrimary ? styles.primaryBadge : styles.rentalBadge,
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              isPrimary ? styles.primaryBadgeText : styles.rentalBadgeText,
            ]}
          >
            {isPrimary ? 'LIVE IN' : 'RENTAL'}
          </Text>
        </View>
      </View>

      {/* 2x2 Valuation Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Market Value</Text>
          <Text style={styles.statValue}>${property.marketValue.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Loan Balance</Text>
          <Text style={styles.statValue}>${property.loanBalance.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Equity Net</Text>
          <Text style={styles.statValueGold}>
            ${equityNet.toLocaleString()} ({equityPercent}%)
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Mortgage P&I</Text>
          <Text style={styles.statValue}>${property.monthlyMortgagePAndI.toLocaleString()}/mo</Text>
        </View>
      </View>

      {/* Cash Flow Summary Footer */}
      <View style={styles.cashFlowBanner}>
        {isPrimary ? (
          <>
            <View>
              <Text style={styles.bannerSubLabel}>Owner Monthly Outflow</Text>
              <Text style={styles.bannerNegativeValue}>-${totalMonthlyExpenses.toLocaleString()}/mo</Text>
            </View>
            <View style={styles.rightBannerCol}>
              <Text style={styles.bannerSubLabel}>Net Cash Flow</Text>
              <Text style={styles.bannerNegativeValue}>-${totalMonthlyExpenses.toLocaleString()}/mo</Text>
            </View>
          </>
        ) : (
          <>
            <View>
              <Text style={styles.bannerSubLabel}>Monthly Rent Income</Text>
              <Text style={styles.bannerPositiveValue}>+${property.monthlyRentIncome.toLocaleString()}/mo</Text>
            </View>
            <View style={styles.rightBannerCol}>
              <Text style={styles.bannerSubLabel}>Net Cash Flow</Text>
              <Text
                style={[
                  styles.bannerValue,
                  { color: isPositiveCashFlow ? '#4ADE80' : '#F87171' },
                ]}
              >
                {isPositiveCashFlow ? '+' : ''}${netCashFlow.toLocaleString()}/mo
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Metadata Footnote */}
      <View style={styles.footerInfoRow}>
        <Text style={styles.footerDate}>
          Purchased: {property.purchaseDate || 'N/A'} • Financed: {property.financedDate || 'N/A'}
        </Text>
        {property.tenantName && (
          <Text style={styles.tenantText}>Tenant: {property.tenantName}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  titleCol: {
    flex: 1,
    paddingRight: 8,
  },
  nameText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  addressText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primaryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  primaryBadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rentalBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  rentalBadgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statBox: {
    width: '50%',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '700',
  },
  statValueGold: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '700',
  },
  cashFlowBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  rightBannerCol: {
    alignItems: 'flex-end',
  },
  bannerSubLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerPositiveValue: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerNegativeValue: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  footerDate: {
    color: '#64748B',
    fontSize: 10,
  },
  tenantText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
});
