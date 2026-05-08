import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { Colors } from '@/constants/Colors';
import { saveDraft } from '@/lib/store';

const ITEMS = [
  'Dinner', 'Brunch', 'Bars & Drinks', 'Live Music',
  'Activities', 'Coffee Hangs', 'Outdoor Stuff', 'Arts & Culture',
];

export default function ExperiencesScreen() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  async function handleContinue() {
    await saveDraft({ experiences: selected });
    router.push('/onboarding/vibe');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={7} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>What do you like to do?</Text>
        <Text style={s.sub}>
          Pick the kinds of plans you actually want to see.
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
  safe:       { flex: 1, backgroundColor: Colors.white },
  content:    { padding: 24, paddingBottom: 8 },
  heading:    { fontSize: 26, fontWeight: '700', color: Colors.black, letterSpacing: -0.5, marginBottom: 6 },
  sub:        { fontSize: 15, color: Colors.naturalGrey, marginBottom: 28 },
  list:        { gap: 12 },
  option:      { borderWidth: 1.5, borderColor: Colors.lightGrey, borderRadius: 14,
                 paddingVertical: 18, paddingHorizontal: 20, backgroundColor: Colors.white },
  optionOn:    { borderColor: Colors.primaryBlue, backgroundColor: '#EBF5FB' },
  optionText:  { fontSize: 16, fontWeight: '500', color: Colors.black },
  optionTextOn:{ color: Colors.deepSlate, fontWeight: '600' },
  footer:      { padding: 24, paddingTop: 8 },
  btn:         { borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  btnActive:   { backgroundColor: Colors.deepSlate },
  btnInactive: { backgroundColor: '#A8D4EC' },
  btnText:     { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
