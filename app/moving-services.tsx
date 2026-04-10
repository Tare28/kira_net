import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Feather, Ionicons, MaterialIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

// ─── Moving service data ──────────────────────────────────────────────────────
const TRUCK_OPTIONS = [
  {
    id: 't1',
    name: 'Mini Pickup',
    icon: '🛻',
    capacity: 'Up to 500 kg · Studio / small rooms',
    price: '800',
    eta: '30–45 min',
    rating: 4.7,
    trips: 213,
    color: '#E8F5E9',
    border: '#86EFAC',
  },
  {
    id: 't2',
    name: 'Medium Truck',
    icon: '🚚',
    capacity: 'Up to 2 tons · 1–2 bedroom flat',
    price: '1,500',
    eta: '45–60 min',
    rating: 4.8,
    trips: 98,
    color: '#EFF6FF',
    border: '#93C5FD',
  },
  {
    id: 't3',
    name: 'Big Cargo Truck',
    icon: '🚛',
    capacity: 'Up to 5 tons · Full villa move',
    price: '2,800',
    eta: '60–90 min',
    rating: 4.9,
    trips: 54,
    color: '#FEF3C7',
    border: '#FCD34D',
  },
];

const MOVERS = [
  {
    id: 'm1',
    name: 'Quick Movers ET',
    avatar: 'https://images.unsplash.com/photo-1560250097-0dc605a9-9d41?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    reviews: 87,
    price: '200',
    priceUnit: 'per mover/hr',
    specialty: 'Furniture assembly, fragile items',
    badge: 'Top Rated',
    badgeColor: '#16A34A',
    available: true,
    location: 'Bole',
  },
  {
    id: 'm2',
    name: 'AddisMove Pro',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
    reviews: 43,
    price: '180',
    priceUnit: 'per mover/hr',
    specialty: 'Fast packing, same-day service',
    badge: 'Fast',
    badgeColor: '#3B82F6',
    available: true,
    location: 'Kazanchis',
  },
  {
    id: 'm3',
    name: 'Bole Lifters',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 4.5,
    reviews: 22,
    price: '150',
    priceUnit: 'per mover/hr',
    specialty: 'Budget-friendly, small moves',
    badge: 'Budget Pick',
    badgeColor: '#F59E0B',
    available: false,
    location: 'Megenagna',
  },
];

const EXTRAS = [
  { id: 'e1', icon: 'package', label: 'Packing Service', price: '300', unit: 'flat', selected: false },
  { id: 'e2', icon: 'tool', label: 'Furniture Assembly', price: '200', unit: 'per item', selected: false },
  { id: 'e3', icon: 'layers', label: 'Floor Protection', price: '100', unit: 'flat', selected: false },
  { id: 'e4', icon: 'archive', label: 'Storage (1 day)', price: '500', unit: 'per day', selected: false },
];

type Extra = typeof EXTRAS[number];

export default function MovingServicesScreen() {
  const [activeTab, setActiveTab] = useState<'trucks' | 'movers'>('trucks');
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);
  const [extras, setExtras] = useState<Extra[]>(EXTRAS);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookTarget, setBookTarget] = useState<any>(null);
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [moveDate, setMoveDate] = useState('');

  const toggleExtra = (id: string) =>
    setExtras(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));

  const totalExtras = extras.filter(e => e.selected).reduce((sum, e) => sum + parseInt(e.price), 0);

  const openBook = (item: any) => {
    setBookTarget(item);
    setShowBookModal(true);
  };

  const handleBook = () => {
    if (!fromAddress.trim() || !toAddress.trim() || !moveDate.trim()) {
      Alert.alert('Missing Info', 'Please fill in all booking fields.');
      return;
    }
    setShowBookModal(false);
    Alert.alert(
      '🎉 Booking Confirmed!',
      `Your ${bookTarget?.name ?? bookTarget?.icon} has been booked for ${moveDate}.\nYou will receive a confirmation call shortly.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Moving Services</Text>
          <Text style={styles.headerSub}>Book trucks & movers in Addis</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <Text style={styles.heroEmoji}>🚛</Text>
          <View>
            <Text style={styles.heroTitle}>Move Made Easy</Text>
            <Text style={styles.heroSub}>Trusted movers · Guaranteed on-time</Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <Text style={styles.heroStatNum}>500+</Text>
          <Text style={styles.heroStatLbl}>Moves done</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trucks' && styles.tabActive]}
          onPress={() => setActiveTab('trucks')}
        >
          <Text style={styles.tabEmoji}>🚚</Text>
          <Text style={[styles.tabText, activeTab === 'trucks' && styles.tabTextActive]}>Book a Truck</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'movers' && styles.tabActive]}
          onPress={() => setActiveTab('movers')}
        >
          <MaterialCommunityIcons name="account-hard-hat" size={16} color={activeTab === 'movers' ? '#9CC942' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'movers' && styles.tabTextActive]}>Find Movers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {activeTab === 'trucks' ? (
          <>
            {/* Truck Options */}
            <Text style={styles.sectionLabel}>CHOOSE YOUR VEHICLE</Text>
            {TRUCK_OPTIONS.map(truck => (
              <TouchableOpacity
                key={truck.id}
                style={[
                  styles.truckCard,
                  { backgroundColor: truck.color, borderColor: truck.border },
                  selectedTruck === truck.id && styles.truckCardSelected,
                ]}
                onPress={() => setSelectedTruck(truck.id)}
                activeOpacity={0.88}
              >
                <View style={styles.truckTop}>
                  <Text style={styles.truckIcon}>{truck.icon}</Text>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.truckName}>{truck.name}</Text>
                    <Text style={styles.truckCapacity}>{truck.capacity}</Text>
                    <View style={styles.truckMeta}>
                      <Ionicons name="star" size={12} color="#FBC02D" />
                      <Text style={styles.truckRating}>{truck.rating}</Text>
                      <Text style={styles.truckDot}>·</Text>
                      <Ionicons name="time-outline" size={12} color="#4A5568" />
                      <Text style={styles.truckEta}>{truck.eta}</Text>
                    </View>
                  </View>
                  <View style={styles.truckPriceBox}>
                    <Text style={styles.truckPrice}>{truck.price}</Text>
                    <Text style={styles.truckPriceUnit}>ETB base</Text>
                  </View>
                </View>

                {selectedTruck === truck.id && (
                  <TouchableOpacity style={styles.bookTruckBtn} onPress={() => openBook(truck)}>
                    <Feather name="check-circle" size={16} color="#FFF" />
                    <Text style={styles.bookTruckBtnText}>Book This Truck</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}

            {/* Extras */}
            <Text style={styles.sectionLabel}>ADD-ON SERVICES</Text>
            <View style={styles.extrasGrid}>
              {extras.map(extra => (
                <TouchableOpacity
                  key={extra.id}
                  style={[styles.extraChip, extra.selected && styles.extraChipActive]}
                  onPress={() => toggleExtra(extra.id)}
                >
                  <Feather name={extra.icon as any} size={14} color={extra.selected ? '#9CC942' : '#6B7280'} />
                  <Text style={[styles.extraLabel, extra.selected && styles.extraLabelActive]}>{extra.label}</Text>
                  <Text style={[styles.extraPrice, extra.selected && styles.extraPriceActive]}>+{extra.price} ETB</Text>
                </TouchableOpacity>
              ))}
            </View>
            {extras.some(e => e.selected) && (
              <View style={styles.extraTotal}>
                <Text style={styles.extraTotalLabel}>Add-ons total:</Text>
                <Text style={styles.extraTotalValue}>{totalExtras} ETB</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* Movers */}
            <Text style={styles.sectionLabel}>AVAILABLE MOVERS NEAR YOU</Text>
            {MOVERS.map(mover => (
              <View key={mover.id} style={[styles.moverCard, !mover.available && styles.moverCardOff]}>
                {!mover.available && (
                  <View style={styles.unavailableOverlay}>
                    <Text style={styles.unavailableText}>Currently Unavailable</Text>
                  </View>
                )}
                <View style={styles.moverTop}>
                  <Image source={mover.avatar} style={styles.moverAvatar} contentFit="cover" />
                  <View style={styles.moverInfo}>
                    <View style={styles.moverNameRow}>
                      <Text style={styles.moverName}>{mover.name}</Text>
                      <View style={[styles.moverBadge, { backgroundColor: mover.badgeColor + '20' }]}>
                        <Text style={[styles.moverBadgeText, { color: mover.badgeColor }]}>{mover.badge}</Text>
                      </View>
                    </View>
                    <View style={styles.moverMeta}>
                      <Ionicons name="star" size={12} color="#FBC02D" />
                      <Text style={styles.moverRating}>{mover.rating} ({mover.reviews} reviews)</Text>
                    </View>
                    <Text style={styles.moverSpecialty}>{mover.specialty}</Text>
                  </View>
                </View>
                <View style={styles.moverFooter}>
                  <View style={styles.moverLocRow}>
                    <Ionicons name="location-sharp" size={12} color="#4A5568" />
                    <Text style={styles.moverLoc}>{mover.location}</Text>
                  </View>
                  <Text style={styles.moverPrice}>{mover.price} ETB <Text style={styles.moverPriceUnit}>{mover.priceUnit}</Text></Text>
                  {mover.available && (
                    <TouchableOpacity style={styles.bookMoverBtn} onPress={() => openBook(mover)}>
                      <Text style={styles.bookMoverBtnText}>Book</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {/* Safety Note */}
        <View style={styles.safetyNote}>
          <MaterialIcons name="verified-user" size={15} color="#3B82F6" />
          <Text style={styles.safetyText}>
            All drivers and movers are Kira-Net verified. Payment on delivery. Cancel up to 2 hours before move.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={showBookModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.bookSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.bookSheetTitle}>
              Book {bookTarget?.name ?? bookTarget?.icon}
            </Text>
            <Text style={styles.bookSheetSub}>Complete your booking details below</Text>

            <Text style={styles.bookLabel}>FROM (current address)</Text>
            <TextInput
              style={styles.bookInput}
              value={fromAddress}
              onChangeText={setFromAddress}
              placeholder="e.g. Bole, Near Total Station"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.bookLabel}>TO (new address)</Text>
            <TextInput
              style={styles.bookInput}
              value={toAddress}
              onChangeText={setToAddress}
              placeholder="e.g. Kazanchis, Alem Building"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.bookLabel}>MOVE DATE</Text>
            <TextInput
              style={styles.bookInput}
              value={moveDate}
              onChangeText={setMoveDate}
              placeholder="e.g. April 5, 2026 at 9:00 AM"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity style={styles.confirmBookBtn} onPress={handleBook}>
              <MaterialCommunityIcons name="truck-fast" size={20} color="#FFF" />
              <Text style={styles.confirmBookText}>Confirm Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBookBtn} onPress={() => setShowBookModal(false)}>
              <Text style={styles.cancelBookText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#16A34A' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  heroBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: KiraColors.primary, marginHorizontal: 20, borderRadius: 20,
    padding: 18, marginBottom: 16,
    shadowColor: '#9CC942', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 6,
  },
  heroLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  heroStats: { alignItems: 'center' },
  heroStatNum: { fontSize: 22, fontWeight: '900', color: '#FBC02D' },
  heroStatLbl: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  tabs: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#F3F4F6', borderRadius: 16, padding: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    paddingVertical: 11, borderRadius: 13,
  },
  tabActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabEmoji: { fontSize: 16 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#9CC942', fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },
  sectionLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1.2, marginBottom: 12 },
  truckCard: {
    borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1.5,
  },
  truckCardSelected: {
    shadowColor: '#9CC942', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  truckTop: { flexDirection: 'row', alignItems: 'center' },
  truckIcon: { fontSize: 40 },
  truckName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  truckCapacity: { fontSize: 12, color: '#4A5568', marginBottom: 5 },
  truckMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  truckRating: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  truckDot: { color: '#9CA3AF' },
  truckEta: { fontSize: 12, color: '#4A5568' },
  truckPriceBox: { alignItems: 'flex-end' },
  truckPrice: { fontSize: 20, fontWeight: '900', color: '#9CC942' },
  truckPriceUnit: { fontSize: 10, color: '#6B7280' },
  bookTruckBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: KiraColors.primary, borderRadius: 14, paddingVertical: 12, marginTop: 14,
  },
  bookTruckBtnText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  extrasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  extraChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F3F4F6', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  extraChipActive: { backgroundColor: '#E8F5E9', borderColor: '#9CC942' },
  extraLabel: { fontSize: 12, fontWeight: '600', color: '#4A5568' },
  extraLabelActive: { color: '#9CC942' },
  extraPrice: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },
  extraPriceActive: { color: '#9CC942' },
  extraTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20,
  },
  extraTotalLabel: { fontSize: 13, fontWeight: '700', color: '#9CC942' },
  extraTotalValue: { fontSize: 16, fontWeight: '900', color: '#9CC942' },
  moverCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    position: 'relative', overflow: 'hidden',
  },
  moverCardOff: { opacity: 0.6 },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center', alignItems: 'center', zIndex: 2,
  },
  unavailableText: { fontSize: 13, fontWeight: '800', color: '#6B7280' },
  moverTop: { flexDirection: 'row', marginBottom: 12 },
  moverAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  moverInfo: { flex: 1 },
  moverNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  moverName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  moverBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  moverBadgeText: { fontSize: 10, fontWeight: '800' },
  moverMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  moverRating: { fontSize: 12, color: '#4A5568' },
  moverSpecialty: { fontSize: 12, color: '#6B7280' },
  moverFooter: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12,
  },
  moverLocRow: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 },
  moverLoc: { fontSize: 11, color: '#4A5568' },
  moverPrice: { fontSize: 14, fontWeight: '900', color: '#9CC942', marginRight: 12 },
  moverPriceUnit: { fontSize: 10, color: '#6B7280', fontWeight: '500' },
  bookMoverBtn: {
    backgroundColor: KiraColors.primary, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 14,
  },
  bookMoverBtnText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  safetyNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, marginTop: 8,
  },
  safetyText: { flex: 1, fontSize: 12, color: '#1D4ED8', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bookSheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40,
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2,
    alignSelf: 'center', marginBottom: 20,
  },
  bookSheetTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 6 },
  bookSheetSub: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  bookLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  bookInput: {
    backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15, color: '#1A1A1A', fontWeight: '500', marginBottom: 14,
  },
  confirmBookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: KiraColors.primary, borderRadius: 16, paddingVertical: 18, marginTop: 4, marginBottom: 12,
    shadowColor: '#9CC942', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  confirmBookText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  cancelBookBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelBookText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
});
