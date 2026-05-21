import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const COLUMNS = ['Weekdays', 'Saturdays', 'Sundays'];

const ROWS: { key: string; Icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }> }[] = [
  { key: 'Morning',   Icon: Sunrise },
  { key: 'Afternoon', Icon: Sun     },
  { key: 'Evening',   Icon: Sunset  },
  { key: 'Late night', Icon: Moon   },
];

function cellKey(col: string, row: string) {
  return `${col}-${row}`;
}

export default function CalendarScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleCell(col: string, row: string) {
    const k = cellKey(col, row);
    const next = new Set(selected);
    if (next.has(k)) next.delete(k); else next.add(k);
    setSelected(next);
  }

  function toggleColumn(col: string) {
    const colKeys = ROWS.map(({ key: k }) => cellKey(col, k));
    const allOn = colKeys.every(k => selected.has(k));
    const next = new Set(selected);
    if (allOn) {
      colKeys.forEach(k => next.delete(k));
    } else {
      colKeys.forEach(k => next.add(k));
    }
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
      subtitle="We'll suggest plans at the right times."
      onContinue={handleContinue}
    >
      <View style={s.grid}>
        {/* Column headers */}
        <View style={s.row}>
          <View style={s.rowLabel} />
          {COLUMNS.map(col => {
            return (
              <Pressable key={col} style={s.colHeader} onPress={() => toggleColumn(col)}>
                <Text style={s.colHeaderText}>{col}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Data rows */}
        {ROWS.map(({ key: rowKey, Icon }) => (
          <View key={rowKey} style={s.row}>
            <View style={s.rowLabel}>
              <Icon size={18} color="#8B8F94" strokeWidth={1.5} />
            </View>
            {COLUMNS.map(col => {
              const on = selected.has(cellKey(col, rowKey));
              return (
                <Pressable
                  key={col}
                  style={[s.cell, on && s.cellSelected]}
                  onPress={() => toggleCell(col, rowKey)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  grid: {
    marginTop: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    width: 36,
    alignItems: 'center',
  },
  colHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  colHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBEBEC',
  },
  cellSelected: {
    backgroundColor: '#4A7FA5',
  },
});
