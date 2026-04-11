import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { KiraColors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

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

export default function LandlordDashboardScreen({ hideBack = false }: { hideBack?: boolean }) {
  const { role } = useUser();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

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

  const filtered = MY_PROPERTIES;

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
          onPress={() => router.push('/list-property')}
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

        {/* Professional Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <View>
              <Text style={styles.earningsSub}>PROJECTED INCOME · APRIL</Text>
              <View style={styles.earningsAmountRow}>
                <Text style={styles.earningsAmount}>{EARNINGS.projectedIncome}</Text>
                <Text style={styles.earningsCurrency}> ETB</Text>
              </View>
              <View style={styles.trendRow}>
                <Feather name="trending-up" size={14} color="#9CC942" />
                <Text style={styles.trendText}>{EARNINGS.changePercent} growth vs last month</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.historyBtn}>
              <Feather name="bar-chart-2" size={20} color="#9CC942" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {[
              { val: EARNINGS.properties, lab: 'PROPERTIES', icon: 'home',  color: '#0EA5E9', bg: '#EFF6FF' },
              { val: `${EARNINGS.occupancy}%`, lab: 'OCCUPANCY', icon: 'users', color: '#16A34A', bg: '#F0FDF4' },
              { val: EARNINGS.leads,      lab: 'LEADS',     icon: 'user-plus', color: '#F59E0B', bg: '#FFFBEB' },
              { val: EARNINGS.views,      lab: 'VIEWS',     icon: 'eye',       color: '#8B5CF6', bg: '#F5F3FF' },
            ].map((stat, i) => (
              <View key={i} style={[styles.statBox, { backgroundColor: stat.bg }]}>
                <View style={styles.statIconWrap}>
                   <Feather name={stat.icon as any} size={12} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.val}</Text>
                <Text style={styles.statLabel}>{stat.lab}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.portfolioFoot}>
            <Text style={styles.portfolioText}>TOTAL PORTFOLIO VALUATION</Text>
            <Text style={styles.portfolioVal}>{EARNINGS.portfolioValue} ETB</Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My active listings</Text>
            <Text style={styles.sectionSub}>{MY_PROPERTIES.length} Listings total</Text>
        </View>

        {/* Property Cards */}
        {filtered.map(property => (
          <TouchableOpacity key={property.id} style={styles.propertyCard} activeOpacity={0.95}>
            
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
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/boost-listing')}>
                  <Feather name="zap" size={14} color="#FFF" />
                  <Text style={styles.actionBtnText}>Boost Visibility</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnAlt} onPress={() => router.push({ pathname: '/property-details', params: { id: property.id } })}>
                   <Feather name="edit-3" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}


        {/* Add New CTA Overlay */}
        <TouchableOpacity 
          style={styles.addPropertyCard} 
          onPress={() => router.push('/list-property')}
          accessibilityLabel={t('landlord.postNew')}
          accessibilityRole="button"
        >
          <View style={styles.addPropertyIcon}>
            <Feather name="plus" size={24} color="#9CC942" />
          </View>
          <Text style={styles.addPropertyText}>{t('landlord.postNew')}</Text>
          <Feather name="chevron-right" size={18} color="#9CC942" />
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  addBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { padding: 20 },

  // Professional Earnings Card
  earningsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  earningsSub: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 8 },
  earningsAmountRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  earningsAmount: { fontSize: 36, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
  earningsCurrency: { fontSize: 15, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  historyBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, minWidth: '45%', padding: 12, borderRadius: 16, alignItems: 'center' },
  statIconWrap: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  portfolioFoot: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  portfolioText: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  portfolioVal: { fontSize: 12, fontWeight: '900', color: '#1A1A1A' },

  // Section Headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  sectionSub: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },

  // Property Cards
  propertyCard: {
    backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  cardImageWrap: { width: '100%', height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  statusBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  statusText: { fontSize: 9, fontWeight: '800' },
  expiryBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  expiryText: { fontSize: 9, fontWeight: '800', color: '#FFF' },

  cardBody: { padding: 18 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocation: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardPrice: { fontSize: 18, fontWeight: '900', color: '#9CC942' },
  cardPriceMonth: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginLeft: 2 },

  statsRowMini: { flexDirection: 'row', gap: 16, marginBottom: 18, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 12 },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { fontSize: 11, fontWeight: '700', color: '#64748B' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1A1A1A', paddingVertical: 14, borderRadius: 14 },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  actionBtnAlt: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },

  // Add Property CTA
  addPropertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7FEE7', borderRadius: 24, padding: 24,
    borderWidth: 1.5, borderColor: '#BEF264', borderStyle: 'dashed',
    marginTop: 8,
  },
  addPropertyIcon: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
  },
  addPropertyText: { flex: 1, fontSize: 15, fontWeight: '900', color: '#4D7C0F' },

  // Restricted
  restrictedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#FFF' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  restrictedTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', marginBottom: 12 },
  restrictedSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  upgradeBtn: { backgroundColor: KiraColors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  upgradeBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
