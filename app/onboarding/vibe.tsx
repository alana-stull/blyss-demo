import React, { useState, useRef } from 'react';
import { View, StyleSheet, Pressable, Text, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const QUESTIONS: { a: string; b: string }[] = [
  { a: 'Spontaneous plans', b: 'Planned ahead' },
  { a: 'Small groups',      b: 'Large groups' },
  { a: 'Invite-only',       b: 'Open to new people' },
  { a: 'Low-key',           b: 'High energy' },
];

// 14 total steps in the flow; vibe occupies steps 7-10 → 50/57/64/71
const STEP_PROGRESS = [50, 57, 64, 71];

export default function VibeScreen() {
  const { updateData } = useOnboarding();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, null]);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentAnswer = answers[step];

  function selectOption(answer: string) {
    const next = [...answers];
    next[step] = answer;
    setAnswers(next);
  }

  function handleContinue() {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      if (step === QUESTIONS.length - 1) {
        updateData({ vibe: answers as string[] });
        router.push('/onboarding/budget');
        return;
      }
      setStep(s => s + 1);
      slideAnim.setValue(SCREEN_WIDTH);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  }

  const q = QUESTIONS[step];

  return (
    <OnboardingLayout
      progress={STEP_PROGRESS[step]}
      question="What's your social style?"
      subtitle={`${step + 1} of ${QUESTIONS.length}`}
      continueDisabled={currentAnswer === null}
      onContinue={handleContinue}
    >
      <View style={s.overflow}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <View style={s.cards}>
            <Pressable
              style={[s.card, currentAnswer === q.a && s.cardSelected]}
              onPress={() => selectOption(q.a)}
            >
              <Text style={[s.cardText, currentAnswer === q.a && s.cardTextSelected]}>
                {q.a}
              </Text>
            </Pressable>
            <Pressable
              style={[s.card, currentAnswer === q.b && s.cardSelected]}
              onPress={() => selectOption(q.b)}
            >
              <Text style={[s.cardText, currentAnswer === q.b && s.cardTextSelected]}>
                {q.b}
              </Text>
            </Pressable>
          </View>
          <Pressable style={s.eitherBtn} onPress={() => selectOption('Either')}>
            <Text style={[s.eitherText, currentAnswer === 'Either' && s.eitherTextSelected]}>
              Either works for me
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  overflow: {
    overflow: 'hidden',
    paddingTop: 8,
  },
  cards: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardSelected: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  cardText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  cardTextSelected: {
    color: '#375169',
  },
  eitherBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  eitherText: {
    fontSize: 14,
    color: '#8B8F94',
    fontWeight: '500',
  },
  eitherTextSelected: {
    color: '#4A7FA5',
    fontWeight: '600',
  },
});
