import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function CalendarScreen() {
  const { updateData } = useOnboarding();
  const [connected, setConnected] = useState<string[]>([]);

  function toggleCalendar(cal: string) {
    if (connected.includes(cal)) {
      setConnected(connected.filter(c => c !== cal));
    } else {
      setConnected([...connected, cal]);
    }
  }

  function handleContinue() {
    updateData({ calendarConnected: connected });
    router.push('/onboarding/friends');
  }

  function handleSkip() {
    router.push('/onboarding/friends');
  }

  const hasConnected = connected.length > 0;

  return (
    <OnboardingLayout
      progress={80}
      question="Sync your calendar."
      subtitle="See when friends are free and plan around your existing schedule."
      continueDisabled={!hasConnected}
      onContinue={hasConnected ? handleContinue : undefined}
    >
      <View style={s.container}>
        {['Connect Google Calendar', 'Connect Apple Calendar'].map((cal, idx) => {
          const isConnected = connected.includes(cal);
          return (
            <Pressable
              key={idx}
              style={[
                s.button,
                isConnected && s.buttonConnected,
              ]}
              onPress={() => toggleCalendar(cal)}
            >
              <Calendar size={20} color={isConnected ? '#4A7FA5' : '#8B8F94'} strokeWidth={1.5} />
              <Text
                style={[
                  s.buttonText,
                  isConnected && s.buttonTextConnected,
                ]}
              >
                {isConnected ? `${cal.replace('Connect ', '')} Connected ✓` : cal}
              </Text>
            </Pressable>
          );
        })}

        {!hasConnected && (
          <Pressable style={s.skipLink} onPress={handleSkip}>
            <Text style={s.skipText}>Skip for now</Text>
          </Pressable>
        )}
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
  },
  buttonConnected: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  buttonTextConnected: {
    color: '#4A7FA5',
  },
  skipLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#8B8F94',
    fontWeight: '500',
  },
});
