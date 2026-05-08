import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const BUDGETS = [
  { label: '$', desc: 'Budget-friendly' },
  { label: '$$', desc: 'Mid-range' },
  { label: '$$$', desc: 'Treat yourself' },
];

export default function BudgetScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    // Map $ -> under20 etc if needed by context
    let budgetValue: 'under20' | '20to40' | '40to75' = 'under20';
    if (selected === '$$') budgetValue = '20to40';
    if (selected === '$$$') budgetValue = '40to75';

    updateData({ budget: budgetValue });
    router.push('/onboarding/calendar');
  }

  return (
    <OnboardingLayout
      progress={73}
      question="What's your usual budget?"
      subtitle="This helps us recommend plans you'll love."
      continueDisabled={!selected}
      onContinue={handleContinue}
    >
      <View style={s.container}>
        {BUDGETS.map((option, idx) => (
          <Pressable
            key={idx}
            style={[
              s.option,
              selected === option.label && s.optionActive,
            ]}
            onPress={() => setSelected(option.label)}
          >
            <View style={s.textContainer}>
              <Text
                style={[
                  s.label,
                  selected === option.label && s.labelActive,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  s.desc,
                  selected === option.label && s.descActive,
                ]}
              >
                {option.desc}
              </Text>
            </View>
            <View style={[s.circle, selected === option.label && s.circleActive]}>
              {selected === option.label && (
                <Check size={14} color="white" strokeWidth={2.5} />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 8,
  },
  option: {
    height: 64,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  optionActive: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  textContainer: {
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  labelActive: {
    color: '#375169',
  },
  desc: {
    fontSize: 12,
    color: '#8B8F94',
  },
  descActive: {
    color: '#375169',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#E3E4E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  circleActive: {
    borderColor: '#4A7FA5',
    backgroundColor: '#4A7FA5',
  },
});
