import { useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MOCK_FRIENDS, MOCK_EVENTS, MOCK_JOURNAL } from '@/lib/store';
import { ScaleBtn } from '@/components/ScaleBtn';
import { VENUES } from '@/lib/venues';

// ─── Derive post data from MOCK_JOURNAL + VENUES ──────────────────────────────

const TIME_AGO  = ['2h ago', '5h ago', '1d ago', '3d ago', '1w ago'];
const LIKE_SEED = [42, 87, 31, 18, 24];
const CMT_SEED  = [8, 14, 4, 3, 2];

const POSTS = MOCK_JOURNAL.map((entry, i) => {
  const venue  = VENUES.find(v => v.venue_id === entry.venue_id);
  const author = entry.with_who?.[0] ?? 'You';
  return {
    id:       entry.id,
    image:    venue?.image ?? '',
    venue:    entry.venue_name,
    venueId:  entry.venue_id,
    author,
    caption:  entry.note ?? '',
    tags:     (venue?.tags ?? []).slice(0, 3) as string[],
    likes:    LIKE_SEED[i] ?? 10,
    comments: CMT_SEED[i]  ?? 3,
    time:     TIME_AGO[i]  ?? '1w ago',
  };
}).filter(p => p.image.length > 0);

// ─── Derive invite data from MOCK_EVENTS + VENUES ─────────────────────────────

const INVITES = MOCK_EVENTS.map(evt => {
  const venue = VENUES.find(v => v.venue_id === evt.venue_id);
  return {
    id:          evt.id,
    host:        evt.attendees[0] ?? 'Someone',
    image:       venue?.image ?? '',
    tags:        (venue?.tags ?? []).slice(0, 2) as string[],
    venueName:   evt.venue,
    date:        evt.date,
    time:        evt.time,
    attendeeCount: evt.attendees.length,
  };
}).filter(i => i.image.length > 0);

// ─── Feed interleaving ────────────────────────────────────────────────────────

type PostItem   = { type: 'post';   data: typeof POSTS[number] };
type InviteItem = { type: 'invite'; data: typeof INVITES[number] };
type FeedItem   = PostItem | InviteItem;

const FEED: FeedItem[] = [];
let pi = 0, ii = 0;
while (pi < POSTS.length || ii < INVITES.length) {
  if (pi < POSTS.length)   FEED.push({ type: 'post',   data: POSTS[pi++] });
  if (pi < POSTS.length)   FEED.push({ type: 'post',   data: POSTS[pi++] });
  if (ii < INVITES.length) FEED.push({ type: 'invite', data: INVITES[ii++] });
}

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({ item }: { item: typeof POSTS[number] }) {
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  function toggleLike() {
    setLiked(v => { setLikeCount(cnt => v ? cnt - 1 : cnt + 1); return !v; });
  }

  const initials = item.author.charAt(0).toUpperCase();

  return (
    <View style={c.card}>
      {/* Top row: avatar · name/timestamp · venue right-justified */}
      <View style={c.topRow}>
        <View style={c.avatar}>
          <Text style={c.avatarText}>{initials}</Text>
        </View>
        <View style={c.nameBlock}>
          <Text style={c.authorName}>{item.author}</Text>
          <Text style={c.timestamp}>{item.time}</Text>
        </View>
        <Pressable style={({ pressed }) => [c.venueRow, pressed && { opacity: 0.7 }]} onPress={() => router.push(`/venue/${item.venueId}`)}>
          <Text style={c.venueLink}>{item.venue}</Text>
        </Pressable>
      </View>

      {/* Optional photo */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={c.photo} resizeMode="cover" />
      ) : null}

      {/* Actions */}
      <View style={c.actionsRow}>
        <Pressable style={({ pressed }) => [c.actionBtn, pressed && { opacity: 0.7 }]} onPress={toggleLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? '#E05C5C' : '#9CA3AF'} />
          <Text style={c.actionCount}>{likeCount}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [c.actionBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
          <Text style={c.actionCount}>{item.comments}</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [c.actionBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="paper-plane-outline" size={18} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Caption + hashtags */}
      <Text style={c.caption}>{item.caption}</Text>
      {item.tags.length > 0 && (
        <View style={c.hashtagRow}>
          {item.tags.map(t => (
            <Text key={t} style={c.hashtag}>#{t.toLowerCase().replace(/\s+/g, '')}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Invite card ──────────────────────────────────────────────────────────────

function InviteCard({ item }: { item: typeof INVITES[number] }) {
  return (
    <View style={c.inviteCard}>
      <View style={c.inviteHeader}>
        <View style={c.inviteAvatar}>
          <Text style={c.inviteAvatarText}>{item.host[0]}</Text>
        </View>
        <Text style={c.inviteHeadline}>
          <Text style={c.inviteName}>{item.host}</Text>
          {' is inviting you'}
        </Text>
      </View>

      <View style={c.inviteImageContainer}>
        <Image source={{ uri: item.image }} style={c.inviteImage} resizeMode="cover" />
        <View style={c.inviteTagsOverlay}>
          {item.tags.map(tag => (
            <View key={tag} style={c.inviteTag}>
              <Text style={c.inviteTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={c.inviteFooter}>
        <View style={c.inviteFooterLeft}>
          <Text style={c.inviteVenue}>{item.venueName}</Text>
          <Text style={c.inviteMeta}>{item.date} · {item.time} · {item.attendeeCount} going</Text>
        </View>
        <ScaleBtn style={c.inviteViewBtn} pressedStyle={{ backgroundColor: '#2D4357' }}>
          <Text style={c.inviteViewText}>View</Text>
        </ScaleBtn>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FriendsScreen() {
  function renderItem({ item }: { item: FeedItem }) {
    if (item.type === 'post')   return <PostCard   item={item.data as typeof POSTS[number]} />;
    if (item.type === 'invite') return <InviteCard item={item.data as typeof INVITES[number]} />;
    return null;
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header — same as explore */}
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]} onPress={() => router.push('/modal')}>
          <Ionicons name="add-circle-outline" size={26} color="#1A1A2E" />
        </Pressable>

        <Image
          source={require('../../assets/images/logo.png')}
          style={s.logo}
          resizeMode="contain"
        />

        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chatbubble-outline" size={20} color="#1A1A2E" />
        </Pressable>
      </View>

      <FlatList
        data={FEED}
        keyExtractor={(item, i) => `${item.type}-${i}`}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={({ leadingItem, trailingItem }: any) =>
          trailingItem?.type === 'invite'
            ? null
            : <View style={s.divider} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#FFFFFF' },

  // Header (matches explore)
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
               paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  logo:      { width: 48, height: 48 },

  list:    { paddingTop: 4, paddingBottom: 120 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16, marginVertical: 8 },
});

const c = StyleSheet.create({
  // ── Post card ──
  card:         { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  topRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F2F8',
                alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '600', color: '#375169' },
  nameBlock:  { flex: 1, gap: 2 },
  authorName: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  timestamp:  { fontSize: 12, color: '#9CA3AF' },
  venueRow:    { flexDirection: 'row', alignItems: 'center' },
  venueLink:   { fontSize: 13, color: '#5BA8D3', fontWeight: '600' },
  photo:        { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#E3E4E6' },
  caption:      { fontSize: 14, color: '#1A1A1A', lineHeight: 21 },
  actionsRow:   { flexDirection: 'row', alignItems: 'center', gap: 20 },
  actionBtn:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionCount:  { fontSize: 13, color: '#9CA3AF' },
  hashtagRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hashtag:      { fontSize: 13, color: '#5BA8D3' },

  // ── Invite card ──
  inviteCard:          { backgroundColor: '#EBF5FB', borderRadius: 16, padding: 14, gap: 12,
                         marginHorizontal: 16, marginVertical: 12,
                         shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                         shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  inviteHeader:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inviteAvatar:        { width: 38, height: 38, borderRadius: 19, backgroundColor: '#5BA8D3',
                         alignItems: 'center', justifyContent: 'center' },
  inviteAvatarText:    { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  inviteHeadline:      { fontSize: 14, color: '#375169' },
  inviteName:          { fontWeight: '700', color: '#1A1A2E' },
  inviteImageContainer:{ borderRadius: 12, overflow: 'hidden' },
  inviteImage:         { width: '100%', height: 180, backgroundColor: '#B7D3E0' },
  inviteTagsOverlay:   { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 6 },
  inviteTag:           { backgroundColor: 'rgba(26,26,46,0.68)', borderRadius: 999,
                         paddingHorizontal: 12, paddingVertical: 5 },
  inviteTagText:       { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  inviteFooter:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inviteFooterLeft:    { flex: 1, gap: 2 },
  inviteVenue:         { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  inviteMeta:          { fontSize: 12, color: '#5BA8D3' },
  inviteViewBtn:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
                         backgroundColor: '#375169' },
  inviteViewText:      { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});
