import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVisitPlan } from '@/context/VisitPlanContext';

export default function SavedScreen() {
  const { visits } = useVisitPlan();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Saved</Text>
        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="more-vertical" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Your Favorites</Text>
          <Text style={styles.pageSubtitle}>
            Keep track of the properties you love. You have 4 saved rentals in Addis Ababa.
          </Text>
        </View>

        {/* Visit Planner Banner */}
        <TouchableOpacity
          style={styles.plannerBanner}
          activeOpacity={0.88}
          onPress={() => router.push('/visit-planner')}
        >
          <View style={styles.plannerLeft}>
            <View style={styles.plannerIconWrap}>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#FFF" />
            </View>
            <View>
              <Text style={styles.plannerTitle}>Visit Planner</Text>
              <Text style={styles.plannerSub}>
                {visits.length === 0
                  ? 'Plan your property visits for the day'
                  : `${visits.length} propert${visits.length === 1 ? 'y' : 'ies'} in your plan`
                }
              </Text>
            </View>
          </View>
          <View style={styles.plannerRight}>
            {visits.length > 0 && (
              <View style={styles.plannerBadge}>
                <Text style={styles.plannerBadgeText}>{visits.length}</Text>
              </View>
            )}
            <Feather name="chevron-right" size={18} color="#005C3A" />
          </View>
        </TouchableOpacity>

        {/* Offline Map Banner */}
        <TouchableOpacity
          style={styles.offlineMapEntrance}
          activeOpacity={0.88}
          onPress={() => router.push('/offline-maps')}
        >
          <View style={styles.offlineLeft}>
            <View style={styles.offlineIconBox}>
              <Ionicons name="map" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.offlineTitle}>Offline Map Pins</Text>
              <Text style={styles.offlineSub}>View saved house locations without data</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#005C3A" />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.92} onPress={() => router.push({ pathname: '/property-details', params: { id: '1' } })}>
          <SavedCard 
            image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop"
            price="45,000"
            title="Luxury Bole Loft"
            location="Bole, Addis Ababa"
            isVerified={true}
          />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.92} onPress={() => router.push({ pathname: '/property-details', params: { id: '3' } })}>
          <SavedCard 
            image="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=600&auto=format&fit=crop"
            price="28,500"
            title="Skyline View Studio"
            location="Kazanchis, Addis Ababa"
            isVerified={true}
          />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.92} onPress={() => router.push({ pathname: '/property-details', params: { id: '2' } })}>
          <SavedCard 
            image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop"
            price="60,000"
            title="Garden Oasis Villa"
            location="Old Airport, Addis Ababa"
            isVerified={true}
          />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.92} onPress={() => router.push({ pathname: '/property-details', params: { id: '3' } })}>
          <SavedCard 
            image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop"
            price="32,000"
            title="Modern CMC Apartment"
            location="CMC, Addis Ababa"
            isVerified={true}
          />
        </TouchableOpacity>

        {/* Promote Card */}
        <View style={styles.promoteCard}>
           <View style={styles.starIconWrap}>
             <Ionicons name="star" size={16} color="#FFF" />
           </View>
           <Text style={styles.promoteTitle}>Find more gems</Text>
           <Text style={styles.promoteSubtitle}>
             Based on your favorites, we found 12 new listings in Bole that match your style.
           </Text>
           <TouchableOpacity style={styles.promoteBtn}>
             <Text style={styles.promoteBtnText}>See Recommendations</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedCard({ image, price, title, location, isVerified }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart" size={18} color="#DC2626" style={{ marginTop: 2 }} />
        </TouchableOpacity>
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={12} color="#FFF" />
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardPrice}>{price} ETB<Text style={styles.cardPriceUnit}>/mo</Text></Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={12} color="#4A5568" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C3A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  cardInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#005C3A',
    marginBottom: 4,
  },
  cardPriceUnit: {
    fontSize: 12,
    color: '#005C3A',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
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
  promoteCard: {
    backgroundColor: '#005C3A',
    borderRadius: 20,
    padding: 24,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  starIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5C048',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  promoteTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  promoteSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 20,
  },
  promoteBtn: {
    backgroundColor: '#FBC02D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  promoteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  // Visit Planner Banner
  plannerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    shadowColor: '#005C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  plannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  plannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  plannerSub: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '500',
  },
  plannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plannerBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plannerBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
  },
  // Offline Map Entrance
  offlineMapEntrance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#005C3A',
  },
  offlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offlineIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  offlineSub: {
    fontSize: 11,
    color: '#4A5568',
    fontWeight: '500',
  },
});
