import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, Animated, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Feather, Ionicons, MaterialIcons, MaterialCommunityIcons,
} from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';
import { SystemConfig } from '@/constants/SystemConfig';

const { width } = Dimensions.get('window');

const CONVENIENCE_FEE = SystemConfig.fees.rentalConvenience;

const PAST_AGREEMENTS = [
  {
    id: 'a1',
    property: 'The Summit Residency',
    tenant: 'Melat Haile',
    landlord: 'Abebe Tadesse',
    start: 'April 1, 2026',
    end: 'March 31, 2027',
    rent: '25,000',
    status: 'signed',
    date: 'Mar 28, 2026',
  },
  {
    id: 'a2',
    property: 'Kazanchis Studio',
    tenant: 'Robel Mekonnen',
    landlord: 'Yonas Bekele',
    start: 'Feb 1, 2026',
    end: 'Jan 31, 2027',
    rent: '18,500',
    status: 'pending',
    date: 'Mar 20, 2026',
  },
];

const DEFAULT_CLAUSES = [
  { id: 'c1', title: 'Monthly Rent', editable: true,  value: '25,000 ETB per month, payable on the 1st of each month.' },
  { id: 'c2', title: 'Advance Deposit', editable: true,  value: '3 months deposit (75,000 ETB) due before move-in.' },
  { id: 'c3', title: 'Lease Duration', editable: true,  value: '12 months commencing April 1, 2026 through March 31, 2027.' },
  { id: 'c4', title: 'Utility Responsibility', editable: true,  value: 'Tenant pays electricity. Water and internet included in rent.' },
];

type TabType = 'create' | 'stored';
type Clause = typeof DEFAULT_CLAUSES[number];
type SigningParty = 'landlord' | 'tenant';

export default function RentalAgreementScreen() {
  const [tab, setTab] = useState<TabType>('create');
  const [clauses, setClauses] = useState<Clause[]>(DEFAULT_CLAUSES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState('');
  const [landlordName, setLandlordName] = useState('Abebe Tadesse');
  const [propertyName, setPropertyName] = useState('The Summit Residency, Bole');

  const [showSignModal, setShowSignModal] = useState(false);
  const [signingParty, setSigningParty] = useState<SigningParty>('landlord');
  const [landlordSigned, setLandlordSigned] = useState(false);
  const [tenantSigned, setTenantSigned] = useState(false);
  const [landlordSig, setLandlordSig] = useState('');
  const [tenantSig, setTenantSig] = useState('');
  const [signName, setSignName] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const bothSigned = landlordSigned && tenantSigned;

  const updateClause = (id: string, value: string) =>
    setClauses(prev => prev.map(c => c.id === id ? { ...c, value } : c));

  const openSignModal = (party: SigningParty) => {
    const name = party === 'landlord' ? landlordName : tenantName;
    if (!name.trim()) {
      Alert.alert('Missing Name', `Please enter the ${party}'s full name first.`);
      return;
    }
    setSigningParty(party);
    setSignName('');
    setShowSignModal(true);
  };

  const handleSign = () => {
    if (!signName.trim()) {
      Alert.alert('Signature Required', 'Please type your full name to sign.');
      return;
    }
    
    // Revenue Alert
    const feeMsg = signingParty === 'tenant' ? `A convenience fee of ${CONVENIENCE_FEE} ETB will be charged for secure vault storage and legal repository. Pay now to execute.` : null;
    
    const finalize = () => {
      if (signingParty === 'landlord') {
        setLandlordSig(signName);
        setLandlordSigned(true);
      } else {
        setTenantSig(signName);
        setTenantSigned(true);
      }
      setShowSignModal(false);
      if (signingParty === 'tenant' || landlordSigned) {
         if (landlordSigned && signingParty === 'tenant') {
            Alert.alert('🎉 Agreement fully signed!', 'You have successfully paid the service fee and signed the agreement. It is now stored in your Vault.');
         }
      }
    };

    if (signingParty === 'tenant') {
       Alert.alert('Convenience Fee', feeMsg!, [
         { text: 'Cancel', style: 'cancel' },
         { text: 'Pay & Sign', onPress: finalize }
       ]);
    } else {
       finalize();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Agreement Vault</Text>
          <Text style={styles.headerSub}>Convenience Fee: {CONVENIENCE_FEE} ETB</Text>
        </View>
        <View style={styles.feeBanner}>
           <Text style={styles.feeBannerText}>Secure Vault</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'create' && styles.tabActive]} onPress={() => setTab('create')}>
          <Text style={[styles.tabText, tab === 'create' && styles.tabTextActive]}>Execute New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'stored' && styles.tabActive]} onPress={() => setTab('stored')}>
          <Text style={[styles.tabText, tab === 'stored' && styles.tabTextActive]}>My Vault ({PAST_AGREEMENTS.length})</Text>
        </TouchableOpacity>
      </View>

      {tab === 'create' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.revenueCard}>
             <MaterialCommunityIcons name="shield-check" size={24} color="#FFF" />
             <View style={{ flex: 1 }}>
                <Text style={styles.revTitle}>Legal Repository Service</Text>
                <Text style={styles.revSub}>Kira-Net acts as a neutral third-party witness and provides lifelong cloud storage for {CONVENIENCE_FEE} ETB.</Text>
             </View>
          </View>

          <Text style={styles.sectionLabel}>PARTIES</Text>
          <View style={styles.partyCard}>
            <TextInput style={styles.partyInput} value={landlordName} onChangeText={setLandlordName} placeholder="Landlord name" />
            <View style={styles.partySep} />
            <TextInput style={styles.partyInput} value={tenantName} onChangeText={setTenantName} placeholder="Tenant name" />
          </View>

          <Text style={styles.sectionLabel}>TERMS</Text>
          {clauses.map((clause, idx) => (
            <View key={clause.id} style={styles.clauseCard}>
              <Text style={styles.clauseTitle}>{clause.title}</Text>
              <Text style={styles.clauseText}>{clause.value}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>SIGNATURES</Text>
          <View style={styles.sigContainer}>
             {/* Landlord Slot */}
             <TouchableOpacity style={[styles.sigBox, landlordSigned && styles.sigBoxSigned]} onPress={() => !landlordSigned && openSignModal('landlord')}>
                <Text style={[styles.sigLabel, landlordSigned && styles.sigLabelSigned]}>LANDLORD SIGNATURE</Text>
                {landlordSigned ? <Text style={styles.sigCursive}>{landlordSig}</Text> : <Text style={styles.sigPlaceholder}>Tap to Sign</Text>}
             </TouchableOpacity>

             {/* Tenant Slot */}
             <TouchableOpacity style={[styles.sigBox, tenantSigned && styles.sigBoxSigned]} onPress={() => !tenantSigned && openSignModal('tenant')}>
                <Text style={[styles.sigLabel, tenantSigned && styles.sigLabelSigned]}>TENANT SIGNATURE</Text>
                {tenantSigned ? <Text style={styles.sigCursive}>{tenantSig}</Text> : <View style={styles.paySignBtn}><Text style={styles.paySignText}>Pay {CONVENIENCE_FEE} ETB & Sign</Text></View>}
             </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <StoredAgreements agreements={PAST_AGREEMENTS} />
      )}

      {/* Sign Modal */}
      <Modal visible={showSignModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.signSheet}>
            <Text style={styles.signSheetTitle}>Execution of Contract</Text>
            <Text style={styles.signSheetSub}>I, {signingParty === 'landlord' ? landlordName : tenantName}, agree to be legally bound by these terms.</Text>
            <TextInput style={styles.signInput} value={signName} onChangeText={setSignName} placeholder="Type Full Name" autoFocus />
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSign}><Text style={styles.confirmBtnText}>Confirm Signature</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSignModal(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StoredAgreements({ agreements }: any) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {agreements.map((ag: any) => (
        <View key={ag.id} style={styles.storedCard}>
           <Text style={styles.storedProperty}>{ag.property}</Text>
           <Text style={styles.storedParties}>{ag.tenant} ↔ {ag.landlord}</Text>
           <View style={styles.storedFooter}><Text style={styles.storedId}>ID: KN-{ag.id.toUpperCase()}</Text><Text style={styles.storedDate}>{ag.date}</Text></View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#9CC942', fontWeight: '800' },
  feeBanner: { backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  feeBannerText: { fontSize: 10, fontWeight: '900', color: '#16A34A' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 12 },
  tabActive: { backgroundColor: '#1A1A1A' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  tabTextActive: { color: '#FFF' },
  scrollContent: { paddingHorizontal: 20 },
  revenueCard: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 20, borderRadius: 24, gap: 16, marginBottom: 24 },
  revTitle: { color: '#FFF', fontSize: 15, fontWeight: '900', marginBottom: 4 },
  revSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 16 },
  sectionLabel: { fontSize: 10, fontWeight: '900', color: '#ADB5BD', marginVertical: 12, letterSpacing: 1 },
  partyCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20 },
  partyInput: { fontSize: 15, fontWeight: '800', paddingVertical: 8 },
  partySep: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
  clauseCard: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  clauseTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  clauseText: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  sigContainer: { gap: 12 },
  sigBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, borderWidth: 2, borderColor: '#F1F5F9', alignItems: 'center', minHeight: 100, justifyContent: 'center' },
  sigBoxSigned: { backgroundColor: '#9CC942', borderColor: '#9CC942' },
  sigLabel: { fontSize: 9, fontWeight: '900', color: '#ADB5BD', marginBottom: 8 },
  sigLabelSigned: { color: 'rgba(0,0,0,0.5)' },
  sigPlaceholder: { fontSize: 14, fontWeight: '800', color: '#CBD5E1' },
  sigCursive: { fontSize: 24, color: '#FFF', fontWeight: '800' },
  paySignBtn: { backgroundColor: '#1A1A1A', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  paySignText: { color: '#9CC942', fontSize: 12, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  signSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingBottom: 60 },
  signSheetTitle: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  signSheetSub: { fontSize: 13, color: '#64748B', marginBottom: 24, lineHeight: 20 },
  signInput: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: '800', marginBottom: 24 },
  confirmBtn: { backgroundColor: '#1A1A1A', padding: 18, borderRadius: 30, alignItems: 'center', marginBottom: 12 },
  confirmBtnText: { color: '#9CC942', fontSize: 15, fontWeight: '900' },
  cancelBtn: { alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  storedCard: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24, marginBottom: 12 },
  storedProperty: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  storedParties: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  storedFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
  storedId: { fontSize: 10, fontWeight: '800', color: '#9CC942' },
  storedDate: { fontSize: 10, color: '#ADB5BD' },
});
