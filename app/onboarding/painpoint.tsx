import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

const OPTIONS = [
  { label: 'Someone always cancels',          value: 'cancels',      emoji: '❌' },
  { label: "Can't agree on what to do",       value: 'indecision',   emoji: '🤔' },
  { label: "No one steps up to organize",     value: 'no_organizer', emoji: '🦗' },
  { label: 'Group chat goes quiet',           value: 'quiet_chat',   emoji: '💬' },
  { label: "Plans rarely fall through for me",value: 'no_problem',   emoji: '✅' },
];

export default function PainpointScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;
    await saveDraft({ pain_point: selected });
    router.push('/onboarding/matching');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={10} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>
          When plans fall through,{'\n'}it's usually…
        </Text>
        <Text style={s.sub}>Helps us build the right features for you.</Text>

        <View style={s.options}>
          {OPTIONS.map(opt => {
            const on = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.option, on && s.optionOn]}
                onPress={() => setSelected(opt.value)}
              >
                <Text style={[s.optionText, on && s.optionTextOn]}>{opt.label}</Text>
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
  heading:     { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5,
                 marginBottom: 6, lineHeight: 33 },
  sub:         { fontSize: 15, color: '#8B8F94', marginBottom: 28 },
  options:     { gap: 12 },
  option:      { borderWidth: 1.5, borderColor: '#E3E4E6', borderRadius: 14,
                 paddingVertical: 18, paddingHorizontal: 20, backgroundColor: '#fff' },
  optionOn:    { borderColor: '#5BA8D3', backgroundColor: '#EBF5FB' },
  optionText:  { flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A2E' },
  optionTextOn:{ color: '#375169', fontWeight: '600' },
  footer:      { padding: 24, paddingTop: 8 },
  btn:         { borderRadius: 14, paddingVertical: 18, alignItems: 'center', backgroundColor: '#375169' },
  btnOff:      { backgroundColor: '#A8D4EC' },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
