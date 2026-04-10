import React from 'react';
import {
  StyleSheet, ScrollView, View, Text,
  TouchableOpacity, Dimensions, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KiraColors } from '@/constants/colors';
import { PROPERTIES } from '@/data/properties';

const { width } = Dimensions.get('window');

const getCount = (name: string) => 
  PROPERTIES.filter(p => p.location.toLowerCase().includes(name.toLowerCase())).length;

const FEATURED = [
  { 
    id: 'bole', 
    name: 'Bole Hub', 
    listings: getCount('Bole'), 
    image: 'https://images.unsplash.com/photo-1548345680-f54753509161?q=80&w=700&auto=format&fit=crop', 
    vibe: 'Premium',
    color: '#9CC942'
  },
  { 
    id: 'kazanchis', 
    name: 'Kazanchis Hub', 
    listings: getCount('Kazanchis'), 
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=700&auto=format&fit=crop', 
    vibe: 'Diplomatic',
    color: '#9CC942'
  },
];

const LOCATIONS = [
  { id: 'old-airport', name: 'Old Airport', listings: getCount('Old Airport'), icon: 'shield-checkmark', color: '#3B82F6' },
  { id: 'megenagna', name: 'Megenagna', listings: getCount('Megenagna'), icon: 'bus', color: '#F59E0B' },
  { id: 'sarbet', name: 'Sarbet', listings: getCount('Sarbet'), icon: 'leaf', color: '#10B981' },
  { id: 'piazza', name: 'Piazza', listings: getCount('Piazza'), icon: 'brush', color: '#8B5CF6' },
  { id: 'cmc', name: 'CMC', listings: getCount('CMC'), icon: 'home', color: '#EF4444' },
  { id: 'ayat', name: 'Ayat', listings: getCount('Ayat'), icon: 'business', color: '#EC4899' },
];

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  const filteredLocations = LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
            <View>
                <Text style={styles.welcomeText}>City clusters</Text>
                <Text style={styles.titleText}>Explore Areas.</Text>
            </View>
            <TouchableOpacity 
              style={[styles.searchIconBtn, showSearch && { borderColor: KiraColors.primary, backgroundColor: '#F0FDF4' }]} 
              onPress={() => setShowSearch(!showSearch)}
            >
                <Feather name={showSearch ? "x" : "search"} size={20} color={KiraColors.primary} />
            </TouchableOpacity>
        </View>

        {showSearch && (
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInner}>
              <Feather name="search" size={16} color="#64748B" />
              <TextInput 
                placeholder="Search neighborhood..." 
                style={styles.searchField}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          </View>
        )}

        {/* Featured Section */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Hubs</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)', params: { neighborhood: '' } })}>
              <Text style={styles.viewAll}>View all homes</Text>
            </TouchableOpacity>
        </View>
        
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.featuredScroll}
        >
            {FEATURED.map((item) => (
                <TouchableOpacity 
                    key={item.id} 
                    style={styles.circleHub}
                    onPress={() => router.push({ pathname: '/(tabs)', params: { neighborhood: item.name.replace(' Hub', '') } })}
                >
                    <View style={styles.circleImageContainer}>
                      <Image source={item.image} style={styles.circleImage} />
                      <View style={styles.circleOverlay}>
                         <View style={styles.pulseDotMini} />
                      </View>
                    </View>
                    <Text style={styles.circleName}>{item.name.replace(' Hub', '')}</Text>
                    <Text style={styles.circleStats}>{item.listings}</Text>
                </TouchableOpacity>
            ))}
            {/* Added a few more for better scroll demo */}
            <TouchableOpacity style={styles.circleHub} onPress={() => router.push({ pathname: '/(tabs)', params: { neighborhood: '' } })}>
                <View style={[styles.circleImageContainer, { backgroundColor: '#F3F4F6' }]}>
                    <Ionicons name="add" size={24} color="#CBD5E1" />
                </View>
                <Text style={styles.circleName}>Others</Text>
                <Text style={styles.circleStats}>5k+</Text>
            </TouchableOpacity>
        </ScrollView>

        {/* All Areas Grid */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Neighborhoods</Text>
        </View>

        <View style={styles.grid}>
            {filteredLocations.map((loc) => (
                <TouchableOpacity 
                    key={loc.id} 
                    style={styles.gridCard}
                    onPress={() => router.push({ pathname: '/(tabs)', params: { neighborhood: loc.name } })}
                >
                    <View style={[styles.iconCircle, { backgroundColor: loc.color + '15' }]}>
                        <Ionicons name={loc.icon as any} size={24} color={loc.color} />
                    </View>
                    <View style={styles.gridContent}>
                        <Text style={styles.gridName}>{loc.name}</Text>
                        <Text style={styles.gridStats}>{loc.listings} Listings</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="#CBD5E1" />
                </TouchableOpacity>
            ))}
        </View>

        {/* Promotional Banner */}
        <TouchableOpacity 
          style={styles.promoBanner}
          onPress={() => router.push('/list-property')}
        >
            <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>Can't find your area?</Text>
                <Text style={styles.promoSub}>Request a neighborhood expansion from our fleet team.</Text>
            </View>
            <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>Request</Text>
            </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 100 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  welcomeText: { fontSize: 13, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  titleText: { fontSize: 32, fontWeight: '900', color: '#0F172A', letterSpacing: -1 },
  searchIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  viewAll: { fontSize: 13, fontWeight: '800', color: KiraColors.primary },

  featuredScroll: { paddingLeft: 25, paddingRight: 5, marginBottom: 40 },
  
  featuredStats: { color: KiraColors.primary, fontSize: 13, fontWeight: '800' },

  // Circle Hub Styles
  circleHub: {
    alignItems: 'center',
    marginRight: 25,
  },
  circleImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: KiraColors.primary,
    padding: 3,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  circleOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDotMini: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: KiraColors.primary,
  },
  circleName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  circleStats: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },

  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchField: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  grid: { paddingHorizontal: 25, gap: 12 },
  gridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: { flex: 1, marginLeft: 16 },
  gridName: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  gridStats: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  promoBanner: {
    margin: 25,
    backgroundColor: KiraColors.primary,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoContent: { flex: 1, marginRight: 15 },
  promoTitle: { color: '#FFF', fontSize: 16, fontWeight: '900', marginBottom: 4 },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', lineHeight: 18 },
  promoBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  promoBadgeText: { color: KiraColors.primary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }
});
