import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Dimensions, ScrollView, Animated
} from 'react-native';
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Find Your\nPerfect Home',
    subtitle: 'Browse hundreds of verified rentals across Addis Ababa — studios, apartments, villas, and more.',
    bg: '#005C3A',
    accent: '#FBC02D',
    icon: <FontAwesome5 name="home" size={80} color="#FBC02D" />,
    dots: ['#FBC02D', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'],
  },
  {
    id: 2,
    title: 'Smart Filters\n& AI Matching',
    subtitle: 'Filter by price, deposit, utilities, and neighborhood. Our AI recommends listings tailored just for you.',
    bg: '#FBC02D',
    accent: '#005C3A',
    icon: <MaterialIcons name="auto-awesome" size={80} color="#005C3A" />,
    dots: ['rgba(0,92,58,0.3)', '#005C3A', 'rgba(0,92,58,0.3)'],
  },
  {
    id: 3,
    title: 'Verified Listings\nYou Can Trust',
    subtitle: 'Every verified listing has been physically inspected by the Kira-Net team. No scams, no fake photos.',
    bg: '#1A1A2E',
    accent: '#FBC02D',
    icon: <MaterialIcons name="verified" size={80} color="#FBC02D" />,
    dots: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)', '#FBC02D'],
  },
];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeSlide + 1), animated: true });
      setActiveSlide(s => s + 1);
    } else {
      router.replace('/login');
    }
  };

  const skip = () => router.replace('/login');

  const onScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSlide(index);
  };

  const slide = SLIDES[activeSlide];

  return (
    <View style={[styles.root, { backgroundColor: slide.bg }]}>
      {/* Skip button */}
      <SafeAreaView style={styles.topBar}>
        {activeSlide < SLIDES.length - 1 ? (
          <TouchableOpacity onPress={skip} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: slide.accent }]}>Skip</Text>
          </TouchableOpacity>
        ) : <View />}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[
              styles.dot,
              { backgroundColor: i === activeSlide ? slide.accent : 'rgba(255,255,255,0.3)' },
              i === activeSlide && styles.dotActive,
            ]} />
          ))}
        </View>
      </SafeAreaView>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, idx) => (
          <View key={idx} style={[styles.slide, { backgroundColor: s.bg }]}>
            {/* Illustration Circle */}
            <View style={[styles.illustrationCircle, { borderColor: `${s.accent}40`, backgroundColor: `${s.accent}18` }]}>
              <View style={[styles.illustrationInner, { backgroundColor: `${s.accent}28` }]}>
                {s.icon}
              </View>
            </View>

            <View style={styles.textBlock}>
              <Text style={[styles.slideTitle, { color: '#FFF' }]}>{s.title}</Text>
              <Text style={[styles.slideSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>{s.subtitle}</Text>
            </View>

            {/* Feature Pills */}
            <View style={styles.pillsRow}>
              {idx === 0 && ['Bole', 'Kazanchis', 'Yeka', 'CMC'].map(n => (
                <View key={n} style={[styles.featurePill, { borderColor: `${s.accent}60` }]}>
                  <Text style={[styles.featurePillText, { color: s.accent }]}>{n}</Text>
                </View>
              ))}
              {idx === 1 && ['AI Picks', 'Smart Filter', 'Price Match'].map(n => (
                <View key={n} style={[styles.featurePill, { borderColor: `${s.accent}60` }]}>
                  <Text style={[styles.featurePillText, { color: s.accent }]}>{n}</Text>
                </View>
              ))}
              {idx === 2 && ['Inspected', 'No Scams', 'Guaranteed'].map(n => (
                <View key={n} style={[styles.featurePill, { borderColor: `${s.accent}60` }]}>
                  <Text style={[styles.featurePillText, { color: s.accent }]}>{n}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: slide.accent }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaBtnText, { color: slide.bg }]}>
            {activeSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Feather name="arrow-right" size={18} color={slide.bg} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        {activeSlide === SLIDES.length - 1 && (
          <TouchableOpacity onPress={skip} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={{ color: '#FBC02D', fontWeight: '800' }}>Log In</Text></Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  skipBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  skipText: { fontSize: 14, fontWeight: '700' },
  dotsRow: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4, marginHorizontal: 3,
  },
  dotActive: { width: 24 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 20,
  },
  illustrationCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  illustrationInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: { alignItems: 'center', marginBottom: 28 },
  slideTitle: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 38,
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  featurePill: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  featurePillText: { fontSize: 12, fontWeight: '700' },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
    alignItems: 'center',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '900' },
  loginLink: { paddingVertical: 8 },
  loginLinkText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
});
