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
import { useSaved } from '@/context/SavedContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAlerts } from '@/context/AlertsContext';
import { useUser } from '@/context/UserContext';
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
import { Skeleton } from '@/components/Skeleton';

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

function LandlordHome({ insets }: { insets: any }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const AI_RECS = [
    {
      id: 'rec1', icon: 'zap', color: '#F59E0B', bg: '#FFFBEB',
      title: 'Boost Summit Residency',
      desc: '48 saves this week — this listing is gaining traction. A 7-day boost could convert into 3–5 signed leases.',
      cta: 'Boost Now',
      route: '/boost-listing',
    },
    {
      id: 'rec2', icon: 'camera', color: '#8B5CF6', bg: '#F5F3FF',
      title: 'Add Photos to Garden Villa',
      desc: 'Listings with 6+ photos get 4× more inquiries. Garden Villa only has 3. Request a professional shoot today.',
      cta: 'Request Shoot',
      route: null,
    },
    {
      id: 'rec3', icon: 'trending-up', color: '#0EA5E9', bg: '#F0F9FF',
      title: 'Reprice Kazanchis Studio',
      desc: 'Similar studios in Kazanchis now list at 21,000 ETB. You\'re 12% below market — consider raising to capture extra revenue.',
      cta: 'Edit Price',
      route: null,
    },
  ];

  const MARKET_INTEL = [
    { area: 'Bole', change: '+5.2%', trend: 'up', desc: 'Rental surge', color: '#9CC942' },
    { area: 'Kazanchis', change: 'Peak', trend: 'fire', desc: 'Studio demand', color: '#F59E0B' },
    { area: 'Old Airport', change: 'Stable', trend: 'minus', desc: 'Mid-range', color: '#64748B' },
    { area: 'Sarbet', change: '+2.1%', trend: 'up', desc: 'Growing', color: '#9CC942' },
  ];

  return (
    <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 120, paddingHorizontal: 20, paddingBottom: 120 }}
    >
        {/* ── Premium Greeting ──────────────────────────────────────────────── */}
        <View style={lh.greetRow}>
            <View>
                <Text style={lh.greetSmall}>{greeting} 👋</Text>
                <Text style={lh.greetBig}>Command Center</Text>
            </View>
            <TouchableOpacity
                style={lh.notifPill}
                onPress={() => router.push('/(tabs)/alerts')}
            >
                <Feather name="bell" size={15} color={KiraColors.primary} />
                <Text style={lh.notifPillText}>Alerts</Text>
                <View style={lh.notifDot} />
            </TouchableOpacity>
        </View>

        {/* ── Revenue + KPI Card ─────────────────────────────────────────────── */}
        <View style={lh.revenueCard}>
            <LinearGradient
                colors={['#1A1A1A', '#2C2C2C']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Brand green accent blob */}
            <View style={[lh.decorCircle, { top: -40, right: -20, width: 140, height: 140, backgroundColor: KiraColors.primary, opacity: 0.12 }]} />
            <View style={[lh.decorCircle, { bottom: -10, left: 20, width: 70, height: 70, backgroundColor: KiraColors.primary, opacity: 0.07 }]} />

            <Text style={lh.revenueLabel}>APRIL 2026 PROJECTED INCOME</Text>
            <Text style={lh.revenueAmount}>88,500 <Text style={lh.revenueCur}>ETB</Text></Text>
            <View style={lh.revenueMeta}>
                <View style={lh.revenueBadge}>
                    <Feather name="trending-up" size={11} color={KiraColors.primary} />
                    <Text style={lh.revenueBadgeText}>+12.4% vs March</Text>
                </View>
                <Text style={lh.revenueAssets}>Portfolio: 14.2M ETB</Text>
            </View>

            {/* Mini KPI Row */}
            <View style={lh.miniKpiRow}>
                {[
                    { label: 'PROPERTIES', val: '3' },
                    { label: 'OCCUPANCY', val: '67%' },
                    { label: 'LEADS', val: '12' },
                    { label: 'VIEWS', val: '1.2K' },
                ].map((k, i) => (
                    <View key={i} style={lh.miniKpi}>
                        <Text style={lh.miniKpiVal}>{k.val}</Text>
                        <Text style={lh.miniKpiLab}>{k.label}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* ── AI Recommendations ────────────────────────────────────────────── */}
        <View style={lh.sectionHeaderRow}>
            <View style={lh.aiTag}>
                <MaterialCommunityIcons name="robot-outline" size={12} color="#FFF" />
                <Text style={lh.aiTagText}>AI</Text>
            </View>
            <Text style={lh.sectionH}>Recommendations</Text>
        </View>

        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 20, gap: 14 }}
        >
            {AI_RECS.map((rec) => (
                <View key={rec.id} style={lh.recCard}>
                    <View style={[lh.recIconWrap, { backgroundColor: rec.bg }]}>
                        <Feather name={rec.icon as any} size={22} color={rec.color} />
                    </View>
                    <Text style={lh.recTitle}>{rec.title}</Text>
                    <Text style={lh.recDesc}>{rec.desc}</Text>
                    <TouchableOpacity
                        style={[lh.recCta, { borderColor: rec.color }]}
                        onPress={() => rec.route && router.push(rec.route as any)}
                    >
                        <Text style={[lh.recCtaText, { color: rec.color }]}>{rec.cta}</Text>
                        <Feather name="arrow-right" size={12} color={rec.color} />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* ── Market Intelligence ───────────────────────────────────────────── */}
        <View style={[lh.sectionHeaderRow, { marginTop: 32 }]}>
            <Text style={lh.sectionH}>Market Intel</Text>
            <TouchableOpacity><Text style={lh.seeAll}>Full Report →</Text></TouchableOpacity>
        </View>

        <View style={lh.intelGrid}>
            {MARKET_INTEL.map((m, i) => (
                <View key={i} style={lh.intelCard}>
                    <Text style={lh.intelArea}>{m.area}</Text>
                    <Text style={[lh.intelChange, { color: m.color }]}>{m.change}</Text>
                    <Text style={lh.intelDesc}>{m.desc}</Text>
                    {m.trend === 'up' && <Feather name="trending-up" size={14} color={m.color} style={{ marginTop: 4 }} />}
                    {m.trend === 'fire' && <Text style={{ fontSize: 14 }}>🔥</Text>}
                    {m.trend === 'minus' && <Feather name="minus" size={14} color={m.color} style={{ marginTop: 4 }} />}
                </View>
            ))}
        </View>

        {/* ── Operational Shortcuts ────────────────────────────────────────── */}
        <Text style={[lh.sectionH, { marginTop: 32, marginBottom: 16 }]}>Quick Actions</Text>
        <View style={lh.opsRow}>
            {[
                { icon: 'camera', label: 'Request Photos', color: '#8B5CF6', bg: '#F5F3FF', onPress: null },
                { icon: 'file-text', label: 'Legal Forms', color: '#0EA5E9', bg: '#F0F9FF', onPress: null },
                { icon: 'home', label: 'My Inventory', color: '#9CC942', bg: '#F4F9EB', onPress: () => router.push('/landlord-dashboard') },
                { icon: 'plus-circle', label: 'New Listing', color: '#F59E0B', bg: '#FFFBEB', onPress: () => router.push('/list-property') },
            ].map((op, i) => (
                <TouchableOpacity key={i} style={lh.opsCard} onPress={op.onPress ?? undefined}>
                    <View style={[lh.opsIconWrap, { backgroundColor: op.bg }]}>
                        <Feather name={op.icon as any} size={20} color={op.color} />
                    </View>
                    <Text style={lh.opsLabel}>{op.label}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={{ height: 120 }} />
    </ScrollView>
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useUser();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { visits } = useVisitPlan();
  const { filters, updateFilters } = useFilters();
  const { unreadCount } = useAlerts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const timer = setTimeout(() => setIsLoading(false), 1500);
     return () => clearTimeout(timer);
  }, []);
  const { neighborhood: navNeighborhood } = useLocalSearchParams<{ neighborhood?: string }>();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollY = useSharedValue(0);

  const headerAnim = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(scrollY.value > 50 ? -10 : 0) },
        { scale: withSpring(scrollY.value > 50 ? 0.95 : 1) }
      ],
      opacity: withSpring(scrollY.value > 150 ? 0.9 : 1)
    };
  });

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
      {/* ── Floating Studio Header ────────────────────────────────────────── */}
      <Animated.View style={[styles.headerFloatingContainer, { paddingTop: Math.max(insets.top, 12) }, headerAnim]}>
        <View style={styles.headerPill}>
          <View style={styles.headerContent}>
            {/* Left: Quick Profile/Account */}
            <View style={styles.headerAvatar}>
               <Text style={styles.avatarInitial}>K</Text>
            </View>

            {/* Center: Brand Identity */}
            <View style={styles.headerCenter}>
               <View style={styles.logoRow}>
                  <Text style={styles.logoTextKira}>Kira</Text>
                  <Text style={styles.logoTextNet}>-Net</Text>
               </View>
               <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{role?.toUpperCase() || 'TENANT'}</Text>
               </View>
            </View>

            {/* Right: Notifications */}
            <TouchableOpacity 
                style={styles.headerNotif}
                onPress={() => router.push('/(tabs)/alerts')}
            >
               <Feather name="bell" size={20} color="#1A1A1A" />
               {unreadCount > 0 && <View style={styles.headerNotifDot} />}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {role === 'landlord' ? (
        <LandlordHome insets={insets} />
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 80 }]}
          onScroll={(e) => {
            scrollY.value = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
        
        {/* ── Mesh Gradient Background ─────────────────────────────────────── */}
        <View style={styles.meshContainer}>
          <LinearGradient
            colors={['rgba(156, 201, 66, 0.05)', 'rgba(255, 255, 255, 0)']}
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
                     <Ionicons name={s.icon as any} size={12} color="#9CC942" style={{ marginRight: 4 }} />
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
            <MaterialCommunityIcons name="map-marker-path" size={18} color="#1A1A1A" />
            <Text style={styles.plannerStripText}>
              {visits.length} propert{visits.length === 1 ? 'y' : 'ies'} in your Visit Plan — tap to view route
            </Text>
            <Feather name="chevron-right" size={16} color="rgba(0,0,0,0.5)" />
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
              {filtered.map((p, i) => (
                <React.Fragment key={p.id}>
                  <PropertyCard property={p} />
                  
                  {/* ── Boost Promo In-Line ─────────────────────────────────── */}
                  {i === 1 && (role === 'landlord' || role === 'agent') && (
                    <TouchableOpacity 
                      style={styles.boostBanner}
                      onPress={() => router.push('/boost-listing')}
                      activeOpacity={0.9}
                    >
                      <View style={styles.boostBannerLeft}>
                        <View style={styles.boostIconRound}>
                          <Feather name="zap" size={20} color="#FFF" />
                        </View>
                        <View>
                          <Text style={styles.boostBannerTitle}>Get 10x More Leads</Text>
                          <Text style={styles.boostBannerSub}>Push your listing to the top of results</Text>
                        </View>
                      </View>
                      <Feather name="chevron-right" size={20} color={KiraColors.primary} />
                    </TouchableOpacity>
                  )}
                </React.Fragment>
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
      )}

      {/* ── Floating Boost FAB ────────────────────────────────────────── */}
      {(role === 'landlord' || role === 'agent') && (
        <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fabInner}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/boost-listing');
          }}
        >
          <Feather name="zap" size={20} color="#1A1A1A" />
          <Text style={styles.fabText}>Boost</Text>
        </TouchableOpacity>
      </View>
      )}

    </View>
  );
}

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: typeof PROPERTIES[number] }) {
  const { addVisit, removeVisit, isInPlan } = useVisitPlan();
  const { saveProperty, unsaveProperty, isSaved } = useSaved();
  const inPlan = isInPlan(property.id);
  const saved = isSaved(property.id);

  const color = trustColor(property.trust);
  const isCommercial = ['shop', 'cafe', 'restaurant'].includes(property.category);

  // Plan Visit — Magnetic Button Animation
  const isPressed = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isPressed.value) }],
  }));

  // Heart / Save — bounce animation
  const heartScale = useSharedValue(1);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(heartScale.value, { damping: 4, stiffness: 180 }) }],
  }));

  const handleSave = () => {
    heartScale.value = 1.4;
    setTimeout(() => { heartScale.value = 1; }, 150);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (saved) {
      unsaveProperty(property.id);
    } else {
      saveProperty({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.image as string,
        badge: property.badge as 'verified' | 'hot_deal',
      });
    }
  };

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
          <Animated.View style={[styles.heartBtn, heartAnimatedStyle]}>
            <TouchableOpacity onPress={handleSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={20}
                color={saved ? KiraColors.danger : '#FFF'}
              />
            </TouchableOpacity>
          </Animated.View>
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
  return (
    <View style={[styles.card, { marginBottom: 24, paddingBottom: 16 }]}>
      <Skeleton width="100%" height={240} borderRadius={28} />
      <View style={{ padding: 16 }}>
        <Skeleton width="70%" height={24} borderRadius={4} style={{ marginBottom: 12 }} />
        <Skeleton width="45%" height={16} borderRadius={4} style={{ marginBottom: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <Skeleton width={110} height={20} borderRadius={4} />
          <Skeleton width={120} height={48} borderRadius={16} />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F9' },

  // Experimental Floating Header
  headerFloatingContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000,
    paddingHorizontal: 16,
  },
  headerPill: {
    backgroundColor: '#FFF',
    borderRadius: 40,
    borderWidth: 1.5, borderColor: '#F1F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.12, shadowRadius: 24,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { color: '#1A1A1A', fontSize: 13, fontWeight: '900' },
  headerCenter: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoTextKira: { fontSize: 16, fontWeight: '900', color: '#1A1A1A' },
  logoTextNet: { fontSize: 16, fontWeight: '900', color: KiraColors.primary },
  roleBadge: { 
    backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, 
    borderRadius: 6, marginTop: 2 
  },
  roleBadgeText: { fontSize: 8, fontWeight: '900', color: '#64748B' },
  headerNotif: { position: 'relative', width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerNotifDot: { 
    position: 'absolute', top: 8, right: 8, width: 8, height: 8, 
    borderRadius: 4, backgroundColor: KiraColors.primary, 
    borderWidth: 1.5, borderColor: '#FFF' 
  },

  // FAB
  fab: {
    position: 'absolute', bottom: 40, right: 20,
    zIndex: 999,
  },
  fabInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: KiraColors.primary, paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 30,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 12,
  },
  fabText: { color: '#1A1A1A', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },

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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9EB',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8,
    borderWidth: 1, borderColor: '#C8E27A',
  },
  suggestionText: { fontSize: 11, fontWeight: '700', color: '#82B136' },

  // Categories
  categoriesRow: { paddingHorizontal: 20, marginBottom: 24 },
  categoryPill: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24, marginRight: 12,
  },
  categoryPillActive: { backgroundColor: KiraColors.primary },
  categoryPillText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  categoryPillTextActive: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },

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
  verifiedText: { fontSize: 9, fontWeight: '800', color: '#1A1A1A', marginLeft: 4, letterSpacing: 0.5 },
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
  trustChipText: { fontSize: 10, fontWeight: '800', color: '#1A1A1A' },
  heartBtn: {
    position: 'absolute', top: 16, right: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
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
  detailBtnText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  planBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1.5, borderColor: KiraColors.primary, backgroundColor: '#FFF',
  },
  planBtnActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  planBtnText: { fontSize: 13, fontWeight: '700', color: KiraColors.primary },
  planBtnTextActive: { color: '#1A1A1A' },

  // FAB
  fabContainer: {
    position: 'absolute', bottom: 90, right: 20, zIndex: 999,
  },
  fabInner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: KiraColors.primary, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 25,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
  },
  fabText: { color: '#1A1A1A', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },

  // Empty
  emptyStateText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  // Boost Banner
  boostBanner: {
    backgroundColor: '#FAFDF4', // Light Fresh Green
    borderRadius: 24, padding: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#E8F5E9',
    marginTop: 8, marginBottom: 100,
  },
  boostBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  boostIconRound: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: KiraColors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  boostBannerTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  boostBannerSub: { fontSize: 9, color: '#6B7280', fontWeight: '500', marginTop: 1 },
});

const appStyles = StyleSheet.create({
    heroSection: { marginBottom: 24 },
    heroTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
    heroSub: { fontSize: 14, color: '#64748B', marginTop: 4 },
    glassCardContainer: { 
        height: 180, borderRadius: 28, overflow: 'hidden', marginBottom: 32,
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10
    },
    glassCard: { flex: 1 },
    glassContent: { flex: 1, padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    glassLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 1, marginBottom: 8 },
    glassValue: { fontSize: 32, fontWeight: '900', color: '#1A1A1A' },
    glassCurrency: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    glassDivider: { width: 1, height: '60%', backgroundColor: 'rgba(0,0,0,0.05)' },
    trendBadge: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F9EB', 
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 12, alignSelf: 'flex-start'
    },
    trendText: { fontSize: 11, fontWeight: '700', color: '#9CC942', marginLeft: 4 },
    intelSection: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
    seeAll: { fontSize: 13, fontWeight: '800', color: KiraColors.primary },
    trendCard: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
        padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9'
    },
    trendIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    trendBody: { flex: 1 },
    trendTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
    trendDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
    opsSection: { marginBottom: 24 },
    opsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    opsItem: { 
        width: (width - 40 - 24) / 3, alignItems: 'center', 
        backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 20,
        borderWidth: 1, borderColor: '#F1F5F9'
    },
    opsIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F9EB', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    opsText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A' },
});

const lh = StyleSheet.create({
    greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greetSmall: { fontSize: 13, color: '#64748B', fontWeight: '600' },
    greetBig: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', marginTop: 2 },
    notifPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: KiraColors.softPrimary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: KiraColors.primary, position: 'relative' },
    notifPillText: { fontSize: 12, fontWeight: '800', color: KiraColors.primary },
    notifDot: { position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: KiraColors.softPrimary },

    revenueCard: { borderRadius: 28, overflow: 'hidden', padding: 24, marginBottom: 32, minHeight: 200 },
    decorCircle: { position: 'absolute', borderRadius: 999 },
    revenueLabel: { fontSize: 9, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 8 },
    revenueAmount: { fontSize: 36, fontWeight: '900', color: '#FFF', marginBottom: 12 },
    revenueCur: { fontSize: 18, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
    revenueMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    revenueBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(156,201,66,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
    revenueBadgeText: { fontSize: 11, fontWeight: '800', color: '#9CC942' },
    revenueAssets: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    miniKpiRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 14 },
    miniKpi: { alignItems: 'center', flex: 1 },
    miniKpiVal: { fontSize: 15, fontWeight: '900', color: '#FFF' },
    miniKpiLab: { fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.6, marginTop: 3 },

    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16, marginTop: 8 },
    aiTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
    aiTagText: { fontSize: 9, fontWeight: '900', color: '#9CC942', letterSpacing: 1 },
    sectionH: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
    seeAll: { fontSize: 13, fontWeight: '800', color: KiraColors.primary },

    recCard: {
        width: width * 0.76,
        marginRight: 14,
        backgroundColor: '#FFF', borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
    },
    recIconWrap: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
    recTitle: { fontSize: 15, fontWeight: '900', color: '#1A1A1A', marginBottom: 8 },
    recDesc: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 16 },
    recCta: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
    recCtaText: { fontSize: 12, fontWeight: '800' },

    intelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
    intelCard: {
        width: (width - 40 - 12) / 2,
        backgroundColor: '#FFF', borderRadius: 20, padding: 16,
        borderWidth: 1, borderColor: '#F1F5F9',
    },
    intelArea: { fontSize: 13, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
    intelChange: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
    intelDesc: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },

    opsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    opsCard: {
        width: (width - 40 - 12) / 2,
        backgroundColor: '#FFF', borderRadius: 20, padding: 18,
        borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'flex-start',
    },
    opsIconWrap: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    opsLabel: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
});
