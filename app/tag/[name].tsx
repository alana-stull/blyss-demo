import { useState, useMemo } from 'react';
import {
  View, Text, FlatList, Image, Pressable, StyleSheet,
  Dimensions, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import { MOCK_JOURNAL, NEW_POST_QUEUE } from '@/lib/store';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';
import { Colors } from '@/constants/Colors';

const { width: SW } = Dimensions.get('window');
const CELL = Math.floor((SW - 2) / 3); // 3 cols with 1px inter-gaps

const TIME_AGO  = ['2h ago',  '5h ago', '1d ago', '3d ago', '1w ago'];
const LIKE_SEED = [42, 87, 31, 18, 24];
const CMT_SEED  = [8,  14,  4,   3,   2];

// ─── Shared types ─────────────────────────────────────────────────────────────

type Post = {
  id: string;
  image: string;
  venue: string;
  venueId: string;
  author: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  time: string;
};

// ─── Data helpers ─────────────────────────────────────────────────────────────

function norm(s: string) {
  return s.toLowerCase().replace(/\W+/g, '');
}

function allPosts(): Post[] {
  const journal: Post[] = MOCK_JOURNAL.map((entry, i) => {
    const v = VENUES.find(vn => vn.venue_id === entry.venue_id);
    if (!v?.image) return null;
    return {
      id:       entry.id,
      image:    v.image,
      venue:    entry.venue_name,
      venueId:  entry.venue_id,
      author:   entry.with_who?.[0] ?? 'You',
      caption:  entry.note ?? '',
      tags:     v.tags.slice(0, 3) as string[],
      likes:    LIKE_SEED[i] ?? 10,
      comments: CMT_SEED[i]  ?? 3,
      time:     TIME_AGO[i]  ?? '1w ago',
    };
  }).filter(Boolean) as Post[];

  return [...NEW_POST_QUEUE, ...journal];
}

function postsForTag(tag: string): Post[] {
  return allPosts().filter(p =>
    p.tags.some(t => norm(t) === tag)
  );
}

function venuesForTag(tag: string): Venue[] {
  return VENUES.filter(v =>
    v.tags.some(t      => norm(t)              === tag) ||
    norm(v.category)                           === tag  ||
    norm(v.city)                               === tag  ||
    v.vibe_tags.some(t => norm(t)              === tag) ||
    norm(v.subcategory).includes(tag)
  );
}

function priceTier(avg: number): string {
  if (avg === 0) return 'Free';
  if (avg <= 15) return '$';
  if (avg <= 30) return '$$';
  if (avg <= 60) return '$$$';
  return '$$$$';
}

// Deterministic pseudo-distance from venue_id
function mockDist(id: string): string {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `${((n % 28) / 10 + 0.2).toFixed(1)} mi`;
}

// ─── Full-screen post viewer ──────────────────────────────────────────────────

function PostViewer({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <Modal visible animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={v.root}>

        {/* Close button */}
        <SafeAreaView style={v.safeTop} edges={['top']}>
          <Pressable onPress={onClose} hitSlop={12} style={v.closeBtn}>
            <X size={24} strokeWidth={2.5} color="#fff" />
          </Pressable>
        </SafeAreaView>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero image — full width square */}
          <Image
            source={{ uri: post.image }}
            style={{ width: SW, height: SW }}
            resizeMode="cover"
          />

          {/* Post meta */}
          <View style={v.meta}>
            <View style={v.metaTopRow}>
              <View style={v.authorRow}>
                <View style={v.authorAv}>
                  <Text style={v.authorAvTxt}>{post.author[0]?.toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={v.authorName}>{post.author}</Text>
                  <Text style={v.metaTime}>{post.time}</Text>
                </View>
              </View>
              {post.venue ? (
                <Pressable onPress={() => { onClose(); router.push(`/venue/${post.venueId}`); }}>
                  <Text style={v.venueLink} numberOfLines={1}>{post.venue}</Text>
                </Pressable>
              ) : null}
            </View>

            {post.caption ? (
              <Text style={v.caption}>{post.caption}</Text>
            ) : null}

            {post.tags.length > 0 && (
              <View style={v.tagRow}>
                {post.tags.map(t => (
                  <Pressable key={t} onPress={() => { onClose(); router.push(`/tag/${norm(t)}`); }}>
                    <Text style={v.tagTxt}>#{norm(t)}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Like / comment counts */}
            <View style={v.statsRow}>
              <Text style={v.statTxt}>♥  {post.likes}</Text>
              <Text style={v.statTxt}>💬  {post.comments}</Text>
            </View>
          </View>
        </ScrollView>

      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TagScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const tag = (name ?? '').toLowerCase();

  const [activeTab, setActiveTab] = useState<'posts' | 'venues'>('posts');
  const [openPost, setOpenPost]   = useState<Post | null>(null);

  const posts  = useMemo(() => postsForTag(tag),  [tag]);
  const venues = useMemo(() => venuesForTag(tag), [tag]);

  const totalPosts  = posts.length;
  const totalVenues = venues.length;

  return (
    <SafeAreaView style={s.root} edges={['top']}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.hBtn}>
          <ChevronLeft size={24} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <Text style={s.hTitle} numberOfLines={1}>#{tag}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* ── Post count ── */}
      <Text style={s.count}>
        {totalPosts} post{totalPosts !== 1 ? 's' : ''}
        {totalVenues > 0 ? `  ·  ${totalVenues} venue${totalVenues !== 1 ? 's' : ''}` : ''}
      </Text>

      {/* ── Tabs ── */}
      <View style={s.tabRow}>
        {(['posts', 'venues'] as const).map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={s.tabItem}
          >
            <Text style={[s.tabTxt, activeTab === tab && s.tabTxtOn]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={s.tabIndicator} />}
          </Pressable>
        ))}
      </View>

      {/* ── Posts grid ── */}
      {activeTab === 'posts' && (
        <FlatList<Post>
          data={posts}
          numColumns={3}
          keyExtractor={p => p.id}
          columnWrapperStyle={{ gap: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<EmptyState label="No posts yet for this tag" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setOpenPost(item)}
              style={[s.gridCell, { width: CELL, height: CELL }]}
            >
              <Image
                source={{ uri: item.image }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      )}

      {/* ── Venues list ── */}
      {activeTab === 'venues' && (
        <FlatList<Venue>
          data={venues}
          keyExtractor={vn => vn.venue_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.venueList}
          ItemSeparatorComponent={() => <View style={s.divider} />}
          ListEmptyComponent={<EmptyState label="No venues match this tag" />}
          renderItem={({ item: vn }) => (
            <Pressable
              style={({ pressed }) => [s.venueRow, pressed && { opacity: 0.85 }]}
              onPress={() => router.push(`/venue/${vn.venue_id}`)}
            >
              <Image source={{ uri: vn.image }} style={s.venueImg} resizeMode="cover" />
              <View style={s.venueBody}>
                <Text style={s.venueName} numberOfLines={1}>{vn.name}</Text>
                <Text style={s.venueMeta}>
                  {vn.neighborhood}
                  <Text style={s.venueMetaDot}>  ·  </Text>
                  {mockDist(vn.venue_id)}
                  <Text style={s.venueMetaDot}>  ·  </Text>
                  {priceTier(vn.avg_cost_pp)}
                </Text>
                <View style={s.vibeTags}>
                  {vn.vibe_tags.slice(0, 3).map(t => (
                    <View key={t} style={s.vibeChip}>
                      <Text style={s.vibeChipTxt}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* ── Post viewer modal ── */}
      {openPost && (
        <PostViewer post={openPost} onClose={() => setOpenPost(null)} />
      )}

    </SafeAreaView>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <View style={s.empty}>
      <Text style={s.emptyTxt}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.screenBackground },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  hBtn:   { width: 44, height: 52, alignItems: 'center', justifyContent: 'center' },
  hTitle: {
    flex: 1, textAlign: 'center',
    fontSize: 20, fontWeight: '700', color: Colors.black,
    fontFamily: 'Figtree_700Bold',
    letterSpacing: -0.3,
  },

  // Post count
  count: {
    fontSize: 13, color: Colors.naturalGrey,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
    marginBottom: 1,
  },
  tabItem: {
    flex: 1, alignItems: 'center', paddingVertical: 13, position: 'relative',
  },
  tabTxt:    { fontSize: 15, fontWeight: '600', color: Colors.naturalGrey },
  tabTxtOn:  { color: Colors.black },
  tabIndicator: {
    position: 'absolute', bottom: 0, left: 24, right: 24, height: 2.5,
    borderRadius: 2, backgroundColor: Colors.primaryBlue,
  },

  // Grid
  gridCell: { overflow: 'hidden' },

  // Empty
  empty:    { alignItems: 'center', paddingVertical: 80 },
  emptyTxt: { fontSize: 15, color: Colors.naturalGrey },

  // Venues list
  venueList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 60 },
  divider: {
    height: StyleSheet.hairlineWidth, backgroundColor: Colors.divider,
  },
  venueRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 14, gap: 14,
  },
  venueImg: {
    width: 82, height: 82, borderRadius: 10,
    backgroundColor: Colors.lightGrey, flexShrink: 0,
  },
  venueBody: { flex: 1, gap: 4, paddingTop: 2 },
  venueName: { fontSize: 16, fontWeight: '700', color: Colors.black, fontFamily: 'Figtree_700Bold', letterSpacing: -0.2 },
  venueMeta: { fontSize: 13, color: Colors.naturalGrey },
  venueMetaDot: { color: Colors.lightGrey },

  vibeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  vibeChip: {
    backgroundColor: Colors.secondaryBlue, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  vibeChipTxt: { fontSize: 12, fontWeight: '500', color: Colors.deepSlate },
});

// ─── Post viewer styles ───────────────────────────────────────────────────────

const v = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#000' },
  safeTop: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 },
  closeBtn: {
    position: 'absolute', top: 12, right: 16,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },

  meta: { padding: 16, gap: 10, paddingTop: 18 },

  metaTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  authorRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  authorAv:   { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2A4A60', alignItems: 'center', justifyContent: 'center' },
  authorAvTxt:{ fontSize: 15, fontWeight: '700', color: Colors.white },
  authorName: { fontSize: 14, fontWeight: '600', color: Colors.white },
  metaTime:   { fontSize: 12, color: '#888', marginTop: 1 },
  venueLink:  { fontSize: 13, fontWeight: '600', color: Colors.primaryBlue, maxWidth: 140 },

  caption: { fontSize: 14, color: '#ddd', lineHeight: 20 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagTxt: { fontSize: 14, color: Colors.primaryBlue, fontWeight: '500' },

  statsRow: { flexDirection: 'row', gap: 20, paddingTop: 4 },
  statTxt:  { fontSize: 14, color: '#888' },
});
