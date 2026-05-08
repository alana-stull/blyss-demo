import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';

// ─── Mock journal entries ────────────────────────────────────────────────────

const JOURNAL_ENTRIES = [
  {
    id: 'j1',
    title: 'Live Jazz Night',
    venue_name: 'Blue Note',
    venue_id: 'V015',
    date: 'Feb 7, 2026',
    note: 'Amazing performance! Marcus Thompson Quartet was incredible. Would definitely go again.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    year: 2026,
  },
  {
    id: 'j2',
    title: 'Yoga & Brunch Morning',
    venue_name: 'Studio Flow',
    venue_id: 'V022',
    date: 'Jan 25, 2026',
    note: 'Great way to start the weekend. The instructors were super friendly.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80',
    year: 2026,
  },
  {
    id: 'j3',
    title: 'Sunday Brunch Club',
    venue_name: 'Café Lumière',
    venue_id: 'V004',
    date: 'Jan 12, 2026',
    note: 'Croissants were flaky and perfect. Came with Maya and Jordan.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    year: 2026,
  },
  {
    id: 'j4',
    title: 'Gallery Opening Night',
    venue_name: 'The Contemporary',
    venue_id: 'V021',
    date: 'Dec 14, 2025',
    note: 'Stunning new exhibit on urban architecture. Stayed for two hours.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=800&q=80',
    year: 2025,
  },
  {
    id: 'j5',
    title: 'Tapas & Cocktails',
    venue_name: 'Mateo Bar de Tapas',
    venue_id: 'V007',
    date: 'Dec 6, 2025',
    note: 'Paella for four was unreal. The sangria pitcher was a great call.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    year: 2025,
  },
  {
    id: 'j6',
    title: 'Trail Hike at Eno',
    venue_name: 'Eno River State Park',
    venue_id: 'V023',
    date: 'Nov 30, 2025',
    note: 'Perfect fall hike. Leaves were still turning. Brought Sam and Maya.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    year: 2025,
  },
];

type Filter = 'all' | 'year' | 'month';

function Stars({ rating }: { rating: number }) {
  return (
    <View style={s.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={Colors.accent}
        />
      ))}
    </View>
  );
}

export default function JournalScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const now = new Date();
    if (filter === 'year')  return JOURNAL_ENTRIES.filter(e => e.year === now.getFullYear());
    if (filter === 'month') return JOURNAL_ENTRIES.filter(e => e.year === now.getFullYear());
    return JOURNAL_ENTRIES;
  }, [filter]);

  const totalVenues = new Set(JOURNAL_ENTRIES.map(e => e.venue_id)).size;
  const avgRating   = (JOURNAL_ENTRIES.reduce((s, e) => s + e.rating, 0) / JOURNAL_ENTRIES.length).toFixed(1);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.black} />
        </Pressable>
        <Text style={s.headerTitle}>Event Journal</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Filter pills */}
        <View style={s.filterRow}>
          {([['all', 'All Time'], ['year', 'This Year'], ['month', 'This Month']] as [Filter, string][]).map(([id, label]) => (
            <Pressable
              key={id}
              style={({ pressed }) => [s.pill, filter === id && s.pillActive, pressed && { opacity: 0.7 }]}
              onPress={() => setFilter(id)}
            >
              <Text style={[s.pillText, filter === id && s.pillTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Stats card */}
        <View style={s.statsCard}>
          <View style={s.stat}>
            <Text style={s.statNum}>87</Text>
            <Text style={s.statLabel}>Events</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>{totalVenues}</Text>
            <Text style={s.statLabel}>Venues</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>{avgRating}</Text>
            <Text style={s.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Recent label */}
        <Text style={s.sectionLabel}>Recent</Text>

        {/* Journal cards */}
        <View style={s.feed}>
          {filtered.map(entry => (
            <Pressable
              key={entry.id}
              style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]}
              onPress={() => router.push(`/venue/${entry.venue_id}`)}
            >
              <Image source={{ uri: entry.image }} style={s.cardImage} />
              <View style={s.cardBody}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardTitle}>{entry.title}</Text>
                  <Stars rating={entry.rating} />
                </View>
                <View style={s.metaRow}>
                  <Ionicons name="location-outline" size={13} color={Colors.naturalGrey} />
                  <Text style={s.metaText}>{entry.venue_name}</Text>
                </View>
                {!!entry.note && (
                  <Text style={s.note} numberOfLines={2}>{entry.note}</Text>
                )}
                <View style={s.metaRow}>
                  <Ionicons name="calendar-outline" size={13} color="#B0B4BA" />
                  <Text style={s.dateText}>{entry.date}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable style={({ pressed }) => [s.fab, pressed && { opacity: 0.85 }]} onPress={() => router.push('/(tabs)/plan')}>
        <Ionicons name="add" size={26} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.screenBackground,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.black },

  // Filter pills
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white,
  },
  pillActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  pillText: { fontSize: 14, fontWeight: '500', color: Colors.naturalGrey },
  pillTextActive: { color: Colors.white, fontWeight: '600' },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontSize: 22, fontWeight: '800', color: Colors.black, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: Colors.naturalGrey, fontWeight: '500' },
  statDivider: { width: 1, backgroundColor: Colors.lightGrey, marginVertical: 4 },

  // Section
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.naturalGrey,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // Feed
  feed: { paddingHorizontal: 16, gap: 16 },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.lightGrey,
  },
  cardBody: {
    padding: 16,
    gap: 7,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 8,
  },
  stars: { flexDirection: 'row', gap: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: Colors.naturalGrey },
  note: { fontSize: 14, color: '#4A4A5A', lineHeight: 20 },
  dateText: { fontSize: 12, color: '#B0B4BA' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
