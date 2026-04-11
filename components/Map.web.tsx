import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KiraColors } from '@/constants/colors';

export const Marker = ({ children, coordinate }: any) => {
  // We can't easily position them without a real map coordinate system on web placeholder
  // but we can just render the children if they are custom markers
  return (
    <View style={styles.webMarker}>
      {children}
    </View>
  );
};

export const Polyline = () => null;

export const PROVIDER_GOOGLE = 'google';

const MapView = ({ children, style, initialRegion }: any) => {
  return (
    <View style={[style, styles.webMapFallback]}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="map-outline" size={48} color={KiraColors.primary} />
        </View>
        <Text style={styles.title}>Interactive Maps (Native Only)</Text>
        <Text style={styles.subtitle}>
          The interactive map experience is optimized for iOS and Android devices. 
          You are viewing the web preview version.
        </Text>
        <View style={styles.regionInfo}>
          <Text style={styles.regionText}>
            Lat: {initialRegion?.latitude?.toFixed(4)}, Lon: {initialRegion?.longitude?.toFixed(4)}
          </Text>
        </View>
      </View>
      
      {/* Overlaying any markers/children in a fixed list if needed, but for now just show fallback */}
      <View style={styles.markersList}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapFallback: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: KiraColors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  regionInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  regionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    fontFamily: 'monospace',
  },
  markersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    gap: 10,
  },
  webMarker: {
    // Basic styling for markers when rendered in a list on web
  }
});

export default MapView;
