import { useState, useMemo } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  Pressable, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

// ─── Mock events derived from venues ─────────────────────────────────────────

const EVENT_TEMPLATES = [
  { suffix: 'Opening Night',    dateLabel: 'Sat, Feb 8 · 7:00 PM',  attending: 24 },
  { suffix: 'Live Music Night', dateLabel: 'Fri, Feb 7 · 8:30 PM',  attending: 18 },
  { suffix: 'Sunday Brunch',    dateLabel: 'Sun, Feb 9 · 11:30 AM', attending: 8  },
  { suffix: 'Community Meetup', dateLabel: 'Sat, Feb 15 · 8:00 AM', attending: 15 },
  { suffix: 'Happy Hour',       dateLabel: 'Thu, Feb 13 · 6:00 PM', attending: 22 },
  { suffix: 'Tasting Event',    dateLabel: 'Sat, Feb 22 · 5:00 PM', attending: 30 },
  { suffix: 'Evening Social',   dateLabel: 'Fri, Feb 21 · 7:30 PM', attending: 12 },
  { suffix: 'Weekend Special',  dateLabel: 'Sun, Feb 23 · 1:00 PM', attending: 9  },
];

interface MockEvent {
  id: string;
  title: string;
  venueName: string;
  venueId: string;
  image: string;
  dateLabel: string;
  attending: number;
}

function buildEvents(venues: Venue[]): MockEvent[] {
  return venues.slice(0, 16).map((v, i) => {
    const tpl = EVENT_TEMPLATES[i % EVENT_TEMPLATES.length];
    return {
      id: `evt-${v.venue_id}`,
      title: `${v.name} ${tpl.suffix}`,
      venueName: v.name,
      venueId: v.venue_id,
      image: v.image,
      dateLabel: tpl.dateLabel,
      attending: tpl.attending,
    };
  });
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function EventCard({ item }: { item: MockEvent }) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]} onPress={() => router.push(`/venue/${item.venueId}`)}>
      <Image source={{ uri: item.image }} style={s.thumb} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={s.cardSub} numberOfLines={1}>{item.venueName}</Text>
        <View style={s.metaRow}>
          <Ionicons name="calendar-outline" size={13} color="#B0B4BA" />
          <Text style={s.metaText}>{item.dateLabel}</Text>
        </View>
        <View style={s.metaRow}>
          <Ionicons name="people-outline" size={13} color="#B0B4BA" />
          <Text style={s.metaText}>{item.attending} attending</Text>
        </View>
      </View>
    </Pressable>
  );
}

function VenueCard({ item }: { item: Venue }) {
  return (
    <Pressable style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]} onPress={() => router.push(`/venue/${item.venue_id}`)}>
      <Image source={{ uri: item.image }} style={s.thumb} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardSub} numberOfLines={1}>
          {item.subcategory} · {item.neighborhood}
        </Text>
        <View style={s.metaRow}>
          <Ionicons name="location-outline" size={13} color="#B0B4BA" />
          <Text style={s.metaText}>{item.city}</Text>
        </View>
        <View style={s.metaRow}>
          <Ionicons name="star-outline" size={13} color="#B0B4BA" />
          <Text style={s.metaText}>
            {item.rating} · {item.avg_cost_pp === 0 ? 'Free' : `~$${item.avg_cost_pp}/pp`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'events' | 'venues'>('events');

  const allEvents = useMemo(() => buildEvents(VENUES), []);

  const filteredVenues = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return VENUES;
    return VENUES.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.subcategory.toLowerCase().includes(q) ||
      v.neighborhood.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  const filteredEvents = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allEvents;
    return allEvents.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.venueName.toLowerCase().includes(q)
    );
  }, [query, allEvents]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Search bar */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color="#B0B4BA" style={s.searchIcon} />
        <TextInput
          style={s.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search events or venues..."
          placeholderTextColor="#B0B4BA"
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
      </View>

      {/* Events / Venues toggle */}
      <View style={s.toggle}>
        <Pressable
          style={({ pressed }) => [s.toggleBtn, tab === 'events' && s.toggleBtnActive, pressed && { opacity: 0.7 }]}
          onPress={() => setTab('events')}
        >
          <Text style={[s.toggleLabel, tab === 'events' && s.toggleLabelActive]}>Events</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.toggleBtn, tab === 'venues' && s.toggleBtnActive, pressed && { opacity: 0.7 }]}
          onPress={() => setTab('venues')}
        >
          <Text style={[s.toggleLabel, tab === 'venues' && s.toggleLabelActive]}>Venues</Text>
        </Pressable>
      </View>

      {/* List */}
      {tab === 'events' ? (
        <FlatList
          key="events"
          data={filteredEvents}
          keyExtractor={e => e.id}
          renderItem={({ item }) => <EventCard item={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={s.empty}>No events found</Text>}
        />
      ) : (
        <FlatList
          key="venues"
          data={filteredVenues}
          keyExtractor={v => v.venue_id}
          renderItem={({ item }) => <VenueCard item={item} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<Text style={s.empty}>No venues found</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: '#F0F1F3',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: Colors.black },

  // Toggle
  toggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#F0F1F3',
    borderRadius: 999,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.deepSlate,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.naturalGrey,
  },
  toggleLabelActive: {
    color: Colors.white,
    fontWeight: '600',
  },

  // List
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 14 },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
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
    height: 110,
    backgroundColor: Colors.lightGrey,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.naturalGrey,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: Colors.naturalGrey,
  },

  // Empty
  empty: {
    textAlign: 'center',
    paddingVertical: 60,
    fontSize: 15,
    color: Colors.naturalGrey,
  },
});
