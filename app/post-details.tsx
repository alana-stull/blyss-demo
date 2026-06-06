import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet, Pressable,
  ScrollView, FlatList, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft, ChevronRight, MapPin, User, Hash, X, Search, Check,
} from 'lucide-react-native';
import { MOCK_FRIENDS, pushPost, saveMyPost } from '@/lib/store';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';
import { Colors } from '@/constants/Colors';

// ─── Hashtag suggestion pool ──────────────────────────────────────────────────

const ALL_TAGS = Array.from(
  new Set([
    ...VENUES.flatMap(v => [
      ...v.tags.flatMap(t => [
        t.toLowerCase().replace(/\W+/g, ''),
        ...t.toLowerCase().split(/\W+/).filter(w => w.length >= 4),
      ]),
      v.city.toLowerCase(),
      v.category.toLowerCase(),
    ]),
  ])
).filter(t => t.length >= 3).sort();

// ─── Venue Search Modal ───────────────────────────────────────────────────────

function VenueSearchModal({
  visible,
  selected,
  onClose,
  onSelect,
}: {
  visible: boolean;
  selected: Venue | null;
  onClose: () => void;
  onSelect: (venue: Venue | null) => void;
}) {
  const [query, setQuery] = useState('');

  const results = query.length === 0
    ? VENUES
    : VENUES.filter(v =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.neighborhood.toLowerCase().includes(query.toLowerCase()) ||
        v.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={m.root} edges={['top']}>

        <View style={m.header}>
          <Pressable onPress={onClose} hitSlop={10} style={m.hBtn}>
            <X size={22} strokeWidth={2} color={Colors.black} />
          </Pressable>
          <Text style={m.hTitle}>Tag a Venue</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={m.searchBar}>
          <Search size={15} strokeWidth={2} color={Colors.naturalGrey} />
          <TextInput
            style={m.searchInput}
            placeholder="Search venues..."
            placeholderTextColor={Colors.naturalGrey}
            value={query}
            onChangeText={setQuery}
            autoFocus
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={v => v.venue_id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={m.div} />}
          renderItem={({ item }) => {
            const isSel = selected?.venue_id === item.venue_id;
            return (
              <Pressable
                style={({ pressed }) => [m.venueRow, pressed && { backgroundColor: Colors.lightGrey }]}
                onPress={() => onSelect(isSel ? null : item)}
              >
                <View style={m.venueInfo}>
                  <Text style={m.venueName}>{item.name}</Text>
                  <Text style={m.venueMeta}>{item.neighborhood} · {item.subcategory}</Text>
                </View>
                {isSel && <Check size={18} strokeWidth={2.5} color={Colors.primaryBlue} />}
              </Pressable>
            );
          }}
        />

      </SafeAreaView>
    </Modal>
  );
}

// ─── Friends Modal ────────────────────────────────────────────────────────────

type Friend = typeof MOCK_FRIENDS[number];

function FriendsModal({
  visible,
  selected,
  onClose,
  onToggle,
}: {
  visible: boolean;
  selected: Friend[];
  onClose: () => void;
  onToggle: (friend: Friend) => void;
}) {
  const [query, setQuery] = useState('');

  const results = query
    ? MOCK_FRIENDS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : MOCK_FRIENDS;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={m.root} edges={['top']}>

        <View style={m.header}>
          <Pressable onPress={onClose} hitSlop={10} style={m.hBtn}>
            <X size={22} strokeWidth={2} color={Colors.black} />
          </Pressable>
          <Text style={m.hTitle}>Tag Friends</Text>
          {selected.length > 0 && (
            <Pressable onPress={onClose} hitSlop={10} style={m.hBtn}>
              <Text style={m.hDone}>Done</Text>
            </Pressable>
          )}
          {selected.length === 0 && <View style={{ width: 60 }} />}
        </View>

        <View style={m.searchBar}>
          <Search size={15} strokeWidth={2} color={Colors.naturalGrey} />
          <TextInput
            style={m.searchInput}
            placeholder="Search friends..."
            placeholderTextColor={Colors.naturalGrey}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={f => f.id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={m.div} />}
          renderItem={({ item }) => {
            const isAdded = selected.some(f => f.id === item.id);
            return (
              <Pressable
                style={({ pressed }) => [m.friendRow, pressed && { backgroundColor: Colors.lightGrey }]}
                onPress={() => onToggle(item)}
              >
                <View style={m.friendAv}>
                  <Text style={m.friendAvTxt}>{item.name[0]}</Text>
                </View>
                <View style={m.friendInfo}>
                  <Text style={m.friendName}>{item.name}</Text>
                  <Text style={m.friendMeta}>{item.status_text}</Text>
                </View>
                <View style={[m.addBtn, isAdded && m.addBtnOn]}>
                  <Text style={[m.addBtnTxt, isAdded && m.addBtnTxtOn]}>
                    {isAdded ? 'Added ✓' : 'Add'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />

      </SafeAreaView>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PostDetailsScreen() {
  const { uris } = useLocalSearchParams<{ uris: string }>();
  const mediaList = (uris ?? '').split('|||').filter(Boolean);
  const firstUri  = mediaList[0] ?? null;

  const [caption,     setCaption]     = useState('');
  const [venue,       setVenue]       = useState<Venue | null>(null);
  const [venueOpen,   setVenueOpen]   = useState(false);
  const [friends,     setFriends]     = useState<Friend[]>([]);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [hashtags,    setHashtags]    = useState<string[]>([]);
  const [hashInput,   setHashInput]   = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const captionRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => captionRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const q = hashInput.trim().toLowerCase();
    if (q.length > 0) {
      setSuggestions(
        ALL_TAGS.filter(t => t.startsWith(q) && !hashtags.includes(t)).slice(0, 6)
      );
    } else {
      setSuggestions([]);
    }
  }, [hashInput, hashtags]);

  function addHashtag(tag: string) {
    const clean = tag.trim().toLowerCase().replace(/^#/, '').replace(/\W+/g, '');
    if (clean && !hashtags.includes(clean)) {
      setHashtags(prev => [...prev, clean]);
    }
    setHashInput('');
    setSuggestions([]);
  }

  function handleHashChange(text: string) {
    if (text.endsWith(' ')) {
      const tag = text.trim();
      if (tag) addHashtag(tag);
    } else {
      setHashInput(text.replace(/^#/, ''));
    }
  }

  function toggleFriend(friend: Friend) {
    setFriends(prev => {
      const idx = prev.findIndex(f => f.id === friend.id);
      return idx >= 0 ? prev.filter(f => f.id !== friend.id) : [...prev, friend];
    });
  }

  function handlePost() {
    const post = pushPost({
      image:   firstUri ?? '',
      venue:   venue?.name   ?? '',
      venueId: venue?.venue_id ?? '',
      author:  'You',
      caption,
      tags:    hashtags,
    });
    saveMyPost(post);
    router.dismissAll();
  }

  return (
    <SafeAreaView style={s.root} edges={['top']}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={s.hBtn}>
          <ChevronLeft size={24} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <Text style={s.hTitle}>New Post</Text>
        <Pressable onPress={handlePost} hitSlop={10} style={s.hBtn}>
          <Text style={s.hPost}>Post</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Hero image ── */}
          {firstUri ? (
            <Image source={{ uri: firstUri }} style={s.heroImage} resizeMode="cover" />
          ) : (
            <View style={[s.heroImage, { backgroundColor: Colors.lightGrey }]} />
          )}

          {/* ── Caption section ── */}
          <View style={s.captionSection}>
            <TextInput
              ref={captionRef}
              style={s.captionInput}
              multiline
              placeholder="Write a caption..."
              placeholderTextColor={Colors.naturalGrey}
              value={caption}
              onChangeText={setCaption}
              textAlignVertical="top"
            />
          </View>

          <View style={s.div} />

          {/* ── Venue row ── */}
          <Pressable
            style={({ pressed }) => [s.row, pressed && { backgroundColor: '#F5F6F7' }]}
            onPress={() => setVenueOpen(true)}
          >
            <MapPin size={20} strokeWidth={1.75} color={Colors.primaryBlue} />
            {venue ? (
              <Text style={s.rowValue} numberOfLines={1}>
                {venue.name}
                <Text style={s.rowValueMeta}>  ·  {venue.neighborhood}</Text>
              </Text>
            ) : (
              <Text style={s.rowPlaceholder}>Tag a venue</Text>
            )}
            <ChevronRight size={16} strokeWidth={2} color={Colors.naturalGrey} style={{ marginLeft: 'auto' }} />
          </Pressable>

          <View style={s.div} />

          {/* ── Friends row ── */}
          <Pressable
            style={({ pressed }) => [s.row, s.rowTop, pressed && { backgroundColor: '#F5F6F7' }]}
            onPress={() => setFriendsOpen(true)}
          >
            <View style={s.iconWrap}>
              <User size={20} strokeWidth={1.75} color={Colors.primaryBlue} />
            </View>
            <View style={s.rowFill}>
              {friends.length === 0 ? (
                <Text style={s.rowPlaceholder}>Tag friends</Text>
              ) : (
                <View style={s.chipRow}>
                  {friends.map(f => (
                    <View key={f.id} style={s.chip}>
                      <Text style={s.chipTxt}>{f.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={s.iconWrap}>
              <ChevronRight size={16} strokeWidth={2} color={Colors.naturalGrey} />
            </View>
          </Pressable>

          <View style={s.div} />

          {/* ── Hashtag row ── */}
          <View style={[s.row, s.rowTop]}>
            <View style={s.iconWrap}>
              <Hash size={20} strokeWidth={1.75} color={Colors.primaryBlue} />
            </View>
            <View style={s.rowFill}>
              <View style={s.hashWrap}>
                {hashtags.map(tag => (
                  <Pressable
                    key={tag}
                    onPress={() => setHashtags(prev => prev.filter(t => t !== tag))}
                    style={s.hashChip}
                  >
                    <Text style={s.hashChipTxt}>#{tag}</Text>
                  </Pressable>
                ))}
                <TextInput
                  style={s.hashInput}
                  placeholder={hashtags.length === 0 ? 'Add hashtags...' : ''}
                  placeholderTextColor={Colors.naturalGrey}
                  value={hashInput}
                  onChangeText={handleHashChange}
                  onSubmitEditing={() => { if (hashInput.trim()) addHashtag(hashInput); }}
                  returnKeyType="done"
                  autoCapitalize="none"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
              </View>

              {/* Autocomplete dropdown */}
              {suggestions.length > 0 && (
                <View style={s.dropdown}>
                  {suggestions.map((tag, idx) => (
                    <Pressable
                      key={tag}
                      onPress={() => addHashtag(tag)}
                      style={({ pressed }) => [
                        s.suggRow,
                        pressed && { backgroundColor: Colors.lightGrey },
                        idx === suggestions.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <Text style={s.suggTxt}>
                        <Text style={s.suggHash}>#</Text>
                        {tag}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={s.div} />

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modals ── */}
      <VenueSearchModal
        visible={venueOpen}
        selected={venue}
        onClose={() => setVenueOpen(false)}
        onSelect={v => { setVenue(v); setVenueOpen(false); }}
      />
      <FriendsModal
        visible={friendsOpen}
        selected={friends}
        onClose={() => setFriendsOpen(false)}
        onToggle={toggleFriend}
      />

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.screenBackground },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', height: 48,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  hBtn:   { width: 60, height: 48, alignItems: 'center', justifyContent: 'center' },
  hTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: Colors.black },
  hPost:  { fontSize: 16, fontWeight: '700', color: Colors.deepSlate },

  body: { paddingBottom: 60 },

  // Hero image
  heroImage: { width: '100%', height: 320 },

  // Caption section
  captionSection: {
    paddingHorizontal: 16, paddingVertical: 14,
  },
  captionInput: {
    fontSize: 15, color: Colors.black, lineHeight: 22,
    minHeight: 72,
  },

  div: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.divider, marginHorizontal: 16 },

  // Generic row
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12, minHeight: 52,
  },
  rowTop: { alignItems: 'flex-start' },

  rowValue: { flex: 1, fontSize: 15, color: Colors.black, fontWeight: '500' },
  rowValueMeta: { fontWeight: '400', color: Colors.naturalGrey },
  rowPlaceholder: { flex: 1, fontSize: 15, color: Colors.naturalGrey },

  // Icon wrapper (keeps icons top-aligned with first line of text in multi-line rows)
  iconWrap: { paddingTop: 1 },

  // Fill area within row
  rowFill: { flex: 1 },

  // Friend chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: Colors.secondaryBlue, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  chipTxt: { fontSize: 13, fontWeight: '600', color: Colors.deepSlate },

  // Hashtag
  hashWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  hashChip: {
    backgroundColor: Colors.secondaryBlue, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  hashChipTxt: { fontSize: 13, fontWeight: '600', color: Colors.deepSlate },
  hashInput: {
    fontSize: 15, color: Colors.black,
    minWidth: 120, paddingVertical: 5,
    flexShrink: 1,
  },

  // Autocomplete dropdown
  dropdown: {
    marginTop: 6, borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth, borderColor: Colors.divider,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  suggRow: {
    paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  suggTxt:  { fontSize: 14, color: Colors.black },
  suggHash: { color: Colors.primaryBlue, fontWeight: '600' },
});

// ─── Modal styles (shared) ────────────────────────────────────────────────────

const m = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.screenBackground },

  header: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.divider,
  },
  hBtn:   { width: 60, height: 52, alignItems: 'center', justifyContent: 'center' },
  hTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: Colors.black },
  hDone:  { fontSize: 15, fontWeight: '700', color: Colors.primaryBlue },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 12, paddingHorizontal: 14, height: 40,
    backgroundColor: Colors.lightGrey, borderRadius: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.black },

  div: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.divider, marginHorizontal: 16 },

  // Venue list
  venueRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  venueInfo: { flex: 1, gap: 3 },
  venueName: { fontSize: 15, fontWeight: '600', color: Colors.black },
  venueMeta: { fontSize: 13, color: Colors.naturalGrey },

  // Friends list
  friendRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  friendAv:    { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F2F8', alignItems: 'center', justifyContent: 'center' },
  friendAvTxt: { fontSize: 17, fontWeight: '600', color: Colors.deepSlate },
  friendInfo:  { flex: 1, gap: 2 },
  friendName:  { fontSize: 15, fontWeight: '600', color: Colors.black },
  friendMeta:  { fontSize: 13, color: Colors.naturalGrey },
  addBtn: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8,
    backgroundColor: '#E8F2F8',
  },
  addBtnOn:    { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.divider },
  addBtnTxt:   { fontSize: 13, fontWeight: '600', color: Colors.deepSlate },
  addBtnTxtOn: { color: Colors.naturalGrey },
});
