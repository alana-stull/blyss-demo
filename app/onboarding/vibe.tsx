import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const VIBES = [
  'Spontaneous plans',
  'Chill nights',
  'Nightlife',
  'Small groups',
  'Big groups',
  'Weekend warrior',
  'Culture vulture',
  'Foodie first',
];

export default function VibeScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleVibe(vibe: string) {
    if (selected.includes(vibe)) {
      setSelected(selected.filter(v => v !== vibe));
    } else {
      setSelected([...selected, vibe]);
    }
  }

  function handleContinue() {
    updateData({ vibe: selected });
    router.push('/onboarding/budget');
  }

  return (
    <OnboardingLayout
      progress={67}
      question="What's your social style?"
      subtitle="Pick as many as you like."
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
    >
      <View style={s.grid}>
        {VIBES.map((vibe, idx) => (
          <Pressable
            key={idx}
            style={[
              s.chip,
              selected.includes(vibe) && s.chipActive,
            ]}
            onPress={() => toggleVibe(vibe)}
          >
            <Text
              style={[
                s.chipText,
                selected.includes(vibe) && s.chipTextActive,
              ]}
            >
              {vibe}
            </Text>
          </Pressable>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chip: {
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  chipActive: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  chipText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
  chipTextActive: {
    color: '#375169',
  },
});
