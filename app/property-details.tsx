import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Share, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
import { Feather, Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useVisitPlan } from '@/context/VisitPlanContext';
import { useSaved } from '@/context/SavedContext';

import { KiraColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Market data by location
const MARKET_DATA: Record<string, { avg: number; cheaper: number; trend: 'up' | 'down' | 'stable'; trendPct: number }> = {
  'Bole, Addis Ababa':        { avg: 28000, cheaper: 72, trend: 'up',     trendPct: 4 },
  'Old Airport, Addis Ababa': { avg: 38000, cheaper: 58, trend: 'stable', trendPct: 0 },
  'Kazanchis, Addis Ababa':   { avg: 22000, cheaper: 60, trend: 'down',   trendPct: 3 },
  'CMC, Addis Ababa':         { avg: 24000, cheaper: 65, trend: 'up',     trendPct: 2 },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
import { PROPERTIES as SHARED_PROPERTIES } from '@/data/properties';

// We'll merge the UI-specific details with the shared property data
// Keys match the #KN-XXX id format from data/properties.ts
const PROPERTIES: Record<string, any> = {
  '#KN-001': {
    ...SHARED_PROPERTIES[0],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 2, bathrooms: 1, sqm: 85,
    description:
      'Welcome to The Summit Residency — a beautifully designed modern apartment nestled in the heart of Bole. This fully-furnished unit offers stunning city views, high-speed fiber internet, and 24/7 security. Ideal for professionals and small families looking for a secure and comfortable home.',
    utilities: [
      { label: 'Constant Water', icon: 'water', available: true },
      { label: 'Private Meter', icon: 'flash', available: true },
      { label: 'Fiber Internet', icon: 'wifi', available: true },
    ],
    deposit: '3 Months', floor: '4th Floor', parking: true,
    owner: {
      name: 'Abebe Tadesse', role: 'Property Manager', verified: true,
      since: 'Member since 2021',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 4.8, reviews: 34,
    },
    trust: {
      score: 91,
      verifiedPhotos: true,
      phoneVerified: true,
      recentlyVerified: 'Verified 2 days ago',
      reviewCount: 34,
      reportCount: 0,
    },
    hood: {
      safety: 4,       // /5
      noise: 2,        // 1=quiet, 5=very busy
      roadAccess: 'Asphalt',
      floodRisk: 'Low',
      tags: ['Business Hub', 'Great Nightlife', 'Near Airport'],
    },
  },
  '#KN-002': {
    ...SHARED_PROPERTIES[1],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 3, bathrooms: 2, sqm: 160,
    description:
      'A spacious and elegant villa situated in the prestigious Old Airport neighborhood. Features a private garden, ample parking, and a modern open-plan kitchen. This is a rare find — reduced in price for a limited time only. Perfect for families who value privacy, space, and premium living.',
    utilities: [
      { label: 'Tanker Water', icon: 'water', available: true },
      { label: 'Shared Meter', icon: 'flash', available: false },
      { label: 'Fiber Internet', icon: 'wifi', available: true },
    ],
    deposit: '2 Months', floor: 'Ground + 1', parking: true,
    owner: {
      name: 'Meron Girma', role: 'Landlord', verified: false,
      since: 'Member since 2023',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      rating: 4.5, reviews: 12,
    },
    trust: {
      score: 64,
      verifiedPhotos: true,
      phoneVerified: false,
      recentlyVerified: 'Verified 3 weeks ago',
      reviewCount: 12,
      reportCount: 1,
    },
    hood: {
      safety: 3,
      noise: 3,
      roadAccess: 'Asphalt',
      floodRisk: 'Moderate',
      tags: ['Family-Friendly', 'Near Schools', 'Quieter Area'],
    },
  },
  '#KN-003': {
    ...SHARED_PROPERTIES[2],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 1, bathrooms: 1, sqm: 45,
    description:
      'A cozy, compact studio in the vibrant Kazanchis area — at the center of everything Addis has to offer. Walking distance to major offices, restaurants, and transport hubs. Fully self-contained with high-speed internet and constant city water. Perfect for a single professional or student.',
    utilities: [
      { label: 'Constant Water', icon: 'water', available: true },
      { label: 'Prepaid', icon: 'flash', available: true },
      { label: 'High Speed', icon: 'wifi', available: true },
    ],
    deposit: '1 Month', floor: '2nd Floor', parking: false,
    owner: {
      name: 'Yonas Bekele', role: 'Property Owner', verified: true,
      since: 'Member since 2020',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      rating: 4.9, reviews: 57,
    },
    trust: {
      score: 97,
      verifiedPhotos: true,
      phoneVerified: true,
      recentlyVerified: 'Verified today',
      reviewCount: 57,
      reportCount: 0,
    },
    hood: {
      safety: 3,
      noise: 5,
      roadAccess: 'Asphalt',
      floodRisk: 'Low',
      tags: ['Popular for Students', 'Very Central', 'High Foot Traffic'],
    },
  },
};

// ─── Trust Score helpers ───────────────────────────────────────────────────────
function getTrustColor(score: number) {
  if (score >= 85) return KiraColors.success;
  if (score >= 60) return KiraColors.warning;
  return KiraColors.danger;
}
function getTrustLabel(score: number) {
  if (score >= 85) return 'Highly Trusted';
  if (score >= 60) return 'Moderately Trusted';
  return 'Low Trust';
}

// ─── Noise label ──────────────────────────────────────────────────────────────
function noiseLabel(level: number) {
  const map = ['', 'Very Quiet', 'Quiet', 'Moderate', 'Busy', 'Very Busy'];
  return map[level] ?? 'Unknown';
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const property = PROPERTIES[id ?? '#KN-001'] ?? PROPERTIES['#KN-001'];
  const isCommercial = ['shop', 'cafe', 'restaurant'].includes(property.category);
  const [activeImage, setActiveImage] = useState(0);
  const [offlineMapSaved, setOfflineMapSaved] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const { addVisit, removeVisit, isInPlan } = useVisitPlan();
  const { saveProperty, unsaveProperty, isSaved } = useSaved();
  const inPlan = isInPlan(id ?? '#KN-001');
  const saved = isSaved(id ?? '#KN-001');

  const handleSave = () => {
    if (saved) {
      unsaveProperty(id ?? '#KN-001');
    } else {
      saveProperty({
        id: id ?? '#KN-001',
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.images[0],
        badge: property.badge,
      });
    }
  };

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const handleShare = async () => {
    await Share.share({
      message: `Check out ${property.title} on Kira-Net — ${property.price} ETB/month in ${property.location}`,
    });
  };

  const handleVisitToggle = () => {
    scale.value = 0.93;
    setTimeout(() => { scale.value = 1; }, 100);

    if (inPlan) {
      removeVisit(id ?? '#KN-001');
    } else {
      addVisit({
        id: id ?? '#KN-001',
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.images[0],
      });
    }
  };

  const trust = property.trust;
  const hood = property.hood;
  const trustColor = getTrustColor(trust.score);

  return (
    <View style={styles.root}>
      {/* ── Image Carousel ─────────────────────────────────────────────────── */}
      <View style={styles.imageWrapper}>
        <ScrollView
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImage(index);
          }}
        >
          {property.images.map((img: string, i: number) => (
            <AnimatedImage 
              key={i} 
              source={img} 
              style={styles.carouselImage} 
              sharedTransitionTag={i === 0 ? `image-${id}` : undefined}
            />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {property.images.map((_: any, i: number) => (
            <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
          ))}
        </View>

        {/* Overlay Buttons */}
        <SafeAreaView style={styles.overlayButtons}>
          <TouchableOpacity style={styles.overlayBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.overlayRight}>
            <TouchableOpacity style={styles.overlayBtn} onPress={handleShare}>
              <Feather name="share-2" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.overlayBtn} onPress={handleSave}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? KiraColors.danger : '#1A1A1A'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.overlayBtn, offlineMapSaved && styles.overlayBtnActive]} 
              onPress={() => {
                setOfflineMapSaved(!offlineMapSaved);
                if (!offlineMapSaved) {
                  Alert.alert('📍 Saved for Offline Map', 'You can now view this property location on the map even without internet.');
                }
              }}
            >
              <MaterialCommunityIcons 
                name={offlineMapSaved ? 'map-marker-check' : 'map-marker-plus-outline'} 
                size={20} 
                color={offlineMapSaved ? KiraColors.primary : '#1A1A1A'} 
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Badge */}
        {property.badge === 'verified' && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color="#3B82F6" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        )}
        {property.badge === 'hot_deal' && (
          <View style={styles.hotDealBadge}>
            <Text style={styles.hotDealText}>HOT DEAL</Text>
          </View>
        )}

        {/* Trust Score Chip on image */}
        <View style={[styles.trustChipOnImage, { backgroundColor: trustColor }]}>
          <MaterialIcons name="shield" size={11} color="#FFF" />
          <Text style={styles.trustChipText}>{trust.score}% Trust</Text>
        </View>
      </View>

      {/* ── Scroll Content ─────────────────────────────────────────────────── */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title & Price */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color="#4A5568" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{property.price} <Text style={styles.priceUnit}>ETB</Text></Text>
            <Text style={styles.priceDesc}> / month</Text>
          </View>
        </View>

        {/* ── Content Specific Spotlight ─────────────────────────── */}
        <ContentSpotlight property={property} isCommercial={isCommercial} />

        {/* ── RENT PRICE INSIGHTS ─────────────────────────────────── */}
        <RentInsightsCard location={property.location} price={property.price} />

        {/* ── 1. TRUST SCORE CARD ─────────────────────────────────────────── */}
        <TrustScoreCard trust={trust} trustColor={trustColor} />

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="bed" size={20} color={KiraColors.primary} />
            <Text style={styles.statValue}>{property.bedrooms}</Text>
            <Text style={styles.statLabel}>Bedrooms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <FontAwesome5 name="bath" size={18} color={KiraColors.primary} />
            <Text style={styles.statValue}>{property.bathrooms}</Text>
            <Text style={styles.statLabel}>Bathrooms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <MaterialIcons name="straighten" size={20} color={KiraColors.primary} />
            <Text style={styles.statValue}>{property.sqm}</Text>
            <Text style={styles.statLabel}>Sq. Meters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="layers" size={20} color={KiraColors.primary} />
            <Text style={styles.statValue} numberOfLines={1}>{property.floor}</Text>
            <Text style={styles.statLabel}>Floor</Text>
          </View>
        </View>

        {/* ── 2. NEIGHBORHOOD INTELLIGENCE ───────────────────────────────── */}
        <NeighborhoodCard hood={hood} />

        {/* Offline Map Link */}
        {offlineMapSaved && (
          <TouchableOpacity 
            style={styles.offlineMapBanner}
            onPress={() => router.push('/offline-maps')}
          >
            <View style={styles.offlineMapIcon}>
              <Ionicons name="map" size={18} color={KiraColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.offlineMapTitle}>View in Offline Map</Text>
              <Text style={styles.offlineMapSub}>Available without internet</Text>
            </View>
            <Feather name="chevron-right" size={16} color={KiraColors.primary} />
          </TouchableOpacity>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{property.description}</Text>
        </View>

        {/* Utilities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Utilities & Facilities</Text>
          <View style={styles.utilitiesGrid}>
            {property.utilities.map((u: any, i: number) => (
              <View key={i} style={[styles.utilityChip, !u.available && styles.utilityChipOff]}>
                <Ionicons name={u.icon} size={16} color={u.available ? KiraColors.primary : '#9CA3AF'} />
                <Text style={[styles.utilityChipText, !u.available && styles.utilityChipTextOff]}>
                  {u.label}
                </Text>
              </View>
            ))}
            <View style={[styles.utilityChip, !property.parking && styles.utilityChipOff]}>
              <MaterialIcons name="local-parking" size={16} color={property.parking ? KiraColors.primary : '#9CA3AF'} />
              <Text style={[styles.utilityChipText, !property.parking && styles.utilityChipTextOff]}>
                Parking
              </Text>
            </View>
          </View>
        </View>

        {/* Rental Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Rental Terms</Text>
          <View style={styles.termsRow}>
            <View style={styles.termBox}>
              <Text style={styles.termLabel}>Advance Deposit</Text>
              <Text style={styles.termValue}>{property.deposit}</Text>
            </View>
            <View style={styles.termBox}>
              <Text style={styles.termLabel}>Pet Friendly</Text>
              <Text style={styles.termValue}>Ask Owner</Text>
            </View>
          </View>
        </View>

        {/* Owner Card */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About the Owner</Text>
          <View style={styles.ownerCard}>
            <Image source={property.owner.avatar} style={styles.ownerAvatar} />
            <View style={styles.ownerInfo}>
              <View style={styles.ownerNameRow}>
                <Text style={styles.ownerName}>{property.owner.name}</Text>
                {property.owner.verified && (
                  <MaterialIcons name="verified" size={14} color="#3B82F6" style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text style={styles.ownerRole}>{property.owner.role}</Text>
              <Text style={styles.ownerSince}>{property.owner.since}</Text>
              <View style={styles.ownerRatingRow}>
                <Ionicons name="star" size={12} color={KiraColors.accent} />
                <Text style={styles.ownerRating}>{property.owner.rating} ({property.owner.reviews} reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Similar Homes */}
        <View style={styles.section}>
          <View style={styles.aiLabelRow}>
            <MaterialIcons name="auto-awesome" size={16} color={KiraColors.primary} />
            <Text style={styles.sectionLabel}>  AI Picks — Similar Homes</Text>
          </View>
          <Text style={styles.aiSub}>Based on price, location & amenities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
            {SHARED_PROPERTIES
              .filter(p => p.id !== id && (p.location.includes(property.location) || Math.abs(parseInt(p.price.replace(/,/g, '')) - parseInt(property.price.replace(/,/g, ''))) < 10000))
              .slice(0, 3)
              .map(sim => (
                <TouchableOpacity
                  key={sim.id} style={styles.simCard} activeOpacity={0.88}
                  onPress={() => router.replace({ pathname: '/property-details', params: { id: sim.id } })}
                >
                  <View style={styles.simImageWrap}>
                    <Image source={sim.image} style={styles.simImage} />
                    <View style={[styles.simBadge, sim.badge === 'verified' ? styles.simBadgeVerified : styles.simBadgeHot]}>
                      {sim.badge === 'verified'
                        ? <MaterialIcons name="verified" size={10} color="#3B82F6" />
                        : <Text style={styles.simBadgeHotText}>HOT</Text>
                      }
                    </View>
                  </View>
                  <View style={styles.simInfo}>
                    <Text style={styles.simTitle} numberOfLines={1}>{sim.title}</Text>
                    <View style={styles.simLocRow}>
                      <Ionicons name="location-sharp" size={10} color="#4A5568" />
                      <Text style={styles.simLocation}>{sim.location}</Text>
                    </View>
                    <Text style={styles.simPrice}>{sim.price} <Text style={styles.simPriceUnit}>ETB/mo</Text></Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        {/* Report */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.reportBtn} onPress={() => router.push('/report-listing')}>
            <Feather name="alert-triangle" size={15} color={KiraColors.danger} />
            <Text style={styles.reportBtnText}>Report this listing</Text>
          </TouchableOpacity>
        </View>

        {/* Post-Move Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>After You Decide</Text>
          <View style={styles.postMoveRow}>
            <TouchableOpacity
              style={styles.postMoveBtn}
              onPress={() => router.push('/rental-agreement')}
              activeOpacity={0.88}
            >
              <View style={[styles.postMoveIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="file-sign" size={20} color={KiraColors.primary} />
              </View>
              <Text style={styles.postMoveBtnTitle}>Digital Agreement</Text>
              <Text style={styles.postMoveBtnSub}>Sign your lease digitally</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postMoveBtn}
              onPress={() => router.push('/moving-services')}
              activeOpacity={0.88}
            >
              <View style={[styles.postMoveIcon, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="truck-fast" size={20} color="#92400E" />
              </View>
              <Text style={styles.postMoveBtnTitle}>Book a Mover</Text>
              <Text style={styles.postMoveBtnSub}>Trucks & movers in Addis</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ── CTA Footer ─────────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        {/* Visit Plan Toggle */}
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            style={[styles.visitPlanBtn, inPlan && styles.visitPlanBtnActive]}
            onPress={handleVisitToggle}
            onPressIn={() => { scale.value = 0.93; }}
            onPressOut={() => { scale.value = 1; }}
          >
            <MaterialCommunityIcons
              name={inPlan ? 'calendar-check' : 'calendar-plus'}
              size={18}
              color={inPlan ? KiraColors.primary : KiraColors.muted}
            />
            <Text style={[styles.visitPlanBtnText, inPlan && styles.visitPlanBtnTextActive]}>
              {inPlan ? 'In Plan' : 'Plan Visit'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Chat */}
        <TouchableOpacity style={styles.chatBtn} onPress={() => router.push('/chat')}>
          <Feather name="message-circle" size={18} color={KiraColors.primary} />
        </TouchableOpacity>

        {/* Contact */}
        <View style={styles.contactWrapper}>
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Linking.openURL(`tel:${property.phone}`)}
          >
            <Ionicons name="call" size={18} color="#FFF" />
            <Text style={styles.contactBtnText}>Call Owner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Content Specific Spotlight Component ─────────────────────────────────────
function ContentSpotlight({ property, isCommercial }: { property: any; isCommercial: boolean }) {
  if (isCommercial) {
    return (
      <View style={[spotStyles.card, { borderColor: '#EEF2FF', backgroundColor: '#F8FAFF' }]}>
        <View style={spotStyles.header}>
          <MaterialIcons name="business-center" size={18} color="#4F46E5" />
          <Text style={[spotStyles.title, { color: '#4F46E5' }]}>Business Suitability</Text>
        </View>
        <View style={spotStyles.grid}>
          <View style={spotStyles.item}>
            <MaterialCommunityIcons name="walk" size={20} color="#4F46E5" />
            <Text style={spotStyles.label}>Foot Traffic</Text>
            <Text style={spotStyles.value}>{property.hood.tags.includes('High Foot Traffic') ? 'Very High' : 'High'}</Text>
          </View>
          <View style={spotStyles.divider} />
          <View style={spotStyles.item}>
             <MaterialCommunityIcons name="power-plug" size={20} color="#4F46E5" />
             <Text style={spotStyles.label}>Energy Status</Text>
             <Text style={spotStyles.value}>{property.utilities.some((u:any) => u.label === 'Generator') ? 'Generator Backup' : 'Stable Grid'}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[spotStyles.card, { borderColor: '#ECFDF5', backgroundColor: '#F0FDF4' }]}>
      <View style={spotStyles.header}>
        <MaterialIcons name="home-work" size={18} color="#059669" />
        <Text style={[spotStyles.title, { color: '#059669' }]}>Sanctuary Quality</Text>
      </View>
      <View style={spotStyles.grid}>
        <View style={spotStyles.item}>
          <Ionicons name="water" size={20} color="#059669" />
          <Text style={spotStyles.label}>Water Supply</Text>
          <Text style={spotStyles.value}>
            {property.utilities.some((u:any) => u.label === 'Constant Water') ? '24/7 Supply' : 'High Capacity Tank'}
          </Text>
        </View>
        <View style={spotStyles.divider} />
        <View style={spotStyles.item}>
           <Ionicons name="volume-low" size={20} color="#059669" />
           <Text style={spotStyles.label}>Noise Serenity</Text>
           <Text style={spotStyles.value}>{property.hood.noise <= 2 ? 'Very Peaceful' : 'Urban Vibes'}</Text>
        </View>
      </View>
    </View>
  );
}

const spotStyles = StyleSheet.create({
  card: {
    marginVertical: 10, padding: 16, borderRadius: 24, borderWidth: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  title: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  item: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(0,0,0,0.05)' },
  label: { fontSize: 10, fontWeight: '600', color: '#6B7280', marginTop: 4 },
  value: { fontSize: 12, fontWeight: '800', color: '#1A1A1A', marginTop: 2 },
});

// ─── Rent Price Insights Card ─────────────────────────────────────────────────
function RentInsightsCard({ location, price }: { location: string; price: string }) {
  const market = MARKET_DATA[location];
  if (!market) return null;

  const numericPrice = parseInt(price.replace(/,/g, ''), 10);
  const diff = market.avg - numericPrice;
  const isCheaper = diff > 0;
  const diffPct = Math.round(Math.abs(diff) / market.avg * 100);

  const trendIcon = market.trend === 'up' ? 'trending-up' : market.trend === 'down' ? 'trending-down' : 'minus';
  const trendColor = market.trend === 'up'
    ? KiraColors.danger
    : market.trend === 'down'
      ? KiraColors.success
      : KiraColors.muted;
  const trendLabel = market.trend === 'up' ? `Rents rising +${market.trendPct}% this month`
    : market.trend === 'down' ? `Rents falling −${market.trendPct}% this month`
    : 'Rents stable this month';

  return (
    <View style={insightStyles.card}>
      <View style={insightStyles.headerRow}>
        <View style={insightStyles.iconWrap}>
          <MaterialIcons name="bar-chart" size={16} color="#3B82F6" />
        </View>
        <Text style={insightStyles.title}>Rent Price Insights</Text>
        <View style={[insightStyles.trendChip, { backgroundColor: trendColor + '18' }]}>
          <Feather name={trendIcon} size={11} color={trendColor} />
          <Text style={[insightStyles.trendText, { color: trendColor }]}>
            {market.trend === 'stable' ? 'Stable' : `${market.trendPct}%`}
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={insightStyles.statsRow}>
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>Avg. in {location.split(',')[0]}</Text>
          <Text style={insightStyles.statValue}>{market.avg.toLocaleString()} ETB</Text>
        </View>
        <View style={insightStyles.statDivider} />
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>This listing</Text>
          <Text style={[insightStyles.statValue, { color: isCheaper ? KiraColors.success : KiraColors.danger }]}>
            {price} ETB
          </Text>
        </View>
        <View style={insightStyles.statDivider} />
        <View style={insightStyles.statBox}>
          <Text style={insightStyles.statLabel}>vs. Market</Text>
          <Text style={[insightStyles.statValue, { color: isCheaper ? KiraColors.success : KiraColors.danger }]}>
            {isCheaper ? `−${diffPct}%` : `+${diffPct}%`}
          </Text>
        </View>
      </View>

      {/* Percentile Bar */}
      <View style={insightStyles.percentileSection}>
        <Text style={insightStyles.percentileLabel}>
          {isCheaper
            ? `✅ Cheaper than ${market.cheaper}% of listings in this area`
            : `⚠️ Pricier than ${100 - market.cheaper}% of similar listings`}
        </Text>
        <View style={insightStyles.barTrack}>
          <View style={[insightStyles.barFill, { width: `${market.cheaper}%` as any, backgroundColor: isCheaper ? KiraColors.success : KiraColors.warning }]} />
          <View style={[insightStyles.barMarker, { left: `${market.cheaper}%` as any }]} />
        </View>
        <View style={insightStyles.barLabels}>
          <Text style={insightStyles.barLabelLeft}>Cheapest</Text>
          <Text style={insightStyles.barLabelRight}>Most Expensive</Text>
        </View>
      </View>

      {/* Trend line */}
      <View style={insightStyles.trendRow}>
        <Feather name={trendIcon} size={13} color={trendColor} />
        <Text style={[insightStyles.trendFullText, { color: trendColor }]}>{trendLabel}</Text>
      </View>
    </View>
  );
}

// ─── Trust Score Card ─────────────────────────────────────────────────────────
function TrustScoreCard({ trust, trustColor }: { trust: any; trustColor: string }) {

  const barWidth = `${trust.score}%` as any;
  return (
    <View style={trustStyles.card}>
      {/* Header row */}
      <View style={trustStyles.headerRow}>
        <View style={trustStyles.shieldWrap}>
          <MaterialIcons name="shield" size={18} color={trustColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={trustStyles.title}>Listing Trust Score</Text>
          <Text style={[trustStyles.label, { color: trustColor }]}>{getTrustLabel(trust.score)}</Text>
        </View>
        <View style={[trustStyles.scoreBubble, { borderColor: trustColor }]}>
          <Text style={[trustStyles.scoreNum, { color: trustColor }]}>{trust.score}</Text>
          <Text style={trustStyles.scoreMax}>/100</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={trustStyles.barTrack}>
        <View style={[trustStyles.barFill, { width: barWidth, backgroundColor: trustColor }]} />
      </View>

      {/* Check items */}
      <View style={trustStyles.checksRow}>
        <TrustCheck ok={trust.verifiedPhotos} label="Verified Photos" />
        <TrustCheck ok={trust.phoneVerified} label="Phone Verified" />
        <TrustCheck ok={trust.reviewCount >= 10} label={`${trust.reviewCount} Reviews`} />
      </View>

      {/* Footer info */}
      <View style={trustStyles.footerRow}>
        <View style={trustStyles.footerItem}>
          <Feather name="clock" size={11} color="#6B7280" />
          <Text style={trustStyles.footerText}>{trust.recentlyVerified}</Text>
        </View>
        {trust.reportCount > 0 && (
          <View style={trustStyles.warnChip}>
            <Feather name="alert-triangle" size={11} color={KiraColors.danger} />
            <Text style={trustStyles.warnText}>{trust.reportCount} report{trust.reportCount > 1 ? 's' : ''} filed</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function TrustCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <View style={trustStyles.checkItem}>
      <View style={[trustStyles.checkIcon, ok ? trustStyles.checkOk : trustStyles.checkFail]}>
        <Feather name={ok ? 'check' : 'x'} size={10} color="#FFF" />
      </View>
      <Text style={trustStyles.checkLabel}>{label}</Text>
    </View>
  );
}

// ─── Neighborhood Card ────────────────────────────────────────────────────────
function NeighborhoodCard({ hood }: { hood: any }) {
  const safetyColor = hood.safety >= 4 ? KiraColors.success : hood.safety >= 3 ? KiraColors.warning : KiraColors.danger;
  const noiseColor = hood.noise <= 2 ? KiraColors.success : hood.noise <= 3 ? KiraColors.warning : KiraColors.danger;
  const floodColor = hood.floodRisk === 'Low' ? KiraColors.success : hood.floodRisk === 'Moderate' ? KiraColors.warning : KiraColors.danger;

  return (
    <View style={hoodStyles.card}>
      <View style={hoodStyles.headerRow}>
        <View style={hoodStyles.iconWrap}>
          <Ionicons name="map" size={16} color={KiraColors.primary} />
        </View>
        <Text style={hoodStyles.title}>Neighborhood Intelligence</Text>
      </View>
      <Text style={hoodStyles.subtitle}>Know the area before you move in</Text>

      {/* Metrics Grid */}
      <View style={hoodStyles.metricsGrid}>
        <HoodMetric
          icon="shield-checkmark-outline"
          label="Safety"
          value={`${hood.safety}/5`}
          color={safetyColor}
          fill={hood.safety / 5}
        />
        <HoodMetric
          icon="volume-medium-outline"
          label="Noise Level"
          value={noiseLabel(hood.noise)}
          color={noiseColor}
          fill={hood.noise / 5}
        />
        <HoodMetric
          icon="car-outline"
          label="Road Access"
          value={hood.roadAccess}
          color="#3B82F6"
          fill={hood.roadAccess === 'Asphalt' ? 1 : 0.5}
        />
        <HoodMetric
          icon="water-outline"
          label="Flood Risk"
          value={hood.floodRisk}
          color={floodColor}
          fill={hood.floodRisk === 'Low' ? 0.2 : hood.floodRisk === 'Moderate' ? 0.55 : 0.9}
        />
      </View>

      {/* Tags */}
      <View style={hoodStyles.tagsRow}>
        {hood.tags.map((tag: string, i: number) => (
          <View key={i} style={hoodStyles.tag}>
            <Text style={hoodStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function HoodMetric({ icon, label, value, color, fill }: any) {
  return (
    <View style={hoodStyles.metric}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={hoodStyles.metricLabel}>{label}</Text>
      <Text style={[hoodStyles.metricValue, { color }]}>{value}</Text>
      {/* mini bar */}
      <View style={hoodStyles.miniBarTrack}>
        <View style={[hoodStyles.miniBarFill, { width: `${Math.round(fill * 100)}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  imageWrapper: { width, height: 300, position: 'relative' },
  carouselImage: { width, height: 300 },
  dotsRow: {
    position: 'absolute', bottom: 16,
    flexDirection: 'row', alignSelf: 'center',
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#FFF', width: 18 },
  overlayButtons: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16,
  },
  overlayRight: { flexDirection: 'row' },
  overlayBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  verifiedBadge: {
    position: 'absolute', bottom: 40, left: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  verifiedText: { fontSize: 9, fontWeight: '800', color: '#1A1A1A', marginLeft: 4 },
  hotDealBadge: {
    position: 'absolute', bottom: 40, left: 16,
    backgroundColor: KiraColors.danger, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  hotDealText: { fontSize: 9, fontWeight: '800', color: '#FFF' },

  trustChipOnImage: {
    position: 'absolute', bottom: 40, right: 16,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  trustChipText: { fontSize: 9, fontWeight: '800', color: '#FFF', marginLeft: 4 },

  scrollContent: { paddingHorizontal: 20 },
  titleSection: { paddingTop: 24, marginBottom: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  propertyTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 10 },
  locationText: { fontSize: 13, color: '#4A5568', marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 26, fontWeight: '900', color: KiraColors.primary },
  priceUnit: { fontSize: 14, fontWeight: '700' },
  priceDesc: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#F7F8F9',
    borderRadius: 20, paddingVertical: 18, paddingHorizontal: 12,
    marginBottom: 28, alignItems: 'center',
  },
  statCard: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB' },
  statValue: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginTop: 6 },
  statLabel: { fontSize: 10, color: '#6B7280', marginTop: 2 },

  section: { marginBottom: 28 },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 14 },
  descriptionText: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
  utilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  utilityChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 30, marginRight: 10, marginBottom: 10,
  },
  utilityChipOff: { backgroundColor: '#F3F4F6' },
  utilityChipText: { fontSize: 12, fontWeight: '700', color: KiraColors.primary, marginLeft: 6 },
  utilityChipTextOff: { color: '#9CA3AF' },
  termsRow: { flexDirection: 'row' },
  termBox: { flex: 1, backgroundColor: '#F7F8F9', borderRadius: 16, padding: 16, marginRight: 10 },
  termLabel: { fontSize: 10, color: '#6B7280', marginBottom: 6 },
  termValue: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  ownerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F8F9', borderRadius: 20, padding: 16,
  },
  ownerAvatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  ownerInfo: { flex: 1 },
  ownerNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ownerName: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  ownerRole: { fontSize: 12, fontWeight: '600', color: KiraColors.primary, marginBottom: 2 },
  ownerSince: { fontSize: 11, color: '#6B7280', marginBottom: 6 },
  ownerRatingRow: { flexDirection: 'row', alignItems: 'center' },
  ownerRating: { fontSize: 11, color: '#4A5568', marginLeft: 4, fontWeight: '600' },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  aiSub: { fontSize: 12, color: '#6B7280', marginBottom: 14 },
  similarRow: { paddingBottom: 4 },
  simCard: {
    width: 160, backgroundColor: '#FFF', borderRadius: 16, marginRight: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  simImageWrap: { width: '100%', height: 100, position: 'relative' },
  simImage: { width: '100%', height: '100%' },
  simBadge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  simBadgeVerified: { backgroundColor: '#FFF' },
  simBadgeHot: { backgroundColor: KiraColors.danger },
  simBadgeHotText: { fontSize: 8, fontWeight: '800', color: '#FFF' },
  simInfo: { padding: 10 },
  simTitle: { fontSize: 12, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  simLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  simLocation: { fontSize: 10, color: '#4A5568', marginLeft: 2 },
  simPrice: { fontSize: 12, fontWeight: '900', color: KiraColors.primary },
  simPriceUnit: { fontSize: 9, fontWeight: '500', color: '#6B7280' },
  reportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderWidth: 1, borderColor: '#FCA5A5',
    borderRadius: 12, backgroundColor: '#FEF2F2',
  },
  reportBtnText: { fontSize: 13, fontWeight: '700', color: KiraColors.danger, marginLeft: 8 },

  // Post-Move Actions
  postMoveRow: { flexDirection: 'row', gap: 12 },
  postMoveBtn: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 18, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  postMoveIcon: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  postMoveBtnTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', marginBottom: 3, textAlign: 'center' },
  postMoveBtnSub: { fontSize: 11, color: '#6B7280', textAlign: 'center' },

  overlayBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: KiraColors.primary,
  },
  offlineMapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    gap: 12,
  },
  offlineMapIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineMapTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: KiraColors.primary,
  },
  offlineMapSub: {
    fontSize: 11,
    color: '#4A5568',
  },
  contactWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  missedCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    paddingHorizontal: 12,
    gap: 6,
  },
  missedCallBtnSent: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4',
  },
  missedCallText: {
    fontSize: 13,
    fontWeight: '800',
    color: KiraColors.danger,
  },
  missedCallTextSent: {
    color: KiraColors.success,
  },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 28,
  },
  visitPlanBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14,
    backgroundColor: '#F7F8F9',
  },
  visitPlanBtnActive: {
    borderColor: KiraColors.primary, backgroundColor: '#E8F5E9',
  },
  visitPlanBtnText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  visitPlanBtnTextActive: { color: KiraColors.primary },
  chatBtn: {
    width: 46, height: 46, borderRadius: 23,
    borderWidth: 1.5, borderColor: KiraColors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: KiraColors.primary, borderRadius: 14, paddingVertical: 14,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  contactBtnText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
});

// ─── Trust Card Styles ────────────────────────────────────────────────────────
const trustStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 24,
    borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  shieldWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F7F8F9', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  title: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  label: { fontSize: 12, fontWeight: '700', marginTop: 1 },
  scoreBubble: {
    borderWidth: 2, borderRadius: 14,
    paddingHorizontal: 10, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'baseline',
  },
  scoreNum: { fontSize: 20, fontWeight: '900' },
  scoreMax: { fontSize: 10, color: '#6B7280', marginLeft: 1 },
  barTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginBottom: 16 },
  barFill: { height: 8, borderRadius: 4 },
  checksRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  checkItem: { alignItems: 'center', flex: 1 },
  checkIcon: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  checkOk: { backgroundColor: KiraColors.success },
  checkFail: { backgroundColor: KiraColors.danger },
  checkLabel: { fontSize: 10, color: '#4A5568', fontWeight: '600', textAlign: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerText: { fontSize: 11, color: '#6B7280' },
  warnChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  warnText: { fontSize: 11, fontWeight: '700', color: KiraColors.danger },
});

// ─── Neighborhood Styles ──────────────────────────────────────────────────────
const hoodStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F0FDF4', borderRadius: 20, padding: 18, marginBottom: 28,
    borderWidth: 1, borderColor: '#D1FAE5',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  iconWrap: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  title: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 12, color: '#4A5568', marginBottom: 18, marginLeft: 40 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metric: {
    width: (width - 80) / 2,
    backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  metricLabel: { fontSize: 11, color: '#6B7280', marginTop: 6, marginBottom: 3 },
  metricValue: { fontSize: 13, fontWeight: '800' },
  miniBarTrack: { height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, marginTop: 8 },
  miniBarFill: { height: 4, borderRadius: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1FAE5',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  tagText: { fontSize: 11, fontWeight: '700', color: KiraColors.primary },
});

// ─── Rent Insights Styles ─────────────────────────────────────────────────────
const insightStyles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF', borderRadius: 20, padding: 18, marginBottom: 24,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconWrap: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  title: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  trendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  trendText: { fontSize: 11, fontWeight: '800' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 12, marginBottom: 16,
    alignItems: 'center',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, color: '#6B7280', fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  statValue: { fontSize: 14, fontWeight: '900', color: '#1A1A1A', textAlign: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },
  percentileSection: { marginBottom: 12 },
  percentileLabel: { fontSize: 12, fontWeight: '700', color: '#1E40AF', marginBottom: 10 },
  barTrack: { height: 8, backgroundColor: '#DBEAFE', borderRadius: 4, position: 'relative', marginBottom: 6 },
  barFill: { height: 8, borderRadius: 4 },
  barMarker: {
    position: 'absolute', top: -3, width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#1D4ED8', borderWidth: 2, borderColor: '#FFF', marginLeft: -7,
  },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabelLeft: { fontSize: 10, color: '#6B7280' },
  barLabelRight: { fontSize: 10, color: '#6B7280' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendFullText: { fontSize: 12, fontWeight: '700' },
});
