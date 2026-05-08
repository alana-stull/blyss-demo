import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScaleBtn } from '@/components/ScaleBtn';
import { Colors } from '@/constants/Colors';
import { acceptEvent, cancelEvent, isAccepted } from '@/lib/events';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = Colors.deepSlate;
const TAB_ITEMS = [
  { id: 'Invites', icon: 'mail-outline', label: 'Invites' },
  { id: 'Updates', icon: 'flash-outline', label: 'Updates' },
  { id: 'Social', icon: 'heart-outline', label: 'Social' },
] as const;
type TabId = typeof TAB_ITEMS[number]['id'];

// ─── Mock data (Truncated for brevity) ────────────────────────────────────────

const UPCOMING = {
  eventId: 'event-upcoming-1',
  title:   'Trivia Tuesday at Ponysaurus',
  host:    'Jordan K',
  venue:   'Ponysaurus Brewing',
  time:    'Tonight · 7:30 PM',
  venueId: 'V010',
  avatars: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  ],
};

const MOCK_INVITES = [
  {
    id: 'inv1', eventId: 'event-inv1', title: 'Tapas Night', host: 'Maya Torres', initials: 'MT',
    venue: 'Mateo Bar de Tapas', venueId: 'V007',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    date: 'Sat, Feb 8', time: '8:00 PM', attendees: 4,
    tags: ['Tapas', 'Cocktails'],
  },
  {
    id: 'inv2', eventId: 'event-inv2', title: 'Morning Hike', host: 'Chris Dos Santos', initials: 'CS',
    venue: 'Eno River State Park', venueId: 'V023',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    date: 'Sun, Feb 9', time: '10:00 AM', attendees: 6,
    tags: ['Outdoors', 'Hiking'],
  },
];

const MOCK_EVENT_UPDATES = [
  { id: 'e1', eventId: 'event-update-1', kind: 'join', actor: 'Ari Patel', initials: 'AP', action: 'joined your event', target: 'Rooftop Mixer', time: '1h ago' },
  { id: 'e2', eventId: 'event-update-2', kind: 'cancel', actor: 'Noah Grant', initials: 'NG', action: 'cancelled their spot at', target: 'Sunday Beats', time: '3h ago' },
];

const MOCK_SOCIAL = [
  { id: 's1', eventId: 'event-social-1', kind: 'like', actor: 'Mesha Robinson', initials: 'MR', action: 'liked your post at', target: 'Café Lumière', time: '2h ago' },
  { id: 's2', eventId: 'event-social-2', kind: 'comment', actor: 'Asili Johnson', initials: 'AS', action: 'commented on your event', target: 'Sunday Brunch Club', time: '4h ago' },
];

// ─── Sub-Components ────────────────────────────────────────────────────────────

function SectionLabel({ text, count }: { text: string; count?: number }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionLabel}>{text}</Text>
      {count != null && (
        <View style={s.countBadge}>
          <Text style={s.countText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function UpcomingCard() {
  return (
    <Pressable style={({ pressed }) => [s.heroCard, pressed && { opacity: 0.95 }]} onPress={() => router.push({ pathname: '/event-detail', params: { id: UPCOMING.eventId } })}>
      <View style={s.timePill}><Text style={s.timePillText}>{UPCOMING.time}</Text></View>
      <Text style={s.heroTitle}>{UPCOMING.title}</Text>
      <View style={s.heroMetaRow}>
        <Text style={s.heroMeta}>Hosted by {UPCOMING.host} · </Text>
        <Pressable onPress={(e) => { e.stopPropagation(); router.push(`/venue/${UPCOMING.venueId}`); }}>
          <Text style={[s.heroMeta, s.linkText]}>{UPCOMING.venue}</Text>
        </Pressable>
      </View>
      <View style={s.avatarStack}>
        {UPCOMING.avatars.map((uri, i) => (
          <Image key={i} source={{ uri }} style={[s.stackAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }]} />
        ))}
      </View>
      <View style={s.heroButtons}>
        <ScaleBtn containerStyle={{ flex: 1 }} style={s.heroDirectionsBtn} onPress={() => router.push(`/venue/${UPCOMING.venueId}`)}><Text style={s.heroDirectionsBtnText}>Directions</Text></ScaleBtn>
        <ScaleBtn containerStyle={{ flex: 1 }} style={s.heroImInBtn} onPress={() => router.push({ pathname: '/event-detail', params: { id: UPCOMING.eventId } })}><Text style={s.heroImInBtnText}>I'm in</Text></ScaleBtn>
      </View>
    </Pressable>
  );
}

function InviteCard({ item, refresh }: { item: typeof MOCK_INVITES[number]; refresh: number }) {
  const [responded, setResponded] = useState<'declined' | null>(null);
  const [accepted, setAccepted] = useState(() => isAccepted(item.eventId));

  useEffect(() => {
    setAccepted(isAccepted(item.eventId));
  }, [item.eventId, refresh]);

  if (responded === 'declined') return null;

  function handleAccept() {
    acceptEvent(item.eventId);
    setAccepted(true);
  }

  function handleCancel() {
    cancelEvent(item.eventId);
    setAccepted(false);
  }

  return (
    <Pressable style={s.inviteCard} onPress={() => router.push({ pathname: '/event-detail', params: { id: item.eventId } })}>
      <View style={s.inviteHeader}>
        <View style={s.inviteAvatar}><Text style={s.inviteAvatarText}>{item.initials}</Text></View>
        <Text style={s.inviteHeadline}><Text style={s.inviteName}>{item.host}</Text> is inviting you</Text>
      </View>
      <View style={s.inviteImgWrap}>
        <Image source={{ uri: item.image }} style={s.inviteImage} resizeMode="cover" />
        <View style={s.tagOverlay}>
          {item.tags.map(tag => (
            <View key={tag} style={s.imgTag}>
              <Text style={s.imgTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={s.inviteTitleRow}>
        <Text style={s.inviteTitle}>{item.title}</Text>
        <Pressable onPress={(e) => { e.stopPropagation(); router.push(`/venue/${item.venueId}`); }}>
          <Text style={s.inviteVenue}>{item.venue}</Text>
        </Pressable>
      </View>
      <Text style={s.inviteMeta}>{item.date} · {item.time} · {item.attendees} going</Text>
      {accepted ? (
        <View style={s.acceptedActions}>
          <ScaleBtn containerStyle={{ flex: 0.25 }} style={s.cancelBtnSmall} onPress={handleCancel}>
            <Text style={s.cancelBtnSmallText}>Cancel</Text>
          </ScaleBtn>
          <View style={[s.goingBadge, { flex: 0.75 }]}>
            <Text style={s.goingBadgeText}>You&apos;re going ✓</Text>
          </View>
        </View>
      ) : (
        <View style={s.inviteActions}>
          <ScaleBtn containerStyle={{ flex: 1 }} style={s.declineBtn} onPress={() => setResponded('declined')}><Text style={s.declineBtnText}>Decline</Text></ScaleBtn>
          <ScaleBtn containerStyle={{ flex: 1 }} style={s.acceptBtn} onPress={handleAccept}><Text style={s.acceptBtnText}>Accept</Text></ScaleBtn>
        </View>
      )}
    </Pressable>
  );
}

function UpdateRow({ item }: { item: any }) {
  return (
    <Pressable style={s.updateRow} onPress={() => item.eventId && router.push({ pathname: '/event-detail', params: { id: item.eventId } })}>
      <View style={s.updateAvatar}><Text style={s.updateAvatarText}>{item.initials}</Text></View>
      <View style={s.updateBody}>
        <Text style={s.updateText}><Text style={s.updateActor}>{item.actor}</Text> {item.action} <Text style={s.updateTarget}>{item.target}</Text></Text>
        <Text style={s.updateTime}>{item.time}</Text>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<TabId>('Invites');
  const [refresh, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefresh(value => value + 1);
    }, [])
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <SectionLabel text="UPCOMING · TODAY" />
        <UpcomingCard />

        <View style={s.tabBar}>
          {TAB_ITEMS.map(tab => (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[s.tabItem, activeTab === tab.id && s.tabItemActive]}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={activeTab === tab.id ? ACCENT : Colors.naturalGrey}
              />
              <Text style={[s.tabText, activeTab === tab.id && s.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'Invites' && (
          <>
            <SectionLabel text="PENDING INVITES" count={MOCK_INVITES.length} />
            {MOCK_INVITES.map(item => <InviteCard key={item.id} item={item} refresh={refresh} />)}
          </>
        )}

        {activeTab === 'Updates' && (
          <>
            <SectionLabel text="EVENT UPDATES" />
            <View style={s.updatesCard}>
              {MOCK_EVENT_UPDATES.map(item => (
                <UpdateRow key={item.id} item={item} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'Social' && (
          <>
            <SectionLabel text="SOCIAL" />
            <View style={s.updatesCard}>
              {MOCK_SOCIAL.map(item => (
                <UpdateRow key={item.id} item={item} />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },

  // Header Styles (Added missing styles here)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.screenBackground,
  },
  headerBtn: { 
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: ACCENT,
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.naturalGrey,
  },
  tabTextActive: {
    color: ACCENT,
    fontWeight: '700',
  },

  // Chips
  chipsWrap: { flexShrink: 0, marginBottom: 4 },
  chipsRow:  { paddingLeft: 16, paddingRight: 16, paddingVertical: 6, gap: 8, flexDirection: 'row' },
  chip: {
    height: 32, paddingHorizontal: 14, borderRadius: 16,
    backgroundColor: Colors.lightGrey, justifyContent: 'center', alignItems: 'center',
  },
  chipActive:     { backgroundColor: ACCENT },
  chipText:       { fontSize: 13, color: Colors.inactiveChipText },
  chipTextActive: { color: Colors.white },

  // Rest of styles...
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.naturalGrey, letterSpacing: 1 },
  countBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 10, fontWeight: '700', color: Colors.white },
  heroCard: { backgroundColor: ACCENT, borderRadius: 16, padding: 16, marginTop: 8 },
  timePill: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  timePillText: { fontSize: 11, fontWeight: '600', color: '#92400E' },
  heroTitle: { fontSize: 18, fontWeight: '600', color: Colors.white, marginTop: 8 },
  heroMeta: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  heroMetaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 },
  linkText: { color: Colors.primaryBlue, textDecorationLine: 'underline' },
  avatarStack: { flexDirection: 'row', marginTop: 12 },
  stackAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: ACCENT },
  heroButtons: { flexDirection: 'row', marginTop: 12, gap: 8 },
  heroDirectionsBtn: { height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroDirectionsBtnText: { fontSize: 14, fontWeight: '500', color: Colors.white },
  heroImInBtn: { height: 36, borderRadius: 8, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  heroImInBtnText: { fontSize: 14, fontWeight: '600', color: ACCENT },
  inviteCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 14, gap: 12, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 4,
  },
  inviteHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inviteAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryBlue, alignItems: 'center', justifyContent: 'center' },
  inviteAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  inviteTitle: { fontSize: 17, fontWeight: '700', color: Colors.black },
  inviteHeadline: { fontSize: 14, color: Colors.naturalGrey },
  inviteName: { fontWeight: '700', color: Colors.black },
  inviteImgWrap: { borderRadius: 12, overflow: 'hidden', position: 'relative' },
  inviteImage: { width: '100%', height: 160, backgroundColor: Colors.lightGrey },
  tagOverlay: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  imgTag: { backgroundColor: 'rgba(0,0,0,0.58)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  imgTagText: { fontSize: 12, fontWeight: '600', color: Colors.white },
  inviteTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 4 },
  inviteFooterRow: { flexDirection: 'row', alignItems: 'center' },
  inviteVenue: { fontSize: 13, fontWeight: '600', color: Colors.primaryBlue },
  inviteMeta: { fontSize: 14, color: Colors.naturalGrey, marginTop: 0 },
  inviteActions: { flexDirection: 'row', gap: 8 },
  acceptedActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  goingBadge: { flex: 1, height: 42, borderRadius: 12, backgroundColor: '#E8F2F8', alignItems: 'center', justifyContent: 'center' },
  goingBadgeText: { fontSize: 14, fontWeight: '700', color: Colors.deepSlate },
  cancelBtnSmall: { height: 42, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  cancelBtnSmallText: { fontSize: 14, fontWeight: '600', color: Colors.naturalGrey },
  declineBtn: { height: 42, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  declineBtnText: { fontSize: 14, fontWeight: '500', color: Colors.naturalGrey },
  acceptBtn: { height: 42, borderRadius: 12, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  updatesCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  updateAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center' },
  updateAvatarText: { fontSize: 14, fontWeight: '700', color: ACCENT },
  updateBody: { flex: 1 },
  updateText: { fontSize: 14, color: '#4A4A5A', lineHeight: 19 },
  updateActor: { fontWeight: '700', color: Colors.black },
  updateTarget: { color: Colors.primaryBlue, fontWeight: '600' },
  updateTime: { fontSize: 12, color: '#B0B4BA', marginTop: 2 },
});