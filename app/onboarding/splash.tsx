import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SplashScreen() {
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
          <View style={s.textBlock}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={s.logo}
              resizeMode="contain"
              tintColor="white"
            />
            <Text style={s.headline}>Good plans{'\n'}start here.</Text>
            <Text style={s.subtext}>
              Tell us what you're into and we'll suggest venues, times, and plans that fit how you actually socialize.
            </Text>
          </View>

          <View style={s.actions}>
            <Pressable
              style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.9 }]}
              onPress={() => router.push('/onboarding/interests')}
            >
              <Text style={s.primaryBtnText}>Let's go</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [s.skipBtn, pressed && { opacity: 0.6 }]}
              onPress={() => router.push('/onboarding/friends')}
            >
              <Text style={s.skipText}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    paddingBottom: 140,
  },
  textBlock: {
    gap: 20,
  },
  logo: {
    width: 44,
    height: 44,
  },
  headline: {
    fontFamily: 'Figtree_700Bold',
    fontSize: 40,
    color: '#FFFFFF',
    lineHeight: 48,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.72)',
    lineHeight: 24,
    fontWeight: '400',
  },
  actions: {
    position: 'absolute',
    bottom: 36,
    left: 28,
    right: 28,
    gap: 16,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#375169',
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
  },
});
