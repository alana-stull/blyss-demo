import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingHeader from '@/components/OnboardingHeader';
import { Colors } from '@/constants/Colors';

const CODE = '123456';

export default function VerifyScreen() {
  const [phone, setPhone]   = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'sending' | 'sent'>('sending');

  useEffect(() => {
    // Load phone from draft
    AsyncStorage.getItem('@blyss_draft').then(raw => {
      const draft = raw ? JSON.parse(raw) : {};
      setPhone(draft.phone ?? '');
    });

    // After 1.5s: mark "sent" and fill digits one by one
    const t1 = setTimeout(() => {
      setStatus('sent');
      CODE.split('').forEach((digit, i) => {
        setTimeout(() => {
          setDigits(prev => {
            const next = [...prev];
            next[i] = digit;
            return next;
          });
        }, i * 130);
      });
    }, 1500);

    // Auto-advance after digits fill + short pause
    const totalFill = 1500 + CODE.length * 130 + 700;
    const t2 = setTimeout(() => {
      router.push('/onboarding/location');
    }, totalFill);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={2} />
      <View style={s.content}>
        <Text style={s.heading}>Check your texts</Text>
        <Text style={s.sub}>
          {status === 'sending'
            ? `Sending code to ${phone || '...'}…`
            : 'Code sent. Verifying now…'}
        </Text>

        <View style={s.boxes}>
          {digits.map((d, i) => (
            <View key={i} style={[s.box, d ? s.boxFilled : null]}>
              <Text style={s.digit}>{d}</Text>
            </View>
          ))}
        </View>

        <Text style={s.note}>This is a demo — no real SMS is sent.</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: Colors.white },
  content:  { flex: 1, padding: 24, paddingTop: 52, alignItems: 'center' },
  heading:  { fontSize: 26, fontWeight: '700', color: Colors.black, letterSpacing: -0.5, marginBottom: 8 },
  sub:      { fontSize: 15, color: Colors.naturalGrey, marginBottom: 44, textAlign: 'center' },
  boxes:    { flexDirection: 'row', gap: 10, marginBottom: 28 },
  box:      { width: 46, height: 56, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.lightGrey,
              backgroundColor: '#F0F1F3', alignItems: 'center', justifyContent: 'center' },
  boxFilled:{ borderColor: Colors.primaryBlue, backgroundColor: '#EBF5FB' },
  digit:    { fontSize: 24, fontWeight: '700', color: Colors.black },
  note:     { fontSize: 12, color: '#B0B4BA' },
});
