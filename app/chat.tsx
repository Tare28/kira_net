import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Feather name="arrow-left" size={24} color="#005C3A" />
          </TouchableOpacity>
          
          <View style={styles.headerProfile}>
            <Image 
              source="https://images.unsplash.com/photo-1549068106-b024baf5062d?q=80&w=200&auto=format&fit=crop"
              style={styles.avatarUrl}
            />
            <View style={styles.headerTextWrap}>
              <View style={styles.nameRow}>
                <Text style={styles.headerName}>Abebe T.</Text>
                <MaterialIcons name="verified" size={14} color="#3B82F6" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.headerRole}>PROPERTY MANAGER</Text>
            </View>
          </View>
          
          <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Ionicons name="call" size={20} color="#005C3A" />
          </TouchableOpacity>
        </View>

        {/* Inquiry Card */}
        <View style={styles.inquiryWrapper}>
          <View style={styles.inquiryCard}>
            <Image 
              source="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=300&auto=format&fit=crop"
              style={styles.inquiryImage}
            />
            <View style={styles.inquiryInfo}>
              <Text style={styles.inquiryLabel}>INQUIRY FOR</Text>
              <Text style={styles.inquiryTitle}>Bole Luxury Apartment</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={12} color="#4A5568" />
                <Text style={styles.locationText}>Bole, Addis Ababa</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.datePillRow}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>TODAY</Text>
            </View>
          </View>

          {/* Left Bubble */}
          <View style={styles.messageRowLeft}>
            <View style={styles.bubbleLeft}>
              <Text style={styles.bubbleTextLeft}>Hello! Are you still interested in the Bole apartment?</Text>
            </View>
            <Text style={styles.timeTextLeft}>10:42 AM</Text>
          </View>

          {/* Right Bubble */}
          <View style={styles.messageRowRight}>
            <View style={styles.bubbleRight}>
              <Text style={styles.bubbleTextRight}>Yes, I am. Is it available for viewing tomorrow?</Text>
            </View>
            <Text style={styles.timeTextRight}>10:45 AM • Delivered</Text>
          </View>

          {/* Left Bubble */}
          <View style={styles.messageRowLeft}>
            <View style={styles.bubbleLeft}>
              <Text style={styles.bubbleTextLeft}>Yes, 4 PM works for me.</Text>
            </View>
            <Text style={styles.timeTextLeft}>10:46 AM</Text>
          </View>

        </ScrollView>

        {/* Input Footer */}
        <View style={styles.inputFooter}>
          <TouchableOpacity style={styles.attachBtn}>
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.textInputBox}>
            <TextInput 
              placeholder="Message..."
              placeholderTextColor="#9CA3AF"
              style={styles.inputField}
            />
          </View>

          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={18} color="#1A1A1A" style={{ marginLeft: 2 }} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  avatarUrl: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextWrap: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#005C3A',
  },
  headerRole: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  inquiryWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  inquiryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inquiryImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  inquiryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  inquiryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#926C15',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  inquiryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#005C3A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#4A5568',
    marginLeft: 4,
  },
  chatScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  datePillRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  datePill: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  datePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  messageRowLeft: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bubbleLeft: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    marginBottom: 4,
  },
  bubbleTextLeft: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  timeTextLeft: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4,
  },
  messageRowRight: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  bubbleRight: {
    backgroundColor: '#005C3A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    marginBottom: 4,
  },
  bubbleTextRight: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  timeTextRight: {
    fontSize: 11,
    color: '#6B7280',
    marginRight: 4,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  attachBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInputBox: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    justifyContent: 'center',
    minHeight: 44,
  },
  inputField: {
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
    margin: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBC02D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
