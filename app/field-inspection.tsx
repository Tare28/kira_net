import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { KiraColors } from '@/constants/colors';

export default function FieldInspection() {
  const { name } = useLocalSearchParams();
  const [photos, setPhotos] = useState<string[]>([]);
  const [checks, setChecks] = useState({
    water: false,
    meter: false,
    road: false,
    id: false
  });

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    Alert.alert(
      "Submission Successful",
      "The inspection report has been sent to the Admin Dashboard for final certification.",
      [{ text: "Back to Terminal", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="x" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Field Audit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.propHeader}>
            <Text style={styles.propName}>{name || 'Property Audit'}</Text>
            <Text style={styles.propSub}>Inspection ID: #AUD-009221</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>"Addis Essentials" Checklist</Text>
            <Text style={styles.sectionSub}>Verify each utility is functional and private.</Text>
            
            <View style={styles.checklist}>
                {[
                    { key: 'water', label: 'Constant Water Supply', icon: 'water-outline' },
                    { key: 'meter', label: 'Private Electric Meter', icon: 'flash-outline' },
                    { key: 'road', label: 'Reliable Road Access', icon: 'car-outline' },
                    { key: 'id', label: 'Landlord ID Matched', icon: 'shield-checkmark-outline' },
                ].map((item) => (
                    <TouchableOpacity 
                        key={item.key} 
                        style={[styles.checkBtn, checks[item.key as keyof typeof checks] && styles.checkBtnActive]}
                        onPress={() => toggleCheck(item.key as keyof typeof checks)}
                    >
                        <View style={styles.checkLeft}>
                            <Ionicons name={item.icon as any} size={20} color={checks[item.key as keyof typeof checks] ? '#1A1A1A' : '#1A1A1A'} />
                            <Text style={[styles.checkLabel, checks[item.key as keyof typeof checks] && styles.checkLabelActive]}>
                                {item.label}
                            </Text>
                        </View>
                        {checks[item.key as keyof typeof checks] ? (
                            <Ionicons name="checkmark-circle" size={24} color="#1A1A1A" />
                        ) : (
                            <View style={styles.emptyCircle} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>現場 Evidence (Photos)</Text>
            <Text style={styles.sectionSub}>Take real-time, high-res verification photos.</Text>
            
            <View style={styles.photoGrid}>
                <TouchableOpacity style={styles.addPhotoBtn}>
                    <Feather name="camera" size={24} color="#000" />
                    <Text style={styles.addPhotoText}>Capture</Text>
                </TouchableOpacity>
                <View style={styles.photoPlaceholder} />
                <View style={styles.photoPlaceholder} />
                <View style={styles.photoPlaceholder} />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Field Agent Observations</Text>
            <View style={styles.notesContainer}>
                <TextInput 
                    style={styles.notesInput}
                    placeholder="Enter detailed neighborhood notes, noise levels, and security context..."
                    placeholderTextColor="#ADB5BD"
                    multiline
                    numberOfLines={4}
                />
            </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleFinish}>
            <Text style={styles.submitBtnText}>Submit Field Report</Text>
            <Feather name="upload-cloud" size={18} color="#1A1A1A" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  scroll: { padding: 24 },

  propHeader: { marginBottom: 32 },
  propName: { fontSize: 26, fontWeight: '900', color: '#000', letterSpacing: -1 },
  propSub: { fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 4 },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#000', marginBottom: 6 },
  sectionSub: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 20 },

  checklist: { gap: 12 },
  checkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: '#F8F9FA', borderRadius: 20, borderWidth: 1, borderColor: '#F1F3F5' },
  checkBtnActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  checkLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  checkLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  checkLabelActive: { color: '#1A1A1A' },
  emptyCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  addPhotoBtn: { width: '48%', aspectRatio: 1, borderRadius: 20, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#F1F3F5', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addPhotoText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  photoPlaceholder: { width: '48%', aspectRatio: 1, borderRadius: 20, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#F1F3F5' },

  notesContainer: { backgroundColor: '#F8F9FA', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F3F5' },
  notesInput: { fontSize: 14, color: '#1A1A1A', fontWeight: '600', minHeight: 100, textAlignVertical: 'top' },

  submitBtn: { flexDirection: 'row', backgroundColor: KiraColors.primary, borderRadius: 20, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  submitBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '800' },
});
