import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const LANDLORD_PROPERTIES = [
  {
    id: '1',
    title: 'The Summit Residency',
    location: 'Bole, Addis Ababa',
    price: '25,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=400&auto=format&fit=crop',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Modern Garden Villa',
    location: 'Old Airport, Addis Ababa',
    price: '45,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop',
    status: 'Active',
  },
];

const BOOST_PLANS = [
  { days: 7, label: '7 Days', price: 150, tag: 'Starter', desc: 'Great for testing reach' },
  { days: 14, label: '14 Days', price: 250, tag: 'Popular', desc: 'Most landlords choose this', highlight: true },
  { days: 30, label: '30 Days', price: 400, tag: 'Best Value', desc: 'Maximum visibility guaranteed' },
];

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', color: '#E83E51', icon: 'phone-portrait' as const, description: 'Pay with your Telebirr wallet' },
  { id: 'cbe', name: 'CBE Birr', color: '#007BFF', icon: 'card' as const, description: 'Commercial Bank of Ethiopia' },
  { id: 'card', name: 'Card / Visa', color: '#1A1A2E', icon: 'card-outline' as const, description: 'Visa or Mastercard' },
];

type Step = 'select_property' | 'select_plan' | 'select_payment' | 'processing' | 'success';

export default function BoostListingScreen() {
  const [step, setStep] = useState<Step>('select_property');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [boostedDate] = useState(new Date());

  const expiryDate = selectedPlan
    ? new Date(boostedDate.getTime() + selectedPlan.days * 24 * 60 * 60 * 1000)
    : null;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 2800);
  };

  // ─── STEP 1: Select Property ───────────────────────
  if (step === 'select_property') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Boost Listing</Text>
          <View style={{ width: 22 }} />
        </View>

        <StepIndicator current={1} total={4} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.stepTitle}>Select a Property</Text>
          <Text style={styles.stepSubtitle}>Choose which listing you want to promote</Text>

          {LANDLORD_PROPERTIES.map(property => (
            <TouchableOpacity
              key={property.id}
              style={[styles.propertyCard, selectedProperty?.id === property.id && styles.propertyCardSelected]}
              onPress={() => setSelectedProperty(property)}
            >
              <Image source={property.image} style={styles.propertyThumb} />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyCardTitle}>{property.title}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={12} color="#4A5568" />
                  <Text style={styles.propertyLocation}>{property.location}</Text>
                </View>
                <Text style={styles.propertyCardPrice}>{property.price} ETB/mo</Text>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{property.status}</Text>
                </View>
              </View>
              {selectedProperty?.id === property.id && (
                <View style={styles.selectedCheck}>
                  <Feather name="check" size={14} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedProperty && styles.primaryBtnDisabled]}
            onPress={() => selectedProperty && setStep('select_plan')}
            disabled={!selectedProperty}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
            <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── STEP 2: Select Plan ────────────────────────────
  if (step === 'select_plan') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('select_property')} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Boost Duration</Text>
          <View style={{ width: 22 }} />
        </View>

        <StepIndicator current={2} total={4} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.stepTitle}>Choose a Boost Plan</Text>
          <Text style={styles.stepSubtitle}>Your listing will appear at the top of search results</Text>

          {/* Selected Property mini card */}
          <View style={styles.miniPropertyCard}>
            <Image source={selectedProperty?.image} style={styles.miniPropertyThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.miniPropertyTitle}>{selectedProperty?.title}</Text>
              <Text style={styles.miniPropertyLocation}>{selectedProperty?.location}</Text>
            </View>
            <TouchableOpacity onPress={() => setStep('select_property')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {BOOST_PLANS.map(plan => (
            <TouchableOpacity
              key={plan.days}
              style={[
                styles.planCard,
                plan.highlight && styles.planCardHighlighted,
                selectedPlan?.days === plan.days && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              {plan.highlight && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>⭐ MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.planRow}>
                <View>
                  <Text style={[styles.planLabel, plan.highlight && styles.planLabelHighlighted]}>{plan.label}</Text>
                  <Text style={styles.planDesc}>{plan.desc}</Text>
                </View>
                <View style={styles.planPriceBox}>
                  <Text style={styles.planPrice}>{plan.price} ETB</Text>
                  <View style={[
                    styles.selectCircle,
                    selectedPlan?.days === plan.days && styles.selectCircleFilled
                  ]}>
                    {selectedPlan?.days === plan.days && <Feather name="check" size={12} color="#FFF" />}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {selectedPlan && (
            <View style={styles.summaryBox}>
              <Feather name="zap" size={16} color={KiraColors.primary} />
              <Text style={styles.summaryText}>
                Boost for <Text style={styles.summaryBold}>{selectedPlan.days} days</Text> — Total:
                <Text style={styles.summaryBold}> {selectedPlan.price} ETB</Text>
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedPlan && styles.primaryBtnDisabled]}
            onPress={() => selectedPlan && setStep('select_payment')}
            disabled={!selectedPlan}
          >
            <Text style={styles.primaryBtnText}>Pay Now</Text>
            <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── STEP 3: Payment Method ─────────────────────────
  if (step === 'select_payment') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('select_plan')} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Feather name="arrow-left" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 22 }} />
        </View>

        <StepIndicator current={3} total={4} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.stepTitle}>Choose Payment Method</Text>
          <Text style={styles.stepSubtitle}>Powered by Chapa — secure & fast</Text>

          {/* Order Summary */}
          <View style={styles.orderCard}>
            <Text style={styles.orderLabel}>ORDER SUMMARY</Text>
            <View style={styles.orderRow}>
              <Text style={styles.orderKey}>Property</Text>
              <Text style={styles.orderVal} numberOfLines={1}>{selectedProperty?.title}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderKey}>Boost Duration</Text>
              <Text style={styles.orderVal}>{selectedPlan?.days} Days</Text>
            </View>
            <View style={[styles.orderRow, styles.orderRowTotal]}>
              <Text style={styles.orderTotalKey}>Total</Text>
              <Text style={styles.orderTotalVal}>{selectedPlan?.price} ETB</Text>
            </View>
          </View>

          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment?.id === method.id && styles.paymentCardSelected,
              ]}
              onPress={() => setSelectedPayment(method)}
            >
              <View style={[styles.paymentIconBox, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon} size={22} color="#FFF" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDesc}>{method.description}</Text>
              </View>
              <View style={[
                styles.selectCircle,
                selectedPayment?.id === method.id && styles.selectCircleFilled
              ]}>
                {selectedPayment?.id === method.id && <Feather name="check" size={12} color="#FFF" />}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.primaryBtn, !selectedPayment && styles.primaryBtnDisabled]}
            onPress={() => selectedPayment && handlePay()}
            disabled={!selectedPayment}
          >
            <Ionicons name="lock-closed" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Confirm & Pay {selectedPlan?.price} ETB</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── STEP 4: Processing ─────────────────────────────
  if (step === 'processing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredFull}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={KiraColors.primary} style={{ marginBottom: 24 }} />
            <Text style={styles.processingTitle}>Processing Payment…</Text>
            <Text style={styles.processingSubtitle}>
              Please wait while we verify your {selectedPayment?.name} transaction. Do not close the app.
            </Text>
            <View style={styles.processingMethodRow}>
              <View style={[styles.paymentIconBox, { backgroundColor: selectedPayment?.color, width: 32, height: 32, borderRadius: 8 }]}>
                <Ionicons name={selectedPayment?.icon} size={16} color="#FFF" />
              </View>
              <Text style={styles.processingMethodText}>via {selectedPayment?.name}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── STEP 5: Success ────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centeredFull}>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIconWrap}>
            <MaterialIcons name="verified" size={64} color={KiraColors.primary} />
          </View>
          <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Your listing is now boosted and will appear at the top of searches.
          </Text>

          <View style={styles.successCard}>
            <Image source={selectedProperty?.image} style={styles.successThumb} />
            <Text style={styles.successPropertyTitle}>{selectedProperty?.title}</Text>
            <Text style={styles.successPropertyLoc}>{selectedProperty?.location}</Text>

            <View style={styles.successDivider} />

            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailKey}>Boost Duration</Text>
              <Text style={styles.successDetailVal}>{selectedPlan?.days} Days</Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailKey}>Amount Paid</Text>
              <Text style={styles.successDetailVal}>{selectedPlan?.price} ETB</Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailKey}>Payment Method</Text>
              <Text style={styles.successDetailVal}>{selectedPayment?.name}</Text>
            </View>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailKey}>Boost Expires</Text>
              <Text style={[styles.successDetailVal, { color: '#DC2626' }]}>
                {expiryDate?.toLocaleDateString('en-ET', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.returnBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Feather name="home" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.returnBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepIndicator}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i + 1 === current && styles.stepDotActive,
            i + 1 < current && styles.stepDotDone,
          ]}
        />
      ))}
      <Text style={styles.stepCount}>Step {current} of {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  stepDot: {
    width: 32, height: 5, borderRadius: 3,
    backgroundColor: '#E5E7EB', marginRight: 6,
  },
  stepDotActive: { backgroundColor: KiraColors.primary, width: 48 },
  stepDotDone: { backgroundColor: '#BBD8C9' },
  stepCount: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginLeft: 'auto' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  stepTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 6, letterSpacing: -0.5 },
  stepSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 24, lineHeight: 18 },
  // Property
  propertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 20, padding: 14, marginBottom: 14,
    borderWidth: 2, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  propertyCardSelected: { borderColor: KiraColors.primary, backgroundColor: '#F0FBF4' },
  propertyThumb: { width: 72, height: 72, borderRadius: 14, marginRight: 14 },
  propertyInfo: { flex: 1 },
  propertyCardTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  propertyLocation: { fontSize: 11, color: '#4A5568', marginLeft: 3 },
  propertyCardPrice: { fontSize: 13, fontWeight: '700', color: KiraColors.primary, marginBottom: 6 },
  statusPill: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 4 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#22C55E' },
  selectedCheck: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: KiraColors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },
  // Mini Property
  miniPropertyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7F8F9', borderRadius: 16, padding: 12, marginBottom: 24,
  },
  miniPropertyThumb: { width: 48, height: 48, borderRadius: 10, marginRight: 12 },
  miniPropertyTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  miniPropertyLocation: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  changeText: { fontSize: 12, fontWeight: '700', color: KiraColors.primary },
  // Plans
  planCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 14,
    borderWidth: 2, borderColor: '#F3F4F6',
  },
  planCardHighlighted: { borderColor: '#FBC02D', backgroundColor: '#FFFDF0' },
  planCardSelected: { borderColor: KiraColors.primary, backgroundColor: '#F0FBF4' },
  popularBadge: {
    alignSelf: 'flex-start', backgroundColor: '#FBC02D',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12,
  },
  popularBadgeText: { fontSize: 9, fontWeight: '800', color: '#92400E' },
  planRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planLabel: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  planLabelHighlighted: { color: '#92400E' },
  planDesc: { fontSize: 12, color: '#6B7280' },
  planPriceBox: { alignItems: 'flex-end' },
  planPrice: { fontSize: 16, fontWeight: '900', color: KiraColors.primary, marginBottom: 8 },
  summaryBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 14, padding: 14, marginTop: 8,
  },
  summaryText: { fontSize: 13, color: '#1A1A1A', marginLeft: 10 },
  summaryBold: { fontWeight: '800', color: KiraColors.primary },
  // Order
  orderCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    marginBottom: 24, borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  orderLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginBottom: 14 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderKey: { fontSize: 13, color: '#4A5568' },
  orderVal: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', maxWidth: width * 0.45, textAlign: 'right' },
  orderRowTotal: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, marginTop: 4 },
  orderTotalKey: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
  orderTotalVal: { fontSize: 18, fontWeight: '900', color: KiraColors.primary },
  // Payment Methods
  paymentCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 14,
    borderWidth: 2, borderColor: '#F3F4F6',
  },
  paymentCardSelected: { borderColor: KiraColors.primary, backgroundColor: '#F0FBF4' },
  paymentIconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  paymentDesc: { fontSize: 12, color: '#6B7280' },
  selectCircle: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  selectCircleFilled: { backgroundColor: KiraColors.primary, borderColor: KiraColors.primary },
  // Processing
  centeredFull: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  processingCard: {
    backgroundColor: '#FFF', borderRadius: 28, padding: 36, alignItems: 'center',
    width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 6,
  },
  processingTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  processingSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  processingMethodRow: { flexDirection: 'row', alignItems: 'center' },
  processingMethodText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginLeft: 10 },
  // Success
  successScroll: { padding: 24, alignItems: 'center' },
  successIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, marginTop: 20,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
  },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 },
  successSubtitle: { fontSize: 14, color: '#4A5568', textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  successCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 28,
  },
  successThumb: { width: '100%', height: 130, borderRadius: 16, marginBottom: 14 },
  successPropertyTitle: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', marginBottom: 3 },
  successPropertyLoc: { fontSize: 12, color: '#6B7280', marginBottom: 16 },
  successDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  successDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  successDetailKey: { fontSize: 13, color: '#4A5568' },
  successDetailVal: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  returnBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: KiraColors.primary, borderRadius: 20, paddingVertical: 18, width: '100%',
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  returnBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  // Footer
  footer: {
    padding: 20, backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: KiraColors.primary, borderRadius: 16, paddingVertical: 18,
    shadowColor: KiraColors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  primaryBtnDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0 },
  primaryBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});
