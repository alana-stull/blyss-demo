import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { loadProfile, MOCK_FRIENDS, MOCK_JOURNAL, MOCK_EVENTS } from '@/lib/store';
import { VENUES } from '@/lib/venues';
import type { UserProfile } from '@/lib/store';

type Tab = 'events' | 'posts' | 'saved';

// ─── Mock event cards ────────────────────────────────────────────────────────

const EVENT_TEMPLATES = [
  { suffix: 'Opening Night',    dateLabel: 'Sat, Feb 8 · 7:00 PM',  attending: ['Sarah'] },
  { suffix: 'Sunday Brunch Club', dateLabel: 'Sun, Feb 9 · 11:30 AM', attending: ['Maya', 'Jordan', 'Alex'] },
  { suffix: 'Live Music Night', dateLabel: 'Fri, Feb 14 · 8:30 PM', attending: ['Priya', 'Sam'] },
  { suffix: 'Happy Hour',       dateLabel: 'Thu, Feb 13 · 6:00 PM', attending: ['Maya', 'Jordan'] },
];

const AVATAR_COLORS = ['#B7D3E0', '#D4C5E2', '#C5DEC5', '#E2D4C5'];
const FRIEND_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
];

function buildProfileEvents() {
  return VENUES.slice(0, 4).map((v, i) => {
    const tpl = EVENT_TEMPLATES[i % EVENT_TEMPLATES.length];
    return {
      id: `pe-${v.venue_id}`,
      title: tpl.suffix === 'Sunday Brunch Club' ? 'Sunday Brunch Club' : `${v.name} ${tpl.suffix}`,
      venueName: v.name,
      venueId: v.venue_id,
      image: v.image,
      dateLabel: tpl.dateLabel,
      attending: tpl.attending,
    };
  });
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ item }: { item: ReturnType<typeof buildProfileEvents>[0] }) {
  const isSolo = item.attending.length === 1;

  return (
    <Pressable style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]} onPress={() => router.push(`/venue/${item.venueId}`)}>
      <Image source={{ uri: item.image }} style={s.thumb} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={s.venueRow}>
          <Ionicons name="location-outline" size={13} color="#5BA8D3" />
          <Text style={s.venueName} numberOfLines={1}>{item.venueName}</Text>
        </View>
        <Text style={s.dateText}>{item.dateLabel}</Text>
        <View style={s.attendeeRow}>
          {item.attending.slice(0, 3).map((_, i) => (
            <Image
              key={i}
              source={{ uri: FRIEND_IMAGES[i % FRIEND_IMAGES.length] }}
              style={[s.attendeeAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }]}
            />
          ))}
          <Text style={s.attendeeText}>
            {isSolo
              ? `${item.attending[0]}'s event`
              : `${item.attending.length} attending`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>('events');

  useFocusEffect(
    useCallback(() => { loadProfile().then(setProfile); }, [])
  );

  const firstName = profile?.first_name ?? 'Alana';
  const lastName  = profile?.last_name  ?? 'Stull';
  const city      = profile?.city       ?? 'Durham';
  const handle    = profile?.handle     ?? `${firstName.toLowerCase()}.cassidy`;
  const initials  = `${firstName[0] ?? 'A'}${lastName[0] ?? 'S'}`.toUpperCase();

  const profileEvents = buildProfileEvents();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Avatar + identity ── */}
        <View style={s.heroSection}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.initials}>{initials}</Text>
            </View>
          </View>

          <Text style={s.displayName}>{firstName} {lastName}</Text>
          <Text style={s.subLine}>@{handle} · {city}</Text>

          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>142</Text>
              <Text style={s.statLabel}>Friends</Text>
            </View>
            <Pressable style={({ pressed }) => [s.stat, pressed && { opacity: 0.7 }]} onPress={() => router.push('/journal')}>
              <Text style={s.statNum}>24</Text>
              <Text style={s.statLabel}>Planned</Text>
            </Pressable>
            <View style={s.stat}>
              <Text style={s.statNum}>87</Text>
              <Text style={s.statLabel}>Attended</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={s.actionsRow}>
            <Pressable style={({ pressed }) => pressed ? { opacity: 0.7 } : {}} onPress={() => router.push('/onboarding/interests')}>
              <Text style={s.actionLink}>Edit Profile</Text>
            </Pressable>
            <Text style={s.actionDot}>·</Text>
            <Pressable style={({ pressed }) => pressed ? { opacity: 0.7 } : {}}>
              <Text style={s.actionLink}>Settings</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={s.tabBar}>
          {(['events', 'posts', 'saved'] as Tab[]).map(t => (
            <Pressable
              key={t}
              style={({ pressed }) => [s.tabBtn, tab === t && s.tabBtnActive, pressed && { opacity: 0.7 }]}
              onPress={() => setTab(t)}
            >
              <Text style={[s.tabLabel, tab === t && s.tabLabelActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Tab content ── */}
        <View style={s.feedSection}>
          {tab === 'events' && profileEvents.map(item => (
            <EventCard key={item.id} item={item} />
          ))}

          {tab === 'posts' && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No posts yet</Text>
            </View>
          )}

          {tab === 'saved' && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No saved places yet</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F7F8FA' },
  scroll: { paddingBottom: 40 },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  avatarWrap: {
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EBF5FB',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  initials: { fontSize: 30, fontWeight: '800', color: '#375169' },

  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subLine: {
    fontSize: 14,
    color: '#8B8F94',
    marginBottom: 20,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 36,
    marginBottom: 18,
  },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: '#8B8F94', fontWeight: '500' },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionLink: { fontSize: 14, color: '#5BA8D3', fontWeight: '600' },
  actionDot:  { fontSize: 14, color: '#B0B4BA' },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F1F3',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: { fontSize: 14, fontWeight: '500', color: '#8B8F94' },
  tabLabelActive: { fontWeight: '700', color: '#1A1A2E' },

  // Feed
  feedSection: { paddingHorizontal: 16, gap: 12 },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: {
    width: 110,
    height: 120,
    backgroundColor: '#E3E4E6',
  },
  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  venueName: {
    fontSize: 13,
    color: '#5BA8D3',
    fontWeight: '500',
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: '#8B8F94',
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  attendeeAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: '#E3E4E6',
  },
  attendeeText: {
    fontSize: 12,
    color: '#8B8F94',
  },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: '#8B8F94' },

});
