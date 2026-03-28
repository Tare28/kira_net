import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, Share, Alert
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const PROPERTIES: Record<string, any> = {
  '1': {
    title: 'The Summit Residency',
    location: 'Bole, Addis Ababa',
    price: '25,000',
    badge: 'verified',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 2,
    bathrooms: 1,
    sqm: 85,
    description:
      'Welcome to The Summit Residency — a beautifully designed modern apartment nestled in the heart of Bole. This fully-furnished unit offers stunning city views, high-speed fiber internet, and 24/7 security. Ideal for professionals and small families looking for a secure and comfortable home in Addis Ababa\'s most sought-after neighborhood.',
    utilities: [
      { label: 'Constant Water', icon: 'water', available: true },
      { label: 'Private Meter', icon: 'flash', available: true },
      { label: 'Fiber Internet', icon: 'wifi', available: true },
    ],
    deposit: '3 Months',
    floor: '4th Floor',
    parking: true,
    owner: {
      name: 'Abebe Tadesse',
      role: 'Property Manager',
      verified: true,
      since: 'Member since 2021',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 4.8,
      reviews: 34,
    },
  },
  '2': {
    title: 'Modern Garden Villa',
    location: 'Old Airport, Addis Ababa',
    price: '45,000',
    badge: 'hot_deal',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 3,
    bathrooms: 2,
    sqm: 160,
    description:
      'A spacious and elegant villa situated in the prestigious Old Airport neighborhood. Features a private garden, ample parking, and a modern open-plan kitchen. This is a rare find — reduced in price for a limited time only. Perfect for families who value privacy, space, and premium living standards.',
    utilities: [
      { label: 'Tanker Water', icon: 'water', available: true },
      { label: 'Shared Meter', icon: 'flash', available: false },
      { label: 'Fiber Internet', icon: 'wifi', available: true },
    ],
    deposit: '2 Months',
    floor: 'Ground + 1',
    parking: true,
    owner: {
      name: 'Meron Girma',
      role: 'Landlord',
      verified: false,
      since: 'Member since 2023',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      rating: 4.5,
      reviews: 12,
    },
  },
  '3': {
    title: 'Kazanchis Studio',
    location: 'Kazanchis, Addis Ababa',
    price: '18,500',
    badge: 'verified',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
    ],
    bedrooms: 1,
    bathrooms: 1,
    sqm: 45,
    description:
      'A cozy, compact studio in the vibrant Kazanchis area — at the center of everything Addis has to offer. Walking distance to major offices, restaurants, and transport hubs. Fully self-contained with high-speed internet and constant city water. Perfect for a single professional or student.',
    utilities: [
      { label: 'Constant Water', icon: 'water', available: true },
      { label: 'Prepaid', icon: 'flash', available: true },
      { label: 'High Speed', icon: 'wifi', available: true },
    ],
    deposit: '1 Month',
    floor: '2nd Floor',
    parking: false,
    owner: {
      name: 'Yonas Bekele',
      role: 'Property Owner',
      verified: true,
      since: 'Member since 2020',
      avatar: 'https://images.unsplash.com/photo-1560250097-0dc605a9-9d41?q=80&w=200&auto=format&fit=crop',
      rating: 4.9,
      reviews: 57,
    },
  },
};

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const property = PROPERTIES[id ?? '1'] ?? PROPERTIES['1'];
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    await Share.share({ message: `Check out ${property.title} on Kira-Net — ${property.price} ETB/month in ${property.location}` });
  };

  return (
    <View style={styles.root}>
      {/* Image Carousel */}
      <View style={styles.imageWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImage(index);
          }}
        >
          {property.images.map((img: string, i: number) => (
            <Image key={i} source={img} style={styles.carouselImage} />
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
            <TouchableOpacity style={styles.overlayBtn} onPress={() => setSaved(s => !s)}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#DC2626' : '#1A1A1A'} />
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
      </View>

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

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="bed" size={20} color="#005C3A" />
            <Text style={styles.statValue}>{property.bedrooms}</Text>
            <Text style={styles.statLabel}>Bedrooms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <FontAwesome5 name="bath" size={18} color="#005C3A" />
            <Text style={styles.statValue}>{property.bathrooms}</Text>
            <Text style={styles.statLabel}>Bathrooms</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <MaterialIcons name="straighten" size={20} color="#005C3A" />
            <Text style={styles.statValue}>{property.sqm}</Text>
            <Text style={styles.statLabel}>Sq. Meters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="layers" size={20} color="#005C3A" />
            <Text style={styles.statValue} numberOfLines={1}>{property.floor}</Text>
            <Text style={styles.statLabel}>Floor</Text>
          </View>
        </View>

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
                <Ionicons name={u.icon} size={16} color={u.available ? '#005C3A' : '#9CA3AF'} />
                <Text style={[styles.utilityChipText, !u.available && styles.utilityChipTextOff]}>{u.label}</Text>
              </View>
            ))}
            <View style={[styles.utilityChip, !property.parking && styles.utilityChipOff]}>
              <MaterialIcons name="local-parking" size={16} color={property.parking ? '#005C3A' : '#9CA3AF'} />
              <Text style={[styles.utilityChipText, !property.parking && styles.utilityChipTextOff]}>Parking</Text>
            </View>
          </View>
        </View>

        {/* More Details */}
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
                <Ionicons name="star" size={12} color="#FBC02D" />
                <Text style={styles.ownerRating}>{property.owner.rating} ({property.owner.reviews} reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Similar Homes — AI Recommendations */}
        <View style={styles.section}>
          <View style={styles.aiLabelRow}>
            <MaterialIcons name="auto-awesome" size={16} color="#005C3A" />
            <Text style={styles.sectionLabel}>  AI Picks — Similar Homes</Text>
          </View>
          <Text style={styles.aiSub}>Based on price, location & amenities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
            {[
              { id: '2', title: 'Modern Garden Villa', location: 'Old Airport', price: '45,000', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop', badge: 'hot_deal' },
              { id: '3', title: 'Kazanchis Studio', location: 'Kazanchis', price: '18,500', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop', badge: 'verified' },
              { id: '1', title: 'The Summit Residency', location: 'Bole', price: '25,000', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop', badge: 'verified' },
            ].filter(s => s.id !== id).map(sim => (
              <TouchableOpacity
                key={sim.id}
                style={styles.simCard}
                activeOpacity={0.88}
                onPress={() => router.replace({ pathname: '/property-details', params: { id: sim.id } })}
              >
                <View style={styles.simImageWrap}>
                  <Image source={sim.image} style={styles.simImage} />
                  <View style={[
                    styles.simBadge,
                    sim.badge === 'hot_deal' ? styles.simBadgeHot : styles.simBadgeVerified
                  ]}>
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
            <Feather name="alert-triangle" size={15} color="#DC2626" />
            <Text style={styles.reportBtnText}>Report this listing</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push('/chat')}
        >
          <Feather name="message-circle" size={20} color="#005C3A" />
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn} onPress={() => Alert.alert('Call Owner', `Calling ${property.owner.name}...`)}>
          <Ionicons name="call" size={18} color="#FFF" />
          <Text style={styles.contactBtnText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  imageWrapper: { width, height: 320, position: 'relative' },
  carouselImage: { width, height: 320 },
  dotsRow: {
    position: 'absolute', bottom: 16,
    flexDirection: 'row', alignSelf: 'center',
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3,
  },
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
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  verifiedBadge: {
    position: 'absolute', bottom: 40, left: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
  },
  verifiedText: { fontSize: 9, fontWeight: '800', color: '#1A1A1A', marginLeft: 4 },
  hotDealBadge: {
    position: 'absolute', bottom: 40, left: 16,
    backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  hotDealText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  scrollContent: { paddingHorizontal: 20 },
  titleSection: { paddingTop: 24, marginBottom: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  propertyTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 10 },
  locationText: { fontSize: 13, color: '#4A5568', marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 26, fontWeight: '900', color: '#005C3A' },
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
  sectionLabel: {
    fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 14,
  },
  descriptionText: {
    fontSize: 14, color: '#4A5568', lineHeight: 22,
  },
  utilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  utilityChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 30, marginRight: 10, marginBottom: 10,
  },
  utilityChipOff: { backgroundColor: '#F3F4F6' },
  utilityChipText: { fontSize: 12, fontWeight: '700', color: '#005C3A', marginLeft: 6 },
  utilityChipTextOff: { color: '#9CA3AF' },
  termsRow: { flexDirection: 'row' },
  termBox: {
    flex: 1, backgroundColor: '#F7F8F9', borderRadius: 16,
    padding: 16, marginRight: 10,
  },
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
  ownerRole: { fontSize: 12, fontWeight: '600', color: '#005C3A', marginBottom: 2 },
  ownerSince: { fontSize: 11, color: '#6B7280', marginBottom: 6 },
  ownerRatingRow: { flexDirection: 'row', alignItems: 'center' },
  ownerRating: { fontSize: 11, color: '#4A5568', marginLeft: 4, fontWeight: '600' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    paddingBottom: 28,
  },
  chatBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: '#005C3A',
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20,
    marginRight: 12,
  },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: '#005C3A', marginLeft: 6 },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#005C3A', borderRadius: 16, paddingVertical: 14,
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  contactBtnText: { fontSize: 14, fontWeight: '800', color: '#FFF', marginLeft: 8 },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  reportBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 8,
  },
  // AI Similar Homes
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  aiSub: { fontSize: 12, color: '#6B7280', marginBottom: 14 },
  similarRow: { paddingBottom: 4 },
  simCard: {
    width: 160, backgroundColor: '#FFF', borderRadius: 16, marginRight: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  simImageWrap: { width: '100%', height: 100, position: 'relative' },
  simImage: { width: '100%', height: '100%' },
  simBadge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  simBadgeVerified: { backgroundColor: '#FFF' },
  simBadgeHot: { backgroundColor: '#DC2626' },
  simBadgeHotText: { fontSize: 8, fontWeight: '800', color: '#FFF' },
  simInfo: { padding: 10 },
  simTitle: { fontSize: 12, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  simLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  simLocation: { fontSize: 10, color: '#4A5568', marginLeft: 2 },
  simPrice: { fontSize: 12, fontWeight: '900', color: '#005C3A' },
  simPriceUnit: { fontSize: 9, fontWeight: '500', color: '#6B7280' },
});
