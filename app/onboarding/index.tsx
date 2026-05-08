import React from 'react';
import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ScaleBtn } from '@/components/ScaleBtn';
import { Colors } from '@/constants/Colors';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.content}>
        {/* Logo and tagline */}
        <View style={s.logoSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.tagline}>Plans with people you love.</Text>
        </View>

        {/* Auth buttons */}
        <View style={s.buttonsContainer}>
          <ScaleBtn
            style={s.appleBtn}
            onPress={() => {
              router.push('/onboarding/phone');
            }}
          >
            <Text style={s.appleBtnText}>Continue with Apple</Text>
          </ScaleBtn>

          <Pressable
            style={({ pressed }) => [s.googleBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              router.push('/onboarding/phone');
            }}
          >
            <Text style={s.googleBtnText}>Continue with Google</Text>
          </Pressable>

          <ScaleBtn
            style={s.phoneBtn}
            onPress={() => router.push('/onboarding/phone')}
          >
            <Text style={s.phoneBtnText}>Continue with phone</Text>
          </ScaleBtn>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FCFCFC' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  logoSection: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 80,
    height: 80,
  },
  tagline: {
    fontSize: 14,
    color: '#8B8F94',
  },
  buttonsContainer: {
    gap: 12,
  },
  appleBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  googleBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E3E4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  phoneBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#4A7FA5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
});
