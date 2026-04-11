import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { KiraColors } from '@/constants/colors';
import { useAlerts } from '@/context/AlertsContext';
import { useUser } from '@/context/UserContext';

export default function ProfileScreen() {
  const { unreadCount } = useAlerts();
  const { role, logout } = useUser();
  const { t } = useTranslation();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.landlord@kiranet.com');
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    if (role) {
      loadProfile();
    }
  }, [role]);

  const loadProfile = async () => {
    if (!role) return;
    try {
      const img = await AsyncStorage.getItem(`@user_image_${role}`);
      const name = await AsyncStorage.getItem(`@user_name_${role}`);
      const email = await AsyncStorage.getItem(`@user_email_${role}`);
      
      if (img) setUserImage(img);
      if (name) setUserName(name);
      if (email) setUserEmail(email);
      else if (role === 'tenant') setUserEmail('john.renter@kiranet.com');
    } catch (e) {
      console.warn('AsyncStorage not available', e);
    }
  };

  const pickImage = async () => {
    if (!role) return;
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
        await AsyncStorage.setItem(`@user_image_${role}`, uri);
      } catch (e) {}
    }
  };

  const saveProfile = async () => {
    if (!role) return;
    try {
      await AsyncStorage.setItem(`@user_name_${role}`, userName);
      await AsyncStorage.setItem(`@user_email_${role}`, userEmail);
    } catch (e) {}
    setIsEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
          await logout();
          router.replace('/login');
      }}
    ]);
  };

  // ─── LANDLORD PROFILE VIEW ──────────────────────────────────────────────────
  const LandlordProfile = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <View style={styles.landlordHero}>
        <View style={styles.landlordHeroRow}>
          <TouchableOpacity style={styles.avatarBig} onPress={pickImage}>
            {userImage
              ? <Image source={{ uri: userImage }} style={styles.avatarImgBig} />
              : <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{userName[0]}</Text></View>}
            <View style={styles.editBadge}><Feather name="camera" size={12} color="#FFF" /></View>
          </TouchableOpacity>
          <View style={styles.landlordHeroInfo}>
            <Text style={styles.landlordName}>{userName}</Text>
            <View style={styles.roleBadge}>
              <MaterialIcons name="verified-user" size={12} color={KiraColors.primary} />
              <Text style={styles.roleText}>Verified Landlord</Text>
            </View>
            <Text style={styles.landlordEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* KPI Stripe */}
        <View style={styles.kpiStripe}>
          {[
            { val: '8',   lab: 'Properties', onPress: () => router.push('/landlord-dashboard') },
            { val: '42',  lab: 'Total Leads', onPress: undefined },
            { val: '4.8', lab: '★ Rating',    onPress: undefined },
            { val: '67%', lab: 'Occupancy',   onPress: undefined },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.kpiStripeItem} onPress={s.onPress}>
                <Text style={styles.kpiStripeVal}>{s.val}</Text>
                <Text style={styles.kpiStripeLab}>{s.lab}</Text>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.kpiStripeDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── Management ──────────────────────────────────────────────────── */}
      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>Management & Hosting</Text>
        <MenuButton icon="home" label="Manage Listings" sub="Post, edit and update properties" onPress={() => router.push('/landlord-dashboard')} />
        <MenuButton icon="zap" label="Boost Management" sub="Maximize your property visibility" onPress={() => router.push('/boost-listing')} />
        <MenuButton 
          icon="credit-card" 
          label="Invoices & Payouts" 
          sub="History of your platform settlements" 
          onPress={() => router.push({
            pathname: '/upload-payment',
            params: { title: 'Platform Subscription', amount: '850' }
          })} 
        />
      </View>

      {/* ── Operations ──────────────────────────────────────────────────── */}
      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>Operations</Text>
        <MenuButton icon="file-text" label="Rental Agreements" sub="Digital lease management" onPress={() => router.push('/rental-agreement')} />
        <MenuButton icon="shield" label="Safety & Verification" sub="Manage your trust documents" />
        <MenuButton icon="settings" label="Account Settings" sub="Profile, security, and notifications" onPress={() => setIsEditModalVisible(true)} />
      </View>

      {/* ── Logout ──────────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.landlordLogout} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out of Kira-Net</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  // ─── RENTER PROFILE VIEW ────────────────────────────────────────────────────
  const RenterProfile = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.renterHeader}>
         <TouchableOpacity style={styles.renterAvatar} onPress={pickImage}>
            {userImage ? <Image source={{ uri: userImage }} style={styles.avatarImgMedium} /> : <View style={styles.avatarBgSmall}><Text style={styles.avatarTextSmall}>{userName[0]}</Text></View>}
         </TouchableOpacity>
         <View style={styles.renterInfo}>
            <Text style={styles.renterName}>{userName}</Text>
            <Text style={styles.renterEmail}>{userEmail}</Text>
         </View>
         <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditModalVisible(true)}>
            <Feather name="edit-3" size={18} color={KiraColors.primary} />
         </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>My Search</Text>
        <MenuButton icon="heart" label="Saved Properties" sub="Listings you've favorited" onPress={() => router.push('/(tabs)/saved')} />
        <MenuButton icon="map-pin" label="Visit Planner" sub="Your scheduled property viewings" onPress={() => router.push('/visit-planner')} />
        <MenuButton icon="users" label="Roommate Finder" sub="Connect with potential roommates" onPress={() => router.push('/roommate-match')} />
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>Agreements & Services</Text>
        <MenuButton icon="file-text" label="Rental Agreements" sub="View your signed lease papers" onPress={() => router.push('/rental-agreement')} />
        <MenuButton icon="truck" label="Moving Services" sub="Book logistical help for your move" onPress={() => router.push('/moving-services')} />
        <MenuButton icon="help-circle" label="Help Center" sub="Support and safety resources" onPress={() => router.push('/modal?type=help')} />
      </View>

      <TouchableOpacity style={styles.renterLogout} onPress={handleLogout}>
        <Text style={styles.logoutTextSmall}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Account</Text>
        <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/(tabs)/alerts')}>
          <Feather name="bell" size={24} color="#1A1A1A" />
          {unreadCount > 0 && <View style={styles.notifDot} />}
        </TouchableOpacity>
      </View>

      {role === 'landlord' ? <LandlordProfile /> : <RenterProfile />}

      <ProfileEditModal 
        visible={isEditModalVisible} 
        onClose={() => setIsEditModalVisible(false)} 
        onSave={saveProfile}
        name={userName}
        setName={setUserName}
        email={userEmail}
        setEmail={setUserEmail}
      />
    </SafeAreaView>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────
const MenuButton = ({ icon, label, sub, onPress }: any) => (
  <TouchableOpacity style={styles.menuBtn} onPress={onPress}>
    <View style={styles.menuIconWrap}>
      <Feather name={icon} size={18} color="#4A5568" />
    </View>
    <View style={styles.menuTextWrap}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuSub}>{sub}</Text>
    </View>
    <Feather name="chevron-right" size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

const ProfileEditModal = ({ visible, onClose, onSave, name, setName, email, setEmail }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose}><Feather name="x" size={24} color="#1A1A1A" /></TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.textInput} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput style={styles.textInput} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFB' },
  screenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#FFF' },
  screenTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
  notifBtn: { position: 'relative', width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' },
  scrollContent: { paddingBottom: 100 },

  // Landlord Styles
  landlordHero: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  landlordHeroRow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 24 },
  landlordHeroInfo: { flex: 1 },
  avatarBig: { width: 76, height: 76, borderRadius: 38, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatarImgBig: { width: 76, height: 76, borderRadius: 38 },
  avatarPlaceholder: { width: 76, height: 76, borderRadius: 38, backgroundColor: KiraColors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#FFF' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  landlordName: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 },
  landlordEmail: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 4 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  roleText: { fontSize: 10, fontWeight: '800', color: '#16A34A', textTransform: 'uppercase' },

  // KPI Stripe
  kpiStripe: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  kpiStripeItem: { flex: 1, alignItems: 'center' },
  kpiStripeVal: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 3 },
  kpiStripeLab: { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  kpiStripeDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0', alignSelf: 'center' },

  // Legacy (kept for menu rows)
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  statLab: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#F1F5F9' },
  landlordStats: { flexDirection: 'row', padding: 24, marginTop: -20, marginBottom: 8, marginHorizontal: 24, backgroundColor: '#FFF', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },

  menuGroup: { marginTop: 32, paddingHorizontal: 24 },
  groupTitle: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 },
  menuBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  menuIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 2 },
  menuSub: { fontSize: 11, fontWeight: '500', color: '#64748B' },

  landlordLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 40, padding: 20, marginHorizontal: 24, backgroundColor: '#FEF2F2', borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { fontSize: 15, fontWeight: '900', color: '#EF4444' },

  // Renter Styles
  renterHeader: { flexDirection: 'row', alignItems: 'center', padding: 24, backgroundColor: '#FFF', marginHorizontal: 24, borderRadius: 32, marginTop: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  renterAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: KiraColors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarImgMedium: { width: 60, height: 60, borderRadius: 30 },
  avatarBgSmall: { width: 60, height: 60, borderRadius: 30, backgroundColor: KiraColors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarTextSmall: { fontSize: 24, fontWeight: '900', color: '#FFF' },
  renterInfo: { flex: 1, marginLeft: 16 },
  renterName: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  renterEmail: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  editBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4', borderRadius: 12 },
  renterLogout: { alignItems: 'center', marginTop: 40, padding: 20 },
  logoutTextSmall: { fontSize: 15, fontWeight: '800', color: '#EF4444' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase' },
  textInput: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, fontSize: 14, fontWeight: '600', color: '#1A1A1A', borderWidth: 1, borderColor: '#F1F5F9' },
  saveBtn: { backgroundColor: KiraColors.primary, padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 8, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  saveBtnText: { fontSize: 15, fontWeight: '900', color: '#FFF' },
});
