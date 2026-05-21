import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoScreen() {
  const { updateData } = useOnboarding();
  const [photo, setPhoto] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setSkipped(false);
    }
  }

  function handleContinue() {
    updateData({ photo: photo || undefined });
    router.push('/onboarding/splash');
  }

  const isValid = photo !== null || skipped;

  return (
    <OnboardingLayout
      progress={36}
      question="Add a profile photo."
      subtitle="Friends are 3x more likely to RSVP when they can see who's hosting."
      continueDisabled={!isValid}
      onContinue={handleContinue}
    >
      <View style={s.container}>
        <Pressable style={s.photoCircle} onPress={handlePickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={s.photoImage} />
          ) : (
            <Camera size={40} color="#8B8F94" strokeWidth={1.5} />
          )}
        </Pressable>

        <Pressable onPress={() => setSkipped(true)}>
          <Text style={s.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: 'center',
    gap: 24,
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F2F8',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B7D3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  skipText: {
    fontSize: 14,
    color: '#8B8F94',
    fontWeight: '500',
  },
});
