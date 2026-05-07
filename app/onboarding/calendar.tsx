import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

type State = 'idle' | 'connecting' | 'connected';

export default function CalendarScreen() {
  const [google, setGoogle] = useState<State>('idle');
  const [apple, setApple]   = useState<State>('idle');

  function connect(which: 'google' | 'apple') {
    const set = which === 'google' ? setGoogle : setApple;
    set('connecting');
    setTimeout(() => set('connected'), 1200);
  }

  async function handleContinue() {
    const connected: string[] = [];
    if (google === 'connected') connected.push('google');
    if (apple  === 'connected') connected.push('apple');
    await saveDraft({ calendar_connected: connected });
    router.push('/onboarding/interests');
  }

  function skip() {
    router.push('/onboarding/interests');
  }

  function label(st: State, name: string) {
    if (st === 'connecting') return 'Connecting…';
    if (st === 'connected')  return `Connected ✓`;
    return `Connect ${name}`;
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={5} />
      <View style={s.content}>
        <Text style={s.heading}>Connect your calendar</Text>
        <Text style={s.sub}>
          So Blyss only shows you plans{'\n'}when you're actually free.
        </Text>

        <View style={s.cards}>
          {/* Google */}
          <TouchableOpacity
            style={[s.card, google === 'connected' && s.cardOn]}
            onPress={() => google === 'idle' && connect('google')}
            disabled={google !== 'idle'}
          >
            <Text style={s.icon}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.cardTitle, google === 'connected' && s.cardTitleOn]}>
                {label(google, 'Google Calendar')}
              </Text>
              {google === 'idle' && (
                <Text style={s.cardSub}>Google Calendar</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={[s.card, apple === 'connected' && s.cardOn]}
            onPress={() => apple === 'idle' && connect('apple')}
            disabled={apple !== 'idle'}
          >
            <Text style={s.icon}>🍎</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.cardTitle, apple === 'connected' && s.cardTitleOn]}>
                {label(apple, 'Apple Calendar')}
              </Text>
              {apple === 'idle' && (
                <Text style={s.cardSub}>Apple Calendar</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.btn} onPress={handleContinue}>
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.skip} onPress={skip}>
          <Text style={s.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#fff' },
  content:    { flex: 1, padding: 24, paddingTop: 40 },
  heading:    { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:        { fontSize: 15, color: '#8B8F94', marginBottom: 36, lineHeight: 22 },
  cards:      { gap: 14 },
  card:       { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5,
                borderColor: '#E3E4E6', borderRadius: 14, paddingVertical: 18,
                paddingHorizontal: 20, backgroundColor: '#fff' },
  cardOn:     { borderColor: '#5BA8D3', backgroundColor: '#EBF5FB' },
  icon:       { fontSize: 26 },
  cardTitle:  { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  cardTitleOn:{ color: '#375169' },
  cardSub:    { fontSize: 12, color: '#B0B4BA', marginTop: 2 },
  footer:     { padding: 24, gap: 10 },
  btn:        { backgroundColor: '#5BA8D3', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  skip:       { alignItems: 'center', paddingVertical: 8 },
  skipText:   { color: '#B0B4BA', fontSize: 14 },
});
