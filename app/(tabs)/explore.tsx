import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image,
  StyleSheet, Pressable, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScaleBtn } from '@/components/ScaleBtn';
import { loadProfile, getRecommendations } from '@/lib/store';
import { VENUES } from '@/lib/venues';
import type { ScoredVenue } from '@/lib/store';

const fallback: ScoredVenue[] = VENUES
  .slice()
  .sort((a, b) => b.rating - a.rating)
  .map(v => ({ ...v, match_score: 0, match_reasons: [] }));

const CHIPS = ['All', 'Tonight', 'This Weekend', 'Chill', 'Active', 'Foodie', 'Outdoors', '$', '$$', '$$$'];

export default function ExploreScreen() {
  const [venues, setVenues] = useState<ScoredVenue[]>(fallback);
  const [activeChip, setActiveChip] = useState('All');
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(p => {
        if (!p) return;
        const recs = getRecommendations(p);
        setVenues(recs.length > 0 ? recs : fallback);
      });
    }, [])
  );

  function renderCard({ item: v }: { item: ScoredVenue }) {
    return (
      <Pressable
        style={({ pressed }) => [c.card, pressed && { opacity: 0.92 }]}
        onPress={() => router.push(`/venue/${v.venue_id}`)}
      >
        <Image source={{ uri: v.image }} style={c.cardImage} resizeMode="cover" />
        <View style={c.cardBody}>
          <Text style={c.name} numberOfLines={1}>{v.name}</Text>
          <Text style={c.meta} numberOfLines={1}>
            {v.subcategory} · {v.neighborhood}, {v.city}
          </Text>

          <View style={c.infoRow}>
            <Text style={c.ratingStar}>★</Text>
            <Text style={c.ratingNum}>{v.rating}</Text>
            <Text style={c.dot}>·</Text>
            <Text style={c.price}>
              {v.avg_cost_pp > 0 ? `~$${v.avg_cost_pp}/pp` : 'Free'}
            </Text>
            {v.reservation_needed && (
              <>
                <Text style={c.dot}>·</Text>
                <Text style={c.resv}>Reservations</Text>
              </>
            )}
          </View>

          <View style={c.tags}>
            {v.tags.map(t => (
              <View key={t} style={c.tag}>
                <Text style={c.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <ScaleBtn
            style={c.planBtn}
            pressedStyle={{ backgroundColor: '#2D4357' }}
            onPress={() => router.push({ pathname: '/(tabs)/plan', params: { venueId: v.venue_id } })}
          >
            <Text style={c.planBtnText}>Plan here</Text>
          </ScaleBtn>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="calendar-outline" size={22} color="#1A1A2E" />
          <View style={s.plusBadge}>
            <Text style={s.plusText}>+</Text>
          </View>
        </Pressable>

        <Image
          source={require('../../assets/images/logo.png')}
          style={s.logo}
          resizeMode="contain"
        />

        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chatbubble-outline" size={22} color="#1A1A2E" />
        </Pressable>
      </View>

      {/* Filter / search row */}
      <View style={s.filterRow}>
        <Pressable
          style={({ pressed }) => [s.searchIconBtn, pressed && { opacity: 0.7 }]}
          onPress={() => { setSearchActive(v => !v); setSearchQuery(''); }}
        >
          <Ionicons name={searchActive ? 'close' : 'search'} size={18} color="#6B7280" />
        </Pressable>

        {searchActive ? (
          <TextInput
            style={s.searchInput}
            placeholder="Search venues..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
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
        )}
      </View>

      {/* Feed */}
      <FlatList
        data={venues}
        keyExtractor={v => v.venue_id}
        renderItem={renderCard}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F7F8FA' },

  // Header
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
               paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#F7F8FA' },
  headerBtn:{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  plusBadge:{ position: 'absolute', top: 0, right: -2, width: 14, height: 14,
               borderRadius: 7, backgroundColor: '#F7F8FA',
               alignItems: 'center', justifyContent: 'center' },
  plusText: { fontSize: 11, fontWeight: '700', color: '#1A1A2E', lineHeight: 14 },
  logo:     { width: 48, height: 48 },

  // Filter / search row
  filterRow:    { flexDirection: 'row', alignItems: 'center',
                  paddingLeft: 16, paddingVertical: 10 },
  searchIconBtn:{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
                  marginRight: 4 },
  searchInput:  { flex: 1, height: 36, borderRadius: 16, backgroundColor: '#E3E4E6',
                  paddingHorizontal: 14, fontSize: 13, color: '#1A1A2E', marginRight: 16 },
  chipsRow:     { paddingRight: 16, gap: 8, flexDirection: 'row' },
  chip:         { height: 32, paddingHorizontal: 14, borderRadius: 16,
                  backgroundColor: '#E3E4E6', justifyContent: 'center', alignItems: 'center' },
  chipActive:   { backgroundColor: '#375169' },
  chipText:     { fontSize: 13, color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },

  // Feed
  list:     { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 88, gap: 16 },
});

const c = StyleSheet.create({
  card:      { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
               shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  cardImage: { width: '100%', height: 200, backgroundColor: '#E3E4E6' },
  cardBody:  { padding: 16, gap: 6 },
  name:      { fontSize: 18, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.4 },
  meta:      { fontSize: 12, color: '#8B8F94' },

  // Info row
  infoRow:  { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 3 },
  ratingStar:{ fontSize: 13, color: '#F2C05A' },
  ratingNum: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  dot:       { fontSize: 13, color: '#B0B4BA', marginHorizontal: 1 },
  price:     { fontSize: 13, color: '#8B8F94' },
  resv:      { fontSize: 13, fontWeight: '500', color: '#5BA8D3' },

  // Tags — outlined pill style
  tags:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },

  // Plan button
  planBtn:     { height: 36, backgroundColor: '#375169', borderRadius: 10,
                 alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  planBtnText: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
  tag:      { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999,
               borderWidth: 1, borderColor: '#E3E4E6', backgroundColor: '#FFFFFF' },
  tagText:  { fontSize: 12, fontWeight: '500', color: '#1A1A2E' },
});
