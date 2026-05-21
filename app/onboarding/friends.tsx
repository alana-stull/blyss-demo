import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Users } from 'lucide-react-native';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const SUGGESTED_FRIENDS = [
  { id: '1', name: 'Alex Johnson', initials: 'AJ', mutuals: 12 },
  { id: '2', name: 'Jordan Smith', initials: 'JS', mutuals: 8 },
  { id: '3', name: 'Casey Williams', initials: 'CW', mutuals: 5 },
  { id: '4', name: 'Morgan Brown', initials: 'MB', mutuals: 3 },
  { id: '5', name: 'Riley Davis', initials: 'RD', mutuals: 1 },
];

export default function FriendsScreen() {
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleFriend(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter(f => f !== id));
    } else {
      setSelected([...selected, id]);
    }
  }

  function handleContinue() {
    updateData({ friendsAdded: selected });
    router.push('/onboarding/notifications');
  }

  return (
    <OnboardingLayout
      progress={93}
      question="Find your friends."
      subtitle="See who's already on Blyss."
      continueDisabled={false}
      onContinue={handleContinue}
    >
      <View style={s.container}>
        <Pressable style={s.syncBtn}>
          <Users size={18} color="#333333" strokeWidth={1.5} />
          <Text style={s.syncBtnText}>Sync contacts</Text>
        </Pressable>

        <FlatList
          scrollEnabled={true}
          data={SUGGESTED_FRIENDS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          renderItem={({ item }) => {
            const isAdded = selected.includes(item.id);
            return (
              <View style={s.friendRow}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{item.initials}</Text>
                </View>
                <View style={s.friendInfo}>
                  <Text style={s.friendName}>{item.name}</Text>
                  <Text style={s.mutualsText}>{item.mutuals} mutual friends</Text>
                </View>
                <Pressable
                  style={[s.addBtn, isAdded && s.addBtnActive]}
                  onPress={() => toggleFriend(item.id)}
                >
                  <Text style={s.addBtnText}>{isAdded ? 'Added ✓' : 'Add'}</Text>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </OnboardingLayout>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, paddingBottom: 100 },
  syncBtn: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  syncBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  listContent: {
    gap: 16,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#375169',
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  mutualsText: {
    fontSize: 13,
    color: '#8B8F94',
    marginTop: 2,
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#E8F2F8',
  },
  addBtnActive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E3E4E6',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#375169',
  },
});
