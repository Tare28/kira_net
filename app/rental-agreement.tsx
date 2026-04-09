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

const { width } = Dimensions.get('window');

// ─── Stored (mock) agreements ──────────────────────────────────────────────────
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
  { id: 'c5', title: 'Property Use', editable: false, value: 'Premises shall be used solely as a private residence.' },
  { id: 'c6', title: 'Sub-letting', editable: false, value: 'Tenant shall not sub-let or assign the premises without written consent.' },
  { id: 'c7', title: 'Maintenance', editable: false, value: 'Tenant shall maintain the property in good clean condition.' },
  { id: 'c8', title: 'Termination Notice', editable: true,  value: 'Either party may terminate with 30 days written notice.' },
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

  // Two-party signing state
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
    if (signingParty === 'landlord') {
      setLandlordSig(signName);
      setLandlordSigned(true);
    } else {
      setTenantSig(signName);
      setTenantSigned(true);
    }
    setShowSignModal(false);
    const otherSigned = signingParty === 'landlord' ? tenantSigned : landlordSigned;
    if (otherSigned) {
      Animated.sequence([
        Animated.spring(pulseAnim, { toValue: 1.08, useNativeDriver: true }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
      Alert.alert('🎉 Agreement Fully Executed!', 'Both parties have signed. The agreement is now legally binding and stored in the Vault.');
    } else {
      Alert.alert(`✅ ${signingParty === 'landlord' ? 'Landlord' : 'Tenant'} Signed`, 'Waiting for the other party to sign to fully execute the agreement.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Rental Agreement</Text>
          <Text style={styles.headerSub}>Digital · Legally Binding</Text>
        </View>
        <View style={styles.secureChip}>
          <Feather name="shield" size={11} color="#000" />
          <Text style={styles.secureText}>Secure Ledger</Text>
        </View>
      </View>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'create' && styles.tabActive]}
          onPress={() => setTab('create')}
        >
          <Feather name="file-plus" size={15} color={tab === 'create' ? '#000' : '#6B7280'} />
          <Text style={[styles.tabText, tab === 'create' && styles.tabTextActive]}>Execute New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'stored' && styles.tabActive]}
          onPress={() => setTab('stored')}
        >
          <Feather name="archive" size={15} color={tab === 'stored' ? '#000' : '#6B7280'} />
          <Text style={[styles.tabText, tab === 'stored' && styles.tabTextActive]}>
            Vault ({PAST_AGREEMENTS.length})
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'create' ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <MaterialCommunityIcons name="file-sign" size={20} color="#1D4ED8" />
            <Text style={styles.infoText}>
              Fill in the details below. Both parties must sign digitally to activate the agreement.
            </Text>
          </View>

          {/* Parties */}
          <Text style={styles.sectionLabel}>PARTIES</Text>
          <View style={styles.partyCard}>
            <View style={styles.partyRow}>
              <View style={styles.partyIconBox}>
                <Feather name="user" size={16} color="#000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.partyRole}>LANDLORD</Text>
                <TextInput
                  style={styles.partyInput}
                  value={landlordName}
                  onChangeText={setLandlordName}
                  placeholder="Landlord full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.partySep} />
            <View style={styles.partyRow}>
              <View style={[styles.partyIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Feather name="user-check" size={16} color="#1D4ED8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partyRole, { color: '#1D4ED8' }]}>TENANT</Text>
                <TextInput
                  style={styles.partyInput}
                  value={tenantName}
                  onChangeText={setTenantName}
                  placeholder="Tenant full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.partySep} />
            <View style={styles.partyRow}>
              <View style={[styles.partyIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="home" size={16} color="#92400E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partyRole, { color: '#92400E' }]}>PROPERTY</Text>
                <TextInput
                  style={styles.partyInput}
                  value={propertyName}
                  onChangeText={setPropertyName}
                  placeholder="Property name & address"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Clauses */}
          <Text style={styles.sectionLabel}>CONTRACT TERMS</Text>
          {clauses.map((clause, index) => (
            <View key={clause.id} style={styles.clauseCard}>
              <View style={styles.clauseHeader}>
                <View style={styles.clauseNumBox}>
                  <Text style={styles.clauseNum}>{index + 1}</Text>
                </View>
                <Text style={styles.clauseTitle}>{clause.title}</Text>
                {clause.editable && (
                  <TouchableOpacity
                    style={styles.editChip}
                    onPress={() => setEditingId(editingId === clause.id ? null : clause.id)}
                  >
                    <Feather name={editingId === clause.id ? 'check' : 'edit-2'} size={12} color="#000" />
                    <Text style={styles.editChipText}>{editingId === clause.id ? 'Save' : 'Edit'}</Text>
                  </TouchableOpacity>
                )}
              </View>
              {editingId === clause.id ? (
                <TextInput
                  style={styles.clauseInput}
                  value={clause.value}
                  onChangeText={v => updateClause(clause.id, v)}
                  multiline
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />
              ) : (
                <Text style={styles.clauseText}>{clause.value}</Text>
              )}
            </View>
          ))}

          {/* Standard Clauses Notice */}
          <View style={styles.legalNote}>
            <Feather name="info" size={13} color="#6B7280" />
            <Text style={styles.legalNoteText}>
              Standard protective clauses (§5–§7) are legally required and cannot be edited. This template complies with Ethiopian rental law.
            </Text>
          </View>

          {/* ── Signature Section ── */}
          <Text style={styles.sectionLabel}>DIGITAL SIGNATURES</Text>

          {bothSigned ? (
            <Animated.View style={[styles.signedBanner, { transform: [{ scale: pulseAnim }] }]}>
              <MaterialIcons name="verified" size={24} color="#FFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.signedTitle}>FULLY EXECUTED</Text>
                <Text style={styles.signedSub}>Both parties signed · ID: KN-LX-{Math.random().toString(36).substr(2, 8).toUpperCase()}</Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.sigStatusBar}>
              <Feather name="clock" size={13} color="#92400E" />
              <Text style={styles.sigStatusText}>Awaiting {!landlordSigned && !tenantSigned ? 'both signatures' : !landlordSigned ? 'landlord signature' : 'tenant signature'}</Text>
            </View>
          )}

          {/* Landlord Signature Slot */}
          <View style={[styles.sigSlot, landlordSigned && styles.sigSlotSigned]}>
            <View style={styles.sigSlotHeader}>
              <View style={styles.sigSlotIconBox}>
                <Feather name="user" size={14} color={landlordSigned ? '#FFF' : '#000'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sigSlotRole, landlordSigned && styles.sigSlotRoleSigned]}>LANDLORD</Text>
                <Text style={[styles.sigSlotName, landlordSigned && styles.sigSlotNameSigned]}>{landlordName || 'Not specified'}</Text>
              </View>
              {landlordSigned ? (
                <View style={styles.sigDoneChip}>
                  <MaterialIcons name="check-circle" size={14} color="#FFF" />
                  <Text style={styles.sigDoneText}>Signed</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.sigSignBtn} onPress={() => openSignModal('landlord')}>
                  <MaterialCommunityIcons name="fountain-pen-tip" size={13} color="#FFF" />
                  <Text style={styles.sigSignBtnText}>Sign</Text>
                </TouchableOpacity>
              )}
            </View>
            {landlordSigned && (
              <View style={styles.sigPreviewRow}>
                <Text style={styles.sigCursive}>{landlordSig}</Text>
                <Text style={styles.sigDate}>{new Date().toLocaleDateString()}</Text>
              </View>
            )}
          </View>

          {/* Tenant Signature Slot */}
          <View style={[styles.sigSlot, tenantSigned && styles.sigSlotSigned]}>
            <View style={styles.sigSlotHeader}>
              <View style={[styles.sigSlotIconBox, { backgroundColor: tenantSigned ? 'rgba(255,255,255,0.2)' : '#EFF6FF' }]}>
                <Feather name="user-check" size={14} color={tenantSigned ? '#FFF' : '#1D4ED8'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sigSlotRole, { color: tenantSigned ? 'rgba(255,255,255,0.6)' : '#1D4ED8' }]}>TENANT</Text>
                <Text style={[styles.sigSlotName, tenantSigned && styles.sigSlotNameSigned]}>{tenantName || 'Not specified'}</Text>
              </View>
              {tenantSigned ? (
                <View style={styles.sigDoneChip}>
                  <MaterialIcons name="check-circle" size={14} color="#FFF" />
                  <Text style={styles.sigDoneText}>Signed</Text>
                </View>
              ) : (
                <TouchableOpacity style={[styles.sigSignBtn, { backgroundColor: '#1D4ED8' }]} onPress={() => openSignModal('tenant')}>
                  <MaterialCommunityIcons name="fountain-pen-tip" size={13} color="#FFF" />
                  <Text style={styles.sigSignBtnText}>Sign</Text>
                </TouchableOpacity>
              )}
            </View>
            {tenantSigned && (
              <View style={styles.sigPreviewRow}>
                <Text style={styles.sigCursive}>{tenantSig}</Text>
                <Text style={styles.sigDate}>{new Date().toLocaleDateString()}</Text>
              </View>
            )}
          </View>

          <View style={styles.fingerprintBox}>
             <Feather name="activity" size={12} color="#ADB5BD" />
             <Text style={styles.fingerprintText}>HASH: 8f2b..3a1c | TIMESTAMP: {new Date().toISOString()}</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <StoredAgreements agreements={PAST_AGREEMENTS} />
      )}

      {/* ── Sign Modal ──────────────────────────────────────────────────────── */}
      <Modal visible={showSignModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.signSheet}>
            <View style={styles.sheetHandle} />

            {/* Party indicator */}
            <View style={styles.signPartyRow}>
              <View style={[styles.signPartyBadge, { backgroundColor: signingParty === 'landlord' ? '#000' : '#1D4ED8' }]}>
                <Feather name={signingParty === 'landlord' ? 'user' : 'user-check'} size={13} color="#FFF" />
                <Text style={styles.signPartyBadgeText}>{signingParty === 'landlord' ? 'LANDLORD' : 'TENANT'}</Text>
              </View>
            </View>

            <Text style={styles.signSheetTitle}>Digital Signature</Text>
            <Text style={styles.signSheetSub}>
              Signing as <Text style={{ fontWeight: '800', color: '#000' }}>{signingParty === 'landlord' ? landlordName : tenantName}</Text>. By typing your name, you legally agree to all terms.
            </Text>

            <View style={styles.signDocSummary}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#000" />
              <Text style={styles.signDocTitle}>{propertyName}</Text>
            </View>

            <Text style={styles.signInputLabel}>TYPE YOUR FULL NAME TO SIGN</Text>
            <TextInput
              style={styles.signInput}
              value={signName}
              onChangeText={setSignName}
              placeholder={signingParty === 'landlord' ? landlordName : tenantName}
              placeholderTextColor="#9CA3AF"
              autoFocus
            />

            {signName.length > 2 && (
              <View style={styles.signPreview}>
                <Text style={styles.signPreviewText}>{signName}</Text>
                <Text style={styles.signPreviewDate}>{new Date().toLocaleDateString()} · {signingParty === 'landlord' ? 'Landlord' : 'Tenant'}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.confirmSignBtn} onPress={handleSign}>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#FFF" />
              <Text style={styles.confirmSignBtnText}>Confirm & Sign</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelSignBtn} onPress={() => setShowSignModal(false)}>
              <Text style={styles.cancelSignText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Stored Agreements ────────────────────────────────────────────────────────
function StoredAgreements({ agreements }: { agreements: typeof PAST_AGREEMENTS }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.storedBanner}>
        <MaterialIcons name="lock" size={15} color="#1D4ED8" />
        <Text style={styles.storedBannerText}>
          All agreements are encrypted and stored securely in Kira-Net.
        </Text>
      </View>
      {agreements.map(ag => (
        <TouchableOpacity key={ag.id} style={styles.storedCard} activeOpacity={0.88}>
          <View style={styles.storedTop}>
            <View style={styles.storedIconBox}>
              <MaterialCommunityIcons name="file-document" size={22} color="#005C3A" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.storedProperty}>{ag.property}</Text>
              <Text style={styles.storedParties}>{ag.tenant} ↔ {ag.landlord}</Text>
              <Text style={styles.storedDates}>{ag.start} → {ag.end}</Text>
            </View>
            <View style={[styles.statusChip, ag.status === 'signed' ? styles.statusSigned : styles.statusPending]}>
              <Text style={[styles.statusText, ag.status === 'signed' ? styles.statusTextSigned : styles.statusTextPending]}>
                {ag.status === 'signed' ? '✓ Signed' : '⏳ Pending'}
              </Text>
            </View>
          </View>
          <View style={styles.storedFooter}>
            <Text style={styles.storedRent}>{ag.rent} ETB/mo</Text>
            <Text style={styles.storedDate}>Created {ag.date}</Text>
            <TouchableOpacity style={styles.downloadBtn}>
              <Feather name="download" size={13} color="#005C3A" />
              <Text style={styles.downloadText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  secureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  secureText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },

  tabs: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#F3F4F6', borderRadius: 16, padding: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    paddingVertical: 11, borderRadius: 13,
  },
  tabActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#005C3A', fontWeight: '800' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#EFF6FF', borderRadius: 16, padding: 14, marginBottom: 24,
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  infoText: { flex: 1, fontSize: 13, color: '#1D4ED8', lineHeight: 19 },

  sectionLabel: {
    fontSize: 10, fontWeight: '800', color: '#6B7280',
    letterSpacing: 1.2, marginBottom: 12, marginTop: 4,
  },

  // Parties
  partyCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  partyRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  partyIconBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
  },
  partyRole: { fontSize: 9, fontWeight: '800', color: '#005C3A', letterSpacing: 0.8, marginBottom: 4 },
  partyInput: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', padding: 0 },
  partySep: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 14 },

  // Clauses
  clauseCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  clauseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  clauseNumBox: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#E8F5E9',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  clauseNum: { fontSize: 11, fontWeight: '900', color: '#005C3A' },
  clauseTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  editChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F8F9FA', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  editChipText: { fontSize: 11, fontWeight: '700', color: '#000' },
  clauseText: { fontSize: 13, color: '#4A5568', lineHeight: 20 },
  clauseInput: {
    fontSize: 13, color: '#1A1A1A', lineHeight: 20,
    backgroundColor: '#F7F8F9', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#EEE',
  },

  legalNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F8F9FA', borderRadius: 14, padding: 14, marginBottom: 24, marginTop: 4,
  },
  legalNoteText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },

  // Signed Banner
  signedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#005C3A', borderRadius: 18, padding: 18, marginBottom: 16,
  },
  signedTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  signedSub: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '700' },

  fingerprintBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 12, backgroundColor: '#F8F9FA', borderRadius: 12 },
  fingerprintText: { fontSize: 9, color: '#ADB5BD', fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  // Sign Button
  signBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#005C3A', borderRadius: 18, paddingVertical: 18,
    shadowColor: '#005C3A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  signBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  // Sign Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  signSheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40,
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2,
    alignSelf: 'center', marginBottom: 20,
  },
  signSheetTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 8 },
  signSheetSub: { fontSize: 13, color: '#4A5568', lineHeight: 20, marginBottom: 20 },
  signDocSummary: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F8F9FA', borderRadius: 12, padding: 12, marginBottom: 20,
  },
  signDocTitle: { fontSize: 13, fontWeight: '700', color: '#005C3A', flex: 1 },
  signInputLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginBottom: 10 },
  signInput: {
    backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 16, color: '#1A1A1A', fontWeight: '600', marginBottom: 16,
  },
  signPreview: {
    backgroundColor: '#005C3A', borderRadius: 14, padding: 32, marginBottom: 20,
    alignItems: 'center', justifyContent: 'center', minHeight: 120,
    borderWidth: 1, borderColor: '#004A2F'
  },
  signPreviewText: { fontSize: 32, fontFamily: Platform.OS === 'ios' ? 'SnellRoundhand-Bold' : 'serif', color: '#FFF', marginBottom: 6 },
  signPreviewDate: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  confirmSignBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#005C3A', borderRadius: 16, paddingVertical: 18, marginBottom: 12,
  },
  confirmSignBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  cancelSignBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelSignText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },

  // Stored
  storedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F8F9FA', borderRadius: 14, padding: 12, marginBottom: 20,
  },
  storedBannerText: { flex: 1, fontSize: 12, color: '#000', fontWeight: '800' },
  storedCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  storedTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  storedIconBox: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center',
  },
  storedProperty: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  storedParties: { fontSize: 12, color: '#4A5568', marginBottom: 2 },
  storedDates: { fontSize: 11, color: '#6B7280' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusSigned: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EEE' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusTextSigned: { color: '#000' },
  statusTextPending: { color: '#92400E' },
  storedFooter: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12,
  },
  storedRent: { fontSize: 13, fontWeight: '900', color: '#000', flex: 1 },
  storedDate: { fontSize: 11, color: '#9CA3AF', marginRight: 14 },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F8F9FA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#EEE'
  },
  downloadText: { fontSize: 12, fontWeight: '700', color: '#000' },

  // ── Two-party signature slots ─────────────────────────────────────
  sigStatusBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginBottom: 12,
  },
  sigStatusText: { fontSize: 12, fontWeight: '700', color: '#92400E', flex: 1 },

  sigSlot: {
    backgroundColor: '#F8F9FA', borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  sigSlotSigned: {
    backgroundColor: '#005C3A', borderColor: '#005C3A',
  },
  sigSlotHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sigSlotIconBox: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center',
  },
  sigSlotRole: { fontSize: 9, fontWeight: '900', color: '#6B7280', letterSpacing: 1, marginBottom: 2 },
  sigSlotRoleSigned: { color: 'rgba(255,255,255,0.5)' },
  sigSlotName: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  sigSlotNameSigned: { color: '#FFF' },

  sigDoneChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  sigDoneText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  sigSignBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#005C3A', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
  },
  sigSignBtnText: { fontSize: 11, fontWeight: '800', color: '#FFF' },

  sigPreviewRow: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sigCursive: {
    fontSize: 26, color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'SnellRoundhand-Bold' : 'serif',
  },
  sigDate: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },

  // ── Modal party badge ─────────────────────────────────────────────
  signPartyRow: { flexDirection: 'row', marginBottom: 14 },
  signPartyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  signPartyBadgeText: { fontSize: 11, fontWeight: '900', color: '#FFF', letterSpacing: 0.5 },
});
