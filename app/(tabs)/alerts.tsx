import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Feather, Ionicons, MaterialIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { KiraColors } from '@/constants/colors';
import { useAlerts, Notification } from '@/context/AlertsContext';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Alert preferences ─────────────────────────────────────────────────────────
const RENTER_PREFS = {
  hotListings: true,
  priceMatch: true,
  priceDrop: true,
  locationMatch: true,
  smsAlerts: false,
  pushAlerts: true,
};

const LANDLORD_PREFS = {
  newInquiries: true,
  visitReminders: true,
  marketTrends: true,
  boostExpiries: true,
  smsAlerts: false,
  pushAlerts: true,
};

export default function AlertsScreen() {
  const { notifications, unreadCount, markAllRead, removeNotification, markAsRead } = useAlerts();
  const { role } = useUser();
  const isLandlord = role === 'landlord';
  const [prefs, setPrefs] = useState(isLandlord ? LANDLORD_PREFS : RENTER_PREFS);
  const [showPrefs, setShowPrefs] = useState(false);

  const toggle = (key: string) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter notifications based on role
  const landlordTypes = ['inquiry', 'visit_scheduled', 'market_intel', 'boost_expiry', 'system'];
  const filteredNotifs = notifications.filter(n => 
    isLandlord ? landlordTypes.includes(n.type) : !landlordTypes.filter(t => t !== 'system').includes(n.type)
  );

  const roleUnreadCount = filteredNotifs.filter(n => n.unread).length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{isLandlord ? 'Business Center' : 'Smart Alerts'}</Text>
            {roleUnreadCount > 0 && (
              <Text style={styles.headerSub}>{roleUnreadCount} unread alerts</Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.prefBtn, showPrefs && styles.prefBtnActive]}
            onPress={() => setShowPrefs(p => !p)}
          >
            <Feather name="sliders" size={18} color={showPrefs ? '#FFF' : '#1A1A1A'} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Role-Based Premium Card ─────────────────────────────────────── */}
          <View style={[styles.premiumCard, isLandlord && styles.landlordCard]}>
            <LinearGradient
               colors={isLandlord ? ['#1A1A1A', '#2D2D2D'] : [KiraColors.primary, '#82B136']}
               style={StyleSheet.absoluteFill}
               start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <View style={styles.premiumRow}>
              <MaterialIcons name={isLandlord ? "business-center" : "auto-awesome"} size={20} color={isLandlord ? '#9CC942' : KiraColors.accent} />
              <Text style={styles.premiumTitle}>{isLandlord ? 'Business Insights' : 'SMS & Push Alerts'}</Text>
              <View style={styles.liveChip}>
                <View style={[styles.liveDot, { backgroundColor: isLandlord ? '#9CC942' : '#FFF' }]} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <Text style={styles.premiumSub}>
              {isLandlord 
                 ? "Get instant alerts for new inquiries and property performance so you never miss a potential tenant."
                 : "Get notified within seconds when a new listing matches your saved searches."}
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
                  trackColor={{ false: 'rgba(255,255,255,0.3)', true: isLandlord ? '#9CC942' : KiraColors.accent }}
                  thumbColor="#FFF"
                />
              </View>
            </View>
          </View>

          {/* ── Alert Type Preferences ──────────────────────────────────────── */}
          {showPrefs && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.prefsCard}>
              <Text style={styles.prefsTitle}>{isLandlord ? 'Business Preferences' : 'Alert Preferences'}</Text>
              <Text style={styles.prefsSub}>Choose what insights you want to receive</Text>

              {(isLandlord ? [
                { key: 'newInquiries', label: '💬 New Daily Inquiries', desc: 'Alerts when potential tenants message' },
                { key: 'visitReminders', label: '📅 Visit Confirmations', desc: 'When visits are booked or rescheduled' },
                { key: 'marketTrends', label: '📈 Local Market Trends', desc: 'AI insights into pricing and demand' },
                { key: 'boostExpiries', label: '⚡ Listing Boost Expiry', desc: 'Alerts before your premium boost ends' },
              ] : [
                { key: 'hotListings', label: '🔥 Hot Listing Alerts', desc: 'New listings that match your search' },
                { key: 'priceMatch', label: '✅ Price Match Alerts', desc: 'Listings within your set budget' },
                { key: 'priceDrop', label: '📉 Price Drop Alerts', desc: 'When a saved listing lowers its price' },
                { key: 'locationMatch', label: '📍 Location Alerts', desc: 'New listings in your saved areas' },
              ]).map(pref => (
                <View key={pref.key} style={styles.prefRow}>
                  <View style={styles.prefLeft}>
                    <Text style={styles.prefLabel}>{pref.label}</Text>
                    <Text style={styles.prefDesc}>{pref.desc}</Text>
                  </View>
                  <Switch
                    value={(prefs as any)[pref.key]}
                    onValueChange={() => toggle(pref.key)}
                    trackColor={{ false: '#E5E7EB', true: isLandlord ? '#DCFCE7' : '#D1FAE5' }}
                    thumbColor={(prefs as any)[pref.key] ? (isLandlord ? '#9CC942' : KiraColors.primary) : KiraColors.muted}
                  />
                </View>
              ))}
            </Animated.View>
          )}

          {/* ── Section Header ──────────────────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>RECENT ALERTS</Text>
            {roleUnreadCount > 0 && (
              <TouchableOpacity onPress={markAllRead}>
                <Text style={styles.markRead}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Notification Cards with Swipe-to-Dismiss ───────────────────── */}
          {filteredNotifs.map(notif => (
            <Swipeable
              key={notif.id}
              renderRightActions={() => (
                <TouchableOpacity 
                   onPress={() => removeNotification(notif.id)}
                   style={styles.deleteAction}
                >
                  <Feather name="trash-2" size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            >
              <NotifCard
                notif={notif}
                onAction={() => {
                  markAsRead(notif.id);
                  if (isLandlord && notif.type === 'inquiry') {
                    router.push('/chat');
                  } else if (isLandlord && notif.type === 'visit_scheduled') {
                    router.push('/(tabs)/locations');
                  } else if (notif.propertyId) {
                    router.push({ pathname: '/property-details', params: { id: notif.propertyId } });
                  } else if (notif.type === 'roommate') {
                    router.push('/roommate-match');
                  }
                }}
              />
            </Swipeable>
          ))}

          {/* ── Caught Up ───────────────────────────────────────────────────── */}
          {filteredNotifs.length === 0 && (
            <View style={styles.caughtUp}>
              <MaterialIcons name="notifications-none" size={36} color="#D1D5DB" />
              <Text style={styles.caughtUpText}>You're all caught up!</Text>
              <Text style={styles.caughtUpSub}>New alerts appear here instantly.</Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────
function NotifCard({ notif, onAction }: { notif: Notification; onAction: () => void }) {
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
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onAction}
      style={[styles.notifCard, { backgroundColor: c.bg, borderColor: c.border }, notif.unread && styles.notifUnread]}
    >
      {notif.unread && <View style={styles.unreadDot} />}

      {/* Icon */}
      <View style={{...styles.notifIconBox, backgroundColor: c.border}}>
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

        {'dropAmount' in notif && notif.dropAmount && (
          <View style={styles.savingsBadge}>
            <Feather name="arrow-down" size={11} color={KiraColors.success} />
            <Text style={styles.savingsText}>Save {notif.dropAmount}</Text>
          </View>
        )}

        {notif.action && (
          <View style={styles.notifAction}>
            <Text style={styles.notifActionText}>{notif.action}</Text>
            <Feather name="arrow-right" size={12} color={KiraColors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
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
  headerSub: { fontSize: 11, color: KiraColors.danger, fontWeight: '700', marginTop: 1 },
  prefBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  prefBtnActive: { backgroundColor: KiraColors.primary },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },
  premiumCard: {
    backgroundColor: KiraColors.primary, borderRadius: 24, padding: 20, marginBottom: 20,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
    overflow: 'hidden', position: 'relative',
  },
  landlordCard: { backgroundColor: '#1A1A1A' },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  premiumTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', flex: 1 },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  liveText: { fontSize: 9, fontWeight: '800', color: '#FFF', letterSpacing: 1 },
  premiumSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  premiumToggles: { gap: 10 },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleLabel: { fontSize: 13, fontWeight: '700', color: '#FFF' },
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
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 1.2 },
  markRead: { fontSize: 12, fontWeight: '700', color: KiraColors.primary },
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
    width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: KiraColors.primary,
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
  savingsText: { fontSize: 11, fontWeight: '800', color: KiraColors.success },
  notifAction: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  notifActionText: { fontSize: 12, fontWeight: '800', color: KiraColors.primary },
  caughtUp: { alignItems: 'center', paddingVertical: 32 },
  caughtUpText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },
  caughtUpSub: { fontSize: 12, color: '#D1D5DB', marginTop: 4 },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '84%',
    borderRadius: 18,
    marginBottom: 12,
  },
});
