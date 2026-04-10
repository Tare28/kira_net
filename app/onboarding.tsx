import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { KiraColors } from '@/constants/colors';
import { useLanguage } from '@/context/LanguageContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { t, language, setLanguage } = useLanguage();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useSharedValue(0);

  const SLIDES = [
    {
      id: 1,
      title: t.slide1Title,
      subtitle: t.slide1Sub,
      image: require('../assets/images/onboarding_1.png'),
      tag: 'Premium Listings'
    },
    {
      id: 2,
      title: t.slide2Title,
      subtitle: t.slide2Sub,
      image: require('../assets/images/onboarding_2.png'),
      tag: 'Elite Search'
    },
    {
      id: 3,
      title: t.slide3Title,
      subtitle: t.slide3Sub,
      image: require('../assets/images/onboarding_3.png'),
      tag: 'Safe & Secure'
    },
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      runOnJS(setActiveSlide)(index);
    },
  });

  const goNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeSlide + 1), animated: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/login');
    }
  };

  const skip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/login');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background Images with Animated Overlay */}
      <View style={StyleSheet.absoluteFill}>
        {SLIDES.map((s, idx) => {
          const bgStyle = useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollX.value,
              [(idx - 1) * width, idx * width, (idx + 1) * width],
              [0, 1, 0],
              Extrapolate.CLAMP
            );
            return { opacity };
          });

          return (
            <Animated.View key={s.id} style={[StyleSheet.absoluteFill, bgStyle]}>
              <Image source={s.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            </Animated.View>
          );
        })}
        {/* Cinematic Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.92)']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Top Bar Actions */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity 
          style={styles.langTogglePill} 
          onPress={() => {
            const nextLang: Record<Language, Language> = { en: 'am', am: 'om', om: 'en' };
            setLanguage(nextLang[language]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.langToggleText}>
            {language === 'en' ? 'EN' : language === 'am' ? 'አማ' : 'OM'}
          </Text>
          <Feather name="globe" size={10} color="#FFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipBtn} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Slides Container */}
      <Animated.ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, idx) => (
          <View key={idx} style={styles.slide}>
            <View style={styles.contentWrap}>
               <View style={styles.tagWrap}>
                  <Text style={styles.tagText}>{s.tag}</Text>
               </View>
               <Text style={styles.titleText}>{s.title}</Text>
               <Text style={styles.subtitleText}>{s.subtitle}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      {/* Footer / Controls */}
      <SafeAreaView style={styles.footerContainer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const dotStyle = useAnimatedStyle(() => {
              const dotWidth = interpolate(
                scrollX.value,
                [(i - 1) * width, i * width, (i + 1) * width],
                [8, 24, 8],
                Extrapolate.CLAMP
              );
              const opacity = interpolate(
                scrollX.value,
                [(i - 1) * width, i * width, (i + 1) * width],
                [0.3, 1, 0.3],
                Extrapolate.CLAMP
              );
              return { width: dotWidth, opacity };
            });

            return (
              <Animated.View 
                key={i} 
                style={[
                  styles.dot, 
                  dotStyle,
                  { backgroundColor: KiraColors.primary }
                ]} 
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.mainCta}
          onPress={goNext}
          activeOpacity={0.9}
        >
          <Text style={styles.mainCtaText}>
            {activeSlide === SLIDES.length - 1 ? t.getStarted : t.next}
          </Text>
          <Feather name="arrow-right" size={18} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.bottomLinkRow}>
           <Text style={styles.bottomLinkText}>Experience Luxury Living in Addis</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 12,
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center' },
  randText: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  langTogglePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  langToggleText: { fontSize: 10, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  skipText: { fontSize: 12, fontWeight: '800', color: '#FFF', textTransform: 'uppercase' },
  
  slide: { width, flex: 1, justifyContent: 'flex-end', paddingBottom: 180 },
  contentWrap: { paddingHorizontal: 32 },
  tagWrap: { 
    backgroundColor: 'rgba(255,255,255,0.12)', 
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, 
    alignSelf: 'flex-start', marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  tagText: { color: KiraColors.primary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  titleText: { fontSize: 44, fontWeight: '900', color: '#FFF', lineHeight: 52, letterSpacing: -1.5, marginBottom: 16 },
  subtitleText: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 24, fontWeight: '500' },

  footerContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 30, alignItems: 'center',
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dot: { height: 4, borderRadius: 2, marginHorizontal: 3 },

  mainCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    width: '100%', backgroundColor: KiraColors.primary, paddingVertical: 18, borderRadius: 20,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 12,
  },
  mainCtaText: { fontSize: 16, fontWeight: '900', color: '#1A1A1A' },
  bottomLinkRow: { marginTop: 20 },
  bottomLinkText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
});
