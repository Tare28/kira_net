import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { KiraColors } from '@/constants/colors';

export default function UploadPaymentScreen() {
  const params = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [amount, setAmount] = useState(params.amount as string || '');
  const [reference, setReference] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [bank, setBank] = useState('CBE');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please upload a screenshot of your bank transfer receipt.');
      return;
    }
    if (!amount) {
      Alert.alert('Missing Amount', 'Please enter the amount paid.');
      return;
    }

    setIsUploading(true);
    // Simulate upload to Supabase Storage and DB update
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Payment Submitted', 
        'Your receipt has been uploaded and is pending verification by our finance team.',
        [{ text: 'Great', onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Payment</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Summary Section */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
                <MaterialCommunityIcons name="bank-transfer" size={24} color={KiraColors.primary} />
            </View>
            <View>
                <Text style={styles.summaryLabel}>Property / Service</Text>
                <Text style={styles.summaryValue}>{params.title || 'Platform Subscription'}</Text>
            </View>
          </View>

          {/* Bank Instructions */}
          <View style={styles.instructionCard}>
            <Text style={styles.sectionTitle}>TRANSFER DETAILS</Text>
            <View style={styles.bankRow}>
                <View style={styles.bankCircle}>
                    <Text style={styles.bankText}>CBE</Text>
                </View>
                <View>
                    <Text style={styles.accountName}>Kira-Net Digital Solutions</Text>
                    <Text style={styles.accountNumber}>1000 4567 8901 2</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Copied', 'Account number copied to clipboard')}>
                    <Feather name="copy" size={16} color={KiraColors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.bankRow}>
                <View style={[styles.bankCircle, { backgroundColor: '#FFD700' }]}>
                    <Text style={[styles.bankText, { color: '#000' }]}>BIRR</Text>
                </View>
                <View>
                    <Text style={styles.accountName}>Telebirr Merchant</Text>
                    <Text style={styles.accountNumber}>889901</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Copied', 'Merchant ID copied to clipboard')}>
                    <Feather name="copy" size={16} color={KiraColors.primary} />
                </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Payment Submission</Text>
            
            <Text style={styles.inputLabel}>Amount Paid (ETB)</Text>
            <View style={styles.inputWrapper}>
                <Feather name="dollar-sign" size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.textInput} 
                  placeholder="e.g. 25,000" 
                  value={amount} 
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
            </View>

            <Text style={styles.inputLabel}>Transaction ID / Reference (Optional)</Text>
            <View style={styles.inputWrapper}>
                <Feather name="hash" size={18} color="#94A3B8" />
                <TextInput 
                  style={styles.textInput} 
                  placeholder="e.g. FT23045..." 
                  value={reference} 
                  onChangeText={setReference}
                />
            </View>

            <Text style={styles.inputLabel}>Proof of Payment (Screenshot)</Text>
            <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
              {image ? (
                <View style={styles.imagePreviewWrap}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <View style={styles.changeBadge}>
                    <Feather name="refresh-cw" size={14} color="#FFF" />
                    <Text style={styles.changeText}>Change</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={styles.uploadIconWrap}>
                    <Feather name="image" size={32} color={KiraColors.primary} />
                  </View>
                  <Text style={styles.uploadMainText}>Tap to select screenshot</Text>
                  <Text style={styles.uploadSubText}>JPEG, PNG up to 5MB</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoNote}>
            <Feather name="info" size={14} color="#64748B" />
            <Text style={styles.infoNoteText}>
              Verifications usually take 1-4 hours during business hours.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, isUploading && styles.submitBtnDisabled]} 
            onPress={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Submit Receipt</Text>
                <Feather name="upload-cloud" size={18} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  scrollContent: { padding: 24 },

  summaryCard: { 
    flexDirection: 'row', alignItems: 'center', gap: 16, 
    backgroundColor: '#F8FAFC', padding: 18, borderRadius: 20, 
    borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 
  },
  summaryIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 15, fontWeight: '900', color: '#1A1A1A', marginTop: 2 },

  instructionCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 24 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1, marginBottom: 16 },
  bankRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 16 },
  bankCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0067B1', alignItems: 'center', justifyContent: 'center' },
  bankText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  accountName: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  accountNumber: { fontSize: 12, fontWeight: '700', color: '#64748B', marginTop: 2 },

  formSection: { marginBottom: 24 },
  formTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', marginBottom: 10, marginLeft: 4 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, 
    backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, 
    borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 
  },
  textInput: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1A1A1A' },

  uploadArea: { 
    width: '100%', height: 220, borderRadius: 24, 
    borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', 
    backgroundColor: '#F8FAFC', overflow: 'hidden' 
  },
  uploadPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  uploadIconWrap: { 
    width: 64, height: 64, borderRadius: 32, 
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', 
    marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 
  },
  uploadMainText: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  uploadSubText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },

  imagePreviewWrap: { flex: 1, position: 'relative' },
  imagePreview: { width: '100%', height: '100%' },
  changeBadge: { 
    position: 'absolute', bottom: 12, right: 12, 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 
  },
  changeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  infoNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24, paddingHorizontal: 8 },
  infoNoteText: { fontSize: 12, color: '#64748B', fontWeight: '500' },

  submitBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, 
    backgroundColor: '#1A1A1A', paddingVertical: 18, borderRadius: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});
