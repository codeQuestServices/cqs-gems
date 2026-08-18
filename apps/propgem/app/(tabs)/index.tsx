import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { calculateMortgage, calculateLTV } from '@cqs/finance-logic';
import { usePortfolio } from '../../src/context/PortfolioContext';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { PortfolioKpiSummary } from '../../src/components/PortfolioKpiSummary';
import { SliderInput } from '../../src/components/SliderInput';
import { StackedOutflowBar } from '../../src/components/StackedOutflowBar';
import { PmiIndicator } from '../../src/components/PmiIndicator';
import { PropertyCard } from '../../src/components/PropertyCard';
import { CollapsibleSection } from '../../src/components/CollapsibleSection';
import { triggerLightImpact, triggerSelectionHaptic } from '../../src/utils/haptics';

export default function HomeownerAndPortfolioScreen() {
  const { screenBottomPadding } = useSafeInsets();
  const {
    properties,
    filter,
    setFilter,
    filteredProperties,
    summary,
    deleteProperty,
  } = usePortfolio();

  // Homeowner Calculator State
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(4200);
  const [insurance, setInsurance] = useState(1200);
  const [hoa, setHoa] = useState(150);

  // Quick Down Payment Chips
  const setDownPaymentPercent = (percent: number) => {
    triggerLightImpact();
    const calculated = Math.round((homePrice * percent) / 100);
    setDownPayment(calculated);
  };

  const handleTermChange = (term: number) => {
    triggerLightImpact();
    setLoanTerm(term);
  };

  // Perform Calculation via @cqs/finance-logic
  const mortgageResult = useMemo(() => {
    return calculateMortgage({
      homePrice,
      downPayment,
      annualInterestRate: interestRate,
      loanTermYears: loanTerm,
      annualPropertyTax: propertyTax,
      annualHomeownersInsurance: insurance,
      monthlyHOA: hoa,
    });
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance, hoa]);

  const ltvResult = useMemo(() => {
    return calculateLTV({
      loanAmount: mortgageResult.loanAmount,
      appraisedValue: homePrice,
    });
  }, [mortgageResult.loanAmount, homePrice]);

  const totalWithPmi = mortgageResult.totalMonthlyPayment + (ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0);
  const monthlyEscrowTotal = mortgageResult.monthlyPropertyTax + mortgageResult.monthlyInsurance + mortgageResult.monthlyHOA;

  const primaryCount = properties.filter((p) => p.propertyType === 'PRIMARY').length;
  const rentalCount = properties.filter((p) => p.propertyType === 'RENTAL').length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: screenBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Portfolio KPI Summary Component */}
        <PortfolioKpiSummary
          summary={summary}
          totalPropertiesCount={properties.length}
        />

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.mainTitle}>Homeowner Financing Sandbox</Text>
            <Text style={styles.subTitle}>
              Real-time payment simulation, PMI detection, and outflow composition
            </Text>
          </View>
        </View>

        {/* Highlight Payment Hero Card: 1 Primary Metric + 2 Supporting Metrics */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>ESTIMATED TOTAL MONTHLY PAYMENT</Text>
          <Text style={styles.heroValue}>
            ${totalWithPmi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.heroSub}>
            P&I: ${mortgageResult.monthlyPrincipalAndInterest.toLocaleString()} | Taxes & Escrows: ${monthlyEscrowTotal.toLocaleString()}/mo
          </Text>
        </View>

        {/* PMI Auto-Detection Alert */}
        <PmiIndicator
          loanAmount={mortgageResult.loanAmount}
          homePrice={homePrice}
        />

        {/* Visual Stacked Outflow Breakdown Bar */}
        <StackedOutflowBar
          principalAndInterest={mortgageResult.monthlyPrincipalAndInterest}
          propertyTax={mortgageResult.monthlyPropertyTax}
          insurance={mortgageResult.monthlyInsurance}
          hoa={mortgageResult.monthlyHOA}
          pmi={ltvResult.requiresPMI ? ltvResult.estimatedMonthlyPMI : 0}
          totalMonthlyPayment={totalWithPmi}
        />

        {/* Primary Interactive Loan Parameters (4 Visible Core Controls) */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Core Loan Parameters</Text>

          {/* Home Purchase Price Slider */}
          <SliderInput
            label="Home Purchase Price"
            value={homePrice}
            onChange={(val) => {
              setHomePrice(val);
              // Maintain down payment ratio if price adjusts
              const ratio = homePrice > 0 ? downPayment / homePrice : 0.2;
              setDownPayment(Math.round(val * ratio));
            }}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            accentColor="#F59E0B"
          />

          {/* Down Payment Slider with Quick Chips */}
          <View style={styles.downPaymentHeaderRow}>
            <Text style={styles.subLabel}>Down Payment ({mortgageResult.downPaymentPercent}%)</Text>
            <View style={styles.chipRow}>
              {[5, 10, 20, 25].map((pct) => (
                <TouchableOpacity
                  key={pct}
                  style={[
                    styles.chip,
                    Math.abs(mortgageResult.downPaymentPercent - pct) < 0.5 && styles.chipActive,
                  ]}
                  onPress={() => setDownPaymentPercent(pct)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      Math.abs(mortgageResult.downPaymentPercent - pct) < 0.5 && styles.chipTextActive,
                    ]}
                  >
                    {pct}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <SliderInput
            label="Down Payment Amount"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={homePrice}
            step={1000}
            prefix="$"
            accentColor="#38BDF8"
          />

          {/* Interest Rate Slider */}
          <SliderInput
            label="Mortgage Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={1.0}
            max={15.0}
            step={0.125}
            suffix="%"
            accentColor="#818CF8"
          />

          {/* Loan Term Toggle Buttons (Min 44dp height) */}
          <View style={styles.termContainer}>
            <Text style={styles.subLabel}>Loan Duration (Years)</Text>
            <View style={styles.termToggleRow}>
              <TouchableOpacity
                style={[styles.termBtn, loanTerm === 15 && styles.termBtnActive]}
                onPress={() => handleTermChange(15)}
                activeOpacity={0.8}
              >
                <Text style={[styles.termBtnText, loanTerm === 15 && styles.termBtnTextActive]}>
                  15-Year Fixed
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.termBtn, loanTerm === 30 && styles.termBtnActive]}
                onPress={() => handleTermChange(30)}
                activeOpacity={0.8}
              >
                <Text style={[styles.termBtnText, loanTerm === 30 && styles.termBtnTextActive]}>
                  30-Year Fixed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Progressive Disclosure: Advanced Escrows & Property Fees Accordion */}
        <CollapsibleSection
          title="Taxes, Insurance & HOA Escrows"
          subtitle="Annual property tax, insurance, and recurring HOA dues"
          badge={`$${monthlyEscrowTotal}/mo`}
          icon="receipt-outline"
        >
          {/* Property Tax */}
          <SliderInput
            label="Annual Property Tax"
            value={propertyTax}
            onChange={setPropertyTax}
            min={0}
            max={25000}
            step={100}
            prefix="$"
            helperText={`$${Math.round(propertyTax / 12)}/mo`}
            accentColor="#F59E0B"
          />

          {/* Home Insurance */}
          <SliderInput
            label="Annual Home Insurance"
            value={insurance}
            onChange={setInsurance}
            min={0}
            max={10000}
            step={50}
            prefix="$"
            helperText={`$${Math.round(insurance / 12)}/mo`}
            accentColor="#818CF8"
          />

          {/* HOA Dues */}
          <SliderInput
            label="Monthly HOA Dues"
            value={hoa}
            onChange={setHoa}
            min={0}
            max={2000}
            step={25}
            prefix="$"
            suffix="/mo"
            accentColor="#A78BFA"
          />
        </CollapsibleSection>

        {/* Distinct Portfolio Assets Section */}
        <View style={styles.portfolioSection}>
          <View style={styles.portfolioHeaderRow}>
            <View>
              <Text style={styles.propertiesSectionTitle}>
                Real Estate Portfolio ({filteredProperties.length})
              </Text>
              <Text style={styles.portfolioSubtitle}>
                Track valuation, remaining debt, and equity across your portfolio
              </Text>
            </View>
            <Link href="/add-property" asChild>
              <TouchableOpacity
                style={styles.addPropertyBtn}
                onPress={() => triggerLightImpact()}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#09090B" />
                <Text style={styles.addPropertyBtnText}>Add Asset</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterPillsRow}>
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  filter === 'ALL' && styles.filterPillActive,
                ]}
                onPress={() => {
                  triggerSelectionHaptic();
                  setFilter('ALL');
                }}
                activeOpacity={0.7}
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
                onPress={() => {
                  triggerSelectionHaptic();
                  setFilter('PRIMARY');
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === 'PRIMARY' && styles.filterPillTextActive,
                  ]}
                >
                  Primary ({primaryCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterPill,
                  filter === 'RENTAL' && styles.filterPillActive,
                ]}
                onPress={() => {
                  triggerSelectionHaptic();
                  setFilter('RENTAL');
                }}
                activeOpacity={0.7}
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
          </View>

          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onDelete={deleteProperty}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeaderRow: {
    marginBottom: 14,
  },
  mainTitle: {
    color: '#FAFAFA',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  subTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
  },
  heroCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  heroLabel: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroValue: {
    color: '#FAFAFA',
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroSub: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardSectionTitle: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  downPaymentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subLabel: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  chipText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#09090B',
  },
  termContainer: {
    marginBottom: 8,
  },
  termToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#09090B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    height: 46, // Exceeds 44x44 dp standard
  },
  termBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termBtnActive: {
    backgroundColor: '#3B82F6',
  },
  termBtnText: {
    color: '#71717A',
    fontWeight: '600',
    fontSize: 13,
  },
  termBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  portfolioSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  portfolioHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portfolioSubtitle: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    minHeight: 38,
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#27272A',
    borderColor: '#38BDF8',
  },
  filterPillText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FAFAFA',
    fontWeight: '700',
  },
  addPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
    minHeight: 44, // Exceeds 44x44 dp standard
  },
  addPropertyBtnText: {
    color: '#09090B',
    fontSize: 13,
    fontWeight: '800',
  },
  propertiesSectionTitle: {
    color: '#FAFAFA',
    fontSize: 17,
    fontWeight: '800',
  },
});

