import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, Animated, Dimensions, Modal,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from '@/components/Map';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useVisitPlan } from '@/context/VisitPlanContext';
import { KiraColors } from '@/constants/colors';
import { SystemConfig } from '@/constants/SystemConfig';

const { width } = Dimensions.get('window');

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

const BOOKING_FEE_PER_VISIT = SystemConfig.fees.visitBooking; 

const LOCATION_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Bole, Addis Ababa':       { latitude: 9.0222, longitude: 38.7949 },
  'Old Airport, Addis Ababa':{ latitude: 9.0104, longitude: 38.7566 },
  'Kazanchis, Addis Ababa':  { latitude: 9.0172, longitude: 38.7628 },
  'CMC, Addis Ababa':        { latitude: 9.0465, longitude: 38.7966 },
  'Sarbet, Addis Ababa':     { latitude: 9.0058, longitude: 38.7459 },
};

function getCoords(location: string) {
  return LOCATION_COORDS[location] ?? { latitude: 9.03, longitude: 38.75 };
}

function buildGoogleMapsRoute(visits: any[]) {
  if (visits.length === 0) return '';
  const origin = '9.0320,38.7469';
  const waypoints = visits
    .slice(0, -1)
    .map(v => {
      const c = getCoords(v.location);
      return `${c.latitude},${c.longitude}`;
    })
    .join('|');
  const dest = (() => {
    const c = getCoords(visits[visits.length - 1].location);
    return `${c.latitude},${c.longitude}`;
  })();
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  url += `&travelmode=driving`;
  return url;
}

export default function VisitPlannerScreen() {
  const { visits, removeVisit, clearAll, updateTime } = useVisitPlan();
  const [timePickerId, setTimePickerId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const totalVisits = visits.length;
  const estimatedTime = totalVisits * 45; 
  const totalServiceFee = totalVisits * BOOKING_FEE_PER_VISIT;

  const openDirections = () => {
    if (visits.length === 0) return;
    const url = buildGoogleMapsRoute(visits);
    Linking.openURL(url).catch(() =>
      Alert.alert('Map Error', 'Could not open Google Maps.')
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Booking',
      `Secure your visit times for ${totalVisits} properties. Total Service Fee: ${totalServiceFee} ETB.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay with Telebirr', onPress: () => processMockPayment() },
      ]
    );
  };

  const processMockPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      Alert.alert('Success!', 'Your visit plan has been secured and confirmed with the agents.');
    }, 2000);
  };

  const handleClearAll = () => {
    Alert.alert('Clear Plan', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearAll },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Planner</Text>
        {visits.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      {visits.length > 0 && (
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Ionicons name="home-outline" size={20} color="#005C3A" />
            <Text style={styles.summaryValue}>{totalVisits}</Text>
            <Text style={styles.summaryLabel}>Properties</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
             <MaterialCommunityIcons name="currency-eth" size={20} color="#005C3A" />
             <Text style={styles.summaryValue}>{totalServiceFee}</Text>
             <Text style={styles.summaryLabel}>Service ETB</Text>
          </View>
          <View style={styles.summaryDivider} />
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={isProcessingPayment}>
             <Text style={styles.checkoutBtnText}>{isProcessingPayment ? '...' : 'SECURE'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {visits.length === 0 ? <EmptyState /> : (
          <>
            <View style={styles.tipCard}>
              <View style={styles.tipIconWrap}><MaterialIcons name="auto-awesome" size={16} color="#FFF" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>Service Fee Notice</Text>
                <Text style={styles.tipBody}>
                  A small service fee of 50 ETB per visit is charged to maintain verification quality and ensure agent availability.
                </Text>
              </View>
            </View>

            {visits.map((item, index) => (
              <View key={item.id}>
                <VisitCard
                  item={item} index={index}
                  isLast={index === visits.length - 1}
                  onRemove={() => removeVisit(item.id)}
                  onTimePress={() => setTimePickerId(timePickerId === item.id ? null : item.id)}
                  onDetail={() => router.push({ pathname: '/property-details', params: { id: item.id } })}
                />
                {timePickerId === item.id && (
                  <View style={styles.timePicker}>
                    <Text style={styles.timePickerLabel}>Pick a time slot</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {TIME_SLOTS.map(slot => (
                        <TouchableOpacity
                          key={slot}
                          style={[styles.timeSlot, item.time === slot && styles.timeSlotActive]}
                          onPress={() => { updateTime(item.id, slot); setTimePickerId(null); }}
                        >
                          <Text style={[styles.timeSlotText, item.time === slot && styles.timeSlotTextActive]}>{slot}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.mapBtn} onPress={() => setShowMap(true)} activeOpacity={0.88}>
              <View style={styles.mapBtnLeft}>
                <View style={styles.mapIconWrap}><Ionicons name="map" size={22} color="#FFF" /></View>
                <View><Text style={styles.mapBtnTitle}>Route Optimizer</Text><Text style={styles.mapBtnSub}>View navigation path</Text></View>
              </View>
              <Feather name="chevron-right" size={20} color="#005C3A" />
            </TouchableOpacity>

            <Modal visible={showMap} animationType="slide" presentationStyle="fullScreen">
               <View style={styles.mapContainer}>
                  <MapView
                    provider={PROVIDER_GOOGLE} style={styles.mapFullscreen}
                    initialRegion={{ latitude: 9.0222, longitude: 38.7469, latitudeDelta: 0.1, longitudeDelta: 0.1 }}
                  >
                    {visits.map((v, i) => (
                      <Marker key={v.id} coordinate={getCoords(v.location)} title={v.title} description={`Stop ${i + 1}`}>
                        <View style={styles.customMarker}><Text style={styles.markerText}>{i + 1}</Text></View>
                      </Marker>
                    ))}
                    {visits.length > 1 && <Polyline coordinates={visits.map(v => getCoords(v.location))} strokeColor="#005C3A" strokeWidth={4} />}
                  </MapView>

                  <SafeAreaView style={styles.mapHeader}>
                    <TouchableOpacity style={styles.closeMapBtn} onPress={() => setShowMap(false)}><Ionicons name="close" size={24} color="#1A1A1A" /></TouchableOpacity>
                    <View style={styles.mapHeaderText}><Text style={styles.mapHeaderTitle}>Live Route Optimizer</Text><Text style={styles.mapHeaderSub}>{visits.length} Stops</Text></View>
                  </SafeAreaView>

                  <View style={styles.mapFooter}>
                     <View style={styles.footerRow}>
                        <View style={styles.footerItem}><Text style={styles.footerLabel}>Total Fee</Text><Text style={styles.footerVal}>{totalServiceFee} ETB</Text></View>
                        <View style={styles.footerSep} />
                        <View style={styles.footerItem}><Text style={styles.footerLabel}>Distance</Text><Text style={styles.footerVal}>8.2 km</Text></View>
                     </View>
                     <TouchableOpacity style={styles.startNavBtn} onPress={openDirections}><Text style={styles.startNavText}>Start GPS Navigation</Text><Feather name="navigation" size={16} color="#FFF" /></TouchableOpacity>
                  </View>
               </View>
            </Modal>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function VisitCard({ item, index, isLast, onRemove, onTimePress, onDetail }: any) {
  return (
    <View style={styles.cardWrapper}>
      <View style={styles.stepCol}>
        <View style={styles.stepCircle}><Text style={styles.stepNum}>{index + 1}</Text></View>
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.9} onPress={onDetail} style={styles.cardMain}>
          <Image source={item.image} style={styles.cardImage} contentFit="cover" />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.locRow}><Ionicons name="location-sharp" size={11} color="#4A5568" /><Text style={styles.locText} numberOfLines={1}>{item.location}</Text></View>
            <Text style={styles.cardPrice}>{item.price} ETB/mo</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.scheduleBtn} onPress={onTimePress}>
            <Ionicons name="time-outline" size={14} color="#005C3A" /><Text style={styles.scheduleBtnText}>{item.time ?? 'Set Time'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}><Feather name="trash-2" size={14} color="#DC2626" /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}><MaterialCommunityIcons name="calendar-check-outline" size={48} color="#005C3A" /></View>
      <Text style={styles.emptyTitle}>Your Visit Plan is Empty</Text>
      <Text style={styles.emptyBody}>Choose properties to visit and secure your time slots.</Text>
      <TouchableOpacity style={styles.exploreCta} onPress={() => router.push('/(tabs)')}><Feather name="search" size={16} color="#FFF" /><Text style={styles.exploreCtaText}>Browse Properties</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  clearText: { fontSize: 14, fontWeight: '700', color: '#DC2626' },
  mapContainer: { flex: 1, backgroundColor: '#000' },
  mapFullscreen: { width: '100%', height: '100%' },
  mapHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.95)' },
  closeMapBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mapHeaderText: { flex: 1 },
  mapHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  mapHeaderSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  customMarker: { backgroundColor: KiraColors.primary, width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  markerText: { color: '#1A1A1A', fontSize: 12, fontWeight: '900' },
  mapFooter: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 8 },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  footerItem: { flex: 1, alignItems: 'center' },
  footerLabel: { fontSize: 10, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 },
  footerVal: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  footerSep: { width: 1, height: 30, backgroundColor: '#E5E7EB' },
  startNavBtn: { flexDirection: 'row', backgroundColor: KiraColors.primary, paddingVertical: 16, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10 },
  startNavText: { color: '#1A1A1A', fontSize: 14, fontWeight: '800' },
  summaryBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 16, elevation: 3 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginTop: 4 },
  summaryLabel: { fontSize: 10, color: '#6B7280', marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: '#E5E7EB' },
  checkoutBtn: { backgroundColor: '#1A1A1A', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  checkoutBtnText: { color: '#9CC942', fontWeight: '900', fontSize: 12 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', borderRadius: 16, padding: 14, marginBottom: 24, gap: 12 },
  tipIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0EA5E9', justifyContent: 'center', alignItems: 'center' },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#0EA5E9', marginBottom: 2 },
  tipBody: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  cardWrapper: { flexDirection: 'row', marginBottom: 12 },
  stepCol: { width: 36, alignItems: 'center', paddingTop: 16 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center' },
  stepNum: { fontSize: 12, fontWeight: '900', color: '#1A1A1A' },
  stepLine: { width: 2, flex: 1, backgroundColor: '#D1FAE5', marginTop: 6, marginBottom: -8 },
  card: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginLeft: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  cardMain: { flexDirection: 'row' },
  cardImage: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  locText: { fontSize: 11, color: '#4A5568', marginLeft: 3, flex: 1 },
  cardPrice: { fontSize: 13, fontWeight: '900', color: '#005C3A' },
  cardActions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8 },
  scheduleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F0F9FF', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 12 },
  scheduleBtnText: { fontSize: 12, fontWeight: '700', color: '#0EA5E9' },
  removeBtn: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  timePicker: { backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 12, marginLeft: 48, elevation: 2 },
  timePickerLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 10 },
  timeSlot: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, backgroundColor: '#F7F8F9' },
  timeSlotActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  timeSlotText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  timeSlotTextActive: { color: '#1A1A1A' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginTop: 8, marginBottom: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  mapBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mapIconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  mapBtnTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  mapBtnSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  emptyBody: { fontSize: 14, color: '#4A5568', lineHeight: 22, textAlign: 'center', marginBottom: 32 },
  exploreCta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: KiraColors.primary, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 20 },
  exploreCtaText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
});
