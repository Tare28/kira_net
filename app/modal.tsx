import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function FiltersModalScreen() {
  const [activeDeposit, setActiveDeposit] = useState('3 Months');
  const [privateElectricity, setPrivateElectricity] = useState(true);
  const [verifiedActive, setVerifiedActive] = useState(false);
  const [activeNeighborhood, setActiveNeighborhood] = useState('Bole');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Feather name="x" size={24} color="#005C3A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Budget Range */}
          <View style={styles.section}>
            <Text style={styles.sectionOverline}>MONTHLY RENT</Text>
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitleGreen}>Budget Range</Text>
              <Text style={styles.currencyText}>ETB</Text>
            </View>

            <View style={styles.sliderCard}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrackLine} />
                <View style={styles.sliderActiveLine} />
                <View style={[styles.sliderThumb, { left: '10%' }]} />
                <View style={[styles.sliderThumb, { left: '60%' }]} />
              </View>
              <View style={styles.minMaxRow}>
                <View style={styles.minMaxBox}>
                  <Text style={styles.minMaxLabel}>Minimum</Text>
                  <Text style={styles.minMaxValue}>5,000</Text>
                </View>
                <View style={styles.dash} />
                <View style={styles.minMaxBox}>
                  <Text style={styles.minMaxLabel}>Maximum</Text>
                  <Text style={styles.minMaxValue}>100,000+</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Security Deposit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Deposit</Text>
            <View style={styles.rowSpacing}>
              {['1 Month', '3 Months', '6 Months'].map(label => (
                <TouchableOpacity
                  key={label}
                  style={[styles.depositPill, activeDeposit === label && styles.depositPillActive]}
                  onPress={() => setActiveDeposit(label)}
                >
                  <Text style={[styles.depositPillText, activeDeposit === label && styles.depositPillTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferred Neighbourhood */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Neighborhood</Text>
            <View style={styles.dropdownInput}>
              <Ionicons name="location-sharp" size={20} color="#005C3A" />
              <Text style={styles.dropdownText}>Bole, Addis Ababa</Text>
              <Feather name="chevron-down" size={20} color="#1A1A1A" style={{ marginLeft: 'auto' }} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {['Bole', 'Arada', 'Yeka', 'Kazanchis'].map(hood => (
                <TouchableOpacity
                  key={hood}
                  style={[styles.chip, activeNeighborhood === hood && styles.chipActive]}
                  onPress={() => setActiveNeighborhood(hood)}
                >
                  <Text style={[styles.chipText, activeNeighborhood === hood && styles.chipTextActive]}>{hood}</Text>
                  {activeNeighborhood === hood && (
                    <Feather name="x" size={12} color="#005C3A" style={{ marginLeft: 4 }} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Essential Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Essential Amenities</Text>
            <View style={styles.amenitiesGrid}>
              <TouchableOpacity style={styles.amenityCard}>
                <View style={styles.amenityIconWrap}>
                  <Ionicons name="water" size={20} color="#005C3A" />
                </View>
                <Text style={styles.amenityCardText}>Constant Water{'\n'}Supply</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.amenityCard}>
                <View style={styles.amenityIconWrap}>
                  <Feather name="wifi" size={20} color="#005C3A" />
                </View>
                <Text style={styles.amenityCardText}>Fiber Optic Internet</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Electricity Setup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Electricity Setup</Text>
            <View style={styles.electricityCard}>
              <View style={styles.electricityIconWrap}>
                <Ionicons name="flash" size={20} color="#005C3A" />
              </View>
              <View style={styles.electricityTextWrap}>
                <Text style={styles.electricityTitle}>Private Electric Meter</Text>
                <Text style={styles.electricitySub}>Exclude shared utility listings</Text>
              </View>
              <Switch
                value={privateElectricity}
                onValueChange={setPrivateElectricity}
                trackColor={{ true: '#005C3A', false: '#D1D5DB' }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Verified Listings */}
          <View style={styles.section}>
            <View style={styles.verifyCard}>
              <View style={styles.verifyIconWrap}>
                <MaterialIcons name="verified" size={22} color="#B8860B" />
              </View>
              <View style={styles.verifyTextWrap}>
                <Text style={styles.verifyTitle}>Verified Listings</Text>
                <Text style={styles.verifySubtitle}>Physically inspected by Kira-Net</Text>
              </View>
              <Switch
                value={verifiedActive}
                onValueChange={setVerifiedActive}
                trackColor={{ true: '#005C3A', false: '#D1D5DB' }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Map Preview */}
          <View style={styles.mapContainer}>
            <Image
              source="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <TouchableOpacity style={styles.mapBtn}>
                <Feather name="map" size={14} color="#005C3A" />
                <Text style={styles.mapBtnText}>PREVIEW IN MAP</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={() => router.back()}>
            <Text style={styles.applyButtonText}>Show 142 Properties</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#005C3A' },
  resetText: { fontSize: 14, fontWeight: '700', color: '#005C3A' },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 20 },
  section: { marginBottom: 28 },
  sectionOverline: {
    fontSize: 10, fontWeight: '800', color: '#6B7280',
    letterSpacing: 1, marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row', alignItems: 'baseline',
    justifyContent: 'space-between', marginBottom: 16,
  },
  sectionTitleGreen: {
    fontSize: 24, fontWeight: '900', color: '#005C3A', letterSpacing: -0.5,
  },
  currencyText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  sliderCard: { backgroundColor: '#F3F4F6', borderRadius: 20, padding: 24 },
  sliderContainer: {
    height: 30, justifyContent: 'center', marginBottom: 20, position: 'relative',
  },
  sliderTrackLine: {
    height: 8, backgroundColor: '#E5E7EB', borderRadius: 4,
    width: '100%', position: 'absolute',
  },
  sliderActiveLine: {
    height: 8, backgroundColor: '#005C3A', borderRadius: 4,
    width: '50%', position: 'absolute', left: '10%',
  },
  sliderThumb: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#FFF', borderWidth: 3, borderColor: '#005C3A',
    position: 'absolute', top: 3,
  },
  minMaxRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dash: { width: 16, height: 1, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  minMaxBox: {
    backgroundColor: '#FFF', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, flex: 1,
  },
  minMaxLabel: { fontSize: 10, color: '#6B7280', marginBottom: 4 },
  minMaxValue: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  rowSpacing: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  depositPill: {
    flex: 1, paddingVertical: 14, backgroundColor: '#FFF', borderRadius: 24,
    marginHorizontal: 4, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center',
  },
  depositPillActive: { backgroundColor: '#FBC02D', borderColor: '#FBC02D' },
  depositPillText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  depositPillTextActive: { color: '#1A1A1A', fontWeight: '700' },
  dropdownInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 16, marginBottom: 14,
  },
  dropdownText: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', marginLeft: 10 },
  chipsRow: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 8, marginRight: 8,
  },
  chipActive: { backgroundColor: '#E8F5E9' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#005C3A', fontWeight: '700' },
  amenitiesGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  amenityCard: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 16,
    padding: 16, marginHorizontal: 6,
  },
  amenityIconWrap: { marginBottom: 24 },
  amenityCardText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', lineHeight: 18 },
  electricityCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F9FA', borderRadius: 20, padding: 16,
  },
  electricityIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  electricityTextWrap: { flex: 1 },
  electricityTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  electricitySub: { fontSize: 10, color: '#6B7280' },
  verifyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF8E7', borderRadius: 24, padding: 20,
    borderWidth: 1, borderColor: '#FBE8C1',
  },
  verifyIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F5C048', justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  verifyTextWrap: { flex: 1 },
  verifyTitle: { fontSize: 14, fontWeight: '800', color: '#92400E', marginBottom: 2 },
  verifySubtitle: { fontSize: 10, color: '#B45309' },
  mapContainer: {
    width: '100%', height: 180, borderRadius: 24,
    overflow: 'hidden', position: 'relative', marginBottom: 10,
  },
  mapImage: { width: '100%', height: '100%', opacity: 0.65 },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  mapBtnText: {
    fontSize: 11, fontWeight: '800', color: '#005C3A',
    marginLeft: 6, letterSpacing: 0.5,
  },
  footer: {
    padding: 20, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  applyButton: {
    backgroundColor: '#005C3A', borderRadius: 30, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  applyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
