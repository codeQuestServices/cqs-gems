import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { calculateLTV } from '@cqs/finance-logic';

export interface PmiIndicatorProps {
  loanAmount: number;
  homePrice: number;
}

export const PmiIndicator: React.FC<PmiIndicatorProps> = ({
  loanAmount,
  homePrice,
}) => {
  const ltvResult = calculateLTV({
    loanAmount,
    appraisedValue: homePrice,
  });

  const {
    ltvRatio,
    requiresPMI,
    estimatedMonthlyPMI,
    amountNeededToReach80LTV,
  } = ltvResult;

  if (homePrice <= 0) return null;

  return (
    <View
      style={[
        styles.container,
        requiresPMI ? styles.warningBorder : styles.safeBorder,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons
            name={requiresPMI ? 'alert-circle' : 'shield-checkmark'}
            size={20}
            color={requiresPMI ? '#F43F5E' : '#10B981'}
          />
          <Text style={styles.titleText}>
            {requiresPMI ? 'PMI Auto-Detected' : 'Conventional Equity (No PMI)'}
          </Text>
        </View>

        <View
          style={[
            styles.ltvBadge,
            requiresPMI ? styles.badgeWarning : styles.badgeSafe,
          ]}
        >
          <Text
            style={[
              styles.ltvBadgeText,
              requiresPMI ? styles.badgeTextWarning : styles.badgeTextSafe,
            ]}
          >
            LTV: {ltvRatio}%
          </Text>
        </View>
      </View>

      {requiresPMI ? (
        <View style={styles.contentGroup}>
          <Text style={styles.description}>
            Because down payment is under 20% (LTV &gt; 80%), lenders typically mandate Private Mortgage Insurance.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Est. Monthly PMI</Text>
              <Text style={styles.statValueWarning}>
                +${estimatedMonthlyPMI.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Down Payment Gap</Text>
              <Text style={styles.statValue}>
                +${amountNeededToReach80LTV.toLocaleString()} to reach 80% LTV
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.contentGroup}>
          <Text style={styles.safeDescription}>
            Your equity position is {ltvResult.equityPercent}% (&gt; 20%), saving you money every month with zero PMI fees!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  warningBorder: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
  },
  safeBorder: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '700',
  },
  ltvBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeWarning: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderColor: '#F43F5E',
  },
  badgeSafe: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  ltvBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextWarning: {
    color: '#FDA4AF',
  },
  badgeTextSafe: {
    color: '#6EE7B7',
  },
  contentGroup: {
    marginTop: 10,
  },
  description: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  safeDescription: {
    color: '#34D399',
    fontSize: 12,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#09090B',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValueWarning: {
    color: '#FB7185',
    fontSize: 13,
    fontWeight: '700',
  },
  statValue: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: '600',
  },
});
