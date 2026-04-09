import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { KiraColors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

const OFFLINE_PINS = [
  {
    id: '1',
    title: 'Luxury Bole Loft',
    location: 'Bole, Addis Ababa',
    price: '45,000',
    coords: { x: 150, y: 220 },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Skyline View Studio',
    location: 'Kazanchis, Addis Ababa',
    price: '28,500',
    coords: { x: 280, y: 350 },
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=200&auto=format&fit=crop',
  },
];

export default function OfflineMapScreen() {
  const [selectedPin, setSelectedPin] = useState<any>(null);

  return (
    <View style={styles.container}>
      {/* Simulated Map View */}
      <View style={styles.mapContainer}>
        {/* Placeholder for Map Tiles */}
        <Image 
          source="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop" 
          style={styles.mapBase}
        />
        
        {/* Map Overlay and Pins */}
        <View style={StyleSheet.absoluteFill}>
          {OFFLINE_PINS.map((pin) => (
            <TouchableOpacity
              key={pin.id}
              style={[styles.pinWrapper, { left: pin.coords.x, top: pin.coords.y }]}
              onPress={() => setSelectedPin(pin)}
            >
              <View style={[styles.pinMarker, selectedPin?.id === pin.id && styles.pinMarkerActive]}>
                <Ionicons
                  name="location"
                  size={24}
                  color={selectedPin?.id === pin.id ? KiraColors.accent : KiraColors.primary}
                />
              </View>
              {selectedPin?.id === pin.id && (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText}>{pin.price} ETB</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Header Overlay */}
        <SafeAreaView style={styles.headerOverlay}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.offlineChip}>
            <MaterialIcons name="offline-pin" size={14} color={KiraColors.primary} />
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        </SafeAreaView>

        {/* Floating Action Buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="locate" size={24} color={KiraColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="layers" size={24} color={KiraColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Info Card Overlay */}
        {selectedPin && (
          <View style={styles.infoCardWrapper}>
            <TouchableOpacity 
              style={styles.infoCard}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/property-details', params: { id: selectedPin.id } })}
            >
              <Image source={selectedPin.image} style={styles.infoImage} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{selectedPin.title}</Text>
                <Text style={styles.infoLoc}>{selectedPin.location}</Text>
                <Text style={styles.infoPrice}>{selectedPin.price} ETB/mo</Text>
              </View>
              <TouchableOpacity style={styles.infoClose} onPress={() => setSelectedPin(null)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* List of Saved Offline Areas */}
      <View style={styles.bottomSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Offline Areas</Text>
          <TouchableOpacity>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedScroll}>
          <TouchableOpacity style={styles.savedAreaCard}>
            <View style={styles.savedIcon}>
              <Ionicons name="download" size={20} color={KiraColors.primary} />
            </View>
            <Text style={styles.savedAreaName}>Bole Central</Text>
            <Text style={styles.savedAreaSize}>12 MB · 48 pins</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.savedAreaCard}>
            <View style={styles.savedIcon}>
              <Ionicons name="download" size={20} color={KiraColors.primary} />
            </View>
            <Text style={styles.savedAreaName}>Kazanchis</Text>
            <Text style={styles.savedAreaSize}>8 MB · 32 pins</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.savedAreaCard, styles.addArea]}>
            <Ionicons name="add" size={24} color="#6B7280" />
            <Text style={styles.addText}>New Area</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBase: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: KiraColors.primary,
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '800',
    color: KiraColors.primary,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinMarker: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pinMarkerActive: {
    transform: [{ scale: 1.2 }],
  },
  pinLabel: {
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -8,
    borderWidth: 1,
    borderColor: KiraColors.primary,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: KiraColors.primary,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    top: Dimensions.get('window').height * 0.4,
    gap: 12,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  infoCardWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  infoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoLoc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  infoPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: KiraColors.primary,
  },
  infoClose: {
    padding: 4,
  },
  bottomSection: {
    padding: 20,
    backgroundColor: '#FAFBFB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  manageText: {
    fontSize: 13,
    color: KiraColors.primary,
    fontWeight: '700',
  },
  savedScroll: {
    gap: 12,
  },
  savedAreaCard: {
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  savedAreaName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  savedAreaSize: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  addArea: {
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D1D5DB',
  },
  addText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 8,
  },
});
