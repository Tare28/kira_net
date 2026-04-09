import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { VisitPlanProvider } from '@/context/VisitPlanContext';
import { FilterProvider } from '@/context/FilterContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <VisitPlanProvider>
      <FilterProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="chat" />
          <Stack.Screen name="list-property" />
          <Stack.Screen name="boost-listing" />
          <Stack.Screen name="report-listing" />
          <Stack.Screen name="property-details" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="landlord-dashboard" />
          <Stack.Screen name="visit-planner" />
          <Stack.Screen name="roommate-match" />
          <Stack.Screen name="rental-agreement" />
          <Stack.Screen name="moving-services" />
          <Stack.Screen name="offline-maps" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      </FilterProvider>
    </VisitPlanProvider>
  );
}
