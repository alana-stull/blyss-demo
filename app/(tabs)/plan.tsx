import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Image,
  TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScaleBtn } from '@/components/ScaleBtn';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = Colors.primaryBlue;
const TOTAL_STEPS = 8;

const CATEGORIES = [
  { id: 'coffee',     label: 'Café',       emoji: '☕' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { id: 'bar',        label: 'Bar',        emoji: '🍹' },
  { id: 'outdoor',    label: 'Outdoor',    emoji: '🌲' },
  { id: 'cultural',   label: 'Cultural',   emoji: '🎨' },
  { id: 'activity',   label: 'Activity',   emoji: '🎯' },
];

const PRIVACY_OPTIONS = [
  { id: 'private',      label: 'Private',      sub: 'Only people you invite can join',         icon: 'lock-closed-outline' as const },
  { id: 'private-open', label: 'Private-Open', sub: 'All friends can see and join this event', icon: 'person-add-outline' as const },
  { id: 'public',       label: 'Public',       sub: 'Anyone can discover and join this event', icon: 'globe-outline' as const },
];

const MOCK_INVITE_FRIENDS = [
  { id: 'if1', name: 'Mesha Robinson',   initials: 'MR' },
  { id: 'if2', name: 'Chris Dos Santos', initials: 'CS' },
  { id: 'if3', name: 'Johanna Kepler',   initials: 'JK' },
  { id: 'if4', name: 'Asili Johnson',    initials: 'AS' },
];

const TIME_SLOTS = [
  { id: 't1', label: 'Sat, Feb 8 · 7:00 PM',  pct: 100, optimal: true  },
  { id: 't2', label: 'Sun, Feb 9 · 11:30 AM', pct: 100, optimal: true  },
  { id: 't3', label: 'Fri, Feb 7 · 8:00 PM',  pct: 75,  optimal: false, desc: '3 of 4 available' },
  { id: 't4', label: 'Sat, Feb 8 · 2:00 PM',  pct: 50,  optimal: false, desc: '2 of 4 available' },
];

const PAYMENT_OPTIONS = [
  { id: 'me',    label: "I'll pay",      sub: "You'll cover the cost for everyone" },
  { id: 'split', label: 'Split evenly',  sub: "Everyone pays their share" },
];

// ─── Step header ─────────────────────────────────────────────────────────────

function StepHeader({ step, total, onBack }: { step: number; total: number; onBack: () => void }) {
  const progress = (step / total) * 100;
  return (
    <View style={s.headerWrap}>
      <View style={s.headerRow}>
        <Pressable style={s.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={Colors.black} />
        </Pressable>
        <Text style={s.headerTitle}>Plan Event</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

// ─── Reusable option row ──────────────────────────────────────────────────────

function OptionRow({
  selected, onPress, children,
}: { selected: boolean; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      style={({ pressed }) => [s.optionRow, selected && s.optionRowSelected, pressed && { opacity: 0.92 }]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 54 + insets.bottom;
  const { venueId } = useLocalSearchParams<{ venueId?: string }>();
  const fromVenue = useRef(false);

  const [step, setStep] = useState(1);
  const [category, setCategory]       = useState('');
  const [venue, setVenue]             = useState<Venue | null>(null);
  const [privacy, setPrivacy]         = useState('');
  const [friends, setFriends]         = useState<string[]>([]);
  const [timeSlot, setTimeSlot]       = useState('');
  const [title, setTitle]             = useState('');
  const [desc, setDesc]               = useState('');
  const [payment, setPayment]         = useState('');

  useEffect(() => {
    if (venueId) {
      const found = VENUES.find(v => v.venue_id === venueId) ?? null;
      setVenue(found);
      setStep(3);
      fromVenue.current = true;
    } else {
      fromVenue.current = false;
    }
  }, [venueId]);

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => {
    if (step === 1) router.back();
    else if (step === 3 && fromVenue.current) router.back();
    else setStep(s => s - 1);
  };

  const toggleFriend = (id: string) =>
    setFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const venueList = category
    ? VENUES.filter(v => v.category === category || (category === 'cultural' && v.category === 'activity'))
    : VENUES;

  // ── Step 1: Category ────────────────────────────────────────────────────────
  const renderCategory = () => (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>What type of venue?</Text>
      <Text style={s.stepSub}>Choose a category to find local options</Text>
      <View style={s.categoryGrid}>
        {CATEGORIES.map(cat => (
          <Pressable
            key={cat.id}
            style={({ pressed }) => [s.categoryCard, category === cat.id && s.categoryCardSelected, pressed && { opacity: 0.92 }]}
            onPress={() => { setCategory(cat.id); setTimeout(next, 150); }}
          >
            <Text style={s.categoryEmoji}>{cat.emoji}</Text>
            <Text style={s.categoryLabel}>{cat.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  // ── Step 2: Choose venue ────────────────────────────────────────────────────
  const renderVenue = () => (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Choose a venue</Text>
      <Text style={s.stepSub}>
        Local {CATEGORIES.find(c => c.id === category)?.label.toLowerCase() ?? 'venue'} options near you
      </Text>
      <View style={s.listGap}>
        {venueList.slice(0, 6).map(v => (
          <Pressable
            key={v.venue_id}
            style={({ pressed }) => [s.venueRow, venue?.venue_id === v.venue_id && s.optionRowSelected, pressed && { opacity: 0.92 }]}
            onPress={() => { setVenue(v); setTimeout(next, 150); }}
          >
            <Image source={{ uri: v.image }} style={s.venueThumb} />
            <View style={s.venueInfo}>
              <Text style={s.venueName}>{v.name}</Text>
              <View style={s.venueMetaRow}>
                <Ionicons name="location-outline" size={12} color={Colors.naturalGrey} />
                <Text style={s.venueMeta}>{v.neighborhood} · {(Math.random() * 2 + 0.5).toFixed(1)} mi</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  // ── Step 3: Privacy ─────────────────────────────────────────────────────────
  const renderPrivacy = () => (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Event privacy</Text>
      <Text style={s.stepSub}>Choose who can join this event</Text>
      <View style={s.listGap}>
        {PRIVACY_OPTIONS.map(opt => (
          <OptionRow
            key={opt.id}
            selected={privacy === opt.id}
            onPress={() => { setPrivacy(opt.id); setTimeout(next, 150); }}
          >
            <View style={s.privacyIcon}>
              <Ionicons name={opt.icon} size={20} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.optionLabel}>{opt.label}</Text>
              <Text style={s.optionSub}>{opt.sub}</Text>
            </View>
          </OptionRow>
        ))}
      </View>
    </ScrollView>
  );

  // ── Step 4: Invite friends ──────────────────────────────────────────────────
  const renderFriends = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.stepTitle}>Invite friends</Text>
        <Text style={s.stepSub}>Select friends to invite</Text>
        <View style={s.listGap}>
          {MOCK_INVITE_FRIENDS.map(f => {
            const sel = friends.includes(f.id);
            return (
              <Pressable
                key={f.id}
                style={({ pressed }) => [s.friendRow, sel && s.optionRowSelected, pressed && { opacity: 0.92 }]}
                onPress={() => toggleFriend(f.id)}
              >
                <View style={s.friendAvatar}>
                  <Text style={s.friendInitials}>{f.initials}</Text>
                </View>
                <Text style={s.friendName}>{f.name}</Text>
                {sel && (
                  <View style={s.checkCircle}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={[s.stickyBottom, { paddingBottom: TAB_BAR_HEIGHT + 8 }]}>
        <ScaleBtn style={s.continueBtn} pressedStyle={{ backgroundColor: '#4D8FB5' }} onPress={next}>
          <Text style={s.continueBtnText}>Continue</Text>
        </ScaleBtn>
      </View>
    </View>
  );

  // ── Step 5: Best times ──────────────────────────────────────────────────────
  const renderTimes = () => (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.stepTitle}>Best times for everyone</Text>
      <Text style={s.stepSub}>Based on your friends' schedules</Text>
      <View style={s.listGap}>
        {TIME_SLOTS.map(slot => (
          <Pressable
            key={slot.id}
            style={({ pressed }) => [s.timeCard, slot.optimal && s.timeCardOptimal, timeSlot === slot.id && s.optionRowSelected, pressed && { opacity: 0.92 }]}
            onPress={() => { setTimeSlot(slot.id); setTimeout(next, 150); }}
          >
            {slot.optimal && (
              <View style={s.optimalBadge}>
                <View style={s.optimalDot} />
                <Text style={s.optimalText}>Optimal Time</Text>
              </View>
            )}
            <View style={s.timeMeta}>
              <Ionicons name="time-outline" size={14} color={Colors.naturalGrey} />
              <Text style={s.timeLabel}>{slot.label}</Text>
            </View>
            <View style={s.timeMeta}>
              <Ionicons name="people-outline" size={14} color={Colors.naturalGrey} />
              <Text style={s.timeAvail}>
                {slot.optimal ? '100% (Everyone is free!)' : `${slot.pct}% (${slot.desc})`}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  // ── Step 6: Event details ───────────────────────────────────────────────────
  const renderDetails = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.stepTitle}>Event details</Text>
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Event title</Text>
          <TextInput
            style={s.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder={`e.g., Sunday Brunch at ${venue?.name ?? 'Café Lumière'}`}
            placeholderTextColor="#B0B4BA"
          />
        </View>
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Description (optional)</Text>
          <TextInput
            style={[s.textInput, s.textArea]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Add any details or notes about the event..."
            placeholderTextColor="#B0B4BA"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      <View style={[s.stickyBottom, { paddingBottom: TAB_BAR_HEIGHT + 8 }]}>
        <ScaleBtn style={[s.continueBtn, !title && s.continueBtnDisabled]} pressedStyle={{ backgroundColor: '#4D8FB5' }} onPress={next} disabled={!title}>
          <Text style={s.continueBtnText}>Continue</Text>
        </ScaleBtn>
      </View>
    </View>
  );

  // ── Step 7: Payment ─────────────────────────────────────────────────────────
  const renderPayment = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.stepTitle}>Payment method</Text>
        <Text style={s.stepSub}>How would you like to handle payment?</Text>
        <View style={s.listGap}>
          {PAYMENT_OPTIONS.map(opt => (
            <OptionRow
              key={opt.id}
              selected={payment === opt.id}
              onPress={() => setPayment(opt.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.optionLabel}>{opt.label}</Text>
                <Text style={s.optionSub}>{opt.sub}</Text>
              </View>
            </OptionRow>
          ))}
        </View>
      </ScrollView>
      <View style={[s.stickyBottom, { paddingBottom: TAB_BAR_HEIGHT + 8 }]}>
        <ScaleBtn
          style={[s.continueBtn, !payment && s.continueBtnDisabled]}
          pressedStyle={{ backgroundColor: '#4D8FB5' }}
          onPress={next}
          disabled={!payment}
        >
          <Text style={s.continueBtnText}>Continue</Text>
        </ScaleBtn>
      </View>
    </View>
  );

  // ── Step 8: Confirmation ────────────────────────────────────────────────────
  const renderConfirmation = () => (
    <View style={s.confirmWrap}>
      <View style={s.confirmIcon}>
        <Ionicons name="checkmark" size={36} color={Colors.white} />
      </View>
      <Text style={s.confirmTitle}>Event Created!</Text>
      <Text style={s.confirmSub}>
        Your event has been sent to your friends.{'\n'}
        We'll notify them to confirm.
      </Text>

      {/* Summary card */}
      <View style={s.confirmCard}>
        {venue && (
          <View style={s.confirmRow}>
            <Ionicons name="location-outline" size={16} color="#5BA8D3" />
            <Text style={s.confirmRowText}>{venue.name}</Text>
          </View>
        )}
        {timeSlot && (
          <View style={s.confirmRow}>
            <Ionicons name="time-outline" size={16} color="#5BA8D3" />
            <Text style={s.confirmRowText}>
              {TIME_SLOTS.find(t => t.id === timeSlot)?.label ?? ''}
            </Text>
          </View>
        )}
        {friends.length > 0 && (
          <View style={s.confirmRow}>
            <Ionicons name="people-outline" size={16} color="#5BA8D3" />
            <Text style={s.confirmRowText}>
              {friends.length} friend{friends.length !== 1 ? 's' : ''} invited
            </Text>
          </View>
        )}
        {title ? (
          <View style={s.confirmRow}>
            <Ionicons name="pencil-outline" size={16} color="#5BA8D3" />
            <Text style={s.confirmRowText}>{title}</Text>
          </View>
        ) : null}
      </View>

      <ScaleBtn style={s.confirmBtn} pressedStyle={{ backgroundColor: '#4D8FB5' }} onPress={() => router.replace('/(tabs)/explore')}>
        <Text style={s.confirmBtnText}>Back to Home</Text>
      </ScaleBtn>
    </View>
  );

  const steps: Record<number, () => React.ReactNode> = {
    1: renderCategory,
    2: renderVenue,
    3: renderPrivacy,
    4: renderFriends,
    5: renderTimes,
    6: renderDetails,
    7: renderPayment,
    8: renderConfirmation,
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {step < 8 && <StepHeader step={step} total={TOTAL_STEPS - 1} onBack={back} />}
      {steps[step]?.()}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },

  // Header
  headerWrap: { backgroundColor: Colors.screenBackground, paddingBottom: 0 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.black },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.lightGrey,
    marginHorizontal: 0,
  },
  progressFill: {
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  // Content
  content: { padding: 20, paddingBottom: 32, gap: 0 },
  stepTitle: { fontSize: 20, fontWeight: '700', color: Colors.black, letterSpacing: -0.4, marginBottom: 4, marginTop: 8 },
  stepSub: { fontSize: 14, color: Colors.naturalGrey, marginBottom: 20 },
  listGap: { gap: 10 },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1.2,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryCardSelected: {
    borderColor: ACCENT,
    backgroundColor: '#EBF5FB',
  },
  categoryEmoji: { fontSize: 28, marginBottom: 8 },
  categoryLabel: { fontSize: 15, fontWeight: '600', color: Colors.black },

  // Venue row
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    overflow: 'hidden',
    gap: 0,
  },
  venueThumb: { width: 72, height: 72, backgroundColor: Colors.lightGrey },
  venueInfo: { flex: 1, paddingHorizontal: 14, gap: 4 },
  venueName: { fontSize: 15, fontWeight: '600', color: Colors.black },
  venueMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  venueMeta: { fontSize: 12, color: Colors.naturalGrey },

  // Option row (privacy, payment)
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    padding: 16,
  },
  optionRowSelected: { borderColor: ACCENT, backgroundColor: '#F0F8FD' },
  optionLabel: { fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 2 },
  optionSub: { fontSize: 13, color: Colors.naturalGrey },

  // Privacy icon
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Friends
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    padding: 12,
  },
  friendAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  friendInitials: { fontSize: 14, fontWeight: '700', color: Colors.white, letterSpacing: 0.5 },
  friendName: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Time slots
  timeCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    padding: 14,
    gap: 6,
  },
  timeCardOptimal: { borderColor: ACCENT, backgroundColor: '#F0F8FD' },
  optimalBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  optimalDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: ACCENT },
  optimalText: { fontSize: 12, fontWeight: '700', color: ACCENT },
  timeMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeLabel: { fontSize: 15, fontWeight: '600', color: Colors.black },
  timeAvail: { fontSize: 13, color: Colors.naturalGrey },

  // Event details
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 8 },
  textInput: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.black,
  },
  textArea: { height: 100, paddingTop: 12 },

  // Sticky bottom
  stickyBottom: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.screenBackground,
  },
  continueBtn: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: Colors.secondaryBlue },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  // Confirmation
  confirmWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
    backgroundColor: Colors.screenBackground,
  },
  confirmIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.black,
    letterSpacing: -0.5,
  },
  confirmSub: {
    fontSize: 15,
    color: Colors.naturalGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confirmRowText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    flex: 1,
  },
  confirmBtn: {
    marginTop: 8,
    width: '100%',
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
