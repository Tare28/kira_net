import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';

import { Dimensions } from 'react-native';
import { useFilters } from '@/context/FilterContext';
import { KiraColors } from '@/constants/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { PROPERTIES } from '@/data/properties';
import Animated, { SlideInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

function SupportContent({ type }: { type: 'help' | 'safety' | 'terms' }) {
  const content = {
    help: {
      title: 'Help Center',
      text: 'How can we help you today? \n\n• Finding a Property: Use the Filter button on the home screen to narrow down results by price and location. \n\n• Contacting Landlords: Click on any property to see the "Message" or "Call" buttons. \n\n• For Landlords: Use the "Agent Terminal" or "My Properties" to manage your listings. \n\nNeed further assistance? Email us at support@kiranet.com'
    },
    safety: {
      title: 'Safety Center',
      text: 'Your safety is our priority. \n\n• Verified Listings: Look for the blue checkmark. These properties have been physically inspected by a Kira-Net agent. \n\n• Meet Safely: When visiting a property, try to go during daylight and bring a friend. \n\n• Secure Payments: Never send money outside of the secure payment links provided within the app. \n\nReport suspicious activity using the "Report Listing" button.'
    },
    terms: {
      title: 'Terms of Service',
      text: 'Welcome to Kira-Net. By using our service, you agree to: \n\n1. provide accurate information when creating an account. \n\n2. treat all participants in the ecosystem with respect. \n\n3. use the platform only for legitimate rental and property management purposes. \n\nKira-Net acts as a facilitator and is not responsible for the direct legal agreements between landlords and tenants.'
    }
  };

  const active = content[type];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={KiraColors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{active.title}</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View style={styles.supportCard}>
             <Feather 
               name={type === 'help' ? 'help-circle' : type === 'safety' ? 'shield' : 'file-text'} 
               size={48} 
               color={KiraColors.primary} 
               style={{ marginBottom: 20 }}
             />
             <Text style={styles.supportText}>{active.text}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function FiltersModalScreen() {
  const { type } = useLocalSearchParams();
  const { filters, updateFilters, resetFilters } = useFilters();
  const [showLocationModal, setShowLocationModal] = useState(false);

  if (type === 'help' || type === 'safety' || type === 'terms') {
    return <SupportContent type={type as any} />;
  }

  const NEIGHBORHOODS = ['Bole', 'Arada', 'Yeka', 'Kazanchis', 'CMC', 'Megenagna'];

  const onValuesChange = (values: number[]) => {
    updateFilters({ minPrice: values[0], maxPrice: values[1] });
  };
  
  const toggleAmenity = (name: string) => {
    if (name === 'Water') {
        updateFilters({ essentialWater: !filters.essentialWater });
    } else if (name === 'Internet') {
        updateFilters({ essentialInternet: !filters.essentialInternet });
    }
  };

  const handleReset = () => {
    resetFilters();
    Alert.alert('Filters Reset', 'All search filters have been cleared.');
  };

  const matchCount = PROPERTIES.filter(p => {
    const price = parseInt(p.price.replace(/,/g, ''));
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
    const matchesLoc = !filters.neighborhood || p.location.includes(filters.neighborhood);
    const matchesWater = !filters.essentialWater || p.amenities?.includes('Water');
    const matchesWifi = !filters.essentialInternet || p.amenities?.includes('Wifi');
    return matchesPrice && matchesLoc && matchesWater && matchesWifi;
  }).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
         <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Feather name="x" size={24} color={KiraColors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>PRICE RANGE (ETB)</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <View style={styles.priceInput}>
                <Text style={styles.currency}>ETB</Text>
                <Text style={styles.priceText}>{filters.minPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceInput}>
                <Text style={styles.currency}>ETB</Text>
                <Text style={styles.priceText}>{filters.maxPrice.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.sliderWrap}>
              <MultiSlider
                values={[filters.minPrice, filters.maxPrice]}
                sliderLength={width - 80}
                onValuesChange={onValuesChange}
                min={0}
                max={150000}
                step={500}
                allowOverlap={false}
                snapped
                selectedStyle={{ backgroundColor: KiraColors.primary }}
                trackStyle={{ height: 4, backgroundColor: '#E2E8F0' }}
                markerStyle={{
                  height: 24, width: 24, borderRadius: 12,
                  backgroundColor: '#FFF', borderWidth: 2, borderColor: KiraColors.primary,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
                }}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>NEIGHBORHOOD</Text>
          <TouchableOpacity style={styles.locationSelector} onPress={() => setShowLocationModal(true)}>
            <View style={styles.locLeft}>
                <Feather name="map-pin" size={18} color={KiraColors.primary} />
                <Text style={styles.locText}>{filters.neighborhood || 'Any Neighborhood'}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>ESSENTIAL AMENITIES</Text>
          <View style={styles.amenitiesGrid}>
              <AmenityToggle 
                name="Water" 
                icon="droplet" 
                isActive={filters.essentialWater} 
                onToggle={() => toggleAmenity('Water')} 
              />
              <AmenityToggle 
                name="Internet" 
                icon="wifi" 
                isActive={filters.essentialInternet} 
                onToggle={() => toggleAmenity('Internet')} 
              />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={() => router.back()}>
            <Text style={styles.applyBtnText}>Show {matchCount} Results</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showLocationModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Neighborhoods</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Feather name="x" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList 
              data={['Any Neighborhood', ...NEIGHBORHOODS]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.neighborhoodItem}
                  onPress={() => {
                    updateFilters({ neighborhood: item === 'Any Neighborhood' ? '' : item });
                    setShowLocationModal(false);
                  }}
                >
                  <Text style={[styles.neighborhoodText, (filters.neighborhood === item || (!filters.neighborhood && item === 'Any Neighborhood')) && styles.neighborhoodActive]}>
                    {item}
                  </Text>
                  {(filters.neighborhood === item || (!filters.neighborhood && item === 'Any Neighborhood')) && (
                    <Feather name="check" size={18} color={KiraColors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function AmenityToggle({ name, icon, isActive, onToggle }: any) {
  return (
    <TouchableOpacity 
      style={[styles.amenityBox, isActive && styles.amenityActive]} 
      onPress={onToggle}
    >
      <Feather name={icon} size={20} color={isActive ? '#FFF' : '#64748B'} />
      <Text style={[styles.amenityText, isActive && styles.amenityTextActive]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A1A' },
  resetText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  scrollContent: { paddingBottom: 40 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginHorizontal: 24, marginTop: 32, marginBottom: 16 },
  
  priceContainer: { marginHorizontal: 20, backgroundColor: '#F8FAFC', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  priceInput: { flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', paddingHorizontal: 16 },
  currency: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 2 },
  priceText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  priceDivider: { width: 12, height: 1, backgroundColor: '#CBD5E1', marginHorizontal: 12 },
  sliderWrap: { alignItems: 'center', paddingHorizontal: 10 },

  locationSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, backgroundColor: '#F8FAFC', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  locLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },

  amenitiesGrid: { flexDirection: 'row', gap: 12, marginHorizontal: 20 },
  amenityBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  amenityActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  amenityText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  amenityTextActive: { color: '#FFF' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  applyBtn: { backgroundColor: KiraColors.primary, borderRadius: 30, paddingVertical: 18, alignItems: 'center', shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  applyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 30 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  neighborhoodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  neighborhoodText: { fontSize: 15, color: '#4A5568', fontWeight: '600' },
  neighborhoodActive: { color: KiraColors.primary, fontWeight: '800' },

  supportCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' },
  supportText: { fontSize: 14, color: '#4A5568', lineHeight: 22, fontWeight: '500' },
});
