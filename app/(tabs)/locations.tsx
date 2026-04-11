import React from 'react';
import {
  StyleSheet, ScrollView, View, Text,
  TouchableOpacity, Dimensions, TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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

import { useUser } from '@/context/UserContext';

function LandlordLeadsView() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<'all' | 'hot' | 'visits'>('all');

  const LEADS = [
    {
      id: '1', name: 'Mekdes Zeleke', initials: 'MZ', color: '#9CC942',
      property: 'Summit Residency', propertyShort: 'Summit', time: '10m ago',
      status: 'Inquiry', trust: 92, verified: true,
      message: 'I\'m interested in the 2-bed. Is the floor negotiable? I can move in next week.',
      aiReply: 'Hi Mekdes, the floor is negotiable. Can we schedule a call at 3pm today?',
    },
    {
      id: '2', name: 'Kalkidan Alemu', initials: 'KA', color: '#0EA5E9',
      property: 'Summit Residency', propertyShort: 'Summit', time: '1h ago',
      status: 'Visit Planned', trust: 88, verified: true,
      message: 'Confirmed my visit for Saturday 10am. Looking forward to it!',
      aiReply: 'See you Saturday at 10am, Kalkidan. I\'ll send you the gate code.',
    },
    {
      id: '3', name: 'Yared Tadesse', initials: 'YT', color: '#F59E0B',
      property: 'Garden Villa', propertyShort: 'Garden', time: 'Yesterday',
      status: 'Inquiry', trust: 75, verified: false,
      message: 'Does the villa have parking for 2 cars? I have a family of four.',
      aiReply: 'Hi Yared, yes — the villa has a private compound for 2 vehicles.',
    },
    {
      id: '4', name: 'Hiwot Bekele', initials: 'HB', color: '#8B5CF6',
      property: 'Kazanchis Studio', propertyShort: 'Kazanchis', time: '2d ago',
      status: 'New', trust: 68, verified: false,
      message: 'Can I get a discount for 6-month advanced payment?',
      aiReply: 'Hi Hiwot! For 6-month advance, I can offer a 5% reduction.',
    },
  ];

  const filtered = activeTab === 'hot'
    ? LEADS.filter(l => l.trust >= 85)
    : activeTab === 'visits'
    ? LEADS.filter(l => l.status === 'Visit Planned')
    : LEADS;

  const statusConfig: Record<string, { bg: string; color: string; icon: string }> = {
    'Visit Planned': { bg: '#F4F9EB', color: '#9CC942',  icon: 'calendar' },
    'Inquiry':       { bg: '#EFF6FF', color: '#0EA5E9',  icon: 'message-circle' },
    'New':           { bg: '#F5F3FF', color: '#8B5CF6',  icon: 'user-plus' },
    'Hot':           { bg: '#FEF3C7', color: '#D97706',  icon: 'zap' },
  };

  const trustColor = (t: number) => t >= 85 ? '#9CC942' : t >= 70 ? '#F59E0B' : '#EF4444';
  const trustLabel = (t: number) => t >= 85 ? 'High Trust' : t >= 70 ? 'Medium' : 'Low';

  return (
    <View style={ll.root}>

      {/* ── Professional White Header ───────────────────────────────────── */}
      <View style={[ll.profHeader, { paddingTop: insets.top + 16 }]}>
        <View style={ll.profHeaderTop}>
          <View>
            <View style={ll.profLiveRow}>
              <View style={ll.profLiveDot} />
              <Text style={ll.profLiveText}>REAL-TIME ACTIVITY</Text>
            </View>
            <Text style={ll.profTitle}>Leads Pipeline.</Text>
          </View>
          <TouchableOpacity style={ll.profBellBtn} onPress={() => router.push('/(tabs)/alerts')}>
            <Feather name="bell" size={20} color="#1A1A1A" />
            <View style={ll.profBellDot} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={ll.profStatsRow}>
          {[
            { val: '12', lab: 'ACTIVE',   color: '#0EA5E9', bg: '#F0F9FF' },
            { val: '3',  lab: 'URGENT',   color: '#F59E0B', bg: '#FFFBEB' },
            { val: '4.8',lab: 'MATCH',    color: '#9CC942', bg: '#F4F9EB' },
            { val: '88%',lab: 'TRUST',    color: '#8B5CF6', bg: '#F5F3FF' },
          ].map((s, i) => (
            <View key={i} style={[ll.profStatBox, { backgroundColor: s.bg }]}>
              <Text style={[ll.profStatVal, { color: s.color }]}>{s.val}</Text>
              <Text style={ll.profStatLab}>{s.lab}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        {/* ── Tab Switcher ──────────────────────────────────────────────── */}
        <View style={ll.tabContainer}>
            <View style={ll.tabRow}>
            {(['all', 'hot', 'visits'] as const).map(tab => (
                <TouchableOpacity
                key={tab}
                style={[ll.tab, activeTab === tab && ll.tabActive]}
                onPress={() => setActiveTab(tab)}
                >
                <Text style={[ll.tabText, activeTab === tab && ll.tabTextActive]}>
                    {tab === 'all' ? 'All Activity' : tab === 'hot' ? '🔥 Hot Leads' : '📅 Visits'}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {filtered.map((lead) => {
            const sc = statusConfig[lead.status] ?? { bg: '#F1F5F9', color: '#64748B', icon: 'circle' };
            const tc = trustColor(lead.trust);

            return (
              <TouchableOpacity key={lead.id} style={ll.card} activeOpacity={0.92} onPress={() => router.push('/chat')}>

                {/* Card Header */}
                <View style={ll.cardHead}>
                  <View style={[ll.avatar, { backgroundColor: lead.color + '15', borderColor: lead.color + '40' }]}>
                    <Text style={[ll.avatarText, { color: lead.color }]}>{lead.initials}</Text>
                  </View>

                  <View style={ll.cardInfo}>
                    <View style={ll.nameRow}>
                      <Text style={ll.name}>{lead.name}</Text>
                      {lead.verified && (
                        <Ionicons name="shield-checkmark" size={14} color="#9CC942" />
                      )}
                    </View>
                    <View style={ll.propRow}>
                      <Text style={ll.property}>{lead.propertyShort}</Text>
                      <Text style={ll.dot}>·</Text>
                      <Text style={ll.time}>{lead.time}</Text>
                    </View>
                  </View>

                  <View style={[ll.statusTag, { backgroundColor: sc.bg }]}>
                    <Text style={[ll.statusText, { color: sc.color }]}>{lead.status}</Text>
                  </View>
                </View>

                {/* Trust Score */}
                <View style={ll.trustRow}>
                  <View style={ll.trustBarWrap}>
                    <View style={ll.trustBar}>
                      <View style={[ll.trustFill, { width: `${lead.trust}%` as any, backgroundColor: tc }]} />
                    </View>
                  </View>
                  <Text style={[ll.trustBadgeText, { color: tc }]}>{lead.trust}% {trustLabel(lead.trust)}</Text>
                </View>

                {/* Message */}
                <View style={ll.messageWrap}>
                  <Text style={ll.message} numberOfLines={2}>"{lead.message}"</Text>
                </View>

                {/* AI Helper */}
                <View style={ll.aiBox}>
                  <View style={ll.aiBoxHeader}>
                    <MaterialCommunityIcons name="robot-outline" size={12} color="#9CC942" />
                    <Text style={ll.aiBoxLabel}>ASSISTED RESPONSE</Text>
                  </View>
                  <Text style={ll.aiBoxText}>{lead.aiReply}</Text>
                  <View style={ll.aiActions}>
                    <TouchableOpacity style={ll.aiSend}>
                      <Feather name="send" size={12} color="#FFF" />
                      <Text style={ll.aiSendText}>Send</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={ll.aiEdit}>
                        <Text style={ll.aiEditText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </TouchableOpacity>
            );
          })}

          {/* Messenger CTA */}
          <TouchableOpacity style={ll.messengerBtn} onPress={() => router.push('/(tabs)/alerts')}>
            <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            <Feather name="message-circle" size={20} color="#9CC942" />
            <Text style={ll.messengerBtnText}>Open Full Messenger</Text>
            <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function LocationsScreen() {
  const insets = useSafeAreaInsets();
  const { role } = useUser();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);

  if (role === 'landlord') {
    return <LandlordLeadsView />;
  }

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
  promoBadgeText: { color: KiraColors.primary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginBottom: 8, marginTop: 20 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
});

const ll = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F8FAFC' },

    // ── Professional White Header
    profHeader: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    profHeaderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    profLiveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    profLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9CC942' },
    profLiveText: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
    profTitle: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
    profBellBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
    profBellDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' },

    profStatsRow: { flexDirection: 'row', gap: 10 },
    profStatBox: { flex: 1, padding: 12, borderRadius: 16, alignItems: 'center' },
    profStatVal: { fontSize: 18, fontWeight: '900' },
    profStatLab: { fontSize: 9, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

    // ── Tab Switcher
    tabContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
    tabRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 4, gap: 2 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    tabActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    tabText: { fontSize: 12, fontWeight: '700', color: '#94A3B8' },
    tabTextActive: { color: '#1A1A1A', fontWeight: '900' },

    // ── Lead Cards
    card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
    cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 14, borderWidth: 1.5, flexShrink: 0 },
    avatarText: { fontSize: 16, fontWeight: '900' },
    cardInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
    name: { fontSize: 15, fontWeight: '900', color: '#1A1A1A' },
    propRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    property: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
    dot: { fontSize: 11, color: '#CBD5E1' },
    time: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 9, fontWeight: '800' },

    // Trust Score
    trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    trustBarWrap: { flex: 1 },
    trustBar: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2 },
    trustFill: { height: 4, borderRadius: 2 },
    trustBadgeText: { fontSize: 11, fontWeight: '800' },

    // Message
    messageWrap: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, marginBottom: 16 },
    message: { fontSize: 13, color: '#475569', lineHeight: 20, fontStyle: 'italic' },

    // AI Helper
    aiBox: { backgroundColor: '#F4F9EB', borderRadius: 14, padding: 14, borderLeftWidth: 3, borderLeftColor: '#9CC942' },
    aiBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    aiBoxLabel: { fontSize: 10, fontWeight: '900', color: '#9CC942', letterSpacing: 0.5 },
    aiBoxText: { fontSize: 12, color: '#374151', lineHeight: 18, marginBottom: 12 },
    aiActions: { flexDirection: 'row', gap: 8 },
    aiSend: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
    aiSendText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
    aiEdit: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    aiEditText: { fontSize: 11, fontWeight: '700', color: '#64748B' },

    // Messenger CTA
    messengerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 20, paddingVertical: 18, overflow: 'hidden', marginTop: 8 },
    messengerBtnText: { fontSize: 14, fontWeight: '900', color: '#FFF', flex: 1, marginLeft: 4 },

    // Safety (some properties kept if needed by logic)
    body: { padding: 20 },
    header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
});
