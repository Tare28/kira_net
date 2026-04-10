import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, Dimensions, ScrollView, View, Text,
  TextInput, TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVisitPlan } from '@/context/VisitPlanContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat,
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

import { KiraColors } from '@/constants/colors';
import { Typography } from '@/constants/typography';

const { width } = Dimensions.get('window');

// Trust score colors (same logic as property-details)
function trustColor(score: number) {
  if (score >= 85) return KiraColors.success;
  if (score >= 60) return KiraColors.warning;
  return KiraColors.danger;
}

import { PROPERTIES } from '@/data/properties';

const CATEGORIES = [
  { key: 'all', label: 'All Homes' },
  { key: 'studios', label: 'Studio' },
  { key: '1bed', label: '1 Bed Room' },
  { key: '2bed', label: '2 Bed Room' },
  { key: 'shop', label: 'Shop' },
  { key: 'cafe', label: 'Cafe' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'other', label: 'Other' },
];

import { useFilters } from '@/context/FilterContext';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { visits } = useVisitPlan();
  const { filters, updateFilters } = useFilters();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const timer = setTimeout(() => setIsLoading(false), 1500);
     return () => clearTimeout(timer);
  }, []);
  const { neighborhood: navNeighborhood } = useLocalSearchParams<{ neighborhood?: string }>();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const SUGGESTIONS = [
    { label: 'Trending in Bole', icon: 'trending-up' },
    { label: 'Quiet in Sarbet', icon: 'volume-mute' },
    { label: 'Hot in Kazanchis', icon: 'flame' },
  ];

  // Sync neighborhood from navigation params (e.g. from Areas tab)
  useEffect(() => {
    if (navNeighborhood) {
      updateFilters({ neighborhood: navNeighborhood });
    }
  }, [navNeighborhood]);

  const filtered = PROPERTIES.filter(p => {
    // 1. Category filter
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;

    // 2. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (
        !p.title.toLowerCase().includes(query) &&
        !p.location.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    // 3. Price filter
    const numericPrice = parseInt(p.price.replace(',', ''));
    if (numericPrice < filters.minPrice || numericPrice > filters.maxPrice) return false;

    // 4. Neighborhood filter
    if (filters.neighborhood && !p.location.includes(filters.neighborhood)) return false;

    // 5. Amenities filters
    if (filters.essentialWater && !p.utils.includes('Constant Water')) return false;
    if (filters.essentialInternet && !p.utils.includes('Fiber Optic') && !p.utils.includes('High Speed')) return false;

    // 6. Verification filter
    if (filters.isVerified && p.badge !== 'verified') return false;

    // 7. Private Meter filter
    if (filters.privateMeter && !p.utils.includes('Private Meter') && !p.utils.includes('Prepaid')) return false;

    return true;
  });

  return (
    <View style={styles.container}>
      {/* ── Sticky Frosted Header ────────────────────────────────────────── */}
      <BlurView intensity={80} tint="light" style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => router.push('/boost-listing')}
          >
            <Feather name="zap" size={24} color={KiraColors.warning} />
          </TouchableOpacity>

          <Text style={styles.logoText}>Kira-Net</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.plannerHeaderBtn}
              onPress={() => router.push('/visit-planner')}
            >
              <MaterialCommunityIcons name="calendar-check" size={20} color={KiraColors.primary} />
              {visits.length > 0 && (
                <View style={styles.plannerBadge}>
                  <Text style={styles.plannerBadgeText}>{visits.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => router.push('/(tabs)/alerts')}
              style={styles.bellWrap}
            >
              <Feather name="bell" size={24} color={KiraColors.primary} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Mesh Gradient Background ─────────────────────────────────────── */}
        <View style={styles.meshContainer}>
          <LinearGradient
            colors={['rgba(0, 92, 58, 0.05)', 'rgba(255, 255, 255, 0)']}
            style={styles.meshBubble1}
          />
          <LinearGradient
            colors={['rgba(251, 192, 45, 0.08)', 'rgba(255, 255, 255, 0)']}
            style={styles.meshBubble2}
          />
        </View>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <View style={styles.titleSection}>
          <Text style={styles.headline}>Find your</Text>
          <Text style={styles.headline}>sanctuary</Text>
          <Text style={styles.headlineBlack}>in Addis.</Text>
        </View>

        {/* ── Search & Filter ──────────────────────────────────────────────── */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={18} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by location or name"
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>

          {/* Smart Suggestions */}
          {(isSearchFocused || searchQuery.length > 0) && (
            <View style={styles.suggestionsContainer}>
               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                 {SUGGESTIONS.map((s, idx) => (
                   <TouchableOpacity 
                     key={idx} 
                     style={styles.suggestionBadge}
                     onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSearchQuery(s.label.split('in ')[1]);
                     }}
                   >
                     <Ionicons name={s.icon as any} size={12} color="#005C3A" style={{ marginRight: 4 }} />
                     <Text style={styles.suggestionText}>{s.label}</Text>
                   </TouchableOpacity>
                 ))}
               </ScrollView>
            </View>
          )}

          <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/modal')}>
            <Feather name="sliders" size={16} color="#1A1A1A" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* ── Visit Planner CTA Banner (shows when plan has items) ─────────── */}
        {visits.length > 0 && (
          <TouchableOpacity
            style={styles.plannerStrip}
            activeOpacity={0.88}
            onPress={() => router.push('/visit-planner')}
          >
            <MaterialCommunityIcons name="map-marker-path" size={18} color="#FFF" />
            <Text style={styles.plannerStripText}>
              {visits.length} propert{visits.length === 1 ? 'y' : 'ies'} in your Visit Plan — tap to view route
            </Text>
            <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}

        {/* ── Categories ───────────────────────────────────────────────────── */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryPill, activeCategory === cat.key && styles.categoryPillActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveCategory(cat.key);
              }}
            >
              <Text style={activeCategory === cat.key ? styles.categoryPillTextActive : styles.categoryPillText}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Listings ─────────────────────────────────────────────────────── */}
        <View style={styles.listingsContainer}>
          {isLoading ? (
             <>
               <SkeletonCard />
               <SkeletonCard />
             </>
          ) : (
            <>
              {filtered.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
              {filtered.length === 0 && (
                <View style={styles.emptyState}>
                  <Feather name="home" size={40} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No listings in this category yet.</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

    </View>
  );
}

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: typeof PROPERTIES[number] }) {
  const { addVisit, removeVisit, isInPlan } = useVisitPlan();
  const inPlan = isInPlan(property.id);

  const color = trustColor(property.trust);
  const isCommercial = ['shop', 'cafe', 'restaurant'].includes(property.category);

  // Magnetic Button Animation
  const isPressed = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isPressed.value) }],
  }));

  const handleVisit = () => {
    isPressed.value = 1.05;
    setTimeout(() => { isPressed.value = 1; }, 100);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (inPlan) {
      removeVisit(property.id);
    } else {
      addVisit({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.image,
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* Image Block */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => router.push({ pathname: '/property-details', params: { id: property.id } })}
      >
        <View style={styles.imageContainer}>
          <AnimatedImage 
            sharedTransitionTag={`image-${property.id}`}
            source={property.image} 
            style={styles.cardImage} 
          />

          {property.badge === 'verified' && (
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={12} color={KiraColors.primary} />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          )}
          {property.badge === 'hot_deal' && (
            <View style={styles.hotDealBadge}>
              <Text style={styles.hotDealText}>HOT DEAL</Text>
            </View>
          )}

          {/* Trust Score Chip */}
          <View style={[styles.trustChip, { backgroundColor: color }]}>
            <MaterialIcons name="shield" size={11} color="#FFF" />
            <Text style={styles.trustChipText}>{property.trust}%</Text>
          </View>

          {/* Heart / Saved */}
          <TouchableOpacity style={styles.heartBtn}>
            <Ionicons name="heart-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Card Info */}
      <View style={styles.cardInfo}>
        {/* Title row */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/property-details', params: { id: property.id } })}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.cardTitle}>{property.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={12} color="#4A5568" />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.cardPrice}>
                {property.price} <Text style={styles.cardPriceUnit}>ETB</Text>
              </Text>
              <Text style={styles.cardPriceDesc}>PER MONTH</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Highlights Row (Content Specific) */}
        <View style={styles.highlightsRow}>
          {isCommercial ? (
            <>
              <View style={[styles.highlightItem, { backgroundColor: '#EEF2FF' }]}>
                <MaterialCommunityIcons name="walk" size={14} color="#4F46E5" />
                <Text style={[styles.highlightText, { color: '#4F46E5' }]}>
                  {property.hood.tags.includes('High Foot Traffic') ? 'High Foot Traffic' : 'Moderate Traffic'}
                </Text>
              </View>
              {property.utils.includes('Parking') && (
                <View style={[styles.highlightItem, { backgroundColor: '#FFF7ED' }]}>
                  <MaterialIcons name="local-parking" size={14} color="#EA580C" />
                  <Text style={[styles.highlightText, { color: '#EA580C' }]}>Customer Parking</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={[styles.highlightItem, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="water" size={12} color="#0284C7" />
                <Text style={[styles.highlightText, { color: '#0284C7' }]}>
                  {property.utils.includes('Constant Water') ? '24/7 Water' : 'Storage Tank'}
                </Text>
              </View>
              <View style={[styles.highlightItem, { backgroundColor: '#FDF2F8' }]}>
                <Ionicons name="volume-low" size={12} color="#DB2777" />
                <Text style={[styles.highlightText, { color: '#DB2777' }]}>
                  {property.hood.noise <= 2 ? 'Serene & Quiet' : 'Lively Area'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Utilities Row - Secondary */}
        <View style={styles.utilsRow}>
          <View style={styles.utilItem}>
            <Ionicons name="water" size={12} color={KiraColors.primary} />
            <Text style={styles.utilText}>{property.utils[0]}</Text>
          </View>
          <View style={styles.utilItem}>
            <Ionicons name="flash" size={12} color={KiraColors.primary} />
            <Text style={styles.utilText}>{property.utils[1]}</Text>
          </View>
          <View style={styles.utilItem}>
            <Ionicons name="wifi" size={12} color={KiraColors.primary} />
            <Text style={styles.utilText}>{property.utils[2]}</Text>
          </View>
        </View>

        {/* Neighborhood Tags */}
        <View style={styles.hoodTags}>
          {property.hood.tags.slice(0, 2).map((t, i) => (
            <View key={i} style={styles.hoodTag}>
              <Text style={styles.hoodTagText}>{t}</Text>
            </View>
          ))}
          {/* Noise indicator */}
          <View style={[styles.hoodTag, styles.noiseTag]}>
            <Ionicons
              name="volume-medium-outline"
              size={10}
              color={
                property.hood.noise <= 2
                  ? KiraColors.success
                  : property.hood.noise <= 3
                    ? KiraColors.warning
                    : KiraColors.danger
              }
            />
            <Text style={[
              styles.hoodTagText,
              {
                color:
                  property.hood.noise <= 2
                    ? KiraColors.success
                    : property.hood.noise <= 3
                      ? KiraColors.warning
                      : KiraColors.danger
              }
            ]}>
              {property.hood.noise <= 2 ? 'Quiet' : property.hood.noise <= 3 ? 'Moderate' : 'Busy'}
            </Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => router.push({ pathname: '/property-details', params: { id: property.id } })}
          >
            <Text style={styles.detailBtnText}>View Details</Text>
            <Feather name="arrow-right" size={14} color="#FFF" />
          </TouchableOpacity>

          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={[styles.planBtn, inPlan && styles.planBtnActive]}
              onPress={handleVisit}
              onPressIn={() => { isPressed.value = 1.05; }}
              onPressOut={() => { isPressed.value = 1; }}
            >
              <MaterialCommunityIcons
                name={inPlan ? 'calendar-check' : 'calendar-plus'}
                size={16}
                color={inPlan ? KiraColors.surface : KiraColors.primary}
              />
              <Text style={[styles.planBtnText, inPlan && styles.planBtnTextActive]}>
                {inPlan ? 'In Plan' : 'Plan Visit'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  const opacity = useSharedValue(0.3);
  
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={[styles.imageContainer, { backgroundColor: '#E5E7EB' }]} />
      <View style={[styles.cardInfo, { height: 120 }]}>
        <View style={{ height: 20, width: '70%', backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 10 }} />
        <View style={{ height: 14, width: '40%', backgroundColor: '#E5E7EB', borderRadius: 4, marginBottom: 20 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ height: 32, width: 100, backgroundColor: '#E5E7EB', borderRadius: 10 }} />
          <View style={{ height: 32, flex: 1, backgroundColor: '#E5E7EB', borderRadius: 10 }} />
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F9' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 20,
  },
  logoText: { fontSize: 18, fontWeight: '900', color: KiraColors.primary, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  plannerHeaderBtn: { position: 'relative', padding: 4 },
  plannerBadge: {
    position: 'absolute', top: -2, right: -2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: KiraColors.danger, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#F7F8F9',
  },
  plannerBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFF' },
  bellWrap: { position: 'relative' },
  notifBadge: {
    position: 'absolute', top: -4, right: -6,
    backgroundColor: KiraColors.danger, width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#F7F8F9',
  },
  notifBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFF' },

  headerContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  meshContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 400, overflow: 'hidden', zIndex: -1,
  },
  meshBubble1: {
    position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 150,
  },
  meshBubble2: {
    position: 'absolute', top: 50, right: -80, width: 350, height: 350, borderRadius: 175,
  },

  scrollContent: { paddingBottom: 100, paddingTop: 100 },

  // Hero
  titleSection: { paddingHorizontal: 20, marginBottom: 24 },
  headline: {
    fontSize: Typography.hero.fontSize,
    fontWeight: Typography.hero.fontWeight,
    color: '#1A1A1A',
    lineHeight: Typography.hero.lineHeight,
    letterSpacing: Typography.hero.letterSpacing,
  },
  headlineBlack: {
    fontSize: Typography.hero.fontSize,
    fontWeight: Typography.hero.fontWeight,
    color: KiraColors.primary,
    lineHeight: Typography.hero.lineHeight,
    letterSpacing: Typography.hero.letterSpacing,
  },

  // Search
  searchSection: { paddingHorizontal: 20, marginBottom: 20 },
  searchInputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500', padding: 0 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 14,
  },
  filterText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginLeft: 8 },

  // Visit Planner Strip
  plannerStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: KiraColors.primary, marginHorizontal: 20, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 16, marginBottom: 20,
  },
  plannerStripText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Smart Suggestions
  suggestionsContainer: { marginBottom: 16, paddingLeft: 4 },
  suggestionBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8,
    borderWidth: 1, borderColor: '#C8E6C9',
  },
  suggestionText: { fontSize: 11, fontWeight: '700', color: '#005C3A' },

  // Categories
  categoriesRow: { paddingHorizontal: 20, marginBottom: 24 },
  categoryPill: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24, marginRight: 12,
  },
  categoryPillActive: { backgroundColor: KiraColors.primary },
  categoryPillText: { fontSize: 13, fontWeight: '600', color: KiraColors.primary },
  categoryPillTextActive: { fontSize: 13, fontWeight: '600', color: '#FFF' },

  // Listings
  listingsContainer: { paddingHorizontal: 20 },
  card: {
    marginBottom: 32, backgroundColor: KiraColors.surface, borderRadius: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04, shadowRadius: 24, elevation: 4,
    overflow: 'hidden',
  },

  // Image
  imageContainer: { width: '100%', height: 240, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },

  verifiedBadge: {
    position: 'absolute', top: 16, left: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: KiraColors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  verifiedText: { fontSize: 9, fontWeight: '800', color: KiraColors.primary, marginLeft: 4, letterSpacing: 0.5 },
  hotDealBadge: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: KiraColors.danger, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  hotDealText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  trustChip: {
    position: 'absolute', top: 16, right: 56,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  trustChipText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  heartBtn: {
    position: 'absolute', top: 16, right: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center',
  },

  // Card Info
  cardInfo: { padding: 16 },
  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  titleLeft: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: '#4A5568', marginLeft: 4 },
  priceContainer: { alignItems: 'flex-end' },
  cardPrice: { fontSize: 17, fontWeight: '900', color: KiraColors.primary },
  cardPriceUnit: { fontSize: 11, fontWeight: '800' },
  cardPriceDesc: { fontSize: 8, fontWeight: '700', color: '#6B7280', marginTop: 2, letterSpacing: 0.5 },

  // Utils
  utilsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  utilItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  utilText: { fontSize: 11, color: '#4A5568', fontWeight: '500', marginLeft: 4 },

  // Highlights
  highlightsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  highlightItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
  },
  highlightText: { fontSize: 10, fontWeight: '700' },

  // Neighborhood Tags
  hoodTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  hoodTag: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  noiseTag: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  hoodTagText: { fontSize: 10, fontWeight: '700', color: KiraColors.primary },

  // Action Row
  cardActions: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingTop: 4, borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  detailBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 14,
    backgroundColor: KiraColors.primary,
  },
  detailBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  planBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1.5, borderColor: KiraColors.primary, backgroundColor: '#FFF',
  },
  planBtnActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  planBtnText: { fontSize: 13, fontWeight: '700', color: KiraColors.primary },
  planBtnTextActive: { color: '#FFF' },

  // FAB
  fab: {
    position: 'absolute', bottom: 100, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },

  // Empty
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 14, color: '#9CA3AF', marginTop: 12, fontWeight: '500' },
});
