import { Tabs, usePathname } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { KiraColors } from '@/constants/colors';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAlerts } from '@/context/AlertsContext';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

const CurvedBackground = ({ activeIndex }: { activeIndex: number }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const targetX = (activeIndex - (TAB_COUNT / 2 - 0.5)) * TAB_WIDTH;
    return {
      transform: [{ translateX: withSpring(targetX, { damping: 15, stiffness: 90 }) }],
    };
  });

  return (
    <View style={styles.svgContainer}>
      <Svg width={width} height={75} viewBox={`0 0 ${width} 75`} style={StyleSheet.absoluteFill}>
        <Path
          d={`M0 0 
             L${width / 2 - 36} 0 
             C${width / 2 - 26} 0, ${width / 2 - 22} 22, ${width / 2} 22 
             C${width / 2 + 22} 22, ${width / 2 + 26} 0, ${width / 2 + 36} 0 
             L${width} 0 
             L${width} 75 
             L0 75 
             Z`}
          fill="#FFFFFF"
        />
      </Svg>

      <Animated.View style={[styles.movingContainer, animatedDotStyle]}>
         <View style={styles.liquidDip} />
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { role } = useUser();

  const activeIndex = useMemo(() => {
    if (pathname === '/' || pathname === '/(tabs)') return 0;
    if (pathname.includes('locations')) return 1;
    if (pathname.includes('saved')) return 3;
    if (pathname.includes('profile')) return 4;
    return 2; // Spacer/Center
  }, [pathname]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: KiraColors.primary,
          tabBarInactiveTintColor: '#94A3B8',
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 58 + (Platform.OS === 'ios' ? insets.bottom : 0),
            backgroundColor: 'transparent',
            elevation: 0,
            borderTopWidth: 0,
          },
          tabBarBackground: () => <CurvedBackground activeIndex={activeIndex} />,
          tabBarLabelStyle: {
            fontSize: 8,
            fontWeight: '700',
            marginBottom: Platform.OS === 'ios' ? 0 : 6,
            marginTop: -2,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeDot} />}
                <View style={[styles.iconWrap, { transform: [{ scale: focused ? 1.15 : 1 }] }]}>
                  <Feather size={18} name="home" color={focused ? KiraColors.primary : '#94A3B8'} />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="locations"
          options={{
            title: role === 'landlord' ? 'Leads' : 'Areas',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeDot} />}
                <View style={[styles.iconWrap, { transform: [{ scale: focused ? 1.15 : 1 }] }]}>
                  {role === 'landlord' ? (
                    <Feather size={18} name="message-circle" color={focused ? KiraColors.primary : '#94A3B8'} />
                  ) : (
                    <Feather size={18} name="map-pin" color={focused ? KiraColors.primary : '#94A3B8'} />
                  )}
                </View>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="action-spacer"
          options={{
            title: '',
            tabBarLabel: () => null,
            tabBarButton: () => <View style={{ width: 60 }} />,
          }}
        />

        <Tabs.Screen
          name="alerts"
          options={{
            href: null, // HIDDEN from tab bar as per user request
          }}
        />

        <Tabs.Screen
          name="saved"
          options={{
            title: role === 'landlord' ? 'My Properties' : 'Saved',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeDot} />}
                <View style={[styles.iconWrap, { transform: [{ scale: focused ? 1.15 : 1 }] }]}>
                  {role === 'landlord' ? (
                    <Feather size={18} name="home" color={focused ? KiraColors.primary : '#94A3B8'} />
                  ) : (
                    <Ionicons size={18} name={focused ? 'heart' : 'heart-outline'} color={focused ? KiraColors.primary : '#94A3B8'} />
                  )}
                </View>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeDot} />}
                <View style={[styles.iconWrap, { transform: [{ scale: focused ? 1.15 : 1 }] }]}>
                  <Feather size={18} name="user" color={focused ? KiraColors.primary : '#94A3B8'} />
                </View>
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Center Action Button */}
      {(role === 'landlord' || role === 'agent') && (
        <View style={[styles.centerBtnContainer, { bottom: Platform.OS === 'ios' ? insets.bottom + 22 : 22 }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.centerBtn}
            onPress={() => router.push('/list-property')}
          >
            <Feather name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  centerBtnContainer: {
    position: 'absolute',
    left: width / 2 - 22,
    width: 44,
    height: 44,
    zIndex: 10,
  },
  centerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: KiraColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  activeDot: {
    position: 'absolute',
    top: -12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KiraColors.primary,
  },
  movingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    width: width,
    zIndex: -1,
  },
  liquidDip: {
    width: 24,
    height: 3,
    backgroundColor: KiraColors.primary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: 0,
    shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
});
