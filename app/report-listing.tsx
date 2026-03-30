import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';

export default function ReportListingScreen() {
  const [selectedReason, setSelectedReason] = useState('');
  
  const reasons = [
    'Fake photos',
    'Incorrect price',
    'Possible scam',
    'Property no longer available',
    'Other'
  ];

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
          <Text style={styles.headerTitle}>Report Listing</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.pageTitle}>Report this listing</Text>
          <Text style={styles.pageSubtitle}>
            Your safety is our priority. Reporting suspicious or inaccurate listings helps us maintain a trustworthy community for everyone seeking a home in Ethiopia.
          </Text>

          <Text style={styles.sectionTitle}>SELECT A REASON</Text>
          
          {reasons.map((reason) => (
            <TouchableOpacity 
              key={reason}
              style={styles.reasonCard}
              onPress={() => setSelectedReason(reason)}
              activeOpacity={0.8}
            >
              <View style={[styles.radioOuter, selectedReason === reason && styles.radioOuterSelected]}>
                {selectedReason === reason && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.reasonText}>{reason}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>DETAILS</Text>
          
          <View style={styles.textAreaContainer}>
            <TextInput 
              style={styles.textArea}
              placeholder="Please provide more context about your report..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.privacyNoteRow}>
            <Ionicons name="information-circle-sharp" size={14} color="#4A5568" />
            <Text style={styles.privacyNoteText}>
              Personal information provided is protected under our Privacy Policy.
            </Text>
          </View>

          <View style={styles.reportingListingCard}>
            <Image 
              source="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=200&auto=format&fit=crop" 
              style={styles.listingImage}
            />
            <View style={styles.listingDetails}>
              <Text style={styles.listingLabel}>REPORTING LISTING</Text>
              <Text style={styles.listingTitle}>Modern Duplex in Bole Atlas</Text>
              <Text style={styles.listingLocation}>Addis Ababa, Ethiopia</Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioOuterSelected: {
    borderColor: '#005C3A',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#005C3A',
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  textAreaContainer: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  textArea: {
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    padding: 0,
  },
  privacyNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  privacyNoteText: {
    fontSize: 11,
    color: '#4A5568',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  reportingListingCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 12,
  },
  listingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  listingDetails: {
    marginLeft: 12,
    justifyContent: 'center',
    flex: 1,
  },
  listingLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#926C15',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  listingLocation: {
    fontSize: 12,
    color: '#4A5568',
  },
  footer: {
    padding: 20,
    backgroundColor: '#F7F8F9',
  },
  submitButton: {
    backgroundColor: '#006C45',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#005C3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
