import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortfolio, PortfolioFilter } from '../../src/context/PortfolioContext';
import { MetricCard } from '../../src/components/MetricCard';
import { DonutChart } from '../../src/components/DonutChart';
import { CashFlowBarChart } from '../../src/components/CashFlowBarChart';
import { PropertyCard } from '../../src/components/PropertyCard';

export default function DashboardScreen() {
  const {
    properties,
    filter,
    setFilter,
    filteredProperties,
    summary,
    deleteProperty,
  } = usePortfolio();

  const primaryCount = properties.filter((p) => p.propertyType === 'PRIMARY').length;
  const rentalCount = properties.filter((p) => p.propertyType === 'RENTAL').length;

  const isPositiveCashFlow = summary.netMonthlyCashFlow >= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Title Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.mainTitle}>Real Estate Investment & Expense</Text>
              <Text style={styles.subTitle}>
                Track property cash flow, mortgage debt, and equity growth
              </Text>
            </View>
          </View>
        </View>

        {/* 4 Hero Metric Cards in 2x2 Grid */}
        <View style={styles.metricGrid}>
          <MetricCard
            label="NET REAL ESTATE EQUITY"
            value={`$${summary.netRealEstateEquity.toLocaleString()}`}
            subValue={`Asset: $${summary.totalAssetValue.toLocaleString()} | LTV: ${summary.blendedLTV}%`}
            valueColor="#FBBF24" // Gold
            isHighlighted
          />
          <MetricCard
            label="TOTAL MORTGAGE DEBT"
            value={`$${summary.totalMortgageDebt.toLocaleString()}`}
            subValue={`Across ${properties.length} properties`}
            valueColor="#F1F5F9"
          />
          <MetricCard
            label="NET MONTHLY CASH FLOW"
            value={`${isPositiveCashFlow ? '+' : ''}$${summary.netMonthlyCashFlow.toLocaleString()}`}
            subValue={`Income: +$${summary.totalMonthlyIncome.toLocaleString()} | Exp: -$${summary.totalMonthlyExpenses.toLocaleString()}`}
            valueColor={isPositiveCashFlow ? '#4ADE80' : '#F87171'}
          />
          <MetricCard
            label="PORTFOLIO CAP RATE"
            value={`${summary.portfolioCapRate}%`}
            subValue={`Annual NOI: $${summary.annualizedNOI.toLocaleString()}`}
            valueColor="#38BDF8"
          />
        </View>

        {/* Visual Charts: Cash Flow Breakdown & Donut Chart */}
        <CashFlowBarChart
          rentIncome={summary.breakdown.rentIncome}
          mortgagePAndI={summary.breakdown.mortgagePAndI}
          taxes={summary.breakdown.taxes}
          insurance={summary.breakdown.insurance}
          hoaAndMaint={summary.breakdown.hoaAndMaintenance}
          netCashFlow={summary.netMonthlyCashFlow}
        />

        <View style={styles.chartRow}>
          <DonutChart
            equityPercent={summary.equitySharePercent}
            equityValue={summary.netRealEstateEquity}
            debtValue={summary.totalMortgageDebt}
          />
        </View>

        {/* Filter Pills & Add Property Button */}
        <View style={styles.filterSection}>
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'ALL' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('ALL')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'ALL' && styles.filterPillTextActive,
                ]}
              >
                All ({properties.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'PRIMARY' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('PRIMARY')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'PRIMARY' && styles.filterPillTextActive,
                ]}
              >
                Owner Occupied ({primaryCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filter === 'RENTAL' && styles.filterPillActive,
              ]}
              onPress={() => setFilter('RENTAL')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filter === 'RENTAL' && styles.filterPillTextActive,
                ]}
              >
                Rentals ({rentalCount})
              </Text>
            </TouchableOpacity>
          </View>

          <Link href="/add-property" asChild>
            <TouchableOpacity style={styles.addPropertyBtn}>
              <Ionicons name="add" size={16} color="#090D16" />
              <Text style={styles.addPropertyBtnText}>Add Property</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Section Title */}
        <Text style={styles.propertiesSectionTitle}>
          Managed Properties ({filteredProperties.length})
        </Text>

        {/* Property Cards List */}
        {filteredProperties.map((prop) => (
          <PropertyCard
            key={prop.id}
            property={prop}
            onDelete={deleteProperty}
          />
        ))}
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
  header: {
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subTitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  chartRow: {
    marginBottom: 16,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#334155',
    borderColor: '#60A5FA',
  },
  filterPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  addPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAB308', // Gold
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  addPropertyBtnText: {
    color: '#090D16',
    fontSize: 12,
    fontWeight: '800',
  },
  propertiesSectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
});
