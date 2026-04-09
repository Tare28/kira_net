import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { KiraColors } from '@/constants/colors';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CurvedBackground = () => (
  <View style={styles.svgContainer}>
    <Svg width={width} height={75} viewBox={`0 0 ${width} 75`}>
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
    {/* Top border line */}
    <View style={styles.topBorderLeft} />
    <View style={styles.topBorderRight} />
  </View>
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0F172A',
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
          tabBarBackground: () => <CurvedBackground />,
          tabBarLabelStyle: {
            fontSize: 9,
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
              <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
                <Feather size={18} name="home" color={focused ? '#0F172A' : '#94A3B8'} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="locations"
          options={{
            title: 'Areas',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
                <Feather size={18} name="map-pin" color={focused ? '#0F172A' : '#94A3B8'} />
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
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
                <Ionicons size={18} name={focused ? 'heart' : 'heart-outline'} color={focused ? '#0F172A' : '#94A3B8'} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="alerts"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
                <Feather size={18} name="user" color={focused ? '#0F172A' : '#94A3B8'} />
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Center Action Button */}
      <View style={[styles.centerBtnContainer, { bottom: Platform.OS === 'ios' ? insets.bottom + 22 : 22 }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.centerBtn}
          onPress={() => router.push('/list-property')}
        >
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  topBorderLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width / 2 - 36,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  topBorderRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width / 2 - 36,
    height: 1,
    backgroundColor: '#F1F5F9',
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
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: '#F1F5F9',
  },
});
