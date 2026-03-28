import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ListPropertyScreen() {
  const [waterStatus, setWaterStatus] = useState('Yes');
  const [electricType, setElectricType] = useState('Private');
  const [internetType, setInternetType] = useState('Available');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Feather name="arrow-left" size={20} color="#005C3A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Your Property</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Property Media */}
          <Text style={styles.sectionTitle}>Property Media</Text>
          <TouchableOpacity style={styles.uploadArea}>
            <View style={styles.uploadIconWrap}>
              <MaterialIcons name="camera-alt" size={24} color="#005C3A" />
              <View style={styles.plusOverlay}>
                <Feather name="plus" size={10} color="#FFF" />
              </View>
            </View>
            <Text style={styles.uploadTitle}>Upload property photos</Text>
            <Text style={styles.uploadSubtitle}>Add up to 10 high-quality images</Text>
          </TouchableOpacity>

          <View style={styles.mediaThumbnailsRow}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.mediaThumbnail}>
                <Feather name="image" size={16} color="#6B7280" />
              </View>
            ))}
            <TouchableOpacity style={styles.mediaAddThumbnail}>
              <Feather name="plus" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Basic Information</Text>
          
          <Text style={styles.inputLabel}>Monthly Rent (ETB)</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
            <Text style={styles.inputAdornment}>ETB</Text>
          </View>

          <Text style={styles.inputLabel}>District / Sub-city</Text>
          <TouchableOpacity style={[styles.inputContainer, { justifyContent: 'space-between' }]}>
            <Text style={{ color: '#6B7280', fontSize: 13, fontWeight: '500' }}>Select Location</Text>
            <Feather name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Property Description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={styles.textArea}
              placeholder="Describe the rooms, neighborhood features, and any specific house rules..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Utilities & Amenities */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Utilities & Amenities</Text>
          
          <View style={styles.utilityCard}>
            <View style={[styles.utilityIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="water" size={16} color="#0EA5E9" />
            </View>
            <View style={styles.utilityTextWrap}>
              <Text style={styles.utilityTitle}>Constant Water Supply</Text>
              <Text style={styles.utilitySubtitle}>24/7 access to running water</Text>
            </View>
            <View style={styles.pillToggle}>
              <TouchableOpacity 
                style={[styles.pillOption, waterStatus === 'Yes' && styles.pillOptionActive]}
                onPress={() => setWaterStatus('Yes')}
              >
                <Text style={[styles.pillText, waterStatus === 'Yes' && styles.pillTextActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pillOption, waterStatus === 'No' && styles.pillOptionActive]}
                onPress={() => setWaterStatus('No')}
              >
                <Text style={[styles.pillText, waterStatus === 'No' && styles.pillTextActive]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.utilityCard}>
            <View style={[styles.utilityIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="flash" size={16} color="#D97706" />
            </View>
            <View style={styles.utilityTextWrap}>
              <Text style={styles.utilityTitle}>Electricity Meter</Text>
              <Text style={styles.utilitySubtitle}>Private or shared connection</Text>
            </View>
            <View style={[styles.pillToggle, { width: 130 }]}>
              <TouchableOpacity 
                style={[styles.pillOption, electricType === 'Shared' && styles.pillOptionActive]}
                onPress={() => setElectricType('Shared')}
              >
                <Text style={[styles.pillText, electricType === 'Shared' && styles.pillTextActive]}>Shared</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pillOption, electricType === 'Private' && styles.pillOptionActive]}
                onPress={() => setElectricType('Private')}
              >
                <Text style={[styles.pillText, electricType === 'Private' && styles.pillTextActive]}>Private</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.utilityCard}>
            <View style={[styles.utilityIconWrap, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="router-wireless" size={16} color="#059669" />
            </View>
            <View style={styles.utilityTextWrap}>
              <Text style={styles.utilityTitle}>Fiber Internet</Text>
              <Text style={styles.utilitySubtitle}>High-speed broadband availability</Text>
            </View>
            <View style={[styles.pillToggle, { width: 130 }]}>
              <TouchableOpacity 
                style={[styles.pillOption, internetType === 'Available' && styles.pillOptionActive]}
                onPress={() => setInternetType('Available')}
              >
                <Text style={[styles.pillText, internetType === 'Available' && styles.pillTextActive]}>Available</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pillOption, internetType === 'None' && styles.pillOptionActive]}
                onPress={() => setInternetType('None')}
              >
                <Text style={[styles.pillText, internetType === 'None' && styles.pillTextActive]}>None</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Request Verification */}
          <View style={styles.verificationCard}>
            <View style={styles.verifyHeader}>
              <MaterialIcons name="verified" size={18} color="#005C3A" />
              <Text style={styles.verifyTitle}>Request Verification</Text>
            </View>
            <Text style={styles.verifySubtitle}>
              Our team will visit to inspect and add the Verified badge to your listing. This increases tenant trust by up to 80%.
            </Text>
            <View style={styles.verifySwitchPosition}>
              <View style={styles.verifySwitchBg} />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Listing</Text>
            <Ionicons name="send" size={14} color="#FFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <Text style={styles.submitDisclaimer}>
            By submitting, you agree to Kira-Net's Landlord{'\n'}Terms of Service and Privacy Policy.
          </Text>

        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Feather name="x" size={18} color="#4A5568" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveDraftBtn}>
            <Ionicons name="save-outline" size={16} color="#1A1A1A" />
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBFB',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#005C3A',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  uploadArea: {
    width: '100%',
    backgroundColor: '#F7F8F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  plusOverlay: {
    position: 'absolute',
    top: 6,
    right: 4,
    backgroundColor: '#005C3A',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  mediaThumbnailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  mediaAddThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    padding: 0,
  },
  inputAdornment: {
    fontSize: 12,
    fontWeight: '700',
    color: '#005C3A',
  },
  textAreaContainer: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
  },
  textArea: {
    fontSize: 13,
    color: '#1F2937',
    minHeight: 80,
    padding: 0,
  },
  utilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  utilityIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  utilityTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  utilityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  utilitySubtitle: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
  pillToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 2,
    width: 100,
  },
  pillOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 14,
  },
  pillOptionActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A5568',
  },
  pillTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  verificationCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    position: 'relative',
  },
  verifyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  verifySubtitle: {
    fontSize: 11,
    color: '#4A5568',
    lineHeight: 16,
    paddingRight: 30, // Make room for switch placeholder
  },
  verifySwitchPosition: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  verifySwitchBg: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    // pseudo-thumb:
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#005C3A',
    borderRadius: 24,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#005C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  submitDisclaimer: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFBFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cancelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 4,
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBC02D',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
});
