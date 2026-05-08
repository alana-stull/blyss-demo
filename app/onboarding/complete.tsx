import React from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.content}>
        <View style={s.centeredContent}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.heading}>You're all set, {data.name?.first || 'there'}!</Text>
          <Text style={s.subtitle}>Turn your intentions into plans.</Text>
        </View>

        <View style={s.buttonContainer}>
          <Pressable
            style={s.primaryBtn}
            onPress={handleCreatePlan}
          >
            <Text style={s.primaryBtnText}>Create your first plan</Text>
          </Pressable>

          <Pressable
            style={s.secondaryBtn}
            onPress={handleExplore}
          >
            <Text style={s.secondaryBtnText}>Explore nearby</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8B8F94',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  secondaryBtn: {
    height: 52,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#375169',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#375169',
  },
  primaryBtn: {
    height: 52,
    backgroundColor: '#375169',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
});
