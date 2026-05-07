import { useLocalSearchParams, router } from 'expo-router';
import {
  View, Text, Image, ScrollView, StyleSheet,
  Pressable, Linking, StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScaleBtn } from '@/components/ScaleBtn';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priceTier(avg: number): string {
  if (avg === 0) return 'Free';
  if (avg <= 15) return '$';
  if (avg <= 30) return '$$';
  if (avg <= 60) return '$$$';
  return '$$$$';
}

function todayHours(v: Venue): string {
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;
  return isWeekend ? v.hours_weekend : v.hours_weekday;
}

function buildDescription(v: Venue): string {
  const vibes = v.vibe_tags.slice(0, 2).join(', ');
  const bestFor = v.best_for.slice(0, 2).join(' or ');
  const extras = v.dietary_options.length > 0
    ? ` ${v.dietary_options[0]} available.`
    : '';
  return `A ${vibes} spot in ${v.neighborhood}. Perfect for ${bestFor}.${extras}`;
}

function openMaps(address: string, city: string) {
  const query = encodeURIComponent(`${address}, ${city}`);
  const url = Platform.OS === 'ios'
    ? `maps://maps.apple.com/?q=${query}`
    : `https://maps.google.com/?q=${query}`;
  Linking.openURL(url);
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function VenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const venue = VENUES.find(v => v.venue_id === id);

  if (!venue) {
    return (
      <View style={s.notFound}>
        <Text style={s.notFoundText}>Venue not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={s.notFoundBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={s.heroContainer}>
          <Image source={{ uri: venue.image }} style={s.heroImage} resizeMode="cover" />

          {/* Gradient overlay for icon legibility */}
          <View style={s.heroOverlay} />

          {/* Top nav buttons */}
          <View style={[s.heroNav, { top: insets.top + 12 }]}>
            <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
            </Pressable>
            <View style={s.heroNavRight}>
              <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
                <Ionicons name="share-outline" size={20} color="#1A1A2E" />
              </Pressable>
              <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}>
                <Ionicons name="bookmark-outline" size={20} color="#1A1A2E" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={s.content}>
          {/* Name */}
          <Text style={s.name}>{venue.name}</Text>

          {/* Rating · Category · Price */}
          <View style={s.metaRow}>
            <Ionicons name="star" size={14} color="#F2C05A" />
            <Text style={s.rating}>{venue.rating}</Text>
            <Text style={s.metaDot}>·</Text>
            <Text style={s.metaText}>
              {venue.subcategory.charAt(0).toUpperCase() + venue.subcategory.slice(1)}
            </Text>
            <Text style={s.metaDot}>·</Text>
            <Text style={s.metaText}>{priceTier(venue.avg_cost_pp)}</Text>
          </View>

          {/* Tags */}
          <View style={s.tags}>
            {venue.tags.map(tag => (
              <View key={tag} style={s.tag}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={s.description}>{buildDescription(venue)}</Text>

          {/* Details card */}
          <View style={s.detailCard}>
            <Text style={s.detailTitle}>Details</Text>

            {/* Address */}
            <View style={s.detailRow}>
              <View style={s.detailIcon}>
                <Ionicons name="location-outline" size={18} color="#5BA8D3" />
              </View>
              <View style={s.detailBody}>
                <Text style={s.detailPrimary}>{venue.address}</Text>
                <Text style={s.detailSecondary}>{venue.neighborhood}</Text>
              </View>
              <Text style={s.detailRight}>{venue.city}</Text>
            </View>

            <View style={s.divider} />

            {/* Hours */}
            <View style={s.detailRow}>
              <View style={s.detailIcon}>
                <Ionicons name="time-outline" size={18} color="#5BA8D3" />
              </View>
              <Text style={s.detailPrimary}>{todayHours(venue)}</Text>
            </View>

            {/* Reservation */}
            {venue.reservation_needed && (
              <>
                <View style={s.divider} />
                <View style={s.detailRow}>
                  <View style={s.detailIcon}>
                    <Ionicons name="calendar-outline" size={18} color="#5BA8D3" />
                  </View>
                  <Text style={s.detailPrimary}>Reservations recommended</Text>
                </View>
              </>
            )}

            {/* Dietary */}
            {venue.dietary_options.length > 0 && (
              <>
                <View style={s.divider} />
                <View style={s.detailRow}>
                  <View style={s.detailIcon}>
                    <Ionicons name="leaf-outline" size={18} color="#5BA8D3" />
                  </View>
                  <Text style={s.detailPrimary}>{venue.dietary_options.join(' · ')}</Text>
                </View>
              </>
            )}

            {/* Group size */}
            <View style={s.divider} />
            <View style={s.detailRow}>
              <View style={s.detailIcon}>
                <Ionicons name="people-outline" size={18} color="#5BA8D3" />
              </View>
              <Text style={s.detailPrimary}>
                {venue.group_size_min === venue.group_size_max
                  ? `Up to ${venue.group_size_max} guests`
                  : `${venue.group_size_min}–${venue.group_size_max} guests`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={[s.ctas, { paddingBottom: insets.bottom + 12 }]}>
        <ScaleBtn
          containerStyle={s.ctaFlex}
          style={s.ctaPrimary}
          pressedStyle={{ backgroundColor: '#2D4357' }}
          onPress={() => router.push({ pathname: '/(tabs)/plan', params: { venueId: venue.venue_id } })}
        >
          <Text style={s.ctaPrimaryText}>Plan Event</Text>
        </ScaleBtn>
        <Pressable
          style={({ pressed }) => [s.ctaFlex, s.ctaSecondary, pressed && { opacity: 0.8 }]}
          onPress={() => openMaps(venue.address, venue.city)}
        >
          <Ionicons name="navigate" size={16} color="#375169" />
          <Text style={s.ctaSecondaryText}>Get Directions</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:       { flex: 1 },

  // Hero
  heroContainer:{ height: 340, position: 'relative' },
  heroImage:    { width: '100%', height: '100%' },
  heroOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  heroNav:      { position: 'absolute', left: 16, right: 16, flexDirection: 'row',
                  justifyContent: 'space-between', alignItems: 'center' },
  heroNavRight: { flexDirection: 'row', gap: 8 },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF',
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.22, shadowRadius: 6, elevation: 6 },

  // Content
  content:      { paddingHorizontal: 20, paddingTop: 20 },
  name:         { fontSize: 22, fontWeight: '700', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 8 },

  // Meta row
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  rating:       { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  metaDot:      { fontSize: 14, color: '#B0B4BA', marginHorizontal: 2 },
  metaText:     { fontSize: 14, color: '#8B8F94' },

  // Tags
  tags:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  tag:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
                  borderWidth: 1, borderColor: '#E3E4E6', backgroundColor: '#FFFFFF' },
  tagText:      { fontSize: 13, fontWeight: '500', color: '#1A1A2E' },

  // Description
  description:  { fontSize: 15, color: '#4A4A5A', lineHeight: 23, marginBottom: 24 },

  // Details card
  detailCard:   { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
                  borderColor: '#E8E9EB', padding: 16, marginBottom: 24,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  detailTitle:  { fontSize: 15, fontWeight: '600', color: '#5BA8D3', marginBottom: 14 },
  detailRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  detailIcon:   { width: 24, alignItems: 'center' },
  detailBody:   { flex: 1 },
  detailPrimary:{ fontSize: 14, fontWeight: '500', color: '#1A1A2E' },
  detailSecondary:{ fontSize: 12, color: '#8B8F94', marginTop: 1 },
  detailRight:  { fontSize: 13, color: '#5BA8D3', fontWeight: '500' },
  divider:      { height: 1, backgroundColor: '#F0F1F3', marginVertical: 10, marginLeft: 36 },

  // CTAs
  ctas:            { position: 'absolute', bottom: 0, left: 0, right: 0,
                     flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16,
                     backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F0F1F3' },
  ctaFlex:         { flex: 1 },
  ctaPrimary:      { alignItems: 'center', justifyContent: 'center',
                     backgroundColor: '#375169', borderRadius: 14, paddingVertical: 16 },
  ctaPrimaryText:  { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  ctaSecondary:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                     gap: 8, borderRadius: 14, paddingVertical: 16,
                     borderWidth: 1.5, borderColor: '#E3E4E6', backgroundColor: '#FFFFFF' },
  ctaSecondaryText:{ fontSize: 15, fontWeight: '600', color: '#375169' },

  // Not found
  notFound:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: '#8B8F94' },
  notFoundBack: { fontSize: 14, color: '#5BA8D3', fontWeight: '600' },
});
