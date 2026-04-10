import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.topSection}>
            <View style={styles.logoCircle}>
              <FontAwesome5 name="feather-alt" size={24} color="#000" />
            </View>
            <Text style={styles.welcomeText}>Welcome back.</Text>
            <Text style={styles.subWelcome}>Secure access to the Kira-Net ecosystem.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={16} color="#000" />
                <TextInput 
                  style={styles.textInput}
                  placeholder="name@kira.net"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Reset?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={16} color="#000" />
                <TextInput 
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.primaryBtnText}>Continue</Text>
              <Feather name="arrow-right" size={18} color="#FFF" />
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
            <Text style={styles.footerText}>New to Kira-Net? <Text style={styles.footerBold}>Create an account</Text></Text>
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
