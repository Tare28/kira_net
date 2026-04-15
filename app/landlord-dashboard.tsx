import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { KiraColors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

const MY_PROPERTIES = [
  {
    id: '1',
    title: 'The Summit Residency',
    location: 'Bole, Addis Ababa',
    price: '25,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop',
    status: 'Boosted',
    statusColor: '#9CC942',
    statusBg: '#E8F5E9',
    views: 248,
    inquiries: 12,
    daysLeft: 8,
  },
  {
    id: '2',
    title: 'Modern Garden Villa',
    location: 'Old Airport, Addis Ababa',
    price: '45,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
    status: 'Active',
    statusColor: '#16A34A',
    statusBg: '#DCFCE7',
    views: 94,
    inquiries: 4,
    daysLeft: null,
  },
  {
    id: '3',
    title: 'Kazanchis Studio Flat',
    location: 'Kazanchis, Addis Ababa',
    price: '18,500',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop',
    status: 'Pending',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    views: 15,
    inquiries: 0,
    daysLeft: null,
    isVerified: false,
  },
];

const EARNINGS = {
  projectedIncome: '88,500',
  portfolioValue: '14.2M',
  changePercent: '+12.4%',
  properties: 3,
  occupancy: 67,
  leads: 12,
  views: '1.2K',
};

const FILTERS = ['All', 'Active', 'Boosted', 'Pending'];

export default function LandlordDashboardScreen({ hideBack = false }: { hideBack?: boolean }) {
  const { role } = useUser();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [activeFilter, setActiveFilter] = useState('All');
  const [userName, setUserName] = useState('Landlord');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('@user_name_landlord');
      if (name) setUserName(name.split(' ')[0]);
    } catch (e) {}
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const dateStr = new Date().toLocaleDateString('en-ET', { weekday: 'long', day: 'numeric', month: 'long' });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Filter logic
  const filtered = activeFilter === 'All'
    ? MY_PROPERTIES
    : MY_PROPERTIES.filter(p => p.status === activeFilter);

  // ─── Tenant Restriction Gate ─────────────────────────────────────────────────
  if (role === 'tenant') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.restrictedContainer}>
          <View style={styles.iconCircle}>
             <MaterialIcons name="business" size={48} color={KiraColors.primary} />
          </View>
          <Text style={styles.restrictedTitle}>{t('landlord.exclusiveAccess')}</Text>
          <Text style={styles.restrictedSubtitle}>
            {t('landlord.exclusiveSubtitle')}
          </Text>
          <TouchableOpacity 
            style={styles.upgradeBtn} 
            onPress={() => router.replace('/(tabs)/profile')}
            accessibilityLabel={t('landlord.goToProfile')}
            accessibilityRole="button"
          >
            <Text style={styles.upgradeBtnText}>{t('landlord.goToProfile')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── KPI Data ───────────────────────────────────────────────────────────────
  const KPI_DATA = [
    { label: 'Monthly Income', value: EARNINGS.projectedIncome, unit: 'ETB', icon: 'dollar-sign' as const, color: '#9CC942', bg: '#F4F9EB', trend: EARNINGS.changePercent },
    { label: 'Properties', value: EARNINGS.properties.toString(), unit: 'listed', icon: 'home' as const, color: '#0EA5E9', bg: '#F0F9FF', trend: `${MY_PROPERTIES.filter(p => p.status !== 'Pending').length} active` },
    { label: 'Occupancy', value: `${EARNINGS.occupancy}`, unit: '%', icon: 'users' as const, color: '#8B5CF6', bg: '#F5F3FF', trend: 'Stable' },
    { label: 'Total Leads', value: EARNINGS.leads.toString(), unit: 'this mo.', icon: 'user-plus' as const, color: '#F59E0B', bg: '#FFFBEB', trend: `${EARNINGS.views} views` },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {!hideBack ? (
          <TouchableOpacity 
            onPress={() => router.back()} 
            hitSlop={{top:10,bottom:10,left:10,right:10}}
            accessibilityLabel={t('landlord.accessibility.back')}
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}
        <Text style={styles.headerTitle}>{t('landlord.dashboardTitle')}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/list-property');
          }}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          accessibilityLabel={t('landlord.accessibility.add')}
          accessibilityRole="button"
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={KiraColors.primary}
            colors={[KiraColors.primary]}
          />
        }
      >

        {/* ── Dynamic Greeting ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.greetingSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingDate}>{dateStr.toUpperCase()}</Text>
            <Text style={styles.greetingTitle}>Good {greeting}, {userName} 👋</Text>
            <Text style={styles.greetingSub}>Here's your property overview</Text>
          </View>
          <TouchableOpacity 
            style={styles.greetingAvatar} 
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.greetingAvatarText}>{userName[0]}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Horizontal KPI Cards ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kpiScroll}
          >
            {KPI_DATA.map((kpi, i) => (
              <View key={i} style={styles.kpiCard}>
                <View style={[styles.kpiIconBox, { backgroundColor: kpi.bg }]}>
                  <Feather name={kpi.icon} size={16} color={kpi.color} />
                </View>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={[styles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
                  <Text style={styles.kpiUnit}> {kpi.unit}</Text>
                </View>
                <View style={[styles.kpiTrendPill, { backgroundColor: kpi.bg }]}>
                  <Text style={[styles.kpiTrendText, { color: kpi.color }]}>{kpi.trend}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Portfolio Value Strip ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.portfolioStrip}>
          <Feather name="briefcase" size={14} color="#94A3B8" />
          <Text style={styles.portfolioLabel}>TOTAL PORTFOLIO VALUATION</Text>
          <Text style={styles.portfolioValue}>{EARNINGS.portfolioValue} ETB</Text>
        </Animated.View>

        {/* ── Section Header + View Toggle ──────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(250).springify()} style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>My Listings</Text>
            <Text style={styles.sectionSub}>
              {filtered.length} {filtered.length === 1 ? 'Listing' : 'Listings'} total
            </Text>
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.viewToggleBtn, viewMode === 'card' && styles.viewToggleBtnActive]} 
              onPress={() => { setViewMode('card'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Feather name="grid" size={14} color={viewMode === 'card' ? '#FFF' : '#94A3B8'} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]} 
              onPress={() => { setViewMode('list'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Feather name="list" size={14} color={viewMode === 'list' ? '#FFF' : '#94A3B8'} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Filter Tabs ───────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTERS.map(f => {
              const count = f === 'All' ? MY_PROPERTIES.length : MY_PROPERTIES.filter(p => p.status === f).length;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
                  onPress={() => {
                    setActiveFilter(f);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}>
                    {f}
                  </Text>
                  <View style={[styles.filterCount, activeFilter === f && styles.filterCountActive]}>
                    <Text style={[styles.filterCountText, activeFilter === f && styles.filterCountTextActive]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* ── Property Cards / Compact List ──────────────────────────────────── */}
        {filtered.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Feather name="inbox" size={32} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No {activeFilter.toLowerCase()} listings</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'All' 
                ? 'Post your first property to start earning.' 
                : `You have no ${activeFilter.toLowerCase()} properties right now.`}
            </Text>
            {activeFilter !== 'All' && (
              <TouchableOpacity 
                style={styles.emptyResetBtn}
                onPress={() => setActiveFilter('All')}
              >
                <Text style={styles.emptyResetText}>Show All Listings</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : viewMode === 'card' ? (
          // ─── Card View ────────────────────────────────────────────────
          filtered.map((property, index) => (
            <Animated.View key={property.id} entering={FadeInDown.delay(400 + index * 100).springify()}>
              <TouchableOpacity 
                style={styles.propertyCard} 
                activeOpacity={0.95}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: '/property-details', params: { id: property.id } });
                }}
              >
                {/* Property Image & Status */}
                <View style={styles.cardImageWrap}>
                  <Image source={property.image} style={styles.cardImage} contentFit="cover" />
                  <View style={[styles.statusBadge, { backgroundColor: property.statusBg }]}>
                    {property.status === 'Boosted' && <Feather name="zap" size={10} color={property.statusColor} style={{ marginRight: 4 }} />}
                    <Text style={[styles.statusText, { color: property.statusColor }]}>{property.status}</Text>
                  </View>
                  {property.daysLeft && (
                    <View style={styles.expiryBadge}>
                      <Text style={styles.expiryText}>{property.daysLeft}d left</Text>
                    </View>
                  )}
                </View>

                {/* Property Content */}
                <View style={styles.cardBody}>
                  <View style={styles.cardHead}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{property.title}</Text>
                      <View style={styles.locationRow}>
                        <Feather name="map-pin" size={10} color="#94A3B8" />
                        <Text style={styles.cardLocation}>{property.location}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardPrice}>{property.price} <Text style={styles.cardPriceMonth}>ETB</Text></Text>
                  </View>

                  <View style={styles.statsRowMini}>
                    <View style={styles.miniStat}>
                      <Feather name="eye" size={10} color="#94A3B8" />
                      <Text style={styles.miniStatText}>{property.views} Views</Text>
                    </View>
                    <View style={styles.miniStat}>
                      <Feather name="message-circle" size={10} color="#94A3B8" />
                      <Text style={styles.miniStatText}>{property.inquiries} Inquiries</Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity 
                      style={styles.actionBtn} 
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/boost-listing');
                      }}
                    >
                      <Feather name="zap" size={14} color="#FFF" />
                      <Text style={styles.actionBtnText}>Boost Visibility</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionBtnAlt} 
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push({ pathname: '/property-details', params: { id: property.id } });
                      }}
                    >
                       <Feather name="edit-3" size={14} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          // ─── Compact List View ────────────────────────────────────────
          filtered.map((property, index) => (
            <Animated.View key={property.id} entering={FadeInRight.delay(400 + index * 80).springify()}>
              <TouchableOpacity 
                style={styles.listRow}
                activeOpacity={0.92}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({ pathname: '/property-details', params: { id: property.id } });
                }}
              >
                <Image source={property.image} style={styles.listThumb} contentFit="cover" />
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle} numberOfLines={1}>{property.title}</Text>
                  <View style={styles.listMeta}>
                    <Feather name="map-pin" size={10} color="#94A3B8" />
                    <Text style={styles.listLocation}>{property.location.split(',')[0]}</Text>
                    <Text style={styles.listDot}>·</Text>
                    <Text style={styles.listPrice}>{property.price} ETB</Text>
                  </View>
                  <View style={styles.listStats}>
                    <Feather name="eye" size={10} color="#94A3B8" />
                    <Text style={styles.listStatText}>{property.views}</Text>
                    <Feather name="user-plus" size={10} color="#94A3B8" style={{ marginLeft: 8 }} />
                    <Text style={styles.listStatText}>{property.inquiries}</Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <View style={[styles.listStatusPill, { backgroundColor: property.statusColor + '20' }]}>
                    <Text style={[styles.listStatusText, { color: property.statusColor }]}>{property.status}</Text>
                  </View>
                  {property.daysLeft && (
                    <Text style={styles.listExpiry}>{property.daysLeft}d left</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}

        {/* ── Add New Property CTA ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <TouchableOpacity 
            style={styles.addPropertyCard} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/list-property');
            }}
            accessibilityLabel={t('landlord.postNew')}
            accessibilityRole="button"
          >
            <View style={styles.addPropertyIcon}>
              <Feather name="plus" size={24} color="#9CC942" />
            </View>
            <Text style={styles.addPropertyText}>{t('landlord.postNew')}</Text>
            <Feather name="chevron-right" size={18} color="#9CC942" />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F9' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  addBtn: {
    width: 36, height: 36, borderRadius: 14,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { padding: 20 },

  // ── Dynamic Greeting ───────────────────────────────────────────────────
  greetingSection: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24,
  },
  greetingDate: {
    fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 4,
    letterSpacing: 0.5,
  },
  greetingTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  greetingSub: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 3 },
  greetingAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center',
  },
  greetingAvatarText: { fontSize: 14, fontWeight: '900', color: '#9CC942' },

  // ── Horizontal KPI Cards ───────────────────────────────────────────────
  kpiScroll: { gap: 12, paddingRight: 20, marginBottom: 16 },
  kpiCard: {
    width: 150, backgroundColor: '#FFF', borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
  },
  kpiIconBox: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 4,
    textTransform: 'uppercase', letterSpacing: 0.3,
  },
  kpiValueRow: { flexDirection: 'row', alignItems: 'flex-end' },
  kpiValue: { fontSize: 22, fontWeight: '900' },
  kpiUnit: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginBottom: 2, marginLeft: 2 },
  kpiTrendPill: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, marginTop: 10,
  },
  kpiTrendText: { fontSize: 10, fontWeight: '800' },

  // ── Portfolio Strip ────────────────────────────────────────────────────
  portfolioStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16,
    marginBottom: 28, borderWidth: 1, borderColor: '#F1F5F9',
  },
  portfolioLabel: { flex: 1, fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  portfolioValue: { fontSize: 13, fontWeight: '900', color: '#1A1A1A' },

  // ── Section Header + View Toggle ───────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  sectionSub: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 2 },
  viewToggle: {
    flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12,
    padding: 3,
  },
  viewToggleBtn: {
    width: 34, height: 30, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  viewToggleBtnActive: { backgroundColor: '#1A1A1A' },

  // ── Filter Pills ───────────────────────────────────────────────────────
  filterScroll: { gap: 8, marginBottom: 20, paddingRight: 20 },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24, borderWidth: 1.5, borderColor: '#F1F5F9',
  },
  filterPillActive: {
    backgroundColor: '#1A1A1A', borderColor: '#1A1A1A',
  },
  filterPillText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterPillTextActive: { color: '#FFF' },
  filterCount: {
    backgroundColor: '#F1F5F9', width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  filterCountActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterCountText: { fontSize: 10, fontWeight: '900', color: '#94A3B8' },
  filterCountTextActive: { color: '#FFF' },

  // ── Empty State ────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 60, paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 8, textAlign: 'center' },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  emptyResetBtn: {
    backgroundColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  emptyResetText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },

  // ── Card View — Property Cards ─────────────────────────────────────────
  propertyCard: {
    backgroundColor: '#FFF', borderRadius: 32, marginBottom: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04, shadowRadius: 16, elevation: 3,
  },
  cardImageWrap: { width: '100%', height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  statusBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  statusText: { fontSize: 10, fontWeight: '800' },
  expiryBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  expiryText: { fontSize: 10, fontWeight: '800', color: '#FFF' },

  cardBody: { padding: 18 },
  cardHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocation: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardPrice: { fontSize: 18, fontWeight: '900', color: '#9CC942' },
  cardPriceMonth: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginLeft: 2 },

  statsRowMini: {
    flexDirection: 'row', gap: 16, marginBottom: 18,
    backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16,
  },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1A1A1A', paddingVertical: 14, borderRadius: 16,
  },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  actionBtnAlt: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#F1F5F9',
  },

  // ── Compact List View ──────────────────────────────────────────────────
  listRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 20, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  listThumb: { width: 60, height: 60, borderRadius: 16, marginRight: 14 },
  listInfo: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  listLocation: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  listDot: { fontSize: 11, color: '#CBD5E1' },
  listPrice: { fontSize: 11, fontWeight: '800', color: '#9CC942' },
  listStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listStatText: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginRight: 4 },
  listRight: { alignItems: 'flex-end', marginLeft: 8 },
  listStatusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  listStatusText: { fontSize: 10, fontWeight: '900' },
  listExpiry: { fontSize: 9, fontWeight: '700', color: '#94A3B8', marginTop: 4 },

  // ── Add Property CTA ───────────────────────────────────────────────────
  addPropertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7FEE7', borderRadius: 32, padding: 24,
    borderWidth: 1.5, borderColor: '#BEF264', borderStyle: 'dashed',
    marginTop: 8,
  },
  addPropertyIcon: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
  },
  addPropertyText: { flex: 1, fontSize: 15, fontWeight: '900', color: '#4D7C0F' },

  // ── Restricted (tenant gate) ───────────────────────────────────────────
  restrictedContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#FFF',
  },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  restrictedTitle: {
    fontSize: 22, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', marginBottom: 12,
  },
  restrictedSubtitle: {
    fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32,
  },
  upgradeBtn: {
    backgroundColor: KiraColors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  upgradeBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
