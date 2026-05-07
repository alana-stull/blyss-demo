import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

const ITEMS = [
  'Food & Drink', 'Music', 'Arts & Culture', 'Outdoors',
  'Wellness', 'Sports', 'Nightlife', 'Learning',
];

export default function InterestsScreen() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  async function handleContinue() {
    await saveDraft({ interests: selected });
    router.push('/onboarding/experiences');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={6} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>What are you into?</Text>
        <Text style={s.sub}>
          Select everything that fits. We'll find the right spots.
        </Text>
        <View style={s.list}>
          {ITEMS.map(item => {
            const on = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[s.option, on && s.optionOn]}
                onPress={() => toggle(item)}
                activeOpacity={0.7}
              >
                <Text style={[s.optionText, on && s.optionTextOn]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, selected.length > 0 ? s.btnActive : s.btnInactive]}
          onPress={handleContinue}
        >
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#fff' },
  content:     { padding: 24, paddingBottom: 8 },
  heading:     { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:         { fontSize: 15, color: '#8B8F94', marginBottom: 28 },
  list:        { gap: 12 },
  option:      { borderWidth: 1.5, borderColor: '#E3E4E6', borderRadius: 14,
                 paddingVertical: 18, paddingHorizontal: 20, backgroundColor: '#fff' },
  optionOn:    { borderColor: '#5BA8D3', backgroundColor: '#EBF5FB' },
  optionText:  { fontSize: 16, fontWeight: '500', color: '#1A1A2E' },
  optionTextOn:{ color: '#375169', fontWeight: '600' },
  footer:      { padding: 24, paddingTop: 8 },
  btn:         { borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  btnActive:   { backgroundColor: '#375169' },
  btnInactive: { backgroundColor: '#A8D4EC' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
