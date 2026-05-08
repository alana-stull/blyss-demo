import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  progress: number; // 0-100
  showBackArrow?: boolean;
  question: string;
  subtitle?: string;
  continueDisabled?: boolean;
  onContinue?: () => void;
}

export function OnboardingLayout({
  children,
  progress,
  showBackArrow = true,
  question,
  subtitle,
  continueDisabled = false,
  onContinue,
}: OnboardingLayoutProps) {
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={s.safeArea} edges={['top']}>
        {/* Top row: back arrow + progress bar */}
        <View style={s.topRow}>
          {showBackArrow ? (
            <Pressable
              style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#8B8F94" strokeWidth={1.5} />
            </Pressable>
          ) : (
            <View style={s.backBtn} />
          )}

          {/* Progress bar */}
          <View style={s.progressBarContainer}>
            <View style={s.progressBarBackground}>
              <LinearGradient
                colors={['#B7D3E0', '#4A7FA5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  s.progressBarFilled,
                  { width: `${progress}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Content area */}
        <View style={s.contentContainer}>
          <Text style={s.question}>{question}</Text>
          {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
          {children}
        </View>

        {/* Continue button */}
        {onContinue && (
          <Pressable
            style={[
              s.continueBtn,
              continueDisabled ? s.continueBtnDisabled : s.continueBtnActive,
            ]}
            onPress={onContinue}
            disabled={continueDisabled}
          >
            <Text
              style={[
                s.continueBtnText,
                continueDisabled ? s.continueBtnTextDisabled : s.continueBtnTextActive,
              ]}
            >
              Continue
            </Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FCFCFC' },
  safeArea: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 14,
  },
  backBtn: { width: 24, height: 24 },
  progressBarContainer: { flex: 1 },
  progressBarBackground: {
    height: 3,
    borderRadius: 3,
    backgroundColor: '#E3E4E6',
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#4A7FA5',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#8B8F94',
    lineHeight: 19.5, // 13 * 1.5
    marginBottom: 28,
  },
  continueBtn: {
    position: 'absolute',
    bottom: 36,
    left: 24,
    right: 24,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnActive: {
    backgroundColor: '#4A7FA5',
  },
  continueBtnDisabled: {
    backgroundColor: '#E3E4E6',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  continueBtnTextActive: {
    color: 'white',
  },
  continueBtnTextDisabled: {
    color: '#A0A4A8',
  },
});
