import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScaleBtn } from '@/components/ScaleBtn';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#375169';
const CHIPS = ['All', 'Invites', 'Updates', 'Social'] as const;
type Chip = typeof CHIPS[number];

// ─── Mock data ────────────────────────────────────────────────────────────────

const UPCOMING = {
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
    id: 'inv1',  host: 'Maya Torres',      initials: 'MT',
    venue: 'Mateo Bar de Tapas',   venueId: 'V007',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    date: 'Sat, Feb 8',  time: '8:00 PM',   attendees: 4,
    tags: ['Tapas', 'Cocktails'],
  },
  {
    id: 'inv2',  host: 'Chris Dos Santos',  initials: 'CS',
    venue: 'Eno River State Park',  venueId: 'V023',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    date: 'Sun, Feb 9',  time: '10:00 AM',  attendees: 6,
    tags: ['Outdoors', 'Hiking'],
  },
];

type UpdateKind = 'like' | 'comment' | 'join' | 'follow';

const MOCK_UPDATES: Array<{
  id: string; kind: UpdateKind; actor: string; initials: string;
  action: string; target: string; time: string;
}> = [
  { id: 'u1', kind: 'like',    actor: 'Mesha Robinson',  initials: 'MR', action: 'liked your post at',      target: 'Café Lumière',       time: '2h ago' },
  { id: 'u2', kind: 'comment', actor: 'Asili Johnson',   initials: 'AS', action: 'commented on your event', target: 'Sunday Brunch Club', time: '4h ago' },
  { id: 'u3', kind: 'join',    actor: 'Johanna Kepler',  initials: 'JK', action: 'joined your event at',    target: 'Ponysaurus Brewing', time: '1d ago' },
  { id: 'u4', kind: 'follow',  actor: 'Sam Carter',      initials: 'SC', action: 'started following you',   target: '',                   time: '2d ago' },
];

const KIND_ICON: Record<UpdateKind, React.ComponentProps<typeof Ionicons>['name']> = {
  like: 'heart', comment: 'chatbubble', join: 'person-add', follow: 'person-add',
};
const KIND_COLOR: Record<UpdateKind, string> = {
  like: '#E05C5C', comment: '#5BA8D3', join: ACCENT, follow: ACCENT,
};

// ─── Section label ────────────────────────────────────────────────────────────

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

// ─── Upcoming hero card ───────────────────────────────────────────────────────

function UpcomingCard() {
  return (
    <View style={s.heroCard}>
      <View style={s.timePill}>
        <Text style={s.timePillText}>{UPCOMING.time}</Text>
      </View>
      <Text style={s.heroTitle}>{UPCOMING.title}</Text>
      <Text style={s.heroMeta}>Hosted by {UPCOMING.host} · {UPCOMING.venue}</Text>

      <View style={s.avatarStack}>
        {UPCOMING.avatars.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={[s.stackAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }]}
          />
        ))}
      </View>

      <View style={s.heroButtons}>
        <ScaleBtn
          containerStyle={{ flex: 1 }}
          style={s.heroDirectionsBtn}
          pressedStyle={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          onPress={() => {}}
        >
          <Text style={s.heroDirectionsBtnText}>Directions</Text>
        </ScaleBtn>
        <ScaleBtn
          containerStyle={{ flex: 1 }}
          style={s.heroImInBtn}
          pressedStyle={{ backgroundColor: '#E8F2F8' }}
          onPress={() => {}}
        >
          <Text style={s.heroImInBtnText}>I'm in</Text>
        </ScaleBtn>
      </View>
    </View>
  );
}

// ─── Invite card ─────────────────────────────────────────────────────────────

function InviteCard({ item }: { item: typeof MOCK_INVITES[number] }) {
  const [responded, setResponded] = useState<'accepted' | 'declined' | null>(null);

  if (responded === 'declined') return null;

  return (
    <View style={s.inviteCard}>
      <View style={s.inviteHeader}>
        <View style={s.inviteAvatar}>
          <Text style={s.inviteAvatarText}>{item.initials}</Text>
        </View>
        <Text style={s.inviteHeadline}>
          <Text style={s.inviteName}>{item.host}</Text>
          {' is inviting you'}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [s.inviteImgWrap, pressed && { opacity: 0.9 }]}
        onPress={() => router.push(`/venue/${item.venueId}`)}
      >
        <Image source={{ uri: item.image }} style={s.inviteImage} resizeMode="cover" />
        <View style={s.inviteTagsOverlay}>
          {item.tags.map(tag => (
            <View key={tag} style={s.inviteTag}>
              <Text style={s.inviteTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </Pressable>

      <View style={s.inviteFooterRow}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.inviteVenue}>{item.venue}</Text>
          <Text style={s.inviteMeta}>{item.date} · {item.time} · {item.attendees} going</Text>
        </View>
      </View>

      {responded === 'accepted' ? (
        <View style={s.acceptedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={ACCENT} />
          <Text style={s.acceptedText}>You're in!</Text>
        </View>
      ) : (
        <View style={s.inviteActions}>
          <Pressable
            style={({ pressed }) => [s.declineBtn, pressed && { opacity: 0.7 }]}
            onPress={() => setResponded('declined')}
          >
            <Text style={s.declineBtnText}>Decline</Text>
          </Pressable>
          <ScaleBtn
            containerStyle={{ flex: 1 }}
            style={s.acceptBtn}
            pressedStyle={{ backgroundColor: '#2D4357' }}
            onPress={() => setResponded('accepted')}
          >
            <Text style={s.acceptBtnText}>Accept</Text>
          </ScaleBtn>
        </View>
      )}
    </View>
  );
}

// ─── Update row ───────────────────────────────────────────────────────────────

function UpdateRow({ item }: { item: typeof MOCK_UPDATES[number] }) {
  return (
    <Pressable style={({ pressed }) => [s.updateRow, pressed && { opacity: 0.8 }]}>
      <View style={s.updateAvatar}>
        <Text style={s.updateAvatarText}>{item.initials}</Text>
      </View>
      <View style={s.updateBody}>
        <Text style={s.updateText} numberOfLines={2}>
          <Text style={s.updateActor}>{item.actor}</Text>
          {' ' + item.action}
          {item.target ? <Text style={s.updateTarget}> {item.target}</Text> : null}
        </Text>
        <Text style={s.updateTime}>{item.time}</Text>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ActivityScreen() {
  const [activeChip, setActiveChip] = useState<Chip>('All');

  const showUpcoming = activeChip !== 'Social';
  const showInvites  = activeChip === 'All' || activeChip === 'Invites';
  const showActivity = activeChip === 'All' || activeChip === 'Updates' || activeChip === 'Social';
  const visibleUpdates =
    activeChip === 'Social'  ? MOCK_UPDATES.filter(u => u.kind === 'like' || u.kind === 'comment') :
    activeChip === 'Updates' ? MOCK_UPDATES.filter(u => u.kind === 'join' || u.kind === 'follow') :
    MOCK_UPDATES;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Activity</Text>
        <Pressable style={({ pressed }) => pressed ? { opacity: 0.7 } : {}}>
          <Text style={s.markRead}>Mark all read</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipsRow}
        style={s.chipsWrap}
      >
        {CHIPS.map(chip => {
          const active = chip === activeChip;
          return (
            <Pressable
              key={chip}
              onPress={() => setActiveChip(chip)}
              style={({ pressed }) => [s.chip, active && s.chipActive, pressed && { opacity: 0.7 }]}
            >
              <Text style={[s.chipText, active && s.chipTextActive]}>{chip}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {showUpcoming && (
          <>
            <SectionLabel text="UPCOMING · TODAY" />
            <UpcomingCard />
          </>
        )}

        {showInvites && (
          <>
            <SectionLabel text="INVITES AWAITING YOU" count={MOCK_INVITES.length} />
            <View style={s.gap}>
              {MOCK_INVITES.map(item => <InviteCard key={item.id} item={item} />)}
            </View>
          </>
        )}

        {showActivity && visibleUpdates.length > 0 && (
          <>
            <SectionLabel text="RECENT ACTIVITY" />
            <View style={s.updatesCard}>
              {visibleUpdates.map((item, i) => (
                <View key={item.id}>
                  <UpdateRow item={item} />
                  {i < visibleUpdates.length - 1 && <View style={s.updateDivider} />}
                </View>
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
  safe: { flex: 1, backgroundColor: '#F7F8FA' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#F7F8FA',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.4 },
  markRead:    { fontSize: 14, fontWeight: '600', color: ACCENT },

  // Chips
  chipsWrap: { flexShrink: 0, marginBottom: 4 },
  chipsRow:  { paddingLeft: 16, paddingRight: 16, paddingVertical: 6, gap: 8, flexDirection: 'row' },
  chip: {
    height: 32, paddingHorizontal: 14, borderRadius: 16,
    backgroundColor: '#E3E4E6', justifyContent: 'center', alignItems: 'center',
  },
  chipActive:     { backgroundColor: ACCENT },
  chipText:       { fontSize: 13, color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 },

  // Section
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 8 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },
  countBadge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  gap: { gap: 12 },

  // ── Hero card ──
  heroCard: { backgroundColor: ACCENT, borderRadius: 16, padding: 16 },
  timePill: {
    alignSelf: 'flex-start', backgroundColor: '#FEF3C7',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  timePillText:          { fontSize: 11, fontWeight: '600', color: '#92400E' },
  heroTitle:             { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 8 },
  heroMeta:              { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  avatarStack:           { flexDirection: 'row', marginTop: 12 },
  stackAvatar: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2, borderColor: ACCENT,
    backgroundColor: '#B7D3E0',
  },
  heroButtons:           { flexDirection: 'row', marginTop: 12, gap: 8 },
  heroDirectionsBtn: {
    height: 36, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroDirectionsBtnText: { fontSize: 14, fontWeight: '500', color: '#fff' },
  heroImInBtn: {
    height: 36, borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  heroImInBtnText: { fontSize: 14, fontWeight: '600', color: ACCENT },

  // ── Invite card ──
  inviteCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  inviteHeader:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inviteAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#5BA8D3', alignItems: 'center', justifyContent: 'center',
  },
  inviteAvatarText:  { fontSize: 14, fontWeight: '700', color: '#fff' },
  inviteHeadline:    { fontSize: 14, color: ACCENT },
  inviteName:        { fontWeight: '700', color: '#1A1A2E' },
  inviteImgWrap:     { borderRadius: 12, overflow: 'hidden' },
  inviteImage:       { width: '100%', height: 150, backgroundColor: '#E3E4E6' },
  inviteTagsOverlay: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  inviteTag:         { backgroundColor: 'rgba(26,26,46,0.68)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  inviteTagText:     { fontSize: 11, fontWeight: '600', color: '#fff' },
  inviteFooterRow:   { flexDirection: 'row', alignItems: 'center' },
  inviteVenue:       { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  inviteMeta:        { fontSize: 12, color: '#5BA8D3' },
  inviteActions:     { flexDirection: 'row', gap: 8 },
  declineBtn: {
    flex: 1, height: 38, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E3E4E6',
    alignItems: 'center', justifyContent: 'center',
  },
  declineBtnText:  { fontSize: 14, fontWeight: '600', color: '#8B8F94' },
  acceptBtn: {
    height: 38, borderRadius: 10,
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
  },
  acceptBtnText:   { fontSize: 14, fontWeight: '600', color: '#fff' },
  acceptedBadge:   { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 4 },
  acceptedText:    { fontSize: 14, fontWeight: '600', color: ACCENT },

  // ── Updates card ──
  updatesCard: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  updateRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  updateAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center',
  },
  updateAvatarText: { fontSize: 14, fontWeight: '700', color: ACCENT },
  updateBody:    { flex: 1 },
  updateText:    { fontSize: 14, color: '#4A4A5A', lineHeight: 19 },
  updateActor:   { fontWeight: '700', color: '#1A1A2E' },
  updateTarget:  { color: '#5BA8D3', fontWeight: '600' },
  updateTime:    { fontSize: 12, color: '#B0B4BA', marginTop: 2 },
  updateDivider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 68 },
});
