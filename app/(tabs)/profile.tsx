import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pencil, Settings, Bookmark, MapPin, Clock } from 'lucide-react-native';
import { loadProfile } from '@/lib/store';
import { ScaleBtn } from '@/components/ScaleBtn';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';
import { EVENTS, getAcceptedEventIds } from '@/lib/events';
import type { UserProfile } from '@/lib/store';
import * as ImagePicker from 'expo-image-picker';

type SavedVenue = {
  id: string; name: string; category: string; location: string;
  imageUrl: string; priceRange: string; tags: string[];
};

type Tab = 'events' | 'posts' | 'saved';

// ─── Mock event cards ────────────────────────────────────────────────────────

const EVENT_TEMPLATES = [
  { suffix: 'Opening Night',    dateLabel: 'Sat, Feb 8 · 7:00 PM',  attending: ['Sarah'] },
  { suffix: 'Sunday Brunch Club', dateLabel: 'Sun, Feb 9 · 11:30 AM', attending: ['Maya', 'Jordan', 'Alex'] },
  { suffix: 'Live Music Night', dateLabel: 'Fri, Feb 14 · 8:30 PM', attending: ['Priya', 'Sam'] },
  { suffix: 'Happy Hour',       dateLabel: 'Thu, Feb 13 · 6:00 PM', attending: ['Maya', 'Jordan'] },
];


function parseEventDate(dateLabel: string) {
  const [left, time] = dateLabel.split(' · ');
  const [dowPart, rest] = left.split(', ');
  const [month, day] = rest.split(' ');
  return { month, day, dow: dowPart, time: time ?? '' };
}

function buildProfileEvents() {
  return getAcceptedEventIds()
    .map(id => EVENTS[id])
    .filter(Boolean)
    .map(evt => ({
      id: evt.id,
      title: evt.title,
      venueName: evt.venue,
      venueId: evt.venueId,
      dateLabel: evt.dateLabel,
      parsed: parseEventDate(evt.dateLabel),
      attending: evt.attending,
    }));
}

// ─── Saved venue row ──────────────────────────────────────────────────────────

function SavedVenueRow({ item }: { item: SavedVenue }) {
  return (
    <Pressable
      style={({ pressed }) => [s.savedCard, pressed && { opacity: 0.92 }]}
      onPress={() => router.push(`/venue/${item.id}`)}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={s.savedName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.savedMeta} numberOfLines={1}>{item.location} · {item.priceRange}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
          {item.tags.slice(0, 3).map(t => (
            <View key={t} style={s.savedTag}>
              <Text style={s.savedTagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <ScaleBtn
        style={s.planBtn}
        onPress={() => router.push({ pathname: '/(tabs)/plan', params: { venueId: item.id } })}
      >
        <Text style={s.planBtnText}>Plan</Text>
      </ScaleBtn>
    </Pressable>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ item }: { item: ReturnType<typeof buildProfileEvents>[0] }) {
  const { month, day, dow, time } = item.parsed;
  return (
    <Pressable style={({ pressed }) => [s.eventCard, pressed && { opacity: 0.92 }]} onPress={() => router.push({ pathname: '/event-detail', params: { id: item.id } })}>
      <View style={s.dateBlock}>
        <Text style={s.dateMonth}>{month.toUpperCase()}</Text>
        <Text style={s.dateDay}>{day}</Text>
        <Text style={s.dateDow}>{dow.toUpperCase()}</Text>
      </View>
      <View style={s.divider} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={s.eventTitle} numberOfLines={1}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MapPin size={11} strokeWidth={2} color="#8B8F94" />
          <Text style={s.eventMeta} numberOfLines={1}>{item.venueName}</Text>
          <Text style={s.eventMeta}> · </Text>
          <Clock size={11} strokeWidth={2} color="#8B8F94" />
          <Text style={s.eventMeta}>{time}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          {item.attending.slice(0, 3).map((name, i) => (
            <View key={i} style={[s.attendeeCircle, { marginLeft: i > 0 ? -5 : 0, zIndex: 5 - i }]}>
              <Text style={s.attendeeInitial}>{name[0]}</Text>
            </View>
          ))}
          <Text style={[s.eventMeta, { marginLeft: 6 }]}>
            {item.attending.length === 1 ? `${item.attending[0]}'s event` : `${item.attending.length} going`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [profile,      setProfile]      = useState<UserProfile | null>(null);
  const [tab,          setTab]          = useState<Tab>('events');
  const [savedVenues,  setSavedVenues]  = useState<SavedVenue[]>([]);
  const [profilePic,   setProfilePic]   = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile().then(setProfile);
      AsyncStorage.getItem('blyss_saved_venues').then(raw => {
        setSavedVenues(raw ? JSON.parse(raw) : []);
      });
    }, [])
  );

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePic(result.assets[0].uri);
    }
  }

  const firstName = profile?.first_name ?? 'Alana';
  const lastName  = profile?.last_name  ?? 'Stull';
  const city      = profile?.city       ?? 'Durham';
  const initials  = `${firstName[0] ?? 'A'}${lastName[0] ?? 'S'}`.toUpperCase();

  const profileEvents = buildProfileEvents();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]} onPress={() => router.push('/edit-profile')}>
          <Pencil size={17} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <View style={{ flex: 1 }} />
      <Pressable
        style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}
        onPress={() => router.push('/settings')}
      >
          <Settings size={20} strokeWidth={1.5} color={Colors.black} />
        </Pressable>
      </View>

      {/* ── Avatar + identity (static) ── */}
      <View style={s.heroSection}>
        <Pressable style={s.avatarWrap} onPress={handlePickImage}>
          <View style={s.avatar}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={{ width: '100%', height: '100%', borderRadius: 52 }} />
            ) : (
              <Text style={s.initials}>{initials}</Text>
            )}
          </View>
        </Pressable>

        <Text style={s.displayName}>{firstName} {lastName}</Text>
        <Text style={s.subLine}>{city}, NC</Text>

        <View style={s.statsRow}>
          <Pressable style={({ pressed }) => [s.stat, pressed && { opacity: 0.7 }]} onPress={() => router.push({ pathname: '/friends-list', params: { tab: 'friends' } })}>
            <Text style={s.statNum}>142</Text>
            <Text style={s.statLabel}>Friends</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.stat, pressed && { opacity: 0.7 }]} onPress={() => router.push({ pathname: '/friends-list', params: { tab: 'planned' } })}>
            <Text style={s.statNum}>24</Text>
            <Text style={s.statLabel}>Planned</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [s.stat, pressed && { opacity: 0.7 }]} onPress={() => router.push({ pathname: '/friends-list', params: { tab: 'attended' } })}>
            <Text style={s.statNum}>87</Text>
            <Text style={s.statLabel}>Attended</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Tabs (static) ── */}
      <View style={s.tabBar}>
        {(['events', 'posts', 'saved'] as Tab[]).map(t => (
          <Pressable
            key={t}
            style={({ pressed }) => [s.tabBtn, tab === t && s.tabBtnActive, pressed && { opacity: 0.7 }]}
            onPress={() => setTab(t)}
          >
            <Text style={[s.tabLabel, tab === t && s.tabLabelActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Tab content (scrollable) ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.feedSection}>
          {tab === 'events' && profileEvents.map(item => (
            <EventCard key={item.id} item={item} />
          ))}

          {tab === 'posts' && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No posts yet</Text>
            </View>
          )}

          {tab === 'saved' && (
            savedVenues.length === 0 ? (
              <View style={s.empty}>
                <Bookmark size={48} strokeWidth={1.5} color="#E3E4E6" />
                <Text style={s.emptyText}>No saved venues yet</Text>
                <Text style={[s.emptyText, { fontSize: 13, marginTop: 4 }]}>Tap the bookmark on any venue to save it</Text>
              </View>
            ) : (
              savedVenues.map(item => <SavedVenueRow key={item.id} item={item} />)
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.screenBackground },
  scroll:    { paddingBottom: 40 },
  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.screenBackground },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.screenBackground,
  },
  avatarWrap: { marginBottom: 14 },
  avatar: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: '#EBF5FB', borderWidth: 3, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10, shadowRadius: 8, elevation: 4,
  },
  initials:    { fontSize: 32, fontWeight: '800', color: Colors.deepSlate },
  displayName: { fontSize: 22, fontWeight: '600', color: Colors.black, letterSpacing: -0.5, marginBottom: 4 },
  subLine:     { fontSize: 15, color: Colors.naturalGrey, marginBottom: 24 },

  // Stats
  statsRow:  { flexDirection: 'row', gap: 28, marginBottom: 0 },
  stat:      { alignItems: 'center', gap: 1 },
  statNum:   { fontSize: 20, fontWeight: '700', color: Colors.black, letterSpacing: -0.4 },
  statLabel: { fontSize: 13, color: Colors.naturalGrey, fontWeight: '500' },

  // Tabs
  tabBar: {
    flexDirection: 'row', backgroundColor: '#F0F1F3',
    marginHorizontal: 16, marginTop: 12, marginBottom: 12,
    borderRadius: 14, padding: 4,
  },
  tabBtn:       { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  tabLabel:       { fontSize: 14, fontWeight: '500', color: Colors.naturalGrey },
  tabLabelActive: { fontWeight: '700', color: Colors.black },

  // Feed
  feedSection: { paddingHorizontal: 16, gap: 12 },

  // Event card
  eventCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10, shadowRadius: 10, elevation: 4,
    padding: 16, paddingVertical: 18, marginBottom: 4,
  },
  dateBlock: { width: 40, alignItems: 'center', gap: 1 },
  dateMonth: { fontSize: 9, fontWeight: '600', color: '#8B8F94', letterSpacing: 0.5 },
  dateDay:   { fontSize: 22, fontWeight: '600', color: '#375169', lineHeight: 26 },
  dateDow:   { fontSize: 9, fontWeight: '500', color: '#8B8F94', letterSpacing: 0.5 },
  divider:   { width: 1, alignSelf: 'stretch', backgroundColor: '#E3E4E6' },
  eventTitle: { fontSize: 15, fontWeight: '700', color: '#333333' },
  eventMeta:  { fontSize: 11.5, color: '#8B8F94', flexShrink: 1 },
  attendeeCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#E8F0F5',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  attendeeInitial: { fontSize: 11, fontWeight: '700', color: Colors.primaryBlue },

  // Saved card
  savedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10, shadowRadius: 10, elevation: 4,
    padding: 16, paddingVertical: 20, marginBottom: 6,
  },
  savedName:    { fontSize: 13.5, fontWeight: '600', color: '#333333' },
  savedMeta:    { fontSize: 11.5, color: '#8B8F94' },
  savedTag:     { backgroundColor: Colors.white, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  savedTagText: { fontSize: 11, color: '#555' },
  planBtn:      { backgroundColor: '#4A7FA5', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  planBtnText:  { fontSize: 13, fontWeight: '600', color: Colors.white },

  // Empty
  empty:     { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: Colors.naturalGrey },
});
