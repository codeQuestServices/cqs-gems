import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PortfolioProvider } from '../src/context/PortfolioContext';

export default function RootLayout() {
  return (
    <PortfolioProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#090D16',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-property"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Add New Property',
            headerStyle: { backgroundColor: '#0F172A' },
            headerTintColor: '#F8FAFC',
          }}
        />
      </Stack>
    </PortfolioProvider>
  );
}
