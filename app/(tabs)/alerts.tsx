import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons, MaterialIcons, FontAwesome5, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => router.push('/menu')}>
            <Feather name="menu" size={24} color="#005C3A" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.logoText}>Kira-Net</Text>
          </View>
          <TouchableOpacity style={styles.userIconWrap} onPress={() => router.push('/profile')}>
            <Feather name="user" size={16} color="#005C3A" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SMS Alerts Premium Card */}
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <MaterialIcons name="auto-awesome" size={20} color="#FBC02D" />
              <Text style={styles.premiumTitle}>SMS Alerts (Premium)</Text>
            </View>
            <Text style={styles.premiumSubtitle}>
              Never miss a deal. Get instant SMS alerts for new listings that match your preferences.
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Updates Header */}
          <View style={styles.updatesHeader}>
            <Text style={styles.updatesTitle}>RECENT UPDATES</Text>
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.markReadText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          {/* Notification Card 1 */}
          <View style={[styles.notificationCard, styles.notificationUnread]}>
            <View style={styles.unreadIndicator} />
            
            <View style={styles.iconBoxHouse}>
              <FontAwesome5 name="home" size={24} color="#FFF" />
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>+</Text>
              </View>
            </View>
            
            <View style={styles.notificationContent}>
              <View style={styles.notificationTitleRow}>
                <Text style={styles.notificationTitleUnread}>New House Match</Text>
                <View style={styles.timePill}>
                  <Text style={styles.timeText}>2m ago</Text>
                </View>
              </View>
              <Text style={styles.notificationDesc}>
                A Studio in Bole matches your criteria.
              </Text>
              <TouchableOpacity>
                <Text style={styles.actionTextProperty}>View Property</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification Card 2 */}
          <View style={styles.notificationCard}>
            <View style={styles.iconBoxPrice}>
              <Feather name="trending-down" size={24} color="#92400E" />
            </View>
            
            <View style={styles.notificationContent}>
              <View style={styles.notificationTitleRow}>
                <Text style={styles.notificationTitle}>Price Drop</Text>
                <Text style={styles.timeTextPlain}>4h ago</Text>
              </View>
              <Text style={styles.notificationDesc}>
                The 2-Bedroom in Arada is now 15% cheaper!
              </Text>
              <View style={styles.hotDealPill}>
                <Text style={styles.hotDealText}>HOT DEAL</Text>
              </View>
            </View>
          </View>

          {/* Notification Card 3 */}
          <View style={styles.notificationCard}>
            <View style={styles.iconBoxSystem}>
              <Octicons name="shield-check" size={24} color="#6B7280" />
            </View>
            
            <View style={styles.notificationContent}>
              <View style={styles.notificationTitleRow}>
                <Text style={styles.notificationTitle}>System Update</Text>
                <Text style={styles.timeTextPlain}>Yesterday</Text>
              </View>
              <Text style={styles.notificationDesc}>
                Your profile has been successfully verified.
              </Text>
            </View>
          </View>

          {/* Caught Up */}
          <View style={styles.caughtUpView}>
            <MaterialIcons name="notifications-off" size={48} color="#9CA3AF" />
            <Text style={styles.caughtUpText}>You're all caught up for today.</Text>
          </View>
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#005C3A',
    marginRight: 6,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#005C3A',
    letterSpacing: -0.5,
  },
  userIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  premiumCard: {
    backgroundColor: '#005C3A',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#005C3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 8,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    backgroundColor: '#FBC02D',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#926C15',
  },
  updatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  updatesTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A5568',
    letterSpacing: 1.2,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#005C3A',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  notificationUnread: {
    backgroundColor: '#FFF',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: '30%',
    bottom: '30%',
    width: 4,
    backgroundColor: '#FBC02D',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconBoxHouse: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1C1C28',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#005C3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  iconBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitleUnread: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timePill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#4A5568',
    fontWeight: '600',
  },
  timeTextPlain: {
    fontSize: 10,
    color: '#6B7280',
  },
  notificationDesc: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
    marginBottom: 10,
  },
  actionTextProperty: {
    fontSize: 12,
    fontWeight: '800',
    color: '#005C3A',
  },
  iconBoxPrice: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  hotDealPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hotDealText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#92400E',
  },
  iconBoxSystem: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  caughtUpView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    opacity: 0.6,
  },
  caughtUpText: {
    marginTop: 12,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
