import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  Animated 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KiraColors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '@/context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface Step {
  title: string;
  description: string;
  targetPos?: { top: number; left: number; width: number; height: number };
}

interface TutorialGuideProps {
  steps: Step[];
  tourKey: string;
  visible: boolean;
  onComplete: () => void;
}

export default function TutorialGuide({ steps, tourKey, visible, onComplete }: TutorialGuideProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await AsyncStorage.setItem(`tutorial_${tourKey}_completed`, 'true');
      onComplete();
    }
  };

  if (!visible) return null;

  const step = steps[currentStep];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        
        {/* Highlight area simulation */}
        {step.targetPos && (
          <View 
            style={[
              styles.highlight, 
              { 
                top: step.targetPos.top - 10, 
                left: step.targetPos.left - 10, 
                width: step.targetPos.width + 20, 
                height: step.targetPos.height + 20 
              }
            ]} 
          />
        )}

        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{currentStep + 1} / {steps.length}</Text>
              </View>
              <TouchableOpacity onPress={onComplete}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.skipBtn} onPress={onComplete}>
                    <Text style={styles.skipText}>{t.tutorialSkip}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <Text style={styles.nextBtnText}>
                        {currentStep === steps.length - 1 ? t.tutorialFinish : t.tutorialNext}
                    </Text>
                    <Feather name="arrow-right" size={16} color="#FFF" />
                </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Indicator dots */}
        <View style={styles.dotsRow}>
            {steps.map((_, i) => (
                <View 
                    key={i} 
                    style={[
                        styles.dot, 
                        i === currentStep && styles.activeDot,
                        { backgroundColor: i === currentStep ? KiraColors.primary : 'rgba(255,255,255,0.3)' }
                    ]} 
                />
            ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: KiraColors.primary,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContainer: {
    paddingHorizontal: 30,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: KiraColors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  dotsRow: {
    position: 'absolute',
    bottom: height * 0.15,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
  },
});
