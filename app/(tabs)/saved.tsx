import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useVisitPlan } from '@/context/VisitPlanContext';
import { useSaved } from '@/context/SavedContext';
import { KiraColors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/context/UserContext';
import LandlordDashboardScreen from '../landlord-dashboard';

export default function SavedScreen() {
  const { role } = useUser();
  const { visits } = useVisitPlan();
  const { saved, unsaveProperty, saveProperty } = useSaved();

  if (role === 'landlord') {
    return <LandlordDashboardScreen hideBack />;
  }
  const [showToast, setShowToast] = useState(false);
  const [lastUnsaved, setLastUnsaved] = useState<any>(null);
  const toastTimer = useRef<any>(null);

  const handleUnsave = (item: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLastUnsaved(item);
    unsaveProperty(item.id);
    
    // Show toast
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleUndo = () => {
    if (lastUnsaved) {
      saveProperty(lastUnsaved);
      setShowToast(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

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
            {saved.length === 0
              ? 'Properties you heart will appear here.'
              : `You have ${saved.length} saved rental${saved.length === 1 ? '' : 's'} in Addis Ababa.`
            }
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
            <Feather name="chevron-right" size={18} color={KiraColors.primary} />
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
          <Feather name="chevron-right" size={18} color={KiraColors.primary} />
        </TouchableOpacity>

        {/* ── Live Saved Properties ─────────────────────────────────── */}
        {saved.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIllustration}>
              <View style={styles.illustrationCircle}>
                <Ionicons name="heart" size={40} color={KiraColors.primary} />
                <View style={styles.miniHeart}>
                   <Ionicons name="sparkles" size={14} color="#FFF" />
                </View>
              </View>
              <View style={[styles.floatingIcon, { top: 0, left: -20 }]}>
                <Ionicons name="home" size={20} color="#E2E8F0" />
              </View>
              <View style={[styles.floatingIcon, { bottom: 10, right: -15 }]}>
                <Ionicons name="search" size={18} color="#E2E8F0" />
              </View>
            </View>
            <Text style={styles.emptyStateTitle}>Your hearts are lonely</Text>
            <Text style={styles.emptyStateSubtitle}>
              Properties you like will show up here. Start exploring the best homes in Addis!
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreBtnText}>Go Finding Gems</Text>
              <Feather name="compass" size={16} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        ) : (
          saved.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              onPress={() => router.push({ pathname: '/property-details', params: { id: item.id } })}
            >
              <SavedCard
                image={item.image}
                price={item.price}
                title={item.title}
                location={item.location}
                isVerified={item.badge === 'verified'}
                onUnsave={() => handleUnsave(item)}
              />
            </TouchableOpacity>
          ))
        )}

        {/* Promote Card — only show when list has items */}
        {saved.length > 0 && (
          <View style={styles.promoteCard}>
            <View style={styles.starIconWrap}>
              <Ionicons name="star" size={16} color="#FFF" />
            </View>
            <Text style={styles.promoteTitle}>Find more gems</Text>
            <Text style={styles.promoteSubtitle}>
              Based on your favorites, explore more listings that match your style.
            </Text>
            <TouchableOpacity style={styles.promoteBtn} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.promoteBtnText}>See Recommendations</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Undo Toast */}
      {showToast && (
        <Animated.View 
          entering={SlideInDown.springify()} 
          exiting={SlideOutDown}
          style={styles.toastContainer}
        >
          <View style={styles.toastInner}>
            <View style={styles.toastLeft}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={styles.toastText}>Removed from favorites</Text>
            </View>
            <TouchableOpacity onPress={handleUndo} style={styles.undoBtn}>
              <Text style={styles.undoText}>UNDO</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

function SavedCard({ image, price, title, location, isVerified, onUnsave }: {
  image: string;
  price: string;
  title: string;
  location: string;
  isVerified: boolean;
  onUnsave: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartBtn} onPress={onUnsave}>
          <Ionicons name="heart" size={18} color={KiraColors.danger} style={{ marginTop: 2 }} />
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
    color: KiraColors.primary,
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
    color: KiraColors.primary,
    marginBottom: 4,
  },
  cardPriceUnit: {
    fontSize: 12,
    color: KiraColors.primary,
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
  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DCFCE7',
  },
  miniHeart: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: KiraColors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  floatingIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  promoteCard: {
    backgroundColor: KiraColors.primary,
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
    backgroundColor: KiraColors.accent,
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
    shadowColor: KiraColors.primary,
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
    backgroundColor: KiraColors.primary,
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
    backgroundColor: KiraColors.primary,
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
    borderColor: KiraColors.primary,
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
    backgroundColor: KiraColors.primary,
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
  // Toast Styles
  toastContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  toastInner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  toastLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  undoBtn: {
    backgroundColor: 'rgba(156, 201, 66, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  undoText: {
    color: '#9CC942',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
