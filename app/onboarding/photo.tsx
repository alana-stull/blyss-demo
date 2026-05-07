import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import OnboardingHeader from '@/components/OnboardingHeader';
import { saveDraft } from '@/lib/store';

export default function PhotoScreen() {
  const [uploaded, setUploaded] = useState(false);

  async function handleUpload() {
    setUploaded(true);
    await saveDraft({ photo_uploaded: true });
  }

  function next() {
    router.push('/onboarding/calendar');
  }

  return (
    <SafeAreaView style={s.safe}>
      <OnboardingHeader step={4} />
      <View style={s.content}>
        <Text style={s.heading}>Add a photo</Text>
        <Text style={s.sub}>
          Plans get more RSVPs when{'\n'}hosts have a photo.
        </Text>

        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            {uploaded
              ? <Text style={s.check}>✓</Text>
              : <Text style={s.person}>👤</Text>
            }
          </View>
          {uploaded && <Text style={s.uploadedLabel}>Looking good!</Text>}
        </View>

        <TouchableOpacity
          style={[s.uploadBtn, uploaded && s.uploadBtnDone]}
          onPress={handleUpload}
          disabled={uploaded}
        >
          <Text style={[s.uploadBtnText, uploaded && s.uploadBtnTextDone]}>
            {uploaded ? '✓  Photo added' : 'Upload photo'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.btn} onPress={next}>
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.skip} onPress={next}>
          <Text style={s.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#fff' },
  content:          { flex: 1, padding: 24, paddingTop: 40, alignItems: 'center' },
  heading:          { fontSize: 26, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 6 },
  sub:              { fontSize: 15, color: '#8B8F94', marginBottom: 44, textAlign: 'center', lineHeight: 22 },
  avatarWrap:       { alignItems: 'center', marginBottom: 32 },
  avatar:           { width: 120, height: 120, borderRadius: 60, backgroundColor: '#EBF5FB',
                      borderWidth: 3, borderColor: '#B7D3E0', alignItems: 'center',
                      justifyContent: 'center', marginBottom: 10 },
  person:           { fontSize: 52 },
  check:            { fontSize: 52, color: '#5BA8D3' },
  uploadedLabel:    { fontSize: 14, color: '#5BA8D3', fontWeight: '600' },
  uploadBtn:        { borderWidth: 1.5, borderColor: '#5BA8D3', borderRadius: 14,
                      paddingVertical: 14, paddingHorizontal: 36 },
  uploadBtnDone:    { backgroundColor: '#EBF5FB', borderColor: '#B7D3E0' },
  uploadBtnText:    { color: '#5BA8D3', fontSize: 15, fontWeight: '600' },
  uploadBtnTextDone:{ color: '#375169' },
  footer:           { padding: 24, paddingTop: 0, gap: 10 },
  btn:              { backgroundColor: '#5BA8D3', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText:          { color: '#fff', fontSize: 16, fontWeight: '700' },
  skip:             { alignItems: 'center', paddingVertical: 8 },
  skipText:         { color: '#B0B4BA', fontSize: 14 },
});
