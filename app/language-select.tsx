import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  ZoomIn, 
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { useLanguage, Language } from '@/context/LanguageContext';
import { KiraColors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  {
    code: 'en' as Language,
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    desc: 'International',
  },
  {
    code: 'am' as Language,
    name: 'Amharic',
    native: 'አማርኛ',
    flag: '🇪🇹',
    desc: 'Ethiopia',
  },
  {
    code: 'om' as Language,
    name: 'Oromoo',
    native: 'Afaan Oromoo',
    flag: '🇪🇹',
    desc: 'Oromia',
  },
];

export default function LanguageSelectScreen() {
  const { setLanguage, language: currentLang } = useLanguage();
  const [selected, setSelected] = useState<Language>(currentLang);

  const handleContinue = async () => {
    await setLanguage(selected);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/onboarding');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      {/* Immersive Background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#050A02' }} />
        <LinearGradient 
          colors={['#102205', '#050A02']} 
          style={StyleSheet.absoluteFill}
        />
        {/* Animated Orbs */}
        <View style={[styles.orb, { top: -100, right: -50, backgroundColor: '#9CC942', opacity: 0.15 }]} />
        <View style={[styles.orb, { bottom: -150, left: -100, width: 400, height: 400, backgroundColor: '#9CC942', opacity: 0.1 }]} />
      </View>

      <SafeAreaView style={styles.safe}>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.header}>
           <View style={styles.logoPill}>
             <FontAwesome5 name="feather-alt" size={12} color="#9CC942" />
             <Text style={styles.logoText}>KIRA-NET</Text>
           </View>
           <Text style={styles.title}>Select Your Language</Text>
           <Text style={styles.subtitle}>እባክዎን ቋንቋዎን ይምረጡ • Afaan keessan filadhaa</Text>
        </Animated.View>

        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {LANGUAGES.map((lang, index) => (
              <LanguageCircle 
                key={lang.code}
                lang={lang}
                isSelected={selected === lang.code}
                onSelect={() => {
                  setSelected(lang.code);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                index={index}
              />
            ))}
          </View>
        </View>

        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueBtn} 
            activeOpacity={0.9}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#9CC942', '#7aaa2a']}
              style={styles.gradBtn}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            >
              <Text style={styles.btnText}>
                {selected === 'en' ? 'Continue' : selected === 'am' ? 'ቀጥል' : 'Itti fufi'}
              </Text>
              <Feather name="arrow-right" size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function LanguageCircle({ lang, isSelected, onSelect, index }: any) {
  const scale = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }],
    borderColor: isSelected ? '#9CC942' : 'rgba(255,255,255,0.08)',
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0, { duration: 500 }),
    transform: [{ scale: withSpring(isSelected ? 1.2 : 0.8) }],
  }));

  return (
    <Animated.View 
      entering={ZoomIn.delay(400 + index * 100).springify()}
      style={styles.circleWrapper}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onSelect}
        style={styles.circleTouchable}
      >
        <Animated.View style={[styles.glowRing, glowStyle]}>
          <LinearGradient
            colors={['rgba(156, 201, 66, 0.4)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View style={[styles.circle, containerStyle]}>
          {isSelected && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          )}
          <Text style={styles.flagIcon}>{lang.flag}</Text>
          <Text style={[styles.nativeLabel, isSelected && { color: '#FFF' }]}>{lang.native}</Text>
          <Text style={styles.englishLabel}>{lang.name}</Text>
          
          {isSelected && (
            <Animated.View entering={ZoomIn} style={styles.checkBadge}>
              <Feather name="check" size={10} color="#000" />
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050A02' },
  safe: { flex: 1 },
  orb: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  
  header: { alignItems: 'center', marginTop: 40, paddingHorizontal: 40 },
  logoPill: { 
    flexDirection: 'row', alignItems: 'center', gap: 8, 
    backgroundColor: 'rgba(156, 201, 66, 0.1)', 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(156, 201, 66, 0.2)', marginBottom: 24
  },
  logoText: { color: '#9CC942', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },

  gridContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { 
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', 
    gap: 24, paddingHorizontal: 20, width: '100%' 
  },
  
  circleWrapper: { width: width * 0.4, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  circleTouchable: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: '90%', height: '90%', borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 15
  },
  glowRing: {
    position: 'absolute', width: '115%', height: '115%', borderRadius: 1000,
    borderOuterWidth: 2, borderColor: '#9CC942'
  },
  flagIcon: { fontSize: 36, marginBottom: 8 },
  nativeLabel: { fontSize: 16, fontWeight: '900', color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  englishLabel: { fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  checkBadge: {
    position: 'absolute', bottom: 12, backgroundColor: '#9CC942',
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'
  },

  footer: { paddingHorizontal: 30, paddingBottom: 50 },
  continueBtn: { borderRadius: 24, overflow: 'hidden', shadowColor: '#9CC942', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 },
  gradBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 22, gap: 12 },
  btnText: { fontSize: 18, fontWeight: '900', color: '#000' }
});
