import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userName, setUserName] = useState('Cityzens User');
  const [userEmail, setUserEmail] = useState('user@kiranet.com');

  const menuSections = [
    {
      title: 'Account Settings',
      items: [
        { name: 'Personal Information', icon: 'user', action: () => setIsEditModalVisible(true) },
        { name: 'Payment Methods', icon: 'credit-card', action: () => Alert.alert('Secure Payments', 'You can manage your Telebirr and Credit Card links here in the next update.') },
        { name: 'Notification Preferences', icon: 'bell', action: () => Alert.alert('Notifications', 'Push notifications for new listings are currently active.') },
      ]
    },
    {
      title: 'Hosting & Landlord',
      items: [
        { name: 'My Properties', icon: 'home', action: () => router.push('/landlord-dashboard') },
        { name: 'Payment History', icon: 'pie-chart', action: () => Alert.alert('History', 'No payment history yet.') },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { name: 'Help Center', icon: 'help-circle', action: () => Alert.alert('Support', 'Contacting support @ support@kiranet.com') },
        { name: 'Safety Center', icon: 'shield', action: () => Alert.alert('Safety', 'Safety guidelines and verification processes.') },
        { name: 'Terms of Service', icon: 'file-text', action: () => Alert.alert('Legal', 'Kira-Net Terms and Conditions.') },
      ]
    },
    {
      title: 'Community',
      items: [
        { name: '🤝 Roommate Finder', icon: 'users', action: () => router.push('/roommate-match') },
        { name: '🔔 Smart Alerts', icon: 'bell', action: () => router.push('/(tabs)/alerts') },
        { name: '🧾 Rental Agreement', icon: 'file-text', action: () => router.push('/rental-agreement') },
        { name: '🚛 Moving Services', icon: 'truck', action: () => router.push('/moving-services') },
      ]
    }
  ];

  const handleItemPress = (item: any) => {
    if (item.action) {
      item.action();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>User Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/boost-listing')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Feather name="zap" size={24} color="#F59E0B" />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => router.push('/(tabs)/alerts')}
            style={styles.bellWrap}
          >
            <Feather name="bell" size={24} color="#005C3A" />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Feather name="user" size={32} color="#005C3A" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {menuSections.map((section, idx) => (
          <View key={idx} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity 
                  key={itemIdx} 
                  style={[styles.menuItem, itemIdx === section.items.length - 1 && styles.menuItemLast]}
                  onPress={() => handleItemPress(item)}
                >
                  <View style={styles.menuIconBox}>
                    <Feather name={item.icon as any} size={18} color="#4A5568" />
                  </View>
                  <Text style={styles.menuItemText}>{item.name}</Text>
                  <Feather name="chevron-right" size={18} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.listPropertyBtn} onPress={() => router.push('/list-property')}>
          <MaterialIcons name="add-business" size={20} color="#FFF" />
          <Text style={styles.listPropertyText}>Post a New Property</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => router.replace('/login')}
        >
          <Feather name="log-out" size={16} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Feather name="x" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput 
                style={styles.textInput} 
                value={userName} 
                onChangeText={setUserName}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput 
                style={styles.textInput} 
                value={userEmail} 
                onChangeText={setUserEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              style={styles.saveBtn} 
              onPress={() => {
                setIsEditModalVisible(false);
                Alert.alert('Success', 'Profile updated successfully!');
              }}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginLeft: 30, // Offset to center correctly with two icons on right
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellWrap: { position: 'relative' },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#DC2626',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  notifBadgeText: { fontSize: 8, fontWeight: '900', color: '#FFF' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 60,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listPropertyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005C3A',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#005C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  listPropertyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#005C3A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
