import React from 'react';
import { View, StyleSheet, Pressable, Text, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScaleBtn } from '@/components/ScaleBtn';

export default function WelcomeScreen() {
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
          <View style={s.logoSection}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={s.logo}
              resizeMode="contain"
              tintColor="white"
            />
            <Text style={s.tagline}>Plans that actually happen.</Text>
          </View>

          <View style={s.buttonsContainer}>
            <ScaleBtn
              style={s.phoneBtn}
              onPress={() => router.push('/onboarding/phone')}
            >
              <Text style={s.phoneBtnText}>Continue with phone</Text>
            </ScaleBtn>

            <Pressable
              style={({ pressed }) => [s.googleBtn, pressed && { opacity: 0.85 }]}
              onPress={() => router.push('/onboarding/phone')}
            >
              <Text style={s.googleBtnText}>Continue with Google</Text>
            </Pressable>

            <ScaleBtn
              style={s.appleBtn}
              onPress={() => router.push('/onboarding/phone')}
            >
              <Text style={s.appleBtnText}>Continue with Apple</Text>
            </ScaleBtn>
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
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  tagline: {
    fontFamily: 'Figtree_600SemiBold_Italic',
    fontSize: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 12,
  },
  phoneBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#375169',
  },
  googleBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  appleBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
