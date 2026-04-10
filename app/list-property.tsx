import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Switch, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

const LOCATIONS = ['Bole', 'Kazanchis', 'Piazza', 'CMC', 'Megenagna', 'Sarbet', 'Ayat'];

export default function ListPropertyScreen() {
  const { role } = useUser();
  const [waterStatus, setWaterStatus] = useState('Yes');
  const [electricType, setElectricType] = useState('Private');
  const [internetType, setInternetType] = useState('Available');
  const [roadAccess, setRoadAccess] = useState('Asphalt');

  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('Select Location');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState('studios');
  const [noiseLevel, setNoiseLevel] = useState(2);
  const [footTraffic, setFootTraffic] = useState('Medium');
  const [parkingAvailable, setParkingAvailable] = useState('Yes');

  if (role === 'tenant') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.restrictedContainer}>
          <View style={styles.iconCircle}>
             <MaterialIcons name="business" size={48} color={KiraColors.primary} />
          </View>
          <Text style={styles.restrictedTitle}>Listings are for Landlords</Text>
          <Text style={styles.restrictedSubtitle}>
            To post properties on Kira-Net, you need to switch your account to Landlord mode in Profile settings.
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace('/(tabs)/profile')}>
            <Text style={styles.upgradeBtnText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const CATEGORIES = [
    { key: 'studios', label: 'Studio' },
    { key: '1bed', label: '1 Bed Room' },
    { key: '2bed', label: '2 Bed Room' },
    { key: 'shop', label: 'Shop' },
    { key: 'cafe', label: 'Cafe' },
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'other', label: 'Other' },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const submitListing = () => {
    Alert.alert('Success', 'Property listing submitted successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post New Property</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Photos Section */}
          <Text style={styles.sectionTitle}>PROPERTY PHOTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                   style={styles.removePhoto}
                   onPress={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color={KiraColors.danger} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
              <Feather name="plus" size={32} color={KiraColors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Location details */}
          <View style={styles.card}>
            <Text style={styles.label}>PROPERTY CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                   key={cat.key} 
                   style={[styles.categoryOption, propertyCategory === cat.key && styles.categoryOptionActive]}
                   onPress={() => setPropertyCategory(cat.key)}
                >
                  <Text style={[styles.categoryOptionText, propertyCategory === cat.key && styles.categoryOptionTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { marginTop: 24 }]}>LISTING TITLE</Text>
            <TextInput style={styles.input} placeholder="e.g. Modern Villa with Garden" placeholderTextColor="#9CA3AF" />

            <Text style={[styles.label, { marginTop: 20 }]}>MONTHLY RENT (ETB)</Text>
            <TextInput style={styles.input} placeholder="e.g. 25,000" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

            <Text style={[styles.label, { marginTop: 20 }]}>LOCATION / AREA</Text>
            <TouchableOpacity style={styles.locationSelector} onPress={() => setShowLocationModal(true)}>
              <Text style={styles.locationSelectorText}>{location}</Text>
              <Feather name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 20 }]}>FULL ADDRESS (OPTIONAL)</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="House No, Sub-city, Neighborhood details..." multiline placeholderTextColor="#9CA3AF" />
          </View>

          {/* Key Utilities */}
          <Text style={styles.sectionTitle}>UTILITIES & ACCESS</Text>
          <View style={styles.card}>
            <Text style={styles.label}>WATER AVAILABILITY</Text>
            <View style={styles.pillRow}>
              {['Yes', 'Limited', 'Tanker Only'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.pill, waterStatus === opt && styles.pillActive]}
                  onPress={() => setWaterStatus(opt)}
                >
                  <Text style={[styles.pillText, waterStatus === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>ELECTRICITY LINE</Text>
            <View style={styles.pillRow}>
              {['Private', 'Shared'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.pill, electricType === opt && styles.pillActive]}
                  onPress={() => setElectricType(opt)}
                >
                  <Text style={[styles.pillText, electricType === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>ROAD ACCESS</Text>
            <View style={styles.pillRow}>
              {['Asphalt', 'Cobblestone', 'Dirt'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.pill, roadAccess === opt && styles.pillActive]}
                  onPress={() => setRoadAccess(opt)}
                >
                  <Text style={[styles.pillText, roadAccess === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>CAR PARKING</Text>
            <View style={styles.pillRow}>
              {['Yes', 'Street Only', 'No'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.pill, parkingAvailable === opt && styles.pillActive]}
                  onPress={() => setParkingAvailable(opt)}
                >
                  <Text style={[styles.pillText, parkingAvailable === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Commercial / Neighborhood specific */}
          <Text style={styles.sectionTitle}>ENVIRONMENTAL DETAILS</Text>
          <View style={styles.card}>
            <Text style={styles.label}>NOISE LEVEL (1-5)</Text>
            <View style={styles.pillRow}>
              {[1, 2, 3, 4, 5].map(nu => (
                <TouchableOpacity 
                  key={nu} 
                  style={[styles.pill, noiseLevel === nu && styles.pillActive]}
                  onPress={() => setNoiseLevel(nu)}
                >
                  <Text style={[styles.pillText, noiseLevel === nu && styles.pillTextActive]}>{nu}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.helperText}>1 = Quiet, 5 = Near busy commercial area</Text>

            <Text style={[styles.label, { marginTop: 20 }]}>FOOT TRAFFIC</Text>
            <View style={styles.pillRow}>
              {['High', 'Medium', 'Low'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.pill, footTraffic === opt && styles.pillActive]}
                  onPress={() => setFootTraffic(opt)}
                >
                  <Text style={[styles.pillText, footTraffic === opt && styles.pillTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.verifySection}>
            <Switch 
              value={isVerified} 
              onValueChange={setIsVerified}
              trackColor={{ false: '#767577', true: KiraColors.primary }}
              thumbColor={isVerified ? '#FFF' : '#f4f3f4'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.verifyTitle}>I agree to the validation terms</Text>
              <Text style={styles.verifySub}>Agent will visit the property to verify all listed details.</Text>
            </View>
          </View>

          <TouchableOpacity 
             style={[styles.submitBtn, (!isVerified || images.length === 0) && styles.submitBtnDisabled]} 
             onPress={submitListing}
             disabled={!isVerified || images.length === 0}
          >
            <Text style={styles.submitBtnText}>Post Listing for Verification</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Area</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <FlatList 
              data={LOCATIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                   style={styles.locationItem}
                   onPress={() => {
                     setLocation(item);
                     setShowLocationModal(false);
                   }}
                >
                  <Feather name="map-pin" size={16} color="#4A5568" />
                  <Text style={styles.locationItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 12,
  },
  imagesScroll: {
    paddingLeft: 20,
    marginBottom: 8,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 20,
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#DCFCE7',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 32,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '800',
    color: KiraColors.primary,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  locationSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  pillActive: {
    backgroundColor: KiraColors.primary,
    borderColor: KiraColors.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  pillTextActive: {
    color: '#FFF',
  },
  helperText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  verifySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  verifySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  submitBtn: {
    backgroundColor: KiraColors.primary,
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1FAFF',
  },
  locationItemText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
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
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  categoryScroll: {
    paddingRight: 20,
    paddingBottom: 4,
  },
  categoryOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  categoryOptionActive: {
    backgroundColor: KiraColors.primary,
    borderColor: '#9CC942',
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A5568',
  },
  categoryOptionTextActive: {
    color: '#FFF',
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FAFBFB',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  restrictedTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  restrictedSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  upgradeBtn: {
    backgroundColor: KiraColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: KiraColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
});
