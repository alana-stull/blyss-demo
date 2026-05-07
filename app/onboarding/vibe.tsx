import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

const OPTIONS = [
  { label: 'Lively & social',      value: 'social',           emoji: '⚡' },
  { label: 'Chill & relaxed',      value: 'chill',            emoji: '🌿' },
  { label: 'Trendy & new',         value: 'trendy',           emoji: '✨' },
  { label: 'Classic & reliable',   value: 'classic',          emoji: '🏛️' },
  { label: "Depends who I'm with", value: 'social_proximity', emoji: '🤷' },
];

export default function VibeScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;
    await saveDraft({ vibe: selected });
    router.push('/onboarding/budget');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={8} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>What's your vibe?</Text>
        <Text style={s.sub}>This shapes what shows up first in your feed.</Text>

        <View style={s.options}>
          {OPTIONS.map(opt => {
            const on = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.option, on && s.optionOn]}
                onPress={() => setSelected(opt.value)}
              >
                <Text style={s.emoji}>{opt.emoji}</Text>
                <Text style={[s.optionText, on && s.optionTextOn]}>{opt.label}</Text>
                <View style={[s.radio, on && s.radioOn]}>
                  {on && <View style={s.dot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !selected && s.btnOff]}
          onPress={handleContinue}
          disabled={!selected}
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
  options:     { gap: 12 },
  option:      { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5,
                 borderColor: '#E3E4E6', borderRadius: 14, paddingVertical: 16,
                 paddingHorizontal: 18, backgroundColor: '#fff' },
  optionOn:    { borderColor: '#5BA8D3', backgroundColor: '#EBF5FB' },
  emoji:       { fontSize: 22 },
  optionText:  { flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A2E' },
  optionTextOn:{ color: '#375169', fontWeight: '600' },
  radio:       { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
                 borderColor: '#E3E4E6', alignItems: 'center', justifyContent: 'center' },
  radioOn:     { borderColor: '#5BA8D3' },
  dot:         { width: 11, height: 11, borderRadius: 6, backgroundColor: '#5BA8D3' },
  footer:      { padding: 24, paddingTop: 8 },
  btn:         { borderRadius: 14, paddingVertical: 18, alignItems: 'center', backgroundColor: '#375169' },
  btnOff:      { backgroundColor: '#A8D4EC' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
