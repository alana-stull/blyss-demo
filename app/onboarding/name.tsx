import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function NameScreen() {
  const { updateData } = useOnboarding();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [focusedField, setFocusedField] = useState<'first' | 'last' | null>(null);
  const [lastNameVisible, setLastNameVisible] = useState(false);

  const lastNameAnim = useRef(new Animated.Value(0)).current;

  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  useEffect(() => {
    if (firstName.length > 0 && !lastNameVisible) {
      setLastNameVisible(true);
      Animated.parallel([
        Animated.timing(lastNameAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [firstName]);

  function handleContinue() {
    updateData({ name: { first: firstName, last: lastName } });
    router.push('/onboarding/location');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.root}
    >
      <OnboardingLayout
        progress={21}
        question="What's your name?"
        subtitle="This shows on your invites and plans."
        continueDisabled={!isValid}
        onContinue={handleContinue}
      >
        <View style={s.inputsContainer}>
          <TextInput
            style={[s.input, focusedField === 'first' && s.inputFocused]}
            placeholder="First name"
            placeholderTextColor="#A0A4A8"
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFocusedField('first')}
            onBlur={() => setFocusedField(null)}
          />
          {lastNameVisible && (
            <Animated.View
              style={{
                opacity: lastNameAnim,
                transform: [
                  {
                    translateY: lastNameAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TextInput
                style={[s.input, focusedField === 'last' && s.inputFocused]}
                placeholder="Last name"
                placeholderTextColor="#A0A4A8"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedField('last')}
                onBlur={() => setFocusedField(null)}
              />
            </Animated.View>
          )}
        </View>
      </OnboardingLayout>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  inputsContainer: {
    gap: 12,
    marginTop: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#333333',
  },
  inputFocused: {
    borderColor: '#4A7FA5',
  },
});
