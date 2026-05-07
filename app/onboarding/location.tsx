import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

const SUGGESTIONS = ['Durham', 'Raleigh', 'Chapel Hill', 'Cary'];

export default function LocationScreen() {
  const [city, setCity]       = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = SUGGESTIONS.filter(s =>
    s.toLowerCase().startsWith(city.toLowerCase())
  );
  const showList = (focused || city.length > 0) && filtered.length > 0 && !SUGGESTIONS.includes(city);

  function select(s: string) {
    setCity(s);
    setFocused(false);
  }

  async function handleContinue() {
    if (!city.trim()) return;
    await saveDraft({ city: city.trim() });
    router.push('/onboarding/photo');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={3} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.heading}>Where are you based?</Text>
          <Text style={s.sub}>We'll show you the best spots nearby.</Text>

          <View>
            <TextInput
              style={s.input}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#B0B4BA"
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              autoCapitalize="words"
              returnKeyType="done"
            />
            {showList && (
              <View style={s.dropdown}>
                {filtered.map((item, i) => (
                  <TouchableOpacity
                    key={item}
                    style={[s.suggestion, i < filtered.length - 1 && s.suggestionBorder]}
                    onPress={() => select(item)}
                  >
                    <Text style={s.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity
            style={[s.btn, !city.trim() && s.btnOff]}
            onPress={handleContinue}
            disabled={!city.trim()}
          >
            <Text style={s.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#fff' },
  content:         { padding: 24, paddingBottom: 8 },
  heading:         { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:             { fontSize: 15, color: '#8B8F94', marginBottom: 28 },
  input:           { backgroundColor: '#F0F1F3', borderRadius: 12, paddingHorizontal: 16,
                     paddingVertical: 14, fontSize: 16, color: '#1A1A2E' },
  dropdown:        { marginTop: 4, backgroundColor: '#fff', borderRadius: 12,
                     borderWidth: 1, borderColor: '#E3E4E6', overflow: 'hidden' },
  suggestion:      { paddingHorizontal: 16, paddingVertical: 14 },
  suggestionBorder:{ borderBottomWidth: 1, borderBottomColor: '#EEEFF1' },
  suggestionText:  { fontSize: 15, color: '#1A1A2E' },
  footer:          { padding: 24, paddingTop: 8 },
  btn:             { backgroundColor: '#5BA8D3', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnOff:          { opacity: 0.35 },
  btnText:         { color: '#fff', fontSize: 16, fontWeight: '700' },
});
