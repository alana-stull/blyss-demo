import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_PADDING = 24;
const COL_GAP = 6;
// Cell width derived from the 4-column first row
const CELL_WIDTH = (SCREEN_WIDTH - 2 * CONTENT_PADDING - 3 * COL_GAP) / 4;
// paddingTop(4) inside scroll content + dayLabel(~18px) + gap+marginBottom(10) below label + 4 cells + 3 gaps between cells
const GRID_HEIGHT = 4 + 18 + 10 + CELL_WIDTH * 4 + COL_GAP * 3;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SHIFTS: { key: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
  { key: 'Morning',   Icon: Sunrise },
  { key: 'Afternoon', Icon: Sun     },
  { key: 'Evening',   Icon: Sunset  },
  { key: 'Night',     Icon: Moon    },
];

function cellKey(day: string, shift: string) {
  return `${day}-${shift}`;
}

function DayColumn({
  day,
  selected,
  onToggle,
  fixedWidth,
}: {
  day: string;
  selected: Set<string>;
  onToggle: (day: string, shift: string) => void;
  fixedWidth?: boolean;
}) {
  return (
    <View style={[s.dayColumn, fixedWidth && { width: CELL_WIDTH, flex: 0 }]}>
      <Text style={s.dayLabel}>{day}</Text>
      {SHIFTS.map(({ key, Icon }) => {
        const on = selected.has(cellKey(day, key));
        return (
          <Pressable
            key={key}
            style={[s.cell, on && s.cellSelected]}
            onPress={() => onToggle(day, key)}
          >
            <Icon size={20} color={on ? '#4A7FA5' : '#8B8F94'} strokeWidth={1.5} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function CalendarScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleCell(day: string, shift: string) {
    const k = cellKey(day, shift);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k); else next.add(k);
    setSelected(next);
  }

  function handleContinue() {
    updateData({ availability: Array.from(selected) });
    router.push('/onboarding/friends');
  }

  return (
    <OnboardingLayout
      progress={86}
      question="When are you usually free?"
      subtitle="Tap any icon to mark your availability, we'll suggest plans at the right times."
      onContinue={handleContinue}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: GRID_HEIGHT, flex: 0 }}
        contentContainerStyle={s.gridContent}
      >
        {DAYS.map(day => (
          <DayColumn key={day} day={day} selected={selected} onToggle={toggleCell} fixedWidth />
        ))}
      </ScrollView>
      <Text style={s.scrollHint}>Swipe left to view and select your full weekly availability</Text>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  gridContent: {
    flexDirection: 'row',
    gap: COL_GAP,
    paddingTop: 4,
    paddingRight: 32,
  },
  dayColumn: {
    width: CELL_WIDTH,
    alignItems: 'center',
    gap: COL_GAP,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEBEC',
  },
  cellSelected: {
    backgroundColor: '#B7D3E0',
  },
  scrollHint: {
    fontSize: 13,
    color: '#8B8F94',
    marginTop: 10,
    textAlign: 'center',
  },
});
