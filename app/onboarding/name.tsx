import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

export default function NameScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [error, setError]         = useState('');

  const valid = firstName.trim().length > 0
    && lastName.trim().length > 0
    && phone.trim().length >= 10;

  async function handleContinue() {
    if (!valid) { setError('Please fill in all three fields.'); return; }
    await saveDraft({
      first_name: firstName.trim(),
      last_name:  lastName.trim(),
      phone:      phone.trim(),
    });
    router.push('/onboarding/verify');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={1} showBack={false} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={s.heading}>What's your name?</Text>
          <Text style={s.sub}>Your profile is visible to friends on Blyss.</Text>

          <Text style={s.label}>First name</Text>
          <TextInput
            style={s.input}
            value={firstName}
            onChangeText={t => { setFirstName(t); setError(''); }}
            placeholder="Alana"
            placeholderTextColor="#B0B4BA"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={s.label}>Last name</Text>
          <TextInput
            style={s.input}
            value={lastName}
            onChangeText={t => { setLastName(t); setError(''); }}
            placeholder="Stull"
            placeholderTextColor="#B0B4BA"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={s.label}>Phone number</Text>
          <TextInput
            style={s.input}
            value={phone}
            onChangeText={t => { setPhone(t); setError(''); }}
            placeholder="(919) 555-0100"
            placeholderTextColor="#B0B4BA"
            keyboardType="phone-pad"
            returnKeyType="done"
          />
          <Text style={s.hint}>We'll text you a verification code. No spam.</Text>

          {!!error && <Text style={s.error}>{error}</Text>}
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity
            style={[s.btn, !valid && s.btnOff]}
            onPress={handleContinue}
            disabled={!valid}
          >
            <Text style={s.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 8 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:     { fontSize: 15, color: '#8B8F94', marginBottom: 28 },
  label:   { fontSize: 11, fontWeight: '700', color: '#375169', letterSpacing: 0.8,
             textTransform: 'uppercase', marginBottom: 6 },
  input:   { backgroundColor: '#F0F1F3', borderRadius: 12, paddingHorizontal: 16,
             paddingVertical: 14, fontSize: 16, color: '#1A1A2E', marginBottom: 16 },
  hint:    { fontSize: 12, color: '#B0B4BA', marginTop: -8, marginBottom: 8 },
  error:   { fontSize: 13, color: '#D45F3C', marginTop: 4 },
  footer:  { padding: 24, paddingTop: 8 },
  btn:     { borderRadius: 14, paddingVertical: 18, alignItems: 'center', backgroundColor: '#375169' },
  btnOff:  { backgroundColor: '#A8D4EC' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
