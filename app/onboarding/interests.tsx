import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';
import { Wine, Coffee, UtensilsCrossed, Music, Dumbbell, Trees, Palette, Zap, Moon, Trophy } from 'lucide-react-native';

const INTERESTS = [
  { label: 'Bars', icon: Wine },
  { label: 'Coffee', icon: Coffee },
  { label: 'Brunch', icon: UtensilsCrossed },
  { label: 'Concerts', icon: Music },
  { label: 'Fitness', icon: Dumbbell },
  { label: 'Outdoors', icon: Trees },
  { label: 'Art', icon: Palette },
  { label: 'Activities', icon: Zap },
  { label: 'Nightlife', icon: Moon },
  { label: 'Sports', icon: Trophy },
];

export default function InterestsScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleInterest(interest: string) {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  }

  function handleContinue() {
    updateData({ interests: selected });
    router.push('/onboarding/vibe');
  }

  return (
    <OnboardingLayout
      progress={60}
      question="What are you into?"
      subtitle="Pick as many as you like."
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
    >
      <View style={s.grid}>
        {INTERESTS.map((item, idx) => {
          const isSelected = selected.includes(item.label);
          return (
            <Pressable
              key={idx}
              style={[
                s.chip,
                isSelected && s.chipActive,
              ]}
              onPress={() => toggleInterest(item.label)}
            >
              <item.icon size={16} color={isSelected ? '#375169' : '#333333'} strokeWidth={1.5} />
              <Text
                style={[
                  s.chipText,
                  isSelected && s.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  chip: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  chipTextActive: {
    color: '#375169',
  },
});
