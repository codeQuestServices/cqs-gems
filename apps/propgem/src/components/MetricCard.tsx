import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetricCardProps {
  label: string;
  value: string;
  subValue: string;
  valueColor?: string;
  isHighlighted?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  valueColor = '#F8FAFC',
  isHighlighted = false,
}) => {
  return (
    <View style={[styles.card, isHighlighted && styles.highlightedCard]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.subValue} numberOfLines={1}>
        {subValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131D2F',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    flex: 1,
    minWidth: '47%',
  },
  highlightedCard: {
    borderColor: 'rgba(234, 179, 8, 0.4)', // Subtle gold border
  },
  label: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subValue: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
});
