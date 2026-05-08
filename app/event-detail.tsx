import { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
  View, Text, Image, Animated, StyleSheet, Modal,
  Pressable, Linking, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Lock } from 'lucide-react-native';
import { ScaleBtn } from '@/components/ScaleBtn';
import { ShareSheet } from '@/components/ShareSheet';
import { Colors } from '@/constants/Colors';
import { EVENTS, isAccepted, acceptEvent, cancelEvent } from '@/lib/events';

const FALLBACK_EVENT = EVENTS['event-upcoming-1'];

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const event = (id && EVENTS[id]) ? EVENTS[id] : FALLBACK_EVENT;

  const [isRsvpd,        setIsRsvpd]        = useState(() => !!id && isAccepted(id));
  const [showFull,       setShowFull]        = useState(false);
  const [shareVisible,   setShareVisible]    = useState(false);
  const [privateOverlay, setPrivateOverlay]  = useState(false);

  function handleJoin() {
    if (id) acceptEvent(id);
    setIsRsvpd(true);
  }

  function handleCancel() {
    if (id) cancelEvent(id);
    setIsRsvpd(false);
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <View style={[s.topNav, { top: insets.top + 12 }]}>
        <Pressable style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.black} />
        </Pressable>
        <View style={s.topNavRight}>
          <Pressable
            style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }]}
            onPress={() => event.isPrivate ? setPrivateOverlay(true) : setShareVisible(true)}
          >
            {event.isPrivate
              ? <Lock size={18} strokeWidth={2} color={Colors.black} />
              : <Ionicons name="share-outline" size={20} color={Colors.black} />}
          </Pressable>
        </View>
      </View>

      <View style={s.heroContainer}>
        <Image source={{ uri: event.image }} style={s.heroImage} resizeMode="cover" />
      </View>

      <Animated.ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          <View style={s.titleSection}>
            <Text style={s.eventTitle}>{event.title}</Text>
            <View style={s.hostSection}>
              {event.hostAvatar
                ? <Image source={{ uri: event.hostAvatar }} style={s.hostAvatar} />
                : (
                  <View style={[s.hostAvatarFallback]}>
                    <Text style={s.hostAvatarInitials}>{event.hostInitials}</Text>
                  </View>
                )}
              <Text style={s.hostText}>Hosted by {event.host}</Text>
            </View>
          </View>

          <Text style={s.sectionHeading}>When + Where</Text>

          <View style={s.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primaryBlue} />
            <Text style={s.infoPrimary}>{event.date} · {event.time}</Text>
          </View>

          <View style={[s.infoRow, s.venueRow]}>
            <Ionicons name="location-outline" size={18} color={Colors.primaryBlue} />
            <Pressable onPress={() => router.push(`/venue/${event.venueId}`)}>
              <Text style={s.venueText}>{event.venue}</Text>
            </Pressable>
          </View>

          <View style={s.sectionBlock}>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionHeading}>Who&apos;s going</Text>
              <Text style={s.sectionMeta}>{event.totalAttendees} attending</Text>
            </View>
            <View style={s.avatarStack}>
              {event.attending.slice(0, 5).map((name, i) => (
                <View key={i} style={[s.avatarBubble, { left: i * 32, zIndex: event.attending.length - i }]}>
                  <Text style={s.avatarInitials}>{name[0]}</Text>
                </View>
              ))}
              {event.totalAttendees > 5 && (
                <View style={[s.avatarBubble, s.moreBubble, { left: 5 * 32 }]}>
                  <Text style={s.moreText}>+{event.totalAttendees - 5}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={s.sectionBlock}>
            <Text style={s.sectionHeading}>About this plan</Text>
            <Text style={s.description} numberOfLines={showFull ? undefined : 3}>
              {event.description}
            </Text>
            {!showFull && (
              <Pressable onPress={() => setShowFull(true)}>
                <Text style={s.readMore}>read more</Text>
              </Pressable>
            )}
            <View style={s.tagsRow}>
              {event.tags.map(tag => (
                <View key={tag} style={s.tag}>
                  <Text style={s.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={[s.bottomCta, { paddingBottom: insets.bottom + 12 }]}>
        {isRsvpd ? (
          <View style={s.ctaRow}>
            <ScaleBtn
              containerStyle={{ flex: 0.28, marginRight: 10 }}
              style={s.cancelBtn}
              pressedStyle={{ backgroundColor: 'rgba(131,145,156,0.12)' }}
              onPress={handleCancel}
            >
              <Text style={s.cancelBtnText}>Cancel</Text>
            </ScaleBtn>
            <View style={[s.goingBtn, { flex: 0.72 }]}>
              <Text style={s.goingBtnText}>You&apos;re going ✓</Text>
            </View>
          </View>
        ) : (
          <ScaleBtn
            style={s.bookNowBtn}
            pressedStyle={{ backgroundColor: '#2D4357' }}
            onPress={handleJoin}
          >
            <Text style={s.bookNowText}>I&apos;m in</Text>
          </ScaleBtn>
        )}
      </View>

      <ShareSheet
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        type="event"
        id={event.id}
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
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: Colors.screenBackground },
  scroll: { flex: 1 },

  topNav:      { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
  topNavRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 6,
  },

  heroContainer: { height: 280, position: 'relative' },
  heroImage:     { width: '100%', height: '100%' },

  content:      { paddingHorizontal: 20, paddingTop: 20 },
  titleSection: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.divider, marginBottom: 20 },
  eventTitle:   { fontSize: 24, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  hostSection:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hostAvatar:   { width: 28, height: 28, borderRadius: 14 },
  hostAvatarFallback: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryBlue, alignItems: 'center', justifyContent: 'center',
  },
  hostAvatarInitials: { fontSize: 11, fontWeight: '700', color: Colors.white },
  hostText:     { fontSize: 14, color: Colors.naturalGrey, fontWeight: '500' },

  sectionHeading:   { fontSize: 12, fontWeight: '700', color: Colors.naturalGrey, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 },
  infoRow:          { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoPrimary:      { fontSize: 14, color: Colors.black },
  venueRow:         { marginBottom: 0 },
  venueText:        { fontSize: 14, color: Colors.primaryBlue, fontWeight: '500' },

  sectionBlock:     { marginTop: 28 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionMeta:      { fontSize: 13, color: Colors.naturalGrey },

  avatarStack:  { minHeight: 48, marginLeft: -10 },
  avatarBubble: {
    position: 'absolute', width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, borderColor: Colors.white,
    backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 15, fontWeight: '700', color: Colors.black },
  moreBubble:     { backgroundColor: Colors.lightGrey },
  moreText:       { fontSize: 14, fontWeight: '700', color: Colors.black },

  description: { fontSize: 14, color: Colors.black, lineHeight: 22, marginTop: 8 },
  readMore:    { marginTop: 8, fontSize: 14, color: Colors.primaryBlue },
  tagsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag:         { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, backgroundColor: Colors.offWhite, borderWidth: 1, borderColor: Colors.lightGrey },
  tagText:     { color: Colors.primaryBlue, fontSize: 12, fontWeight: '600' },

  bottomCta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: Colors.divider,
    paddingTop: 12, paddingHorizontal: 20,
  },
  bookNowBtn:    { height: 48, borderRadius: 12, backgroundColor: Colors.deepSlate, alignItems: 'center', justifyContent: 'center' },
  bookNowText:   { fontSize: 16, fontWeight: '600', color: Colors.white },
  ctaRow:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cancelBtn:     { height: 48, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: Colors.naturalGrey },
  goingBtn:      { height: 48, borderRadius: 12, backgroundColor: '#E8F2F8', alignItems: 'center', justifyContent: 'center' },
  goingBtnText:  { fontSize: 14, fontWeight: '600', color: Colors.deepSlate },

  // Private overlay
  privateBackdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  privateCard:        { backgroundColor: Colors.white, borderRadius: 20, padding: 28, alignItems: 'center', gap: 10, width: '100%' },
  privateTitle:       { fontSize: 17, fontWeight: '700', color: Colors.black, marginTop: 4 },
  privateBody:        { fontSize: 14, color: Colors.naturalGrey, textAlign: 'center', lineHeight: 20 },
  privateDismiss:     { marginTop: 8, backgroundColor: '#375169', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12 },
  privateDismissText: { fontSize: 15, fontWeight: '600', color: Colors.white },
});
