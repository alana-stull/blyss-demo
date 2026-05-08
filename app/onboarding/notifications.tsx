import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Bell, CalendarCheck, Clock } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

export default function NotificationsScreen() {
  const { updateData } = useOnboarding();

  async function handleTurnOn() {
    const { status } = await Notifications.requestPermissionsAsync();
    updateData({ notificationsEnabled: status === 'granted' });
    router.push('/onboarding/complete');
  }

  function handleSkip() {
    updateData({ notificationsEnabled: false });
    router.push('/onboarding/complete');
  }

  return (
    <OnboardingLayout
      progress={93}
      question="Stay in the loop."
      subtitle="Get notified when friends RSVP, plans are confirmed, and reminders before events."
    >
      <ScrollView style={s.container} scrollEnabled={false}>
        <View style={s.feature}>
          <Bell size={20} color="#4A7FA5" strokeWidth={1.5} />
          <Text style={s.featureText}>When friends RSVP</Text>
        </View>

        <View style={s.feature}>
          <CalendarCheck size={20} color="#4A7FA5" strokeWidth={1.5} />
          <Text style={s.featureText}>When plans are confirmed</Text>
        </View>

        <View style={s.feature}>
          <Clock size={20} color="#4A7FA5" strokeWidth={1.5} />
          <Text style={s.featureText}>Reminders before events</Text>
        </View>

        <Pressable
          style={s.turnOnBtn}
          onPress={handleTurnOn}
        >
          <Text style={s.turnOnText}>Turn on notifications</Text>
        </Pressable>

        <Pressable style={s.maybeLink} onPress={handleSkip}>
          <Text style={s.maybeLinkText}>Maybe later</Text>
        </Pressable>
      </ScrollView>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  turnOnBtn: {
    height: 52,
    backgroundColor: '#4A7FA5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  turnOnText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  maybeLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  maybeLinkText: {
    fontSize: 14,
    color: '#8B8F94',
    fontWeight: '500',
  },
});
