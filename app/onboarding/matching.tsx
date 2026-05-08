import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingHeader from '@/components/OnboardingHeader';
import { Colors } from '@/constants/Colors';
import { saveProfile, clearDraft } from '@/lib/store';
import type { UserProfile, BudgetTier } from '@/lib/store';

const STEPS = [
  { delay: 0,    duration: 1400, target: 0.28 },
  { delay: 1600, duration: 1400, target: 0.62 },
  { delay: 3200, duration: 1000, target: 0.90 },
  { delay: 4400, duration: 500,  target: 1.00 },
];
const DONE_AT = 5200;

export default function MatchingScreen() {
  const progress  = useRef(new Animated.Value(0)).current;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone]         = useState(false);
  const [city, setCity]         = useState('your city');
  const [filled, setFilled]     = useState(5); // how many of 5 preference screens answered

  // Dynamic messages (city interpolated at render time)
  const messages = [
    `Finding venues in ${city}…`,
    'Scoring based on your vibe…',
    'Building your explore feed…',
    'Ready!',
  ];

  useEffect(() => {
    async function init() {
      const raw   = await AsyncStorage.getItem('@blyss_draft');
      const draft = raw ? JSON.parse(raw) : {};

      // City for display
      setCity(draft.city ?? 'your city');

      // Profile completeness (screens 6–10)
      const prefs = [
        Array.isArray(draft.interests)   && draft.interests.length   > 0,
        Array.isArray(draft.experiences) && draft.experiences.length > 0,
        !!draft.vibe,
        !!draft.budget_tier,
        !!draft.pain_point,
      ];
      setFilled(prefs.filter(Boolean).length);

      // Compile and save profile
      const profile: UserProfile = {
        first_name:         draft.first_name         ?? '',
        last_name:          draft.last_name          ?? '',
        phone:              draft.phone              ?? '',
        city:               draft.city               ?? '',
        photo_uploaded:     draft.photo_uploaded     ?? false,
        calendar_connected: draft.calendar_connected ?? [],
        interests:          draft.interests          ?? [],
        experiences:        draft.experiences        ?? [],
        vibe:               draft.vibe               ?? '',
        budget_tier:        (draft.budget_tier as BudgetTier) ?? 'nolimit',
        pain_point:         draft.pain_point         ?? '',
        onboarding_complete: true,
        joined_at:          new Date().toISOString(),
        handle: (draft.first_name ?? 'user').toLowerCase(),
        name:   `${draft.first_name ?? ''} ${draft.last_name ?? ''}`.trim(),
      };
      await saveProfile(profile);
      await clearDraft();

      // Start animation sequence
      STEPS.forEach((step, i) => {
        const t = setTimeout(() => {
          setMsgIndex(i);
          Animated.timing(progress, {
            toValue:         step.target,
            duration:        step.duration,
            useNativeDriver: false,
          }).start();
        }, step.delay);
        timersRef.current.push(t);
      });

      const doneTimer = setTimeout(() => setDone(true), DONE_AT);
      timersRef.current.push(doneTimer);
    }

    init();
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const barWidth = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0%', '100%'],
  });

  const missing = 5 - filled;

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={11} showBack={false} />
      <View style={s.content}>
        <Text style={s.heading}>Your feed is ready.</Text>
        <Text style={s.sub}>Matching you with the best spots in {city}.</Text>

        {/* Animated progress card */}
        <View style={s.card}>
          <Text style={s.message}>{messages[msgIndex]}</Text>
          <View style={s.track}>
            <Animated.View style={[s.fill, { width: barWidth }]} />
          </View>
        </View>

        {/* Profile completeness (only when done and something was skipped) */}
        {done && missing > 0 && (
          <View style={s.completeness}>
            <View style={s.dots}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[s.dotEl, i < filled && s.dotFilled]} />
              ))}
            </View>
            <Text style={s.completenessText}>
              Answer {missing} more question{missing > 1 ? 's' : ''} for better recommendations
            </Text>
          </View>
        )}

        {/* Spacer pushes button to bottom */}
        <View style={{ flex: 1 }} />

        {done && (
          <TouchableOpacity
            style={s.enterBtn}
            onPress={() => router.replace('/(tabs)/explore')}
          >
            <Text style={s.enterBtnText}>Enter Blyss →</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.white },
  content:          { flex: 1, padding: 24, paddingTop: 40 },
  heading:          { fontSize: 30, fontWeight: '700', color: Colors.black,
                      letterSpacing: -0.5, marginBottom: 6 },
  sub:              { fontSize: 15, color: Colors.naturalGrey, marginBottom: 36 },
  card:             { backgroundColor: Colors.screenBackground, borderRadius: 16, padding: 24, marginBottom: 20 },
  message:          { fontSize: 15, fontWeight: '600', color: Colors.deepSlate, marginBottom: 16 },
  track:            { height: 6, backgroundColor: Colors.lightGrey, borderRadius: 3, overflow: 'hidden' },
  fill:             { height: 6, backgroundColor: Colors.primaryBlue, borderRadius: 3 },
  completeness:     { backgroundColor: '#EBF5FB', borderRadius: 14, padding: 16, alignItems: 'center' },
  dots:             { flexDirection: 'row', gap: 8, marginBottom: 8 },
  dotEl:            { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.lightGrey },
  dotFilled:        { backgroundColor: Colors.primaryBlue },
  completenessText: { fontSize: 13, color: Colors.deepSlate, textAlign: 'center', lineHeight: 18 },
  enterBtn:         { backgroundColor: Colors.primaryBlue, borderRadius: 14, paddingVertical: 18,
                      alignItems: 'center', marginBottom: 8 },
  enterBtnText:     { color: Colors.white, fontSize: 17, fontWeight: '700', letterSpacing: 0.2 },
});
