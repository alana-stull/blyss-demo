import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

const OPTIONS = [
  { label: 'Under $20',            value: 'under20', sub: 'Budget-friendly only' },
  { label: '$20–40',               value: '20to40',  sub: 'Most mid-range spots' },
  { label: '$40–75',               value: '40to75',  sub: 'Nice nights out' },
  { label: "No limit if it's great", value: 'nolimit', sub: 'Show me everything' },
];

export default function BudgetScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;
    await saveDraft({ budget_tier: selected });
    router.push('/onboarding/painpoint');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={9} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.heading}>What's your budget?</Text>
        <Text style={s.sub}>
          So we don't show you things outside your range.
        </Text>

        <View style={s.options}>
          {OPTIONS.map(opt => {
            const on = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.option, on && s.optionOn]}
                onPress={() => setSelected(opt.value)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[s.optionLabel, on && s.optionLabelOn]}>{opt.label}</Text>
                  <Text style={s.optionSub}>{opt.sub}</Text>
                </View>
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
  safe:         { flex: 1, backgroundColor: '#fff' },
  content:      { padding: 24, paddingBottom: 8 },
  heading:      { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:          { fontSize: 15, color: '#8B8F94', marginBottom: 28 },
  options:      { gap: 12 },
  option:       { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5,
                  borderColor: '#E3E4E6', borderRadius: 14, paddingVertical: 16,
                  paddingHorizontal: 18, backgroundColor: '#fff' },
  optionOn:     { borderColor: '#5BA8D3', backgroundColor: '#EBF5FB' },
  optionLabel:  { fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  optionLabelOn:{ color: '#375169' },
  optionSub:    { fontSize: 13, color: '#8B8F94' },
  radio:        { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
                  borderColor: '#E3E4E6', alignItems: 'center', justifyContent: 'center' },
  radioOn:      { borderColor: '#5BA8D3' },
  dot:          { width: 11, height: 11, borderRadius: 6, backgroundColor: '#5BA8D3' },
  footer:       { padding: 24, paddingTop: 8 },
  btn:          { borderRadius: 14, paddingVertical: 18, alignItems: 'center', backgroundColor: '#375169' },
  btnOff:       { backgroundColor: '#A8D4EC' },
  btnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
});
