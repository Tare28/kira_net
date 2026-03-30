import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useVisitPlan } from '@/context/VisitPlanContext';

const { width } = Dimensions.get('window');

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

// Neighborhood coords (mock — tied to listing location strings)
const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Bole, Addis Ababa':       { lat: 9.0222, lng: 38.7949 },
  'Old Airport, Addis Ababa':{ lat: 9.0104, lng: 38.7566 },
  'Kazanchis, Addis Ababa':  { lat: 9.0172, lng: 38.7628 },
  'CMC, Addis Ababa':        { lat: 9.0465, lng: 38.7966 },
  'Sarbet, Addis Ababa':     { lat: 9.0058, lng: 38.7459 },
};

function getCoords(location: string) {
  return LOCATION_COORDS[location] ?? { lat: 9.03, lng: 38.75 };
}

function buildGoogleMapsRoute(visits: any[]) {
  if (visits.length === 0) return '';
  const origin = '9.0320,38.7469'; // Addis Ababa center
  const waypoints = visits
    .slice(0, -1)
    .map(v => {
      const c = getCoords(v.location);
      return `${c.lat},${c.lng}`;
    })
    .join('|');
  const dest = (() => {
    const c = getCoords(visits[visits.length - 1].location);
    return `${c.lat},${c.lng}`;
  })();
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  url += `&travelmode=driving`;
  return url;
}

export default function VisitPlannerScreen() {
  const { visits, removeVisit, clearAll, updateTime } = useVisitPlan();
  const [timePickerId, setTimePickerId] = useState<string | null>(null);

  const totalVisits = visits.length;
  const estimatedTime = totalVisits * 45; // 45 min per visit avg

  const openDirections = () => {
    if (visits.length === 0) return;
    const url = buildGoogleMapsRoute(visits);
    Linking.openURL(url).catch(() =>
      Alert.alert('Map Error', 'Could not open Google Maps. Please check your connection.')
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Visit Plan',
      'Remove all properties from your visit plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Planner</Text>
        {visits.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Summary Banner */}
      {visits.length > 0 && (
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Ionicons name="home-outline" size={20} color="#005C3A" />
            <Text style={styles.summaryValue}>{totalVisits}</Text>
            <Text style={styles.summaryLabel}>Properties</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={20} color="#005C3A" />
            <Text style={styles.summaryValue}>~{estimatedTime}m</Text>
            <Text style={styles.summaryLabel}>Est. Duration</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="car-outline" size={20} color="#005C3A" />
            <Text style={styles.summaryValue}>1 Day</Text>
            <Text style={styles.summaryLabel}>Plan</Text>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {visits.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Optimized Route Tip */}
            <View style={styles.tipCard}>
              <View style={styles.tipIconWrap}>
                <MaterialIcons name="auto-awesome" size={16} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>AI Suggested Route</Text>
                <Text style={styles.tipBody}>
                  Visit properties in the order below to save time and transport cost.
                </Text>
              </View>
            </View>

            {/* Visit Cards */}
            {visits.map((item, index) => (
              <View key={item.id}>
                <VisitCard
                  item={item}
                  index={index}
                  isLast={index === visits.length - 1}
                  onRemove={() => removeVisit(item.id)}
                  onTimePress={() =>
                    setTimePickerId(timePickerId === item.id ? null : item.id)
                  }
                  onDetail={() =>
                    router.push({ pathname: '/property-details', params: { id: item.id } })
                  }
                />
                {/* Time Picker */}
                {timePickerId === item.id && (
                  <View style={styles.timePicker}>
                    <Text style={styles.timePickerLabel}>Pick a time slot</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_SLOTS.map(slot => (
                        <TouchableOpacity
                          key={slot}
                          style={[
                            styles.timeSlot,
                            item.time === slot && styles.timeSlotActive,
                          ]}
                          onPress={() => {
                            updateTime(item.id, slot);
                            setTimePickerId(null);
                          }}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              item.time === slot && styles.timeSlotTextActive,
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}

            {/* Map CTA */}
            <TouchableOpacity style={styles.mapBtn} onPress={openDirections} activeOpacity={0.88}>
              <View style={styles.mapBtnLeft}>
                <View style={styles.mapIconWrap}>
                  <Ionicons name="map" size={22} color="#FFF" />
                </View>
                <View>
                  <Text style={styles.mapBtnTitle}>Open Full Route</Text>
                  <Text style={styles.mapBtnSub}>View in Google Maps with directions</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#005C3A" />
            </TouchableOpacity>

            {/* Tips */}
            <View style={styles.hintsSection}>
              <Text style={styles.sectionLabel}>💡 Visit Day Tips</Text>
              {[
                { icon: 'camera', text: 'Take photos of each property for comparison later.' },
                { icon: 'check-square', text: 'Check water taps, electric sockets & windows.' },
                { icon: 'phone', text: 'Confirm visits with the owner the night before.' },
              ].map((tip, i) => (
                <View key={i} style={styles.hintRow}>
                  <View style={styles.hintIconBox}>
                    <Feather name={tip.icon as any} size={14} color="#005C3A" />
                  </View>
                  <Text style={styles.hintText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Visit Card ──────────────────────────────────────────────────────────────
function VisitCard({ item, index, isLast, onRemove, onTimePress, onDetail }: any) {
  return (
    <View style={styles.cardWrapper}>
      {/* Step Connector */}
      <View style={styles.stepCol}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNum}>{index + 1}</Text>
        </View>
        {!isLast && <View style={styles.stepLine} />}
      </View>

      {/* Card */}
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.9} onPress={onDetail} style={styles.cardMain}>
          <Image source={item.image} style={styles.cardImage} contentFit="cover" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.locRow}>
              <Ionicons name="location-sharp" size={11} color="#4A5568" />
              <Text style={styles.locText} numberOfLines={1}>{item.location}</Text>
            </View>
            <Text style={styles.cardPrice}>{item.price} ETB/mo</Text>
          </View>
        </TouchableOpacity>

        {/* Card Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.scheduleBtn} onPress={onTimePress}>
            <Ionicons name="time-outline" size={14} color="#005C3A" />
            <Text style={styles.scheduleBtnText}>
              {item.time ?? 'Set Time'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <Feather name="trash-2" size={14} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <MaterialCommunityIcons name="calendar-check-outline" size={48} color="#005C3A" />
      </View>
      <Text style={styles.emptyTitle}>Your Visit Plan is Empty</Text>
      <Text style={styles.emptyBody}>
        Browse listings and tap{' '}
        <Text style={{ fontWeight: '800', color: '#005C3A' }}>+ Add to Visit Plan</Text>{' '}
        on any property to schedule a visit.
      </Text>
      <TouchableOpacity style={styles.exploreCta} onPress={() => router.push('/(tabs)')}>
        <Feather name="search" size={16} color="#FFF" />
        <Text style={styles.exploreCtaText}>Browse Properties</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
    backgroundColor: '#FAFBFB',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  clearText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },

  summaryBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 20,
    paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16,
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginTop: 4 },
  summaryLabel: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: '#E5E7EB' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  tipCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 16,
    padding: 14, marginBottom: 24, gap: 12,
  },
  tipIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#005C3A', justifyContent: 'center', alignItems: 'center',
  },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#005C3A', marginBottom: 2 },
  tipBody: { fontSize: 12, color: '#4A5568', lineHeight: 18 },

  // Visit Card Row
  cardWrapper: { flexDirection: 'row', marginBottom: 12 },
  stepCol: { width: 36, alignItems: 'center', paddingTop: 16 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#005C3A', justifyContent: 'center', alignItems: 'center',
  },
  stepNum: { fontSize: 12, fontWeight: '900', color: '#FFF' },
  stepLine: { width: 2, flex: 1, backgroundColor: '#D1FAE5', marginTop: 6, marginBottom: -8 },

  card: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, marginLeft: 12,
  },
  cardMain: { flexDirection: 'row' },
  cardImage: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  locText: { fontSize: 11, color: '#4A5568', marginLeft: 3, flex: 1 },
  cardPrice: { fontSize: 13, fontWeight: '900', color: '#005C3A' },

  cardActions: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  scheduleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F5E9', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 12,
  },
  scheduleBtnText: { fontSize: 12, fontWeight: '700', color: '#005C3A' },
  removeBtn: {
    width: 34, height: 34, borderRadius: 12,
    backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  },

  // Time Picker
  timePicker: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 14,
    marginBottom: 12, marginLeft: 48,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  timePickerLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 10 },
  timeSlot: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
    marginRight: 8, backgroundColor: '#F7F8F9',
  },
  timeSlotActive: { backgroundColor: '#005C3A', borderColor: '#005C3A' },
  timeSlotText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  timeSlotTextActive: { color: '#FFF' },

  // Map CTA
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', borderRadius: 20, padding: 16,
    marginTop: 8, marginBottom: 24,
    borderWidth: 1.5, borderColor: '#D1FAE5',
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 3,
  },
  mapBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mapIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#005C3A', justifyContent: 'center', alignItems: 'center',
  },
  mapBtnTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  mapBtnSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // Hints
  hintsSection: {
    backgroundColor: '#F7F8F9', borderRadius: 20, padding: 18, marginBottom: 8,
  },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 14 },
  hintRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  hintIconBox: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
    marginRight: 12, marginTop: 1,
  },
  hintText: { flex: 1, fontSize: 13, color: '#4A5568', lineHeight: 20 },

  // Empty State
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  emptyBody: { fontSize: 14, color: '#4A5568', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
  exploreCta: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#005C3A', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 20,
  },
  exploreCtaText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
});
