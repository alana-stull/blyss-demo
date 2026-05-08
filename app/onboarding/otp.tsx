import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function OTPScreen() {
  const { data } = useOnboarding();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleChange(text: string, index: number) {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next box
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  const isValid = otp.every(digit => digit !== '');

  function handleContinue() {
    const code = otp.join('');
    // Verify OTP logic here
    router.push('/onboarding/name');
  }

  return (
    <OnboardingLayout
      progress={27}
      question="Enter your code."
      subtitle={data.phone ? `Sent to ${data.phone}.` : "Sent to your phone."}
      continueDisabled={!isValid}
      onContinue={handleContinue}
    >
      <View style={s.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => {
              if (ref) inputs.current[index] = ref;
            }}
            style={[s.otpBox, otp[index] && s.otpBoxFilled]}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            placeholder="-"
            placeholderTextColor="#E3E4E6"
          />
        ))}
      </View>

      {canResend && (
        <Pressable style={s.resendBtn}>
          <Text style={s.resendText}>Resend code</Text>
        </Pressable>
      )}
      {!canResend && resendTimer > 0 && (
        <Text style={s.resendTimer}>Resend in {resendTimer}s</Text>
      )}
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 8,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#4A7FA5',
  },
  resendBtn: {
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#4A7FA5',
    fontWeight: '500',
  },
  resendTimer: {
    fontSize: 13,
    color: '#8B8F94',
    marginTop: 24,
  },
});
