import React, { useState } from 'react';
import { StyleSheet, Platform, Dimensions, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROPERTIES = [
  { id: '1', category: 'apartments', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop', badge: 'verified', title: 'The Summit Residency', location: 'Bole, Addis Ababa', price: '25,000', utils: ['Included', 'Prepaid', 'Fiber Optic'] },
  { id: '2', category: 'villas', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop', badge: 'hot_deal', title: 'Modern Garden Villa', location: 'Old Airport, Addis Ababa', price: '45,000', utils: ['Included', 'Included', 'Available'] },
  { id: '3', category: 'studios', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop', badge: 'verified', title: 'Kazanchis Studio', location: 'Kazanchis, Addis Ababa', price: '18,500', utils: ['Tanker', 'Prepaid', 'High Speed'] },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? PROPERTIES
    : PROPERTIES.filter(p => p.category === activeCategory);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => router.push('/menu')}>
          <Feather name="menu" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Kira-Net</Text>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => router.push('/(tabs)/alerts')}
          style={styles.bellWrap}
        >
          <Feather name="bell" size={24} color="#005C3A" />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.headline}>Find your</Text>
          <Text style={styles.headline}>sanctuary</Text>
          <Text style={styles.headlineGreen}>in Addis.</Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={18} color="#6B7280" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search by location or price"
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/modal')}>
            <Feather name="sliders" size={16} color="#1A1A1A" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {[{key:'all',label:'All Homes'},{key:'studios',label:'Studio'},{key:'apartments',label:'1 Bedroom'},{key:'villas',label:'2 Bedrooms'}].map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryPill, activeCategory === cat.key && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat.key)}
            >
              <Text style={activeCategory === cat.key ? styles.categoryPillTextActive : styles.categoryPillText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Property Listings */}
        <View style={styles.listingsContainer}>
          {filtered.map(p => (
            <TouchableOpacity key={p.id} activeOpacity={0.95} onPress={() => router.push({ pathname: '/property-details', params: { id: p.id } })}>
              <PropertyCard image={p.image} badge={p.badge} title={p.title} location={p.location} price={p.price} utils={p.utils} />
            </TouchableOpacity>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="home" size={40} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No listings in this category yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/list-property')}>
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function PropertyCard({ image, badge, title, location, price, utils }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.cardImage} />
        
        {/* Badges */}
        {badge === 'verified' && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color="#3B82F6" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        )}
        {badge === 'hot_deal' && (
          <View style={styles.hotDealBadge}>
            <Text style={styles.hotDealText}>HOT DEAL</Text>
          </View>
        )}
        
        {/* Heart */}
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.cardTitle}>{title}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color="#000" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>{price} <Text style={styles.cardPriceUnit}>ETB</Text></Text>
            <Text style={styles.cardPriceDesc}>PER MONTH</Text>
          </View>
        </View>

        <View style={styles.utilsRow}>
          <View style={styles.utilItem}>
            <Ionicons name="water" size={12} color="#1A1A1A" />
            <Text style={styles.utilText}>{utils[0]}</Text>
          </View>
          <View style={styles.utilItem}>
            <Ionicons name="flash" size={12} color="#1A1A1A" />
            <Text style={styles.utilText}>{utils[1]}</Text>
          </View>
          <View style={styles.utilItem}>
            <Ionicons name="wifi" size={12} color="#1A1A1A" />
            <Text style={styles.utilText}>{utils[2]}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#005C3A',
    letterSpacing: -0.5,
  },
  bellWrap: { position: 'relative' },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#DC2626',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F7F8F9',
  },
  notifBadgeText: { fontSize: 9, fontWeight: '900', color: '#FFF' },
  scrollContent: {
    paddingBottom: 100, // Extra space for FAB and modern footer
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headline: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1A1A1A',
    lineHeight: 46,
    letterSpacing: -1.5,
  },
  headlineGreen: {
    fontSize: 42,
    fontWeight: '900',
    color: '#005C3A',
    lineHeight: 46,
    letterSpacing: -1.5,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    padding: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  categoriesRow: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  categoryPillActive: {
    backgroundColor: '#005C3A',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  categoryPillTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  listingsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 32,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A1A1A',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  hotDealBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hotDealText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  heartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleLeft: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#4A5568',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#005C3A',
  },
  cardPriceUnit: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardPriceDesc: {
    fontSize: 8,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  utilsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  utilItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  utilText: {
    fontSize: 10,
    color: '#1A1A1A',
    fontWeight: '500',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
    fontWeight: '500',
  },
});
