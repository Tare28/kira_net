import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { KiraColors } from '@/constants/colors';

const ASSIGNED_WORK = [
  { id: '1', title: 'Modern Garden Villa', location: 'Old Airport', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400', deadline: 'Today', status: 'pending' },
  { id: '2', title: 'Luxury Penthouse', location: 'Bole', image: 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?q=80&w=400', deadline: 'Tomorrow', status: 'pending' },
];

export default function AgentDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agent Terminal</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Feather name="bell" size={20} color="#000" />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>COMPLETED</Text>
            <Text style={styles.statValue}>142</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#000' }]}>
            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.6)' }]}>VERIFIED</Text>
            <Text style={[styles.statValue, { color: '#FFF' }]}>98%</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Inspections</Text>
          <Text style={styles.countText}>{ASSIGNED_WORK.length} tasks</Text>
        </View>

        {ASSIGNED_WORK.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.taskCard}
            onPress={() => router.push({ pathname: '/field-inspection', params: { id: item.id, name: item.title } })}
          >
            <Image source={{ uri: item.image }} style={styles.taskImg} />
            <View style={styles.taskInfo}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PENDING FIELD AUDIT</Text>
              </View>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <View style={styles.locRow}>
                <Ionicons name="location" size={14} color="#64748B" />
                <Text style={styles.locText}>{item.location}, Addis</Text>
              </View>
              <View style={styles.deadlineRow}>
                <Feather name="clock" size={12} color="#000" />
                <Text style={styles.deadlineText}>Due {item.deadline}</Text>
              </View>
            </View>
            <View style={styles.arrowBox}>
              <Feather name="chevron-right" size={20} color="#DDD" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>Performance Metric</Text>
        </View>
        
        <View style={styles.metricCard}>
            <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Audit Accuracy</Text>
                <Text style={styles.metricVal}>99.2%</Text>
            </View>
            <View style={styles.barContainer}>
                <View style={[styles.bar, { width: '99%' }]} />
            </View>
            <Text style={styles.metricSub}>Your reports are the foundation of Kira-Net trust.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  notifBtn: { position: 'relative', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#000', borderWidth: 1, borderColor: '#FFF' },
  scroll: { padding: 20 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#F8F9FA', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F3F5' },
  statLabel: { fontSize: 10, fontWeight: '900', color: '#64748B', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.5 },
  countText: { fontSize: 12, fontWeight: '700', color: '#ADB5BD' },

  taskCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#F1F3F5', alignItems: 'center' },
  taskImg: { width: 80, height: 80, borderRadius: 16 },
  taskInfo: { flex: 1, marginLeft: 16 },
  badge: { backgroundColor: '#F0F9FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 },
  badgeText: { fontSize: 8, fontWeight: '900', color: '#0369A1', letterSpacing: 0.5 },
  taskTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locText: { fontSize: 13, color: '#64748B', fontWeight: '500', marginLeft: 4 },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deadlineText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A' },
  arrowBox: { padding: 8 },

  metricCard: { backgroundColor: KiraColors.primary, padding: 24, borderRadius: 24 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricLabel: { color: 'rgba(0,0,0,0.6)', fontSize: 13, fontWeight: '700' },
  metricVal: { color: '#1A1A1A', fontSize: 18, fontWeight: '900' },
  barContainer: { height: 6, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3, marginBottom: 16 },
  bar: { height: 6, backgroundColor: '#1A1A1A', borderRadius: 3 },
  metricSub: { color: 'rgba(0,0,0,0.4)', fontSize: 11, lineHeight: 16, fontWeight: '500' },
});
