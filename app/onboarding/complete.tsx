import React from 'react';
import { View, StyleSheet, Pressable, Text, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function CompleteScreen() {
  const { data, reset } = useOnboarding();

  async function handleExplore() {
    await AsyncStorage.setItem('blyss_onboarding_complete', 'true');
    reset();
    router.replace('/(tabs)/explore');
  }

  async function handleCreatePlan() {
    await AsyncStorage.setItem('blyss_onboarding_complete', 'true');
    reset();
    router.replace('/(tabs)/plan');
  }

  return (
    <LinearGradient
      colors={['#4A90C4', '#3B72A8', '#162D55']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={s.root}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        <View style={s.content}>
          <View style={s.centeredContent}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={s.logo}
              resizeMode="contain"
              tintColor="white"
            />
            <Text style={s.heading}>
              You're all set, {data.name?.first || 'there'}!
            </Text>
            <Text style={s.subtitle}>Turn your intentions into plans.</Text>
          </View>

          <View style={s.buttonContainer}>
            <Pressable
              style={({ pressed }) => [s.exploreBtn, pressed && { opacity: 0.9 }]}
              onPress={handleExplore}
            >
              <Text style={s.exploreBtnText}>Explore nearby</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [s.createBtn, pressed && { opacity: 0.85 }]}
              onPress={handleCreatePlan}
            >
              <Text style={s.createBtnText}>Create your first plan</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  heading: {
    fontFamily: 'Figtree_700Bold',
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Figtree_600SemiBold_Italic',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    gap: 12,
  },
  exploreBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#375169',
  },
  createBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
