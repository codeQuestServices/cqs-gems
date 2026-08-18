import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeInsets } from '../../src/hooks/useSafeInsets';
import { triggerSelectionHaptic } from '../../src/utils/haptics';
import {
  PropGemEmblem,
  MortgagePIIcon,
  LtvShieldIcon,
  CashFlowChartIcon,
} from '../../src/components/icons/PropGemIcons';

export default function TabLayout() {
  const { tabBarHeight, tabBarPaddingBottom } = useSafeInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#09090B',
          borderBottomColor: '#27272A',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FAFAFA',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopColor: '#27272A',
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#71717A',
      }}
      screenListeners={{
        tabPress: () => {
          triggerSelectionHaptic();
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Homeowner',
          headerTitle: 'PropGem Homeowner & Portfolio',
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <PropGemEmblem size={24} accentColor="#38BDF8" color="#FAFAFA" />
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mortgage"
        options={{
          title: 'Mortgage',
          headerTitle: 'Mortgage Calculator',
          tabBarIcon: ({ color, size }) => (
            <MortgagePIIcon size={size} color={color} accentColor={color === '#38BDF8' ? '#38BDF8' : '#71717A'} />
          ),
        }}
      />
      <Tabs.Screen
        name="ltv"
        options={{
          title: 'LTV & Equity',
          headerTitle: 'Loan-to-Value & Equity',
          tabBarIcon: ({ color, size }) => (
            <LtvShieldIcon size={size} color={color} accentColor={color === '#38BDF8' ? '#22C55E' : '#71717A'} />
          ),
        }}
      />
      <Tabs.Screen
        name="cash-flow"
        options={{
          title: 'Investor',
          headerTitle: 'Investor Cash Flow Sandbox',
          tabBarIcon: ({ color, size }) => (
            <CashFlowChartIcon size={size} color={color} accentColor={color === '#38BDF8' ? '#22C55E' : '#71717A'} />
          ),
        }}
      />
    </Tabs>
  );
}
