import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const MY_PROPERTIES = [
  {
    id: '1',
    title: 'The Summit Residency',
    location: 'Bole, Addis Ababa',
    price: '25,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop',
    status: 'Boosted',
    statusColor: '#005C3A',
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
  },
];

export default function LandlordDashboardScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'boosted'>('all');

  const filtered = MY_PROPERTIES.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return p.status === 'Active';
    if (activeTab === 'boosted') return p.status === 'Boosted';
    return true;
  });

  const totalViews = MY_PROPERTIES.reduce((a, b) => a + b.views, 0);
  const totalInquiries = MY_PROPERTIES.reduce((a, b) => a + b.inquiries, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
          <Feather name="arrow-left" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dashboard</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/list-property')}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Feather name="eye" size={18} color="#005C3A" />
            <Text style={styles.statValue}>{totalViews}</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="message-circle" size={18} color="#005C3A" />
            <Text style={styles.statValue}>{totalInquiries}</Text>
            <Text style={styles.statLabel}>Inquiries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Feather name="home" size={18} color="#005C3A" />
            <Text style={styles.statValue}>{MY_PROPERTIES.length}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {(['all', 'active', 'boosted'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Property Cards */}
        <Text style={styles.sectionLabel}>Your Properties</Text>
        {filtered.map(property => (
          <View key={property.id} style={styles.propertyCard}>
            
            {/* Property Image */}
            <View style={styles.cardImageWrap}>
              <Image source={property.image} style={styles.cardImage} />
              <View style={[styles.statusBadge, { backgroundColor: property.statusBg }]}>
                {property.status === 'Boosted' && <Feather name="zap" size={11} color={property.statusColor} style={{ marginRight: 3 }} />}
                {property.status === 'Pending' && <Feather name="clock" size={11} color={property.statusColor} style={{ marginRight: 3 }} />}
                {property.status === 'Active' && <View style={[styles.activeDot, { backgroundColor: property.statusColor }]} />}
                <Text style={[styles.statusText, { color: property.statusColor }]}>{property.status}</Text>
              </View>
            </View>

            {/* Property Info */}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{property.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={11} color="#4A5568" />
                <Text style={styles.cardLocation}>{property.location}</Text>
              </View>
              <Text style={styles.cardPrice}>{property.price} ETB <Text style={styles.cardPriceMonth}>/month</Text></Text>

              {/* Metrics */}
              <View style={styles.metricsRow}>
                <View style={styles.metric}>
                  <Feather name="eye" size={12} color="#6B7280" />
                  <Text style={styles.metricText}>{property.views} views</Text>
                </View>
                <View style={styles.metric}>
                  <Feather name="message-circle" size={12} color="#6B7280" />
                  <Text style={styles.metricText}>{property.inquiries} inquiries</Text>
                </View>
                {property.daysLeft && (
                  <View style={styles.metric}>
                    <Feather name="zap" size={12} color="#005C3A" />
                    <Text style={[styles.metricText, { color: '#005C3A', fontWeight: '700' }]}>
                      {property.daysLeft}d boost left
                    </Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => router.push({ pathname: '/property-details', params: { id: property.id } })}
                >
                  <Feather name="eye" size={14} color="#005C3A" />
                  <Text style={styles.actionBtnOutlineText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => router.push('/boost-listing')}
                >
                  <Feather name="zap" size={14} color="#005C3A" />
                  <Text style={styles.actionBtnOutlineText}>Boost</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => router.push('/chat')}
                >
                  <Feather name="message-circle" size={14} color="#005C3A" />
                  <Text style={styles.actionBtnOutlineText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Add New CTA */}
        <TouchableOpacity style={styles.addPropertyCard} onPress={() => router.push('/list-property')}>
          <View style={styles.addPropertyIcon}>
            <Feather name="plus" size={24} color="#005C3A" />
          </View>
          <Text style={styles.addPropertyText}>Post a New Property</Text>
          <Feather name="chevron-right" size={18} color="#005C3A" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F9' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#005C3A', justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { padding: 20 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20,
    paddingVertical: 20, paddingHorizontal: 12, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#F3F4F6' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginTop: 8, marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600' },
  tabsRow: { flexDirection: 'row', marginBottom: 20 },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12, marginHorizontal: 4,
  },
  tabActive: { backgroundColor: '#005C3A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  tabTextActive: { color: '#FFF', fontWeight: '800' },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  propertyCard: {
    backgroundColor: '#FFF', borderRadius: 20, marginBottom: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardImageWrap: { width: '100%', height: 160, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  statusBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  activeDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: '800' },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardLocation: { fontSize: 12, color: '#4A5568', marginLeft: 3 },
  cardPrice: { fontSize: 16, fontWeight: '900', color: '#005C3A', marginBottom: 12 },
  cardPriceMonth: { fontSize: 11, fontWeight: '500', color: '#6B7280' },
  metricsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  metric: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  metricText: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  actionsRow: { flexDirection: 'row' },
  actionBtnOutline: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#005C3A', borderRadius: 10,
    paddingVertical: 10, marginHorizontal: 3,
  },
  actionBtnOutlineText: { fontSize: 12, fontWeight: '700', color: '#005C3A', marginLeft: 5 },
  addPropertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 20, padding: 20,
    borderWidth: 1.5, borderColor: '#BBD8C9', borderStyle: 'dashed',
    marginTop: 8,
  },
  addPropertyIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  addPropertyText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#005C3A' },
});
