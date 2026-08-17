import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortfolioProvider } from '../src/context/PortfolioContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PortfolioProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#09090B',
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
              headerStyle: { backgroundColor: '#18181B' },
              headerTintColor: '#FAFAFA',
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </PortfolioProvider>
    </SafeAreaProvider>
  );
}
