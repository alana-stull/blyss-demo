import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View, Text, Image, Animated, StyleSheet, Modal,
  Pressable, Linking, StatusBar, Platform, Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Lock } from 'lucide-react-native';
import { ScaleBtn } from '@/components/ScaleBtn';
import { ShareSheet } from '@/components/ShareSheet';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

const PRIVATE_VENUE_IDS = new Set(['V001', 'V007', 'V012']);

type SavedVenue = {
  id: string; name: string; category: string; location: string;
  imageUrl: string; priceRange: string; tags: string[];
};

const SAVED_KEY = 'blyss_saved_venues';

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

  const [isSaved,         setIsSaved]         = useState(false);
  const [shareVisible,    setShareVisible]    = useState(false);
  const [toast,           setToast]           = useState<string | null>(null);
  const [privateOverlay,  setPrivateOverlay]  = useState(false);

  const isPrivate = venue ? PRIVATE_VENUE_IDS.has(venue.venue_id) : false;

  useEffect(() => {
    if (!venue) return;
    AsyncStorage.getItem(SAVED_KEY).then(raw => {
      if (!raw) return;
      const saved: SavedVenue[] = JSON.parse(raw);
      setIsSaved(saved.some(v => v.id === venue.venue_id));
    });
  }, [venue?.venue_id]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  async function toggleSave() {
    if (!venue) return;
    Vibration.vibrate(30);
    const raw = await AsyncStorage.getItem(SAVED_KEY);
    const saved: SavedVenue[] = raw ? JSON.parse(raw) : [];
    if (isSaved) {
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(saved.filter(v => v.id !== venue.venue_id)));
      setIsSaved(false);
    } else {
      saved.push({
        id: venue.venue_id, name: venue.name, category: venue.subcategory,
        location: `${venue.neighborhood}, ${venue.city}`, imageUrl: venue.image,
        priceRange: priceTier(venue.avg_cost_pp), tags: venue.tags.slice(0, 3),
      });
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(saved));
      setIsSaved(true);
      showToast('Saved to profile');
    }
  }

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

      {/* Sticky top nav — floats above scroll, hero slides under */}
      <View style={[s.heroNav, { top: insets.top + 12 }]}>
        <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.black} />
        </Pressable>
        <View style={s.heroNavRight}>
          <Pressable
            style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}
            onPress={() => isPrivate ? setPrivateOverlay(true) : setShareVisible(true)}
          >
            {isPrivate
              ? <Lock size={18} strokeWidth={2} color={Colors.black} />
              : <Ionicons name="share-outline" size={20} color={Colors.black} />}
          </Pressable>
          <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]} onPress={toggleSave}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isSaved ? '#375169' : Colors.black} />
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={s.heroContainer}>
          <Image source={{ uri: venue.image }} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroOverlay} />
        </View>

        {/* Content */}
        <View style={s.content}>
          {/* Name */}
          <Text style={s.name}>{venue.name}</Text>

          {/* Rating · Category · Price */}
          <View style={s.metaRow}>
            <Ionicons name="star" size={14} color={Colors.accent} />
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
              <Pressable
                key={tag}
                style={({ pressed }) => [s.tag, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(`/tag/${tag.toLowerCase().replace(/\W+/g, '')}`)}
              >
                <Text style={s.tagText}>{tag}</Text>
              </Pressable>
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
                <Ionicons name="location-outline" size={18} color={Colors.primaryBlue} />
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
                <Ionicons name="time-outline" size={18} color={Colors.primaryBlue} />
              </View>
              <Text style={s.detailPrimary}>{todayHours(venue)}</Text>
            </View>

            {/* Reservation */}
            {venue.reservation_needed && (
              <>
                <View style={s.divider} />
                <View style={s.detailRow}>
                  <View style={s.detailIcon}>
                    <Ionicons name="calendar-outline" size={18} color={Colors.primaryBlue} />
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
                    <Ionicons name="leaf-outline" size={18} color={Colors.primaryBlue} />
                  </View>
                  <Text style={s.detailPrimary}>{venue.dietary_options.join(' · ')}</Text>
                </View>
              </>
            )}

            {/* Group size */}
            <View style={s.divider} />
            <View style={s.detailRow}>
              <View style={s.detailIcon}>
                <Ionicons name="people-outline" size={18} color={Colors.primaryBlue} />
              </View>
              <Text style={s.detailPrimary}>
                {venue.group_size_min === venue.group_size_max
                  ? `Up to ${venue.group_size_max} guests`
                  : `${venue.group_size_min}–${venue.group_size_max} guests`}
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Toast */}
      {toast && (
        <View style={s.toast}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}

      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        type="venue"
        id={venue.venue_id}
      />

      <Modal visible={privateOverlay} transparent animationType="fade" onRequestClose={() => setPrivateOverlay(false)}>
        <Pressable style={s.privateBackdrop} onPress={() => setPrivateOverlay(false)}>
          <View style={s.privateCard}>
            <Lock size={28} strokeWidth={1.75} color="#375169" />
            <Text style={s.privateTitle}>Private Event</Text>
            <Text style={s.privateBody}>This event is private and cannot be shared.</Text>
            <Pressable style={({ pressed }) => [s.privateDismiss, pressed && { opacity: 0.75 }]} onPress={() => setPrivateOverlay(false)}>
              <Text style={s.privateDismissText}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Bottom CTAs */}
      <View style={[s.ctas, { paddingBottom: insets.bottom + 16 }]}>
        <View style={s.ctaButtonRow}>
          <ScaleBtn
            containerStyle={{ flex: 1, marginRight: 10 }}
            style={s.ctaDirectionsBtn}
            pressedStyle={{ backgroundColor: 'rgba(55,81,105,0.08)' }}
            onPress={() => openMaps(venue.address, venue.city)}
          >
            <View style={s.ctaButtonContent}>
              <Ionicons name="navigate" size={18} color={Colors.deepSlate} />
              <Text style={s.ctaDirectionsText}>Get Directions</Text>
            </View>
          </ScaleBtn>
          <ScaleBtn
            containerStyle={{ flex: 1 }}
            style={s.ctaPlanBtn}
            pressedStyle={{ backgroundColor: '#2D4357' }}
            onPress={() => router.push({ pathname: '/(tabs)/plan', params: { venueId: venue.venue_id } })}
          >
            <Text style={s.ctaPlanText}>Plan Event</Text>
          </ScaleBtn>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: Colors.white },
  scroll:       { flex: 1 },

  // Hero
  heroContainer:{ height: 340, position: 'relative' },
  heroImage:    { width: '100%', height: '100%' },
  heroOverlay:  { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  heroNav:      { position: 'absolute', left: 16, right: 16, flexDirection: 'row',
                  justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
  heroNavRight: { flexDirection: 'row', gap: 8 },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.white,
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.22, shadowRadius: 6, elevation: 6 },

  // Content
  content:      { paddingHorizontal: 20, paddingTop: 20 },
  name:         { fontSize: 22, fontWeight: '700', color: Colors.black, letterSpacing: -0.5, marginBottom: 8 },

  // Meta row
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  rating:       { fontSize: 14, fontWeight: '600', color: Colors.black },
  metaDot:      { fontSize: 14, color: '#B0B4BA', marginHorizontal: 2 },
  metaText:     { fontSize: 14, color: Colors.naturalGrey },

  // Tags
  tags:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  tag:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
                  borderWidth: 1, borderColor: Colors.lightGrey, backgroundColor: Colors.white },
  tagText:      { fontSize: 13, fontWeight: '500', color: Colors.black },

  // Description
  description:  { fontSize: 15, color: '#4A4A5A', lineHeight: 23, marginBottom: 24 },

  // Details card
  detailCard:   { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1,
                  borderColor: '#E8E9EB', padding: 16, marginBottom: 24,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  detailTitle:  { fontSize: 15, fontWeight: '600', color: Colors.primaryBlue, marginBottom: 14 },
  detailRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  detailIcon:   { width: 24, alignItems: 'center' },
  detailBody:   { flex: 1 },
  detailPrimary:{ fontSize: 14, fontWeight: '500', color: Colors.black },
  detailSecondary:{ fontSize: 12, color: Colors.naturalGrey, marginTop: 1 },
  detailRight:  { fontSize: 13, color: Colors.primaryBlue, fontWeight: '500' },
  divider:      { height: 1, backgroundColor: '#F0F1F3', marginVertical: 10, marginLeft: 36 },

  // CTAs
  ctas:            { position: 'absolute', bottom: 0, left: 0, right: 0,
                     paddingHorizontal: 20, paddingTop: 16,
                     backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#F0F1F3' },
  ctaFull:         { alignItems: 'center', justifyContent: 'center',
                     backgroundColor: Colors.deepSlate, borderRadius: 14, paddingVertical: 16 },
  ctaFullText:     { fontSize: 15, fontWeight: '600', color: Colors.white },

  ctaButtonRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaPlanBtn:      { alignItems: 'center', justifyContent: 'center',
                     backgroundColor: Colors.deepSlate, borderRadius: 14, paddingVertical: 16 },
  ctaPlanText:     { fontSize: 15, fontWeight: '600', color: Colors.white },
  ctaDirectionsBtn:{ alignItems: 'center', justifyContent: 'center',
                     backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.deepSlate,
                     borderRadius: 14, paddingVertical: 16 },
  ctaDirectionsText:{ fontSize: 15, fontWeight: '600', color: Colors.deepSlate },

  ctaManageRow:    { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ctaManage:       { alignItems: 'center', justifyContent: 'center',
                     backgroundColor: Colors.deepSlate, borderRadius: 14, paddingVertical: 16 },
  ctaManageText:   { fontSize: 15, fontWeight: '600', color: Colors.white },
  ctaViewInvite:   { fontSize: 14, fontWeight: '500', color: Colors.primaryBlue },

  ctaGoingWrap:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaGoing:        { flex: 3, alignItems: 'center', justifyContent: 'center',
                     backgroundColor: '#EAF4EC', borderRadius: 14, paddingVertical: 16 },
  ctaGoingText:    { fontSize: 15, fontWeight: '600', color: '#2E7D44' },
  ctaCancelBtn:    { alignItems: 'center', justifyContent: 'center',
                     borderRadius: 14, paddingVertical: 16,
                     borderWidth: 1.5, borderColor: Colors.lightGrey, backgroundColor: Colors.white },
  ctaCancelText:   { fontSize: 14, fontWeight: '600', color: Colors.naturalGrey },

  // Toast
  toast:        { position: 'absolute', bottom: 110, left: 20, right: 20, backgroundColor: '#333333',
                  borderRadius: 10, padding: 12, alignItems: 'center', zIndex: 999 },
  toastText:    { color: Colors.white, fontSize: 14, fontWeight: '600' },

  // Private overlay
  privateBackdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  privateCard:         { backgroundColor: Colors.white, borderRadius: 20, padding: 28, alignItems: 'center', gap: 10, width: '100%' },
  privateTitle:        { fontSize: 17, fontWeight: '700', color: Colors.black, marginTop: 4 },
  privateBody:         { fontSize: 14, color: Colors.naturalGrey, textAlign: 'center', lineHeight: 20 },
  privateDismiss:      { marginTop: 8, backgroundColor: '#375169', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12 },
  privateDismissText:  { fontSize: 15, fontWeight: '600', color: Colors.white },

  // Not found
  notFound:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16, color: Colors.naturalGrey },
  notFoundBack: { fontSize: 14, color: Colors.primaryBlue, fontWeight: '600' },
});
