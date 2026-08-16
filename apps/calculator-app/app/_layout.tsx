import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#090D16',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Mortgage Calculator',
          }}
        />
        <Stack.Screen
          name="ltv"
          options={{
            title: 'LTV & Equity Calculator',
          }}
        />
        <Stack.Screen
          name="cash-flow"
          options={{
            title: 'Cash Flow & Cap Rate',
          }}
        />
      </Stack>
    </>
  );
}
