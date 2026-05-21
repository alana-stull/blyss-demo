import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TILE_WIDTH = (SCREEN_WIDTH - 48 - 10) / 2; // 48px h-padding, 10px column gap

const CATEGORIES: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Activities',  icon: 'bowling-ball-outline' },
  { label: 'Arcade',      icon: 'game-controller-outline' },
  { label: 'Bars',        icon: 'wine-outline' },
  { label: 'Brunch',      icon: 'restaurant-outline' },
  { label: 'Coffee',      icon: 'cafe-outline' },
  { label: 'Comedy',      icon: 'happy-outline' },
  { label: 'Concerts',    icon: 'musical-notes-outline' },
  { label: 'Fitness',     icon: 'fitness-outline' },
  { label: 'Galleries',   icon: 'color-palette-outline' },
  { label: 'Hiking',      icon: 'walk-outline' },
  { label: 'Karaoke',     icon: 'mic-outline' },
  { label: 'Movies',      icon: 'film-outline' },
  { label: 'Museums',     icon: 'library-outline' },
  { label: 'Nightlife',   icon: 'star-outline' },
  { label: 'Parks',       icon: 'leaf-outline' },
  { label: 'Restaurants', icon: 'fast-food-outline' },
  { label: 'Rooftops',    icon: 'business-outline' },
  { label: 'Shows',       icon: 'ticket-outline' },
  { label: 'Sports',      icon: 'trophy-outline' },
  { label: 'Trivia',      icon: 'bulb-outline' },
];

export default function InterestsScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(label: string) {
    setSelected(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  }

  function handleContinue() {
    updateData({ interests: selected });
    router.push('/onboarding/vibe');
  }

  return (
    <OnboardingLayout
      progress={43}
      question="What's your scene?"
      subtitle="Pick as many as you like."
      onContinue={handleContinue}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.grid}
      >
        {CATEGORIES.map(({ label, icon }) => {
          const on = selected.includes(label);
          return (
            <Pressable
              key={label}
              style={[s.tile, on && s.tileSelected]}
              onPress={() => toggle(label)}
            >
              <Ionicons
                name={icon}
                size={22}
                color={on ? '#4A7FA5' : '#8B8F94'}
              />
              <Text style={[s.tileLabel, on && s.tileLabelSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
    paddingBottom: 104,
  },
  tile: {
    width: TILE_WIDTH,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tileSelected: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  tileLabelSelected: {
    color: '#4A7FA5',
  },
});
