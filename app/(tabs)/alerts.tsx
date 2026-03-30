import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Feather, Ionicons, MaterialIcons, FontAwesome5,
  Octicons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';

// ─── Mock notification data ────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: '1', type: 'hot_listing', unread: true,
    title: '🔥 Hot Listing Alert',
    desc: 'A Studio in Bole just listed for 18,500 ETB — matches your saved search.',
    time: '2m ago', action: 'View Listing', propertyId: '3',
  },
  {
    id: '2', type: 'price_match', unread: true,
    title: '✅ Price Match Found',
    desc: 'New 2BR in Kazanchis at 22,000 ETB — within your 25,000 ETB budget.',
    time: '14m ago', action: 'View Listing', propertyId: '1',
  },
  {
    id: '3', type: 'price_drop', unread: false,
    title: '📉 Price Drop Alert',
    desc: 'The Summit Residency dropped from 28,000 → 25,000 ETB. That\'s 11% off!',
    time: '2h ago', action: 'See Deal', propertyId: '1',
    dropAmount: '3,000 ETB',
  },
  {
    id: '4', type: 'location_match', unread: false,
    title: '📍 New Listing in Bole',
    desc: '3 new properties added in your saved location: Bole, Addis Ababa.',
    time: '4h ago', action: 'Browse Area',
  },
  {
    id: '5', type: 'price_drop', unread: false,
    title: '📉 Price Drop Alert',
    desc: 'Modern Garden Villa dropped from 55,000 → 45,000 ETB. Act fast!',
    time: 'Yesterday', action: 'See Deal', propertyId: '2',
    dropAmount: '10,000 ETB',
  },
  {
    id: '6', type: 'system', unread: false,
    title: '🛡️ Verification Complete',
    desc: 'Your Kira-Net profile has been successfully verified. You now show the ✓ badge.',
    time: '2 days ago',
  },
  {
    id: '7', type: 'roommate', unread: false,
    title: '🤝 Roommate Request',
    desc: 'Tigist B. wants to connect — budget 12,000 ETB, Bole area, student.',
    time: '3 days ago', action: 'View Profile',
  },
];

// ─── Alert preferences ─────────────────────────────────────────────────────────
const DEFAULT_PREFS = {
  hotListings: true,
  priceMatch: true,
  priceDrop: true,
  locationMatch: true,
  smsAlerts: false,
  pushAlerts: true,
};

type NotifType = typeof NOTIFICATIONS[number];

export default function AlertsScreen() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showPrefs, setShowPrefs] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggle = (key: keyof typeof DEFAULT_PREFS) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/(tabs)')}
        >
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Smart Alerts</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} unread</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.prefBtn, showPrefs && styles.prefBtnActive]}
          onPress={() => setShowPrefs(p => !p)}
        >
          <Feather name="settings" size={18} color={showPrefs ? '#FFF' : '#1A1A1A'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── SMS + Push Premium Card ─────────────────────────────────────── */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumRow}>
            <MaterialIcons name="auto-awesome" size={20} color="#FBC02D" />
            <Text style={styles.premiumTitle}>SMS & Push Alerts</Text>
            <View style={styles.liveChip}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.premiumSub}>
            Get notified within seconds when a new listing matches your saved searches — via push notification or SMS.
          </Text>
          <View style={styles.premiumToggles}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <Feather name="bell" size={15} color="rgba(255,255,255,0.9)" />
                <Text style={styles.toggleLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={prefs.pushAlerts}
                onValueChange={() => toggle('pushAlerts')}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#FBC02D' }}
                thumbColor="#FFF"
              />
            </View>
            <View style={styles.toggleRow}>
              <View style={styles.toggleLeft}>
                <MaterialCommunityIcons name="message-text" size={15} color="rgba(255,255,255,0.9)" />
                <Text style={styles.toggleLabel}>SMS Alerts (Premium)</Text>
              </View>
              <Switch
                value={prefs.smsAlerts}
                onValueChange={() => {
                  if (!prefs.smsAlerts) {
                    Alert.alert(
                      '🔒 Upgrade Required',
                      'SMS Alerts are a Premium feature. Upgrade to receive instant SMS when your dream listing drops.',
                      [
                        { text: 'Later', style: 'cancel' },
                        { text: 'Upgrade Now', style: 'default', onPress: () => router.push('/boost-listing') },
                      ]
                    );
                  } else {
                    toggle('smsAlerts');
                  }
                }}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#FBC02D' }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        {/* ── Alert Type Preferences ──────────────────────────────────────── */}
        {showPrefs && (
          <View style={styles.prefsCard}>
            <Text style={styles.prefsTitle}>Alert Preferences</Text>
            <Text style={styles.prefsSub}>Choose what alerts you want to receive</Text>

            {[
              { key: 'hotListings', icon: 'fire', label: '🔥 Hot Listing Alerts', desc: 'New listings that match your search, instantly', color: '#DC2626' },
              { key: 'priceMatch', icon: 'check-circle', label: '✅ Price Match Alerts', desc: 'Listings within your set budget', color: '#16A34A' },
              { key: 'priceDrop', icon: 'trending-down', label: '📉 Price Drop Alerts', desc: 'When a saved listing lowers its price', color: '#F59E0B' },
              { key: 'locationMatch', icon: 'map-pin', label: '📍 Location Alerts', desc: 'New listings in your saved areas', color: '#3B82F6' },
            ].map(pref => (
              <View key={pref.key} style={styles.prefRow}>
                <View style={styles.prefLeft}>
                  <Text style={styles.prefLabel}>{pref.label}</Text>
                  <Text style={styles.prefDesc}>{pref.desc}</Text>
                </View>
                <Switch
                  value={prefs[pref.key as keyof typeof DEFAULT_PREFS]}
                  onValueChange={() => toggle(pref.key as keyof typeof DEFAULT_PREFS)}
                  trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                  thumbColor={prefs[pref.key as keyof typeof DEFAULT_PREFS] ? '#005C3A' : '#9CA3AF'}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>RECENT ALERTS</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markRead}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Notification Cards ──────────────────────────────────────────── */}
        {notifications.map(notif => (
          <NotifCard
            key={notif.id}
            notif={notif}
            onAction={() => {
              if (notif.propertyId) {
                router.push({ pathname: '/property-details', params: { id: notif.propertyId } });
              } else if (notif.type === 'roommate') {
                router.push('/roommate-match');
              }
            }}
          />
        ))}

        {/* ── Caught Up ───────────────────────────────────────────────────── */}
        <View style={styles.caughtUp}>
          <MaterialIcons name="notifications-none" size={36} color="#D1D5DB" />
          <Text style={styles.caughtUpText}>You're all caught up!</Text>
          <Text style={styles.caughtUpSub}>New alerts appear here instantly.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────
function NotifCard({ notif, onAction }: { notif: NotifType; onAction: () => void }) {
  const config: Record<string, { bg: string; border: string; icon: any; iconLib: string }> = {
    hot_listing:    { bg: '#FFF5F5', border: '#FCA5A5', icon: 'local-fire-department', iconLib: 'material' },
    price_match:    { bg: '#F0FDF4', border: '#86EFAC', icon: 'check-circle',           iconLib: 'material' },
    price_drop:     { bg: '#FFFBEB', border: '#FDBA74', icon: 'trending-down',          iconLib: 'material' },
    location_match: { bg: '#EFF6FF', border: '#93C5FD', icon: 'location-on',            iconLib: 'material' },
    system:         { bg: '#F9FAFB', border: '#E5E7EB', icon: 'shield-checkmark',       iconLib: 'ionicons' },
    roommate:       { bg: '#FDF4FF', border: '#E879F9', icon: 'people',                  iconLib: 'ionicons' },
  };

  const c = config[notif.type] ?? config.system;

  return (
    <View style={[styles.notifCard, { backgroundColor: c.bg, borderColor: c.border }, notif.unread && styles.notifUnread]}>
      {notif.unread && <View style={styles.unreadDot} />}

      {/* Icon */}
      <View style={[styles.notifIconBox, { backgroundColor: c.border }]}>
        {c.iconLib === 'material'
          ? <MaterialIcons name={c.icon} size={22} color="#1A1A1A" />
          : <Ionicons name={c.icon} size={22} color="#1A1A1A" />
        }
      </View>

      {/* Content */}
      <View style={styles.notifContent}>
        <View style={styles.notifTitleRow}>
          <Text style={[styles.notifTitle, notif.unread && styles.notifTitleBold]} numberOfLines={1}>
            {notif.title}
          </Text>
          <Text style={styles.notifTime}>{notif.time}</Text>
        </View>
        <Text style={styles.notifDesc}>{notif.desc}</Text>

        {/* Price drop savings badge */}
        {'dropAmount' in notif && notif.dropAmount && (
          <View style={styles.savingsBadge}>
            <Feather name="arrow-down" size={11} color="#16A34A" />
            <Text style={styles.savingsText}>Save {notif.dropAmount}</Text>
          </View>
        )}

        {/* CTA */}
        {notif.action && (
          <TouchableOpacity style={styles.notifAction} onPress={onAction}>
            <Text style={styles.notifActionText}>{notif.action}</Text>
            <Feather name="arrow-right" size={12} color="#005C3A" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FAFBFB',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#DC2626', fontWeight: '700', marginTop: 1 },
  prefBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  prefBtnActive: { backgroundColor: '#005C3A' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Premium Card
  premiumCard: {
    backgroundColor: '#005C3A', borderRadius: 24, padding: 20, marginBottom: 20,
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  premiumTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', flex: 1 },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  liveText: { fontSize: 9, fontWeight: '800', color: '#4ADE80', letterSpacing: 1 },
  premiumSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  premiumToggles: { gap: 10 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleLabel: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Prefs Card
  prefsCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  prefsTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  prefsSub: { fontSize: 12, color: '#6B7280', marginBottom: 16 },
  prefRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  prefLeft: { flex: 1, marginRight: 12 },
  prefLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  prefDesc: { fontSize: 11, color: '#6B7280' },

  // Section header
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 1.2 },
  markRead: { fontSize: 12, fontWeight: '700', color: '#005C3A' },

  // Notif Card
  notifCard: {
    flexDirection: 'row', borderRadius: 18, padding: 14, marginBottom: 12,
    borderWidth: 1, position: 'relative', overflow: 'hidden',
  },
  notifUnread: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  unreadDot: {
    position: 'absolute', left: 0, top: '25%', bottom: '25%',
    width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: '#005C3A',
  },
  notifIconBox: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', flex: 1, marginRight: 8 },
  notifTitleBold: { fontWeight: '800' },
  notifTime: { fontSize: 10, color: '#9CA3AF', fontWeight: '500' },
  notifDesc: { fontSize: 12, color: '#4A5568', lineHeight: 18, marginBottom: 8 },

  savingsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8,
  },
  savingsText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },

  notifAction: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  notifActionText: { fontSize: 12, fontWeight: '800', color: '#005C3A' },

  // Caught up
  caughtUp: { alignItems: 'center', paddingVertical: 32 },
  caughtUpText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },
  caughtUpSub: { fontSize: 12, color: '#D1D5DB', marginTop: 4 },
});
