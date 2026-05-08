import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';

// ─── Mock profiles ─────────────────────────────────────────────────────────────

const MOCK_PROFILES: Record<string, {
  name: string; initials: string; bg: string; fg: string;
  handle: string; city: string; friends: number; planned: number; attended: number;
  bio: string;
}> = {
  'maya-r':   { name: 'Maya R.',   initials: 'MR', bg: '#9FE1CB', fg: '#085041', handle: 'maya.r',    city: 'Durham, NC',    friends: 218, planned: 31, attended: 104, bio: 'Always down for a new restaurant or a long hike. Durham local.' },
  'jordan-k': { name: 'Jordan K.', initials: 'JK', bg: '#C5D4E0', fg: '#2C4A5E', handle: 'jordan.k',  city: 'Durham, NC',    friends: 143, planned: 22, attended: 78,  bio: 'Live music & late nights. Ponysaurus is my second home.' },
  'jordan-s': { name: 'Jordan S.', initials: 'JS', bg: '#F5C4B3', fg: '#712B13', handle: 'jordan.s',  city: 'Chapel Hill, NC', friends: 156, planned: 19, attended: 67, bio: 'Cocktail enthusiast. Recommends every rooftop in the Triangle.' },
  'priya-s':  { name: 'Priya S.',  initials: 'PS', bg: '#E8D9F5', fg: '#5B2D8E', handle: 'priya.s',   city: 'Durham, NC',    friends: 97,  planned: 15, attended: 52,  bio: 'Outdoor adventures and good coffee. Always planning the next trip.' },
  'alex-t':   { name: 'Alex T.',   initials: 'AT', bg: '#FDEACC', fg: '#7A4510', handle: 'alex.t',    city: 'Raleigh, NC',   friends: 124, planned: 18, attended: 61,  bio: 'Music photographer by day, venue explorer by night.' },
  'sam-l':    { name: 'Sam L.',    initials: 'SL', bg: '#C5DEC5', fg: '#1E5C1E', handle: 'sam.l',     city: 'Durham, NC',    friends: 88,  planned: 11, attended: 39,  bio: 'Hiking trails and farmers markets. Loves Eno River.' },
  'kai-p':    { name: 'Kai P.',    initials: 'KP', bg: '#C5D4E0', fg: '#2C4A5E', handle: 'kai.p',     city: 'Durham, NC',    friends: 89,  planned: 12, attended: 44,  bio: 'Golf, ping pong, and finding the best wings in Durham.' },
  'tara-r':   { name: 'Tara R.',   initials: 'TR', bg: '#B7D3E0', fg: '#375169', handle: 'tara.r',    city: 'Raleigh, NC',   friends: 174, planned: 28, attended: 91,  bio: 'Brunch spots and rooftop bars. Perpetually planning the next group outing.' },
};

const FALLBACK = MOCK_PROFILES['maya-r'];

const RECENT_VENUES = VENUES.slice(0, 3);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = MOCK_PROFILES[id ?? ''] ?? FALLBACK;
  const [following, setFollowing] = useState(false);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
          <ChevronLeft size={22} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Hero */}
        <View style={s.heroSection}>
          <View style={[s.avatar, { backgroundColor: profile.bg }]}>
            <Text style={[s.initials, { color: profile.fg }]}>{profile.initials}</Text>
          </View>
          <Text style={s.displayName}>{profile.name}</Text>
          <Text style={s.subLine}>@{profile.handle} · {profile.city}</Text>
          {!!profile.bio && <Text style={s.bio}>{profile.bio}</Text>}

          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>{profile.friends}</Text>
              <Text style={s.statLabel}>Friends</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statNum}>{profile.planned}</Text>
              <Text style={s.statLabel}>Planned</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statNum}>{profile.attended}</Text>
              <Text style={s.statLabel}>Attended</Text>
            </View>
          </View>

          <View style={s.actionsRow}>
            <Pressable
              style={[s.followBtn, following && s.followingBtn]}
              onPress={() => setFollowing(v => !v)}
            >
              <Text style={[s.followBtnText, following && s.followingBtnText]}>
                {following ? 'Following' : '+ Follow'}
              </Text>
            </Pressable>
            <Pressable style={s.messageBtn} onPress={() => router.push('/chat')}>
              <Text style={s.messageBtnText}>Message</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent spots */}
        <Text style={s.sectionLabel}>RECENT SPOTS</Text>
        {RECENT_VENUES.map(v => (
          <Pressable
            key={v.venue_id}
            style={({ pressed }) => [s.venueRow, pressed && { opacity: 0.9 }]}
            onPress={() => router.push(`/venue/${v.venue_id}`)}
          >
            <Image source={{ uri: v.image }} style={s.venueThumb} />
            <View style={s.venueBody}>
              <Text style={s.venueName} numberOfLines={1}>{v.name}</Text>
              <Text style={s.venueMeta}>{v.subcategory} · {v.neighborhood}</Text>
              <View style={s.venueTagRow}>
                {v.tags.slice(0, 2).map(t => (
                  <View key={t} style={s.tag}>
                    <Text style={s.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.screenBackground },
  scroll: { paddingBottom: 40 },

  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  heroSection: { alignItems: 'center', paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20, backgroundColor: Colors.white, marginBottom: 16 },
  avatar:     { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
  initials:   { fontSize: 28, fontWeight: '800' },
  displayName:{ fontSize: 20, fontWeight: '700', color: Colors.black, letterSpacing: -0.4, marginBottom: 4 },
  subLine:    { fontSize: 13, color: Colors.naturalGrey, marginBottom: 10 },
  bio:        { fontSize: 13, color: '#4A4A5A', textAlign: 'center', lineHeight: 19, marginBottom: 16, paddingHorizontal: 20 },

  statsRow:   { flexDirection: 'row', gap: 36, marginBottom: 18 },
  stat:       { alignItems: 'center', gap: 2 },
  statNum:    { fontSize: 20, fontWeight: '800', color: Colors.black, letterSpacing: -0.5 },
  statLabel:  { fontSize: 12, color: Colors.naturalGrey, fontWeight: '500' },

  actionsRow: { flexDirection: 'row', gap: 10 },
  followBtn:  { paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10, backgroundColor: '#375169' },
  followingBtn: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: '#375169' },
  followBtnText:   { fontSize: 14, fontWeight: '600', color: Colors.white },
  followingBtnText:{ color: '#375169' },
  messageBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.lightGrey },
  messageBtnText: { fontSize: 14, fontWeight: '600', color: Colors.black },

  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.naturalGrey, letterSpacing: 1, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 10, textTransform: 'uppercase' },

  venueRow:  { flexDirection: 'row', backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 10, borderRadius: 14, overflow: 'hidden',
               shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  venueThumb:{ width: 90, height: 90, backgroundColor: Colors.lightGrey },
  venueBody: { flex: 1, padding: 12, justifyContent: 'center', gap: 3 },
  venueName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  venueMeta: { fontSize: 12, color: Colors.naturalGrey },
  venueTagRow:{ flexDirection: 'row', gap: 6, marginTop: 4 },
  tag:       { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 99, borderWidth: 1, borderColor: Colors.lightGrey },
  tagText:   { fontSize: 11, color: Colors.black },
});
