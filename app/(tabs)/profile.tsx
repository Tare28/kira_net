import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { KiraColors } from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';
import { useUser } from '@/context/UserContext';

export default function ProfileScreen() {
  const { unreadCount } = useAlerts();
  const { role, logout } = useUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userName, setUserName] = useState('Cityzens User');
  const [userEmail, setUserEmail] = useState('user@kiranet.com');
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const img = await AsyncStorage.getItem('@user_image');
      const name = await AsyncStorage.getItem('@user_name');
      const email = await AsyncStorage.getItem('@user_email');
      if (img) setUserImage(img);
      if (name) setUserName(name);
      if (email) setUserEmail(email);
    } catch (e) {
      console.warn('AsyncStorage not available', e);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUserImage(uri);
      try {
        await AsyncStorage.setItem('@user_image', uri);
      } catch (e) {}
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('@user_name', userName);
      await AsyncStorage.setItem('@user_email', userEmail);
    } catch (e) {}
    setIsEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const menuSections = [
    ...(role === 'landlord' || role === 'agent' ? [{
      title: 'Account Settings',
      items: [
        { name: 'Payment Methods', icon: 'credit-card', action: () => Alert.alert('Secure Payments', 'You can manage your Telebirr and Credit Card links here in the next update.') },
        { name: 'Notification Preferences', icon: 'bell', action: () => Alert.alert('Notifications', 'Push notifications for new listings are currently active.') },
      ]
    }] : []),
    ...(role === 'agent' || role === 'landlord' ? [{
      title: 'Field Operations',
      items: [
        { name: 'Agent Terminal', icon: 'briefcase', action: () => router.push('/agent-dashboard') },
      ]
    }] : []),
    ...(role === 'landlord' ? [{
      title: 'Hosting & Landlord',
      items: [
        { name: 'My Properties', icon: 'home', action: () => router.push('/landlord-dashboard') },
        { name: 'Payment History', icon: 'pie-chart', action: () => Alert.alert('History', 'No payment history yet.') },
      ]
    }] : []),
    {
      title: 'Support & Legal',
      items: [
        { name: 'Help Center', icon: 'help-circle', action: () => router.push('/modal?type=help') },
        { name: 'Safety Center', icon: 'shield', action: () => router.push('/modal?type=safety') },
        { name: 'Terms of Service', icon: 'file-text', action: () => router.push('/modal?type=terms') },
      ]
    },
    {
      title: 'Community',
      items: [
        ...(role === 'tenant' ? [
          { name: '🤝 Roommate Finder', icon: 'users', action: () => router.push('/roommate-match') },
        ] : []),
        { name: '🧾 Rental Agreement', icon: 'file-text', action: () => router.push('/rental-agreement') },
        { name: '🚛 Moving Services', icon: 'truck', action: () => router.push('/moving-services') },
      ]
    }
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/login');
      }}
    ]);
  };

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
          {(role === 'landlord' || role === 'agent') && (
            <TouchableOpacity onPress={() => router.push('/boost-listing')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Feather name="zap" size={24} color={KiraColors.warning} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => router.push('/(tabs)/alerts')}
            style={styles.bellWrap}
          >
            <Feather name="bell" size={24} color={KiraColors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.userCard}>
          <TouchableOpacity style={styles.userAvatar} onPress={pickImage}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarInitials}>
                {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            )}
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={10} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
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

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color={KiraColors.danger} />
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
              onPress={saveProfile}
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
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  bellWrap: {
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: KiraColors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  notifBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  scrollContent: {
    paddingBottom: 120, // Increased to avoid footer tab overlap
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: KiraColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1A1A1A',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  sectionContainer: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: KiraColors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  saveBtn: {
    backgroundColor: KiraColors.primary,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
});
