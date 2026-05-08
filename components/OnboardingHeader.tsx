import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface Props {
  step: number;
  total?: number;
  showBack?: boolean;
}

export default function OnboardingHeader({ step, total = 11, showBack = true }: Props) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <View style={styles.chevronWrap}>
            <View style={[styles.chevronLine, styles.chevronTop]} />
            <View style={[styles.chevronLine, styles.chevronBottom]} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}
      <View style={styles.dashes}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.dash, i < step ? styles.dashFilled : styles.dashEmpty]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 14,
  },
  backBtn: {
    width: 32,
    height: 24,
    justifyContent: 'center',
  },
  chevronWrap: {
    width: 10,
    height: 16,
    justifyContent: 'center',
  },
  chevronLine: {
    position: 'absolute',
    width: 10,
    height: 1.8,
    backgroundColor: Colors.black,
    borderRadius: 2,
  },
  chevronTop: {
    transform: [{ rotate: '-45deg' }, { translateY: -3 }],
  },
  chevronBottom: {
    transform: [{ rotate: '45deg' }, { translateY: 3 }],
  },
  dashes: {
    flexDirection: 'row',
    gap: 4,
  },
  dash: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  dashFilled: {
    backgroundColor: Colors.primaryBlue,
  },
  dashEmpty: {
    backgroundColor: Colors.lightGrey,
  },
});
