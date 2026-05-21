import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function PhoneScreen() {
  const { updateData } = useOnboarding();
  const [phone, setPhone] = useState('');

  const isValid = phone.replace(/\D/g, '').length === 10;

  function handleContinue() {
    updateData({ phone: '+1' + phone.replace(/\D/g, '') });
    router.push('/onboarding/otp');
  }

  function formatPhone(text: string) {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} - ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} - ${cleaned.slice(3, 6)} - ${cleaned.slice(6, 10)}`;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.root}
    >
      <OnboardingLayout
        progress={7}
        question="What's your number?"
        subtitle="We protect our community by ensuring everyone on Blyss is real."
        continueDisabled={!isValid}
        onContinue={handleContinue}
      >
        <View style={s.inputRow}>
          <View style={s.countryCodeBox}>
            <Text style={s.countryCodeInput}>
              🇺🇸 +1
            </Text>
          </View>
          <TextInput
            style={s.phoneInput}
            placeholder="999 - 999 - 9999"
            placeholderTextColor="#A0A4A8"
            keyboardType="phone-pad"
            value={formatPhone(phone)}
            onChangeText={setPhone}
            maxLength={16}
          />
        </View>
      </OnboardingLayout>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  countryCodeBox: {
    width: 52,
    height: 48,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeInput: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333333',
  },
});
