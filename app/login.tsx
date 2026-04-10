import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';
import { useUser, UserRole } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();

  const handleLogin = async () => {
    // ─── MOCK USERS ───────────────────────────────────────────────────────────
    const MOCK_USERS: Record<string, { pass: string; role: UserRole; name: string }> = {
      'tenant@kiranet.com': { pass: 'pass123', role: 'tenant', name: 'Tadesse Renter' },
      'landlord@kiranet.com': { pass: 'pass123', role: 'landlord', name: 'Lomi Landlord' },
    };

    const user = MOCK_USERS[email.toLowerCase()];

    if (user && user.pass === password) {
       try {
         await login(email, user.role);
         await AsyncStorage.setItem('@user_name', user.name);
         await AsyncStorage.setItem('@user_email', email);
         router.replace('/(tabs)');
       } catch (e) {
         Alert.alert('System Error', 'Failed to initialize session.');
       }
    } else {
      Alert.alert(
        'Invalid Credentials', 
        'Try:\n' + 
        '• RENTER: tenant@kiranet.com / pass123\n' + 
        '• LANDLORD: landlord@kiranet.com / pass123'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerToggleRow}>
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

          <View style={styles.topSection}>
            <View style={styles.logoCircle}>
              <FontAwesome5 name="feather-alt" size={24} color="#000" />
            </View>
            <Text style={styles.welcomeText}>{t.welcomeBack}</Text>
            <Text style={styles.subWelcome}>{t.secureAccess}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={16} color="#000" />
                <TextInput 
                  style={styles.textInput}
                  placeholder={t.emailPlaceholder}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.fieldLabel}>{t.passwordLabel}</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>{t.forgotPassword}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={16} color="#000" />
                <TextInput 
                  style={styles.textInput}
                  placeholder={t.passwordPlaceholder}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
              <Text style={styles.primaryBtnText}>{t.signIn}</Text>
              <Feather name="arrow-right" size={18} color="#1A1A1A" />
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>SECURE LOGIN</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome5 name="google" size={18} color="#000" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome5 name="apple" size={20} color="#000" />
                <Text style={styles.socialBtnText}>Apple ID</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.footerLink} onPress={() => router.push('/signup')}>
            <Text style={styles.footerText}>{t.noAccount} <Text style={styles.footerBold}>{t.signUpLink}</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 30, paddingVertical: 40, justifyContent: 'center' },
  
  topSection: { marginBottom: 48 },
  headerToggleRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  langPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1
  },
  langPillText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A' },
  logoCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#C8E6C9' },
  welcomeText: { fontSize: 42, fontWeight: '900', color: KiraColors.primary, letterSpacing: -2, lineHeight: 46 },
  subWelcome: { fontSize: 15, color: '#64748B', fontWeight: '500', marginTop: 8 },

  card: { backgroundColor: '#FFF', borderRadius: 0 },
  inputGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 10, fontWeight: '900', color: KiraColors.primary, letterSpacing: 1.5, marginBottom: 12 },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { fontSize: 10, fontWeight: '800', color: '#64748B', marginBottom: 10 },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  textInput: { flex: 1, fontSize: 14, color: '#000', fontWeight: '600', marginLeft: 12 },

  primaryBtn: { flexDirection: 'row', backgroundColor: KiraColors.primary, borderRadius: 18, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  primaryBtnText: { color: '#1A1A1A', fontSize: 16, fontWeight: '800' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: '#F1F3F5' },
  orText: { fontSize: 9, fontWeight: '900', color: '#ADB5BD', paddingHorizontal: 16, letterSpacing: 2 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F3F5', borderRadius: 16, paddingVertical: 16 },
  socialBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },

  footerLink: { marginTop: 48, alignItems: 'center' },
  footerText: { fontSize: 13, color: '#4A5568' },
  footerBold: { fontWeight: '900', color: '#000' },
});
