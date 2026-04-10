import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLanguage } from '@/context/LanguageContext';

export default function SignupScreen() {
  const { t, language, setLanguage } = useLanguage();
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const { login } = useUser();

  const handleSignup = async () => {
    if (!fullName || !email) {
      alert('Full name and email are required');
      return;
    }

    try {
      await login(email, role);
      await AsyncStorage.setItem('@user_name', fullName);
      await AsyncStorage.setItem('@user_email', email);
      router.replace('/(tabs)');
    } catch (e) {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.langPill}
              onPress={() => {
                const nextLang: Record<Language, Language> = { en: 'am', am: 'om', om: 'en' };
                setLanguage(nextLang[language]);
              }}
            >
              <Feather name="globe" size={12} color={KiraColors.primary} />
              <Text style={styles.langPillText}>
                {language === 'en' ? 'English' : language === 'am' ? 'አማርኛ' : 'Oromoo'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerArea}>
            <Text style={styles.title}>{t.createAccount}</Text>
            <Text style={styles.subtitle}>{t.joinEcosystem}</Text>
          </View>

          <View style={styles.rolePicker}>
             <TouchableOpacity 
                style={[styles.roleBtn, role === 'tenant' && styles.roleBtnActive]} 
                onPress={() => setRole('tenant')}
             >
                <Ionicons name="person" size={18} color={role === 'tenant' ? '#FFF' : '#64748B'} />
                <View>
                  <Text style={[styles.roleBtnText, role === 'tenant' && styles.roleBtnTextActive]}>{t.renter.toUpperCase()}</Text>
                  <Text style={[styles.roleSubText, role === 'tenant' && styles.roleSubTextActive]}>Looking for property</Text>
                </View>
             </TouchableOpacity>
             <TouchableOpacity 
                style={[styles.roleBtn, role === 'landlord' && styles.roleBtnActive]} 
                onPress={() => setRole('landlord')}
             >
                <Ionicons name="business" size={18} color={role === 'landlord' ? '#FFF' : '#64748B'} />
                <View>
                  <Text style={[styles.roleBtnText, role === 'landlord' && styles.roleBtnTextActive]}>{t.landlord.toUpperCase()}</Text>
                  <Text style={[styles.roleSubText, role === 'landlord' && styles.roleSubTextActive]}>Posting / Managing</Text>
                </View>
             </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Full Name */}
            <Text style={styles.label}>{t.fullName.toUpperCase()}</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder={t.fullNamePlaceholder}
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
              />
              <Feather name="user" size={18} color="#9CA3AF" />
            </View>

            {/* Phone Number */}
            <Text style={[styles.label, { marginTop: 20 }]}>{t.phone.toUpperCase()}</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder={t.phonePlaceholder}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <Feather name="phone" size={18} color="#9CA3AF" />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 20 }]}>{t.emailLabel.toUpperCase()}</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Feather name="mail" size={18} color="#9CA3AF" />
            </View>

            {role === 'landlord' && (
              <View style={styles.landlordExtra}>
                <View style={styles.landlordDivider}>
                   <View style={styles.dividerLine} />
                   <Text style={styles.dividerText}>LANDLORD PROFILE</Text>
                   <View style={styles.dividerLine} />
                </View>

                {/* ID / License Number */}
                <Text style={styles.label}>GOVERNMENT ID / LICENSE</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Enter ID Serial Number"
                    placeholderTextColor="#9CA3AF"
                    value={idNumber}
                    onChangeText={setIdNumber}
                  />
                  <Feather name="shield" size={18} color="#9CA3AF" />
                </View>

                {/* Property Count */}
                <Text style={[styles.label, { marginTop: 20 }]}>EXPECTED LISTINGS</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="e.g. 1-5 properties"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Feather name="layers" size={18} color="#9CA3AF" />
                </View>

                {/* Operating Area */}
                <Text style={[styles.label, { marginTop: 20 }]}>PRIMARY OPERATION AREA</Text>
                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="e.g. Bole, Kazanchis..."
                    placeholderTextColor="#9CA3AF"
                  />
                  <Feather name="map-pin" size={18} color="#9CA3AF" />
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
              <Text style={styles.signupBtnText}>{t.signUpLink}</Text>
              <Feather name="check" size={18} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <Text style={styles.termsText}>
              {t.agreeTerms}
            </Text>
          </View>

          <View style={styles.loginWrap}>
            <Text style={styles.loginText}>{t.alreadyHave} </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>{t.signInLink}</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  langPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1
  },
  langPillText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A' },
  headerArea: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#64748B', fontWeight: '500', marginTop: 4 },
  
  rolePicker: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    gap: 12, 
    paddingHorizontal: 16,
    paddingVertical: 14, 
    borderRadius: 16, 
    backgroundColor: '#FFF', 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0' 
  },
  roleBtnActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  roleBtnText: { fontSize: 13, fontWeight: '900', color: '#1A1A1A' },
  roleBtnTextActive: { color: '#FFF' },
  roleSubText: { fontSize: 9, fontWeight: '600', color: '#64748B', marginTop: 1 },
  roleSubTextActive: { color: 'rgba(255,255,255,0.8)' },

  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  label: { fontSize: 11, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  textInput: { flex: 1, fontSize: 14, color: '#1A1A1A', padding: 0 },
  signupBtn: { flexDirection: 'row', backgroundColor: KiraColors.primary, borderRadius: 30, paddingVertical: 18, justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 20, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  signupBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  termsText: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 16 },
  termsLink: { color: KiraColors.primary, fontWeight: '700' },
  
  landlordExtra: { marginTop: 24, paddingVertical: 12 },
  landlordDivider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  dividerText: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', paddingHorizontal: 12, letterSpacing: 1 },

  loginWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, paddingBottom: 20 },
  loginText: { fontSize: 13, color: '#4A5568' },
  loginLink: { fontSize: 13, fontWeight: '800', color: KiraColors.primary },
});
