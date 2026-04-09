import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { KiraColors } from '@/constants/colors';

// ─── Auto-reply templates (landlord side) ─────────────────────────────────────
const AUTO_REPLIES: Record<string, string> = {
  available: "Yes, the house is still available ✅",
  visit:     "You can visit after 5 PM on weekdays. Weekends 9 AM – 12 PM 🕔",
  price:     "The rent is 25,000 ETB/month with 3 months deposit required.",
  water:     "Water supply is constant (city + backup tank) 💧",
  internet:  "Yes, fiber-optic internet is included in the rent 🌐",
  parking:   "There is a private parking space for one vehicle 🚗",
  pets:      "Sorry, pets are not allowed in this property 🐾",
  furnished: "The apartment is fully furnished with modern furniture 🛋️",
  deposit:   "Deposit is 3 months (75,000 ETB), refundable on checkout.",
  negotiate: "The price is fixed, but I can offer a small discount for 6-month upfront payment.",
};

const QUICK_REPLY_LABELS: { key: keyof typeof AUTO_REPLIES; label: string }[] = [
  { key: 'available', label: '🏠 Still available?' },
  { key: 'visit',     label: '📅 Visit time' },
  { key: 'price',     label: '💰 Price details' },
  { key: 'water',     label: '💧 Water supply' },
  { key: 'internet',  label: '🌐 Internet' },
  { key: 'parking',   label: '🚗 Parking' },
  { key: 'pets',      label: '🐾 Pets allowed?' },
  { key: 'furnished', label: '🛋️ Furnished?' },
  { key: 'deposit',   label: '🔑 Deposit terms' },
  { key: 'negotiate', label: '🤝 Negotiate' },
];

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'landlord';
  time: string;
  status: 'sent' | 'delivered' | 'read';
  isAutoReply?: boolean;
};

function formatTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Hello! Are you still interested in the Bole apartment?', sender: 'landlord', time: '10:42 AM', status: 'read' },
  { id: '2', text: 'Yes, I am. Is it available for viewing tomorrow?',         sender: 'user',     time: '10:45 AM', status: 'read' },
  { id: '3', text: 'Yes, 4 PM works for me. See you then!',                    sender: 'landlord', time: '10:46 AM', status: 'read' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLandlordMode, setIsLandlordMode] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(typingAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnim.stopAnimation();
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMessage = (text: string, isAutoReply = false) => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: isLandlordMode ? 'landlord' : 'user',
      time: formatTime(),
      status: 'sent',
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    scrollToBottom();

    // If user sends a message, simulate landlord auto-reply after delay
    if (!isLandlordMode && !isAutoReply) {
      simulateLandlordTyping(text.trim().toLowerCase());
    }
  };

  const simulateLandlordTyping = (userText: string) => {
    // Find matching auto-reply
    const matched = Object.entries(AUTO_REPLIES).find(([key]) =>
      userText.includes(key) ||
      (key === 'available' && (userText.includes('available') || userText.includes('still'))) ||
      (key === 'visit' && (userText.includes('visit') || userText.includes('see') || userText.includes('view'))) ||
      (key === 'price' && (userText.includes('price') || userText.includes('rent') || userText.includes('cost'))) ||
      (key === 'water' && userText.includes('water')) ||
      (key === 'internet' && (userText.includes('internet') || userText.includes('wifi'))) ||
      (key === 'parking' && userText.includes('park')) ||
      (key === 'pets' && (userText.includes('pet') || userText.includes('dog') || userText.includes('cat'))) ||
      (key === 'furnished' && (userText.includes('furnish') || userText.includes('furniture'))) ||
      (key === 'deposit' && userText.includes('deposit')) ||
      (key === 'negotiate' && (userText.includes('negotiat') || userText.includes('discount') || userText.includes('reduce')))
    );

    const reply = matched
      ? matched[1]
      : "Thanks for your message! I'll get back to you shortly. 🙏";

    setIsTyping(true);
    scrollToBottom();

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      const autoMsg: Message = {
        id: Date.now().toString(),
        text: reply,
        sender: 'landlord',
        time: formatTime(),
        status: 'delivered',
        isAutoReply: true,
      };
      setMessages(prev => [...prev, autoMsg]);
      scrollToBottom();
    }, delay);
  };

  const sendAutoReply = (key: keyof typeof AUTO_REPLIES) => {
    const reply = AUTO_REPLIES[key];
    sendMessage(reply, true);
    setShowQuickReplies(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerProfile} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              <Image
                source="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                style={styles.avatarImg}
              />
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.headerText}>
              <View style={styles.nameRow}>
                <Text style={styles.headerName}>Abebe T.</Text>
                <MaterialIcons name="verified" size={14} color="#3B82F6" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.headerRole}>Property Manager · Online</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {/* Landlord Mode Toggle */}
            <TouchableOpacity
              style={[styles.modeBtn, isLandlordMode && styles.modeBtnActive]}
              onPress={() => {
                setIsLandlordMode(p => !p);
                Alert.alert(
                  isLandlordMode ? '👤 Tenant Mode' : '🏠 Landlord Mode',
                  isLandlordMode
                    ? 'Switched to tenant view.'
                    : 'Now viewing as landlord. Tap ⚡ for auto-reply templates.'
                );
              }}
            >
              <MaterialCommunityIcons
                name={isLandlordMode ? 'home' : 'account'}
                size={16}
                color={isLandlordMode ? KiraColors.primary : KiraColors.muted}
              />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="call" size={20} color={KiraColors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Property Card ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.propertyCard}
          activeOpacity={0.88}
          onPress={() => router.push({ pathname: '/property-details', params: { id: '1' } })}
        >
          <Image
            source="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=300&auto=format&fit=crop"
            style={styles.propertyImg}
          />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyLabel}>INQUIRY FOR</Text>
            <Text style={styles.propertyTitle}>The Summit Residency</Text>
            <View style={styles.propertyLocRow}>
              <Ionicons name="location-sharp" size={11} color="#4A5568" />
              <Text style={styles.propertyLoc}>Bole, Addis Ababa</Text>
            </View>
          </View>
          <View style={styles.propertyPrice}>
            <Text style={styles.propertyPriceText}>25K</Text>
            <Text style={styles.propertyPriceUnit}>ETB/mo</Text>
          </View>
        </TouchableOpacity>

        {/* ── Messages ────────────────────────────────────────────────────── */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chatScroll}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          <View style={styles.datePillRow}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>TODAY</Text>
            </View>
          </View>

          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.messageRowLeft}>
              <View style={styles.typingBubble}>
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
              </View>
              <Text style={styles.typingText}>Abebe is typing…</Text>
            </View>
          )}
        </ScrollView>

        {/* ── Auto-Reply Sheet (Landlord Mode) ───────────────────────────── */}
        {isLandlordMode && showQuickReplies && (
          <View style={styles.autoReplySheet}>
            <View style={styles.autoReplyHeader}>
              <View style={styles.autoReplyTitleRow}>
                <MaterialCommunityIcons name="lightning-bolt" size={16} color={KiraColors.warning} />
                <Text style={styles.autoReplyTitle}>Auto-Reply Templates</Text>
              </View>
              <TouchableOpacity onPress={() => setShowQuickReplies(false)}>
                <Feather name="x" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesRow}>
              {QUICK_REPLY_LABELS.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={styles.quickReplyChip}
                  onPress={() => sendAutoReply(key)}
                >
                  <Text style={styles.quickReplyLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Input Footer ────────────────────────────────────────────────── */}
        <View style={styles.inputFooter}>
          {/* Auto-Reply trigger (landlord mode only) */}
          {isLandlordMode && (
            <TouchableOpacity
              style={[styles.autoBtn, showQuickReplies && styles.autoBtnActive]}
              onPress={() => setShowQuickReplies(p => !p)}
            >
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={18}
                color={showQuickReplies ? KiraColors.surface : KiraColors.warning}
              />
            </TouchableOpacity>
          )}

          {!isLandlordMode && (
            <TouchableOpacity style={styles.attachBtn}>
              <Feather name="plus" size={18} color="#FFF" />
            </TouchableOpacity>
          )}

          <View style={[styles.textInputBox, isLandlordMode && styles.textInputBoxLandlord]}>
            <TextInput
              placeholder={isLandlordMode ? 'Reply as landlord…' : 'Message…'}
              placeholderTextColor="#9CA3AF"
              style={styles.inputField}
              value={input}
              onChangeText={setInput}
              multiline
              onSubmitEditing={() => sendMessage(input)}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={16} color="#1A1A1A" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === 'user';
  return (
    <View style={isUser ? styles.messageRowRight : styles.messageRowLeft}>
      <View style={[isUser ? styles.bubbleRight : styles.bubbleLeft]}>
        {msg.isAutoReply && (
          <View style={styles.autoReplyTag}>
            <MaterialCommunityIcons name="lightning-bolt" size={9} color={KiraColors.warning} />
            <Text style={styles.autoReplyTagText}>Auto-reply</Text>
          </View>
        )}
        <Text style={isUser ? styles.bubbleTextRight : styles.bubbleTextLeft}>{msg.text}</Text>
      </View>
      <View style={isUser ? styles.metaRight : styles.metaLeft}>
        <Text style={styles.timeText}>{msg.time}</Text>
        {isUser && (
          <Ionicons
            name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
            size={12}
            color={msg.status === 'read' ? '#3B82F6' : '#9CA3AF'}
            style={{ marginLeft: 3 }}
          />
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F9' },
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  avatarWrap: { position: 'relative' },
  avatarImg: { width: 42, height: 42, borderRadius: 21, marginRight: 12 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 11,
    width: 10, height: 10, borderRadius: 5,
  backgroundColor: KiraColors.success, borderWidth: 2, borderColor: '#FFF',
  },
  headerText: { justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  headerName: { fontSize: 15, fontWeight: '800', color: KiraColors.primary },
  headerRole: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#E8F5E9' },

  // Property card
  propertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', marginHorizontal: 16, marginVertical: 10,
    borderRadius: 16, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  propertyImg: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  propertyInfo: { flex: 1 },
  propertyLabel: { fontSize: 9, fontWeight: '800', color: '#926C15', letterSpacing: 0.5, marginBottom: 3 },
  propertyTitle: { fontSize: 13, fontWeight: '800', color: KiraColors.primary, marginBottom: 3 },
  propertyLocRow: { flexDirection: 'row', alignItems: 'center' },
  propertyLoc: { fontSize: 11, color: '#4A5568', marginLeft: 3 },
  propertyPrice: { alignItems: 'flex-end' },
  propertyPriceText: { fontSize: 16, fontWeight: '900', color: KiraColors.primary },
  propertyPriceUnit: { fontSize: 9, color: '#6B7280' },

  // Chat
  chatScroll: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8 },
  datePillRow: { alignItems: 'center', marginBottom: 20 },
  datePill: { backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 5, borderRadius: 16 },
  datePillText: { fontSize: 10, fontWeight: '800', color: '#4A5568', letterSpacing: 0.5 },

  messageRowLeft: { alignItems: 'flex-start', marginBottom: 18 },
  messageRowRight: { alignItems: 'flex-end', marginBottom: 18 },

  bubbleLeft: {
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 20, borderBottomLeftRadius: 4, maxWidth: '82%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  bubbleRight: {
    backgroundColor: KiraColors.primary, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 20, borderBottomRightRadius: 4, maxWidth: '82%',
  },
  bubbleTextLeft: { fontSize: 14, color: '#1A1A1A', lineHeight: 21 },
  bubbleTextRight: { fontSize: 14, color: '#FFF', lineHeight: 21 },

  autoReplyTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FEF3C7', paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6,
  },
  autoReplyTagText: { fontSize: 9, fontWeight: '800', color: '#92400E' },

  metaLeft: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 4 },
  metaRight: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginRight: 4 },
  timeText: { fontSize: 10, color: '#9CA3AF' },

  // Typing
  typingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 20, borderBottomLeftRadius: 4, marginBottom: 4,
  },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#9CA3AF' },
  typingText: { fontSize: 11, color: '#9CA3AF', marginLeft: 4 },

  // Auto-reply sheet
  autoReplySheet: {
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 4,
  },
  autoReplyHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  autoReplyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  autoReplyTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  quickRepliesRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8, flexDirection: 'row' },
  quickReplyChip: {
    backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FCD34D',
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
  },
  quickReplyLabel: { fontSize: 13, fontWeight: '700', color: '#92400E' },

  // Input footer
  inputFooter: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#FFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10, gap: 10,
  },
  attachBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center',
  },
  autoBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFFBEB', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FCD34D',
  },
  autoBtnActive: { backgroundColor: KiraColors.warning, borderColor: KiraColors.warning },
  textInputBox: {
    flex: 1, backgroundColor: '#F3F4F6', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10, minHeight: 44, justifyContent: 'center',
  },
  textInputBoxLandlord: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FCD34D' },
  inputField: { fontSize: 15, color: '#1A1A1A', padding: 0, maxHeight: 100 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: KiraColors.accent, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
