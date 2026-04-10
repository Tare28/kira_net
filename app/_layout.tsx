import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { VisitPlanProvider } from '@/context/VisitPlanContext';
import { FilterProvider } from '@/context/FilterContext';
import { SavedProvider } from '@/context/SavedContext';
import { AlertsProvider } from '@/context/AlertsContext';
import '@/localization/i18n'; // Bootstrap i18next — must be imported before any screen renders

import { useColorScheme } from '@/hooks/use-color-scheme';
import * as SplashScreen from 'expo-splash-screen';
import Animated, { FadeIn, FadeOut, SlideInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { KiraColors } from '@/constants/colors';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash loader bar: animates from 0 → full width
  const loaderProgress = useSharedValue(0);
  const loaderStyle = useAnimatedStyle(() => ({
    width: `${loaderProgress.value * 100}%` as any,
  }));

  useEffect(() => {
    // Start the loading bar animation from 0 → 100% over 2.2s
    loaderProgress.value = withTiming(1, { duration: 2200 });

    const timer = setTimeout(() => {
      setAppReady(true);
      // Let the custom splash show until the bar finishes
      setTimeout(() => {
        setShowSplash(false);
        SplashScreen.hideAsync();
      }, 3000);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AlertsProvider>
      <SavedProvider>
        <VisitPlanProvider>
          <FilterProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <View style={{ flex: 1 }}>
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

                {showSplash && (
                  <Animated.View 
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(800)}
                    style={StyleSheet.absoluteFill}
                  >
                    <Image 
                      source={require('../assets/images/splash.png')}
                      style={StyleSheet.absoluteFill}
                      contentFit="cover"
                    />
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    
                    <View style={styles.splashContent}>
                       <Animated.View entering={SlideInDown.delay(300).springify()}>
                          <View style={styles.logoWrap}>
                            <FontAwesome5 name="feather-alt" size={40} color="#FFF" />
                          </View>
                          <Text style={styles.splashTitle}>Kira-Net</Text>
                          <Text style={styles.splashSubtitle}>Properties in Addis</Text>
                       </Animated.View>

                       <View style={styles.loaderContainer}>
                          <View style={styles.loaderLine}>
                            <Animated.View style={[styles.loaderActive, loaderStyle]} />
                          </View>
                       </View>
                    </View>
                  </Animated.View>
                )}
              </View>
              <StatusBar style="light" />
            </ThemeProvider>
          </FilterProvider>
        </VisitPlanProvider>
      </SavedProvider>
    </AlertsProvider>
  );
}

const styles = StyleSheet.create({
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: KiraColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  splashTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFF', // Keeping white title because it sits on a dark frosted background
    letterSpacing: -2,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 4,
    textAlign: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
  },
  loaderLine: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderActive: {
    height: '100%',
    width: '100%',
    backgroundColor: KiraColors.primary,
  }
});
