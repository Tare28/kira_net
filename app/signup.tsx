import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  KeyboardAvoidingView, Platform, ScrollView, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';

export default function SignupScreen() {
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <View style={styles.headerArea}>
            <Text style={styles.title}>Join Kira-Net.</Text>
            <Text style={styles.subtitle}>Create an account to start your journey</Text>
          </View>

          <View style={styles.rolePicker}>
             <TouchableOpacity 
                style={[styles.roleBtn, role === 'tenant' && styles.roleBtnActive]} 
                onPress={() => setRole('tenant')}
             >
                <Ionicons name="person" size={18} color={role === 'tenant' ? '#FFF' : '#64748B'} />
                <Text style={[styles.roleBtnText, role === 'tenant' && styles.roleBtnTextActive]}>TENANT</Text>
             </TouchableOpacity>
             <TouchableOpacity 
                style={[styles.roleBtn, role === 'landlord' && styles.roleBtnActive]} 
                onPress={() => setRole('landlord')}
             >
                <Ionicons name="business" size={18} color={role === 'landlord' ? '#FFF' : '#64748B'} />
                <Text style={[styles.roleBtnText, role === 'landlord' && styles.roleBtnTextActive]}>LANDLORD</Text>
             </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Full Name */}
            <Text style={styles.label}>FULL NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="Abebe Kebede"
                placeholderTextColor="#9CA3AF"
              />
              <Feather name="user" size={18} color="#9CA3AF" />
            </View>

            {/* Phone Number */}
            <Text style={[styles.label, { marginTop: 20 }]}>PHONE NUMBER</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="+251 9--"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              <Feather name="phone" size={18} color="#9CA3AF" />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 20 }]}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
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

            <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.signupBtnText}>Create Account</Text>
              <Feather name="check" size={18} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          <View style={styles.loginWrap}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Login</Text>
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
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  headerArea: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#64748B', fontWeight: '500', marginTop: 4 },
  
  rolePicker: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  roleBtnActive: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  roleBtnText: { fontSize: 12, fontWeight: '800', color: '#64748B' },
  roleBtnTextActive: { color: '#FFF' },

  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  label: { fontSize: 11, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  textInput: { flex: 1, fontSize: 14, color: '#1A1A1A', padding: 0 },
  signupBtn: { flexDirection: 'row', backgroundColor: KiraColors.primary, borderRadius: 30, paddingVertical: 18, justifyContent: 'center', alignItems: 'center', marginTop: 32, marginBottom: 20, shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  signupBtnText: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
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
