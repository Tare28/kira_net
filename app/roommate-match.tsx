import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

// ─── Mock Roommate Profiles ────────────────────────────────────────────────────
const ROOMMATES = [
  {
    id: '1',
    name: 'Tigist Bekele',
    age: 23,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop',
    verified: true,
    budget: 12000,
    location: 'Bole',
    gender: 'Female',
    lifestyle: ['Student', 'Quiet', 'Non-Smoker'],
    bio: 'Med student at AAU. Looking for a calm, clean flat-share in Bole near campus transport. Early sleeper, very tidy.',
    matchScore: 94,
    moveIn: 'April 2026',
    occupation: 'Student',
  },
  {
    id: '2',
    name: 'Robel Haile',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    verified: true,
    budget: 18000,
    location: 'Kazanchis',
    gender: 'Male',
    lifestyle: ['Professional', 'Social', 'Non-Smoker'],
    bio: 'Software Engineer at a startup. Looking for a modern apartment share near the office. Love cooking and weekend hangouts.',
    matchScore: 81,
    moveIn: 'April 2026',
    occupation: 'Software Engineer',
  },
  {
    id: '3',
    name: 'Sara Tesfaye',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200&auto=format&fit=crop',
    verified: false,
    budget: 15000,
    location: 'Old Airport',
    gender: 'Female',
    lifestyle: ['Professional', 'Quiet', 'Pet-Friendly'],
    bio: 'Graphic designer working remotely. Looking for a well-lit space, ideally with garden. Has a small cat.',
    matchScore: 76,
    moveIn: 'May 2026',
    occupation: 'Designer',
  },
  {
    id: '4',
    name: 'Dawit Mekonnen',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    verified: true,
    budget: 22000,
    location: 'Bole',
    gender: 'Male',
    lifestyle: ['Professional', 'Social', 'Sports-Lover'],
    bio: 'Bank professional. Looking for a serious, clean flat-share in Bole. Gym-goer, keeps odd hours sometimes.',
    matchScore: 68,
    moveIn: 'March 2026',
    occupation: 'Banker',
  },
];

const LIFESTYLE_OPTIONS = ['Student', 'Professional', 'Quiet', 'Social', 'Non-Smoker', 'Pet-Friendly', 'Sports-Lover', 'Early Riser'];
const LOCATION_OPTIONS = ['Bole', 'Kazanchis', 'Old Airport', 'CMC', 'Sarbet', 'Piassa', 'Megenagna'];
const GENDER_OPTIONS = ['Any', 'Male', 'Female'];

function matchColor(score: number) {
  if (score >= 85) return '#16A34A';
  if (score >= 70) return '#F59E0B';
  return '#6B7280';
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RoommateMatchScreen() {
  const { role } = useUser();
  const [activeGender, setActiveGender] = useState('Any');
  const [maxBudget, setMaxBudget] = useState(25000);
  const [selectedLifestyle, setSelectedLifestyle] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState<typeof ROOMMATES[number] | null>(null);

  const filtered = ROOMMATES
    .filter(r => {
      if (activeGender !== 'Any' && r.gender !== activeGender) return false;
      if (r.budget > maxBudget) return false;
      if (selectedLifestyle.length > 0) {
        const hasMatch = selectedLifestyle.some(l => r.lifestyle.includes(l));
        if (!hasMatch) return false;
      }
      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const toggleLifestyle = (tag: string) => {
    setSelectedLifestyle(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Roommate Match</Text>
          <Text style={styles.headerSub}>{filtered.length} profiles available</Text>
        </View>
        {(role === 'tenant' || !role) && (
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
            <Feather name="plus" size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Viral Banner ────────────────────────────────────────────────── */}
        <View style={styles.viralBanner}>
          <View style={styles.viralLeft}>
            <Text style={styles.viralEmoji}>🏠</Text>
            <View>
              <Text style={styles.viralTitle}>Split the Rent. Double the Fun.</Text>
              <Text style={styles.viralSub}>Connect with verified roommates in Addis Ababa</Text>
            </View>
          </View>
          <View style={styles.viralStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>340+</Text>
              <Text style={styles.statLbl}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>92%</Text>
              <Text style={styles.statLbl}>Match Rate</Text>
            </View>
          </View>
        </View>

        {/* ── Filters ─────────────────────────────────────────────────────── */}
        <View style={styles.filtersSection}>
          {/* Gender */}
          <Text style={styles.filterLabel}>GENDER PREFERENCE</Text>
          <View style={styles.pillRow}>
            {GENDER_OPTIONS.map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.pill, activeGender === g && styles.pillActive]}
                onPress={() => setActiveGender(g)}
              >
                <Text style={[styles.pillText, activeGender === g && styles.pillTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget Slider (simplified as step buttons) */}
          <Text style={styles.filterLabel}>MAX BUDGET — {maxBudget.toLocaleString()} ETB</Text>
          <View style={styles.pillRow}>
            {[10000, 15000, 20000, 25000, 35000].map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.pill, maxBudget === b && styles.pillActive]}
                onPress={() => setMaxBudget(b)}
              >
                <Text style={[styles.pillText, maxBudget === b && styles.pillTextActive]}>
                  {(b / 1000).toFixed(0)}K
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lifestyle Tags */}
          <Text style={styles.filterLabel}>LIFESTYLE</Text>
          <View style={styles.tagWrap}>
            {LIFESTYLE_OPTIONS.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, selectedLifestyle.includes(tag) && styles.tagActive]}
                onPress={() => toggleLifestyle(tag)}
              >
                <Text style={[styles.tagText, selectedLifestyle.includes(tag) && styles.tagTextActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Results Count ───────────────────────────────────────────────── */}
        <View style={styles.resultsRow}>
          <Text style={styles.resultsLabel}>{filtered.length} matches found</Text>
          <TouchableOpacity>
            <Text style={styles.sortText}>Sort: Best Match ↓</Text>
          </TouchableOpacity>
        </View>

        {/* ── Cards ───────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="account-search" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters above</Text>
          </View>
        ) : (
          filtered.map(r => (
            <RoommateCard
              key={r.id}
              roommate={r}
              onView={() => { setSelectedRoommate(r); setShowProfile(true); }}
              onConnect={() =>
                Alert.alert(
                  '✅ Request Sent',
                  `Your roommate request has been sent to ${r.name}. They'll be notified shortly.`
                )
              }
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Profile Detail Modal ─────────────────────────────────────────── */}
      <Modal visible={showProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.profileSheet}>
            <View style={styles.sheetHandle} />
            {selectedRoommate && (
              <ProfileDetail
                roommate={selectedRoommate}
                onClose={() => setShowProfile(false)}
                onConnect={() => {
                  setShowProfile(false);
                  Alert.alert('✅ Request Sent', `Roommate request sent to ${selectedRoommate.name}!`);
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ── Create Profile Modal ─────────────────────────────────────────── */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.createSheet}>
            <View style={styles.sheetHandle} />
            <CreateRoommateProfile onClose={() => setShowCreateModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Roommate Card ─────────────────────────────────────────────────────────────
function RoommateCard({ roommate, onView, onConnect }: any) {
  const color = matchColor(roommate.matchScore);
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.92} onPress={onView}>
      {/* Match Score */}
      <View style={[styles.matchBadge, { backgroundColor: color }]}>
        <Text style={styles.matchBadgeText}>{roommate.matchScore}% Match</Text>
      </View>

      <View style={styles.cardTop}>
        {/* Avatar */}
        <Image source={roommate.avatar} style={styles.avatar} contentFit="cover" />

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{roommate.name}</Text>
            {roommate.verified && <MaterialIcons name="verified" size={14} color="#3B82F6" />}
          </View>
          <Text style={styles.occupation}>{roommate.occupation} · {roommate.age} yrs</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={11} color="#4A5568" />
            <Text style={styles.locationText}>{roommate.location}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.moveIn}>Moves in {roommate.moveIn}</Text>
          </View>

          {/* Budget */}
          <View style={styles.budgetChip}>
            <MaterialCommunityIcons name="cash" size={13} color="KiraColors.primary" />
            <Text style={styles.budgetText}>{roommate.budget.toLocaleString()} ETB/mo</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio} numberOfLines={2}>{roommate.bio}</Text>

      {/* Tags */}
      <View style={styles.tagWrap}>
        {roommate.lifestyle.map((tag: string) => (
          <View key={tag} style={styles.lifeTag}>
            <Text style={styles.lifeTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.viewBtn} onPress={onView}>
          <Text style={styles.viewBtnText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectBtn} onPress={onConnect}>
          <Ionicons name="paper-plane" size={15} color="#FFF" />
          <Text style={styles.connectBtnText}>Connect</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Profile Detail Sheet ─────────────────────────────────────────────────────
function ProfileDetail({ roommate, onClose, onConnect }: any) {
  const color = matchColor(roommate.matchScore);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Close */}
      <View style={styles.sheetHeaderRow}>
        <Text style={styles.sheetTitle}>Roommate Profile</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Profile top */}
      <View style={styles.profileTop}>
        <Image source={roommate.avatar} style={styles.avatarLarge} contentFit="cover" />
        <View style={[styles.matchRing, { borderColor: color }]}>
          <Text style={[styles.matchRingText, { color }]}>{roommate.matchScore}%</Text>
          <Text style={styles.matchRingLabel}>match</Text>
        </View>
      </View>

      <View style={styles.profileNameRow}>
        <Text style={styles.profileName}>{roommate.name}</Text>
        {roommate.verified && <MaterialIcons name="verified" size={16} color="#3B82F6" />}
      </View>
      <Text style={styles.profileRole}>{roommate.occupation} · {roommate.age} years old</Text>

      {/* Details Grid */}
      <View style={styles.detailGrid}>
        <DetailItem icon="location-on" label="Preferred Area" value={roommate.location} />
        <DetailItem icon="people" label="Gender" value={roommate.gender} />
        <DetailItem icon="attach-money" label="Max Budget" value={`${roommate.budget.toLocaleString()} ETB`} />
        <DetailItem icon="event" label="Move-In" value={roommate.moveIn} />
      </View>

      {/* Bio */}
      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>About</Text>
        <Text style={styles.bioFull}>{roommate.bio}</Text>
      </View>

      {/* Lifestyle */}
      <View style={styles.bioSection}>
        <Text style={styles.bioLabel}>Lifestyle</Text>
        <View style={styles.tagWrap}>
          {roommate.lifestyle.map((tag: string) => (
            <View key={tag} style={[styles.lifeTag, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.lifeTagText, { color: 'KiraColors.primary' }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Notice */}
      <View style={styles.safetyNote}>
        <MaterialIcons name="shield" size={15} color="#3B82F6" />
        <Text style={styles.safetyText}>
          Always meet in a public place first. Kira-Net verified users have completed phone verification.
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.connectBtnLarge} onPress={onConnect}>
        <Ionicons name="paper-plane" size={18} color="#FFF" />
        <Text style={styles.connectBtnLargeText}>Send Roommate Request</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <View style={styles.detailItem}>
      <MaterialIcons name={icon} size={16} color="KiraColors.primary" />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

// ─── Create Profile Modal ─────────────────────────────────────────────────────
function CreateRoommateProfile({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [bio, setBio] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [gender, setGender] = useState('Any');

  const toggleTag = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = () => {
    if (!name.trim() || !budget.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your name and budget.');
      return;
    }
    onClose();
    Alert.alert('🎉 Profile Created!', 'Your roommate profile is now live. Matches will be sent to you shortly.');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 24 }}>
      <View style={styles.sheetHeaderRow}>
        <Text style={styles.sheetTitle}>Create My Profile</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
      <Text style={styles.createSub}>Find your perfect roommate match in Addis Ababa</Text>

      <Text style={styles.createLabel}>Full Name</Text>
      <TextInput style={styles.createInput} value={name} onChangeText={setName} placeholder="e.g. Alemu Tadesse" placeholderTextColor="#9CA3AF" />

      <Text style={styles.createLabel}>Max Monthly Budget (ETB)</Text>
      <TextInput style={styles.createInput} value={budget} onChangeText={setBudget} placeholder="e.g. 15000" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

      <Text style={styles.createLabel}>I prefer a roommate who is...</Text>
      <View style={styles.pillRow}>
        {GENDER_OPTIONS.map(g => (
          <TouchableOpacity key={g} style={[styles.pill, gender === g && styles.pillActive]} onPress={() => setGender(g)}>
            <Text style={[styles.pillText, gender === g && styles.pillTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.createLabel}>My Lifestyle Tags</Text>
      <View style={styles.tagWrap}>
        {LIFESTYLE_OPTIONS.map(tag => (
          <TouchableOpacity key={tag} style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]} onPress={() => toggleTag(tag)}>
            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.createLabel}>Short Bio</Text>
      <TextInput
        style={[styles.createInput, { height: 90, textAlignVertical: 'top' }]}
        value={bio} onChangeText={setBio}
        placeholder="Tell potential roommates about yourself..."
        placeholderTextColor="#9CA3AF" multiline
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Publish My Profile</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
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
  headerSub: { fontSize: 11, color: '#6B7280', fontWeight: '500', marginTop: 1 },
  createBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center',
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Viral Banner
  viralBanner: {
    backgroundColor: KiraColors.primary, borderRadius: 20, padding: 18, marginBottom: 20,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  viralLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  viralEmoji: { fontSize: 32 },
  viralTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  viralSub: { fontSize: 12, color: 'rgba(0,0,0,0.6)' },
  viralStats: { flexDirection: 'row', gap: 24 },
  statItem: { alignItems: 'flex-start' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#FBC02D' },
  statLbl: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Filters
  filtersSection: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  filterLabel: {
    fontSize: 10, fontWeight: '800', color: '#6B7280',
    letterSpacing: 1.1, marginBottom: 10, marginTop: 4,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  pillActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  pillText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  pillTextActive: { color: '#1A1A1A' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  tagActive: { backgroundColor: '#E8F5E9', borderColor: KiraColors.primary },
  tagText: { fontSize: 12, fontWeight: '600', color: '#4A5568' },
  tagTextActive: { color: KiraColors.primary },

  // Results
  resultsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  resultsLabel: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  sortText: { fontSize: 12, fontWeight: '700', color: KiraColors.primary },

  // Card
  card: {
    backgroundColor: '#FFF', borderRadius: 22, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, position: 'relative',
  },
  matchBadge: {
    position: 'absolute', top: 14, right: 14,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  matchBadgeText: { fontSize: 11, fontWeight: '800', color: '#FFF' },
  cardTop: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  cardInfo: { flex: 1, paddingRight: 70 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  name: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  occupation: { fontSize: 12, color: '#6B7280', marginBottom: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  locationText: { fontSize: 11, color: '#4A5568' },
  dot: { color: '#9CA3AF', fontSize: 11 },
  moveIn: { fontSize: 11, color: '#4A5568' },
  budgetChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  budgetText: { fontSize: 12, fontWeight: '800', color: 'KiraColors.primary' },
  bio: { fontSize: 13, color: '#4A5568', lineHeight: 19, marginBottom: 12 },
  lifeTag: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  lifeTagText: { fontSize: 11, fontWeight: '600', color: '#4A5568' },
  cardActions: {
    flexDirection: 'row', gap: 10, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: '#F3F4F6', marginTop: 12,
  },
  viewBtn: {
    flex: 1, borderWidth: 1.5, borderColor: 'KiraColors.primary', borderRadius: 14,
    paddingVertical: 11, alignItems: 'center',
  },
  viewBtnText: { fontSize: 13, fontWeight: '700', color: 'KiraColors.primary' },
  connectBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: KiraColors.primary, borderRadius: 14, paddingVertical: 11,
  },
  connectBtnText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 50 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#9CA3AF', marginTop: 14 },
  emptySub: { fontSize: 13, color: '#D1D5DB', marginTop: 6 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  profileSheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '90%', padding: 20,
  },
  createSheet: {
    backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '92%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2,
    alignSelf: 'center', marginBottom: 16,
  },
  sheetHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },

  // Profile Detail
  profileTop: { alignItems: 'center', paddingVertical: 16, position: 'relative' },
  avatarLarge: { width: 100, height: 100, borderRadius: 50 },
  matchRing: {
    position: 'absolute', right: 60, top: 16,
    width: 52, height: 52, borderRadius: 26, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF',
  },
  matchRingText: { fontSize: 14, fontWeight: '900' },
  matchRingLabel: { fontSize: 8, color: '#6B7280', fontWeight: '600' },
  profileNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 },
  profileName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  profileRole: { textAlign: 'center', fontSize: 13, color: '#6B7280', marginBottom: 18 },
  detailGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18,
    backgroundColor: '#F7F8F9', borderRadius: 16, padding: 14,
  },
  detailItem: { width: (width - 100) / 2, gap: 4 },
  detailLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  detailValue: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  bioSection: { marginBottom: 18 },
  bioLabel: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  bioFull: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
  safetyNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, marginBottom: 18,
  },
  safetyText: { flex: 1, fontSize: 12, color: '#1D4ED8', lineHeight: 18 },
  connectBtnLarge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'KiraColors.primary', borderRadius: 18, paddingVertical: 18,
    shadowColor: 'KiraColors.primary', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  connectBtnLargeText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  // Create form
  createSub: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
  createLabel: { fontSize: 11, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginBottom: 10, marginTop: 6 },
  createInput: {
    backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15, color: '#1A1A1A', fontWeight: '500', marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: 'KiraColors.primary', borderRadius: 16, paddingVertical: 18,
    alignItems: 'center', marginTop: 8,
    shadowColor: 'KiraColors.primary', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
});
