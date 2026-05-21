import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, Pressable, Image,
  TextInput, StyleSheet, Animated, Switch, Dimensions, Share,
} from 'react-native';
import ReAnimated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ArrowLeft, Users as UsersIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScaleBtn } from '@/components/ScaleBtn';
import { ShareSheet } from '@/components/ShareSheet';
import { Colors } from '@/constants/Colors';
import { VENUES } from '@/lib/venues';
import type { Venue } from '@/lib/venues';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT    = Colors.primaryBlue;
const PLAN_BTN  = '#5BA8D3';
const TOTAL_STEPS = 11;

const VIBE_CATEGORIES: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'coffee',     label: 'Coffee',         icon: 'cafe-outline' },
  { id: 'restaurant', label: 'Restaurants',    icon: 'restaurant-outline' },
  { id: 'bar',        label: 'Bars',           icon: 'wine-outline' },
  { id: 'outdoor',    label: 'Outdoors',       icon: 'leaf-outline' },
  { id: 'cultural',   label: 'Arts & Culture', icon: 'color-palette-outline' },
  { id: 'activity',   label: 'Activities',     icon: 'barbell-outline' },
  { id: 'activity',   label: 'Arcade',         icon: 'game-controller-outline' },
  { id: 'restaurant', label: 'Brunch',         icon: 'restaurant-outline' },
  { id: 'cultural',   label: 'Concerts',       icon: 'musical-notes-outline' },
  { id: 'bar',        label: 'Nightlife',      icon: 'moon-outline' },
  { id: 'cultural',   label: 'Movies',         icon: 'film-outline' },
  { id: 'outdoor',    label: 'Sports',         icon: 'trophy-outline' },
];

const PRIVACY_OPTIONS: { id: string; label: string; sub: string; icon?: typeof Ionicons.defaultProps; ionIcon?: string; LucideIcon?: React.ComponentType<{ size: number; color: string; strokeWidth: number }>; nextStep: number }[] = [
  { id: 'private', label: 'Just my crew',     sub: 'Only people you invite can join',       ionIcon: 'lock-closed-outline', nextStep: 5 },
  { id: 'friends', label: 'Friends can join', sub: 'Any of your friends can see and join',  LucideIcon: UsersIcon,          nextStep: 6 },
  { id: 'public',  label: 'Open to everyone', sub: 'Anyone on Blyss can discover and join', ionIcon: 'globe-outline',       nextStep: 6 },
];

const MOCK_INVITE_FRIENDS = [
  { id: 'if1', name: 'Mesha Robinson',   initials: 'MR' },
  { id: 'if2', name: 'Chris Dos Santos', initials: 'CS' },
  { id: 'if3', name: 'Johanna Kepler',   initials: 'JK' },
  { id: 'if4', name: 'Asili Johnson',    initials: 'AJ' },
  { id: 'if5', name: 'Tariq Hassan',     initials: 'TH' },
  { id: 'if6', name: 'Priya Nair',       initials: 'PN' },
  { id: 'if7', name: 'Marcus Webb',      initials: 'MW' },
  { id: 'if8', name: 'Lucia Fernandez',  initials: 'LF' },
];

const TIME_SLOTS = [
  { id: 't1', label: 'Sat, Feb 8 · 7:00 PM',  day: 'Saturday', date: 'Feb 8', time: '7:00 PM',  pct: 100, optimal: true,  desc: "Everyone's free" },
  { id: 't2', label: 'Sun, Feb 9 · 11:30 AM', day: 'Sunday',   date: 'Feb 9', time: '11:30 AM', pct: 100, optimal: true,  desc: "Everyone's free" },
  { id: 't3', label: 'Fri, Feb 7 · 8:00 PM',  day: 'Friday',   date: 'Feb 7', time: '8:00 PM',  pct: 75,  optimal: false, desc: '3 of 4 available' },
  { id: 't4', label: 'Sat, Feb 8 · 2:00 PM',  day: 'Saturday', date: 'Feb 8', time: '2:00 PM',  pct: 50,  optimal: false, desc: '2 of 4 available' },
];

const ENVELOPE_COLORS = ['#375169', '#5BA8D3', '#F2C05A', '#333333', '#FCFCFC'];
const CARD_COLORS = ['#FFFFFF', '#F9F9FA', '#F2C05A', '#E8F2F8', '#333333'];

// Envelope preview dimensions
const EP_W          = Math.min(290, Dimensions.get('window').width - 60);
const EP_H          = 200;
const EP_FLAP_H     = Math.round(EP_W * 0.42);
const EP_CARD_W     = EP_W - 28;
const EP_CARD_H     = 222;
const EP_CARD_TRAVEL = 190;

const PAYMENT_OPTIONS = [
  { id: 'me',    label: "I'll pay",      sub: "You'll cover the cost for everyone" },
  { id: 'split', label: 'Split evenly',  sub: "Everyone pays their share" },
];

type StartPath = 'vibe' | 'place' | 'people';

const START_OPTIONS: { id: StartPath; ionIcon?: string; LucideIcon?: React.ComponentType<{ size: number; color: string; strokeWidth: number }>; label: string; subtitle: string; nextStep: number }[] = [
  { id: 'people', LucideIcon: UsersIcon,     label: 'I have people', subtitle: 'Start with who you want to hang with', nextStep: 5 },
  { id: 'place',  ionIcon: 'location-outline', label: 'I have a place', subtitle: 'Already know where you want to go', nextStep: 3 },
  { id: 'vibe',   ionIcon: 'compass-outline',  label: 'I have a vibe',  subtitle: 'Browse by type of plan',           nextStep: 2 },
];

// ─── Step header ─────────────────────────────────────────────────────────────

let _lastPlanProgress = 0;

function StepHeader({ step, total, onBack }: { step: number; total: number; onBack: () => void }) {
  const progress = (step / total) * 100;
  const animatedProgress = useRef(new Animated.Value(_lastPlanProgress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
    _lastPlanProgress = progress;
  }, [progress]);

  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={s.headerWrap}>
      <View style={s.headerRow}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={onBack}
        >
          <ArrowLeft size={20} color="#8B8F94" strokeWidth={1.5} />
        </Pressable>
        <View style={s.progressBarContainer}>
          <View style={s.progressBarBackground}>
            <Animated.View style={[s.progressBarFilled, { width: animatedWidth }]}>
              <LinearGradient
                colors={['#B7D3E0', '#4A7FA5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

const RSVP_DEADLINES = [
  'Mon, Feb 3', 'Tue, Feb 4', 'Wed, Feb 5',
  'Thu, Feb 6', 'Fri, Feb 7', 'Sat, Feb 8',
];

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ value, onDecrement, onIncrement, min = 1, max = 50 }: {
  value: number; onDecrement: () => void; onIncrement: () => void; min?: number; max?: number;
}) {
  return (
    <View style={st.stepperRow}>
      <Pressable
        style={[st.stepperBtn, value <= min && st.stepperBtnDisabled]}
        onPress={onDecrement}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={18} color={value <= min ? '#C0C4CA' : '#333333'} />
      </Pressable>
      <Text style={st.stepperValue}>{value}</Text>
      <Pressable
        style={[st.stepperBtn, value >= max && st.stepperBtnDisabled]}
        onPress={onIncrement}
        disabled={value >= max}
      >
        <Ionicons name="add" size={18} color={value >= max ? '#C0C4CA' : '#333333'} />
      </Pressable>
    </View>
  );
}

// Stepper-only stylesheet (avoids forward-reference to `s`)
const st = StyleSheet.create({
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F5F6F8',
    alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnDisabled: { opacity: 0.4 },
  stepperValue: {
    fontSize: 16, fontWeight: '700', color: '#333333',
    minWidth: 28, textAlign: 'center',
  },
});

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

// ─── Envelope preview ────────────────────────────────────────────────────────

function EnvelopePreview({
  envelopeColor, cardColor, title, venue, timeSlotId, friendIds, privacy, tabBarHeight, onSend, onEdit, cardStyle
}: {
  envelopeColor: string; cardColor: string; title: string; venue: Venue | null; timeSlotId: string;
  friendIds: string[]; privacy: string; tabBarHeight: number;
  onSend: () => void; onEdit: () => void; cardStyle: 'minimal' | 'bold' | 'photo';
}) {
  const [tapped, setTapped] = useState(false);
  const cardAnim = useSharedValue(0);
  const buttonsAnim = useSharedValue(0);
  const hintAnim = useSharedValue(1);

  const slot = TIME_SLOTS.find(t => t.id === timeSlotId);

  function openEnvelope() {
    if (tapped) return;
    setTapped(true);
    
    // Smooth step-by-step physical unboxing sequence
    hintAnim.value = withTiming(0, { duration: 150 });
    cardAnim.value = withSpring(1, { damping: 16, stiffness: 100 }, (finished) => {
      if (finished) {
        buttonsAnim.value = withTiming(1, { duration: 250 });
      }
    });
  }

  // Linear vertical slide upward
  const cardSlide = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(cardAnim.value, [0, 1], [0, -180]) }],
  }));

  const buttonsAppear = useAnimatedStyle(() => ({
    opacity: buttonsAnim.value,
    transform: [{ translateY: interpolate(buttonsAnim.value, [0, 1], [15, 0]) }],
  }));

  const hintAppear = useAnimatedStyle(() => ({ opacity: hintAnim.value }));

  return (
    <View style={ep.root}>
      <Pressable style={ep.center} onPress={openEnvelope} hitSlop={32}>
        {/* Main Sleeve/Pocket Frame */}
        <View style={[ep.sleeveContainer, { backgroundColor: '#F9F9FA' }]}>
          
          {/* 1 — The Actual Card (Slides up from the background layer) */}
          <ReAnimated.View style={[ep.animatedCardWrapper, cardSlide]}>
            <InvitePreviewCard
              cardStyle={cardStyle}
              envelopeColor={envelopeColor}
              cardColor={cardColor}
              title={title}
              venue={venue}
              slot={slot}
              friends={friendIds}
              privacy={privacy}
            />
          </ReAnimated.View>

          {/* 2 — Premium Minimal Back Pocket Base */}
          <View style={[ep.pocketBack, { backgroundColor: envelopeColor }]} />

          {/* 3 — Front Cover Sleeve Mask (Creates the physical insert layer) */}
          <View style={[ep.pocketFront, { backgroundColor: envelopeColor }]} />
        </View>

        <ReAnimated.Text style={[ep.tapHint, hintAppear]}>Tap to open</ReAnimated.Text>
      </Pressable>

      {/* Primary Action Buttons */}
      <ReAnimated.View style={[ep.buttons, { paddingBottom: 24 }, buttonsAppear]}>
        <Pressable style={ep.sendBtn} onPress={onSend}>
          <Text style={ep.sendText}>Send invite</Text>
        </Pressable>
        <Pressable style={ep.editBtn} onPress={onEdit}>
          <Text style={ep.editText}>Edit</Text>
        </Pressable>
      </ReAnimated.View>
    </View>
  );
}

const ep = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Matches modern physical gift layouts
  sleeveContainer: {
    width: 320,
    height: 220,
    position: 'relative',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  animatedCardWrapper: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    zIndex: 1,
  },
  pocketBack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: 0,
  },
  pocketFront: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140, // Height of the cut pocket sleeve
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },

  tapHint: { 
    marginTop: 28, 
    fontSize: 14, 
    color: '#8E8E93', 
    fontWeight: '500', 
    fontFamily: 'Figtree',
    letterSpacing: 0.3 
  },

  buttons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  sendBtn: { 
    backgroundColor: '#4A7FA5', 
    height: 52, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  sendText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', fontFamily: 'Figtree' },
  editBtn: { 
    height: 52, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#4A7FA5', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  editText: { fontSize: 16, fontWeight: '600', color: '#4A7FA5', fontFamily: 'Figtree' },
});

const previewStyles = StyleSheet.create({
  previewCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 150,
  },
  previewTitle: {
    fontSize: 20,
    fontFamily: 'Figtree',
    fontWeight: '600',
    marginBottom: 8,
  },
  previewSub: {
    fontSize: 13,
    fontFamily: 'Figtree',
    fontWeight: '500',
    color: '#8B8F94',
    marginBottom: 3,
  },
  previewPhotoInner: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 150,
  },
});

type TimeSlot = (typeof TIME_SLOTS)[0];

interface InvitePreviewCardProps {
  cardStyle: 'minimal' | 'bold' | 'photo';
  envelopeColor: string;
  cardColor: string;
  title: string;
  venue: Venue | null;
  slot: TimeSlot | undefined;
  friends: string[];
  privacy: string;
}

const InvitePreviewCard = ({ cardStyle, envelopeColor, cardColor, title, venue, slot, friends, privacy }: InvitePreviewCardProps) => {
  const isLightCard = ['#FFFFFF', '#FCFCFC', '#F9F9FA', '#E8F2F8', '#F2C05A'].includes(cardColor);
  const onDark = !isLightCard;

  if (cardStyle === 'bold') {
    return (
      <View style={[previewStyles.previewCard, { backgroundColor: cardColor, borderWidth: 0, shadowColor: cardColor }]}>
        <Text style={[previewStyles.previewTitle, { color: onDark ? '#FFFFFF' : '#1A1A1A' }]}>
          {title || 'Your Plan'}
        </Text>
        <View style={{ gap: 4, marginTop: 8 }}>
          <Text style={[previewStyles.previewSub, { color: onDark ? 'rgba(255,255,255,0.85)' : '#4A4A4A' }]}>{venue?.name ?? 'Your Venue'}</Text>
          {slot && <Text style={[previewStyles.previewSub, { color: onDark ? 'rgba(255,255,255,0.85)' : '#4A4A4A' }]}>{slot.day}, {slot.date} · {slot.time}</Text>}
          {friends.length > 0 && privacy === 'private' && <Text style={[previewStyles.previewSub, { color: onDark ? 'rgba(255,255,255,0.65)' : '#666666', marginTop: 4 }]}>{friends.length} friend{friends.length !== 1 ? 's' : ''} invited</Text>}
        </View>
      </View>
    );
  }

  if (cardStyle === 'photo') {
    return (
      <View style={[previewStyles.previewCard, { overflow: 'hidden', padding: 0, borderWidth: 0 }]}>
        {venue?.image ? <Image source={{ uri: venue.image }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : <View style={[StyleSheet.absoluteFill, { backgroundColor: '#EAEAEA' }]} />}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]} />
        <View style={[previewStyles.previewPhotoInner, { padding: 20, justifyContent: 'flex-end', height: '100%' }]}>
          <Text style={[previewStyles.previewTitle, { color: '#FFFFFF' }]}>
            {title || 'Your Plan'}
          </Text>
          <View style={{ gap: 4, marginTop: 8 }}>
            <Text style={[previewStyles.previewSub, { color: 'rgba(255,255,255,0.9)' }]}>{venue?.name ?? 'Your Venue'}</Text>
            {slot && <Text style={[previewStyles.previewSub, { color: 'rgba(255,255,255,0.9)' }]}>{slot.day}, {slot.date} · {slot.time}</Text>}
            {friends.length > 0 && privacy === 'private' && <Text style={[previewStyles.previewSub, { color: 'rgba(255,255,255,0.7)' }]}>{friends.length} friend{friends.length !== 1 ? 's' : ''} invited</Text>}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[previewStyles.previewCard, { backgroundColor: cardColor, borderWidth: 1, borderColor: '#F0F0F0', padding: 24 }]}>
      <Text style={[previewStyles.previewTitle, { color: onDark ? '#FFFFFF' : '#1A1A1A' }]}>
        {title || 'Your Plan'}
      </Text>
      <View style={{ gap: 4, marginTop: 12 }}>
        <Text style={[previewStyles.previewSub, { color: onDark ? '#EBEBEB' : '#555555' }]}>{venue?.name ?? 'Your Venue'}</Text>
        {slot && <Text style={[previewStyles.previewSub, { color: onDark ? '#EBEBEB' : '#555555' }]}>{slot.day}, {slot.date} · {slot.time}</Text>}
        {friends.length > 0 && privacy === 'private' && <Text style={[previewStyles.previewSub, { color: onDark ? '#C0C0C0' : '#888888', marginTop: 6 }]}>{friends.length} friend{friends.length !== 1 ? 's' : ''} invited</Text>}
      </View>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 54 + insets.bottom;
  const { venueId, new: newPlan } = useLocalSearchParams<{ venueId?: string; new?: string }>();
  const fromVenue = useRef(false);

  const [step, setStep] = useState(1);
  const [startPath, setStartPath]     = useState<StartPath | null>(null);
  const [selectedVibe, setSelectedVibe] = useState('');
  const [category, setCategory]       = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [venueSearch, setVenueSearch] = useState('');
  const [venue, setVenue]             = useState<Venue | null>(null);
  const [privacy, setPrivacy]         = useState('');
  const [friends, setFriends]         = useState<string[]>([]);
  const [timeSlot, setTimeSlot]       = useState('');
  const [title, setTitle]             = useState('');
  const [desc, setDesc]               = useState('');
  const [envelopeColor, setEnvelopeColor] = useState('#5BA8D3');
  const [cardColor, setCardColor]     = useState('#FFFFFF');
  const [cardStyle, setCardStyle]     = useState<'minimal' | 'bold' | 'photo'>('minimal');
  const [minRsvp, setMinRsvp]         = useState(2);
  const [maxCapacity, setMaxCapacity] = useState(8);
  const [skipThreshold, setSkipThreshold] = useState(false);
  const [rsvpDeadlineIdx, setRsvpDeadlineIdx] = useState(0);
  const [payment, setPayment]         = useState('');
  const [linkCopied, setLinkCopied]   = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    if (venueId) {
      const found = VENUES.find(v => v.venue_id === venueId) ?? null;
      setVenue(found);
      setStep(4);
      fromVenue.current = true;
    } else {
      fromVenue.current = false;
    }
  }, [venueId]);

  useEffect(() => {
    if (newPlan) {
      setStep(1); setStartPath(null); setSelectedVibe(''); setCategory('');
      setVenue(null); setPrivacy(''); setFriends([]); setTimeSlot('');
      setTitle(''); setDesc(''); fromVenue.current = false;
    }
  }, [newPlan]);

  const resetFlow = () => {
    setStep(1);
    setStartPath(null);
    setSelectedVibe('');
    setCategory('');
    setFriendSearch('');
    setVenueSearch('');
    setVenue(null);
    setPrivacy('');
    setFriends([]);
    setTimeSlot('');
    setTitle('');
    setDesc('');
    setEnvelopeColor('#5BA8D3');
    setCardColor('#FFFFFF');
    setCardStyle('minimal');
    setMinRsvp(2);
    setMaxCapacity(8);
    setSkipThreshold(false);
    setRsvpDeadlineIdx(0);
    setPayment('');
    setLinkCopied(false);
    setShareVisible(false);
    fromVenue.current = false;
    _lastPlanProgress = 0;
  };

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => {
    if (step === 1) router.back();
    else if (step === 2) {
      if (startPath === 'vibe') setStep(1);
      else if (startPath === 'people') {
        if (privacy === 'private') setStep(5);
        else setStep(4);
      }
    }
    else if (step === 3) {
      if (startPath === 'place') setStep(1);
      else setStep(2);
    }
    else if (step === 4) {
      if (fromVenue.current) router.back();
      else if (startPath === 'people') setStep(1);
      else setStep(3);
    }
    else if (step === 5) {
      setStep(4);
    }
    else if (step === 6) {
      if (startPath === 'people') setStep(3);
      else {
        if (privacy === 'private') setStep(5);
        else setStep(4);
      }
    }
    else setStep(s => s - 1);
  };

  const toggleFriend = (id: string) =>
    setFriends(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const venueList = category
    ? VENUES.filter(v => v.category === category || (category === 'cultural' && v.category === 'activity'))
    : VENUES;

  const filteredVenues = venueSearch
    ? venueList.filter(v => v.name.toLowerCase().includes(venueSearch.toLowerCase()) || v.neighborhood.toLowerCase().includes(venueSearch.toLowerCase()))
    : venueList.slice(0, 8);

  // ── Step 1: Start ───────────────────────────────────────────────────────────
  const renderStart = () => (
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Text style={s.startHeading}>Where do you want to start?</Text>
      <View style={[s.listGap, { marginTop: 24 }]}>
        {START_OPTIONS.map(opt => (
          <Pressable
            key={opt.id}
            style={({ pressed }) => [s.startCard, pressed && { opacity: 0.88 }]}
            onPress={() => {
              setStartPath(opt.id);
              if (opt.id === 'people') setStep(4);
              else if (opt.id === 'place') setStep(3);
              else if (opt.id === 'vibe') setStep(2);
            }}
          >
            <View style={s.startIconWrap}>
              {opt.LucideIcon
                ? <opt.LucideIcon size={24} color={ACCENT} strokeWidth={1.8} />
                : <Ionicons name={opt.ionIcon as any} size={24} color={ACCENT} />
              }
            </View>
            <View style={s.startTextWrap}>
              <Text style={s.startLabel}>{opt.label}</Text>
              <Text style={s.startSub}>{opt.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C0C4CA" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

  // ── Step 2: Vibe ────────────────────────────────────────────────────────────
  const renderCategory = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <Text style={s.vibeHeading}>What's the vibe?</Text>
        <View style={[s.listGap, { marginTop: 20 }]}>
          {VIBE_CATEGORIES.map(cat => {
            const sel = selectedVibe === cat.label;
            return (
              <Pressable
                key={cat.label}
                style={({ pressed }) => [s.vibeRow, sel && s.vibeRowSelected, pressed && { opacity: 0.88 }]}
                onPress={() => {
                  setSelectedVibe(cat.label);
                  setCategory(cat.id);
                }}
              >
                <Ionicons name={cat.icon} size={22} color={sel ? '#4A7FA5' : '#8B8F94'} />
                <Text style={[s.vibeRowLabel, sel && s.vibeRowLabelSelected]}>{cat.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable
        style={[s.circleNavBtn, { bottom: 24 }, !selectedVibe && s.circleNavBtnDisabled]}
        onPress={() => setStep(3)}
        disabled={!selectedVibe}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  // ── Step 2: Choose venue ────────────────────────────────────────────────────
  const renderVenue = () => (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.stepTitle}>Choose a venue</Text>
        <Text style={s.stepSub}>
          Local {VIBE_CATEGORIES.find(c => c.id === category)?.label.toLowerCase() ?? 'venue'} options near you
        </Text>

        <View style={[s.friendSearchBar, { marginBottom: 16 }]}>
          <Ionicons name="search-outline" size={16} color="#8B8F94" />
          <TextInput
            style={s.friendSearchInput}
            value={venueSearch}
            onChangeText={setVenueSearch}
            placeholder="Search venues..."
            placeholderTextColor="#B0B4BA"
          />
        </View>

        <View style={s.listGap}>
          {filteredVenues.length === 0 && (
            <Text style={[s.stepSub, { textAlign: 'center', marginTop: 24 }]}>No venues found.</Text>
          )}
          {filteredVenues.map(v => (
            <Pressable
              key={v.venue_id}
              style={({ pressed }) => [s.venueRow, venue?.venue_id === v.venue_id && s.optionRowSelected, pressed && { opacity: 0.92 }]}
              onPress={() => setVenue(v)}
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
      <Pressable
        style={[s.circleNavBtn, { bottom: 24 }, !venue && s.circleNavBtnDisabled]}
        onPress={() => {
          if (startPath === 'people') setStep(6);
          else setStep(4);
        }}
        disabled={!venue}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  // ── Step 3: Privacy ─────────────────────────────────────────────────────────
  const renderPrivacy = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
        <Text style={s.vibeHeading}>Who can join?</Text>
        <View style={[s.listGap, { marginTop: 20 }]}>
          {PRIVACY_OPTIONS.map(opt => {
            const sel = privacy === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [s.optionRow, sel && s.optionRowSelected, pressed && { opacity: 0.88 }]}
                onPress={() => setPrivacy(opt.id)}
              >
                <View style={s.privacyIcon}>
                  {opt.LucideIcon
                    ? <opt.LucideIcon size={20} color={sel ? ACCENT : '#8B8F94'} strokeWidth={1.8} />
                    : <Ionicons name={opt.ionIcon as any} size={20} color={sel ? ACCENT : '#8B8F94'} />
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.optionLabel, sel && { color: ACCENT }]}>{opt.label}</Text>
                  <Text style={s.optionSub}>{opt.sub}</Text>
                </View>
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
      <Pressable
        style={[s.circleNavBtn, { bottom: 24 }, !privacy && s.circleNavBtnDisabled]}
        onPress={() => {
          if (privacy === 'private') setStep(5);
          else {
            if (startPath === 'people') setStep(2);
            else setStep(6);
          }
        }}
        disabled={!privacy}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  // ── Step 5: Invite friends ──────────────────────────────────────────────────
  const renderFriends = () => {
    const filtered = MOCK_INVITE_FRIENDS.filter(f =>
      f.name.toLowerCase().includes(friendSearch.toLowerCase())
    );
    const count = friends.length;
    return (
      <View style={{ flex: 1 }}>
        <View style={s.friendsHeaderSection}>
          <Text style={s.vibeHeading}>Who's invited?</Text>
          <Text style={[s.stepSub, { marginTop: 6, marginBottom: 14 }]}>Pick as many as you like</Text>
          <View style={s.friendSearchBar}>
            <Ionicons name="search-outline" size={16} color="#8B8F94" />
            <TextInput
              style={s.friendSearchInput}
              value={friendSearch}
              onChangeText={setFriendSearch}
              placeholder="Search friends..."
              placeholderTextColor="#B0B4BA"
            />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map(f => {
            const sel = friends.includes(f.id);
            return (
              <Pressable
                key={f.id}
                style={({ pressed }) => [s.friendRow, sel && s.friendRowSelected, pressed && { opacity: 0.88 }]}
                onPress={() => toggleFriend(f.id)}
              >
                <View style={[s.friendAvatar, sel && s.friendAvatarSelected]}>
                  <Text style={s.friendInitials}>{f.initials}</Text>
                </View>
                <Text style={[s.friendName, sel && { color: ACCENT }]}>{f.name}</Text>
                {sel && (
                  <View style={s.checkCircle}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={[s.stickyBottom, { paddingBottom: 24 }]}>
          <ScaleBtn
            style={[s.continueBtn, count === 0 && s.continueBtnDisabled]}
            pressedStyle={{ backgroundColor: '#3D6E8F' }}
            onPress={() => {
              if (startPath === 'people') setStep(2);
              else setStep(6);
            }}
            disabled={count === 0}
          >
            <Text style={[s.continueBtnText, count === 0 && s.continueBtnTextDisabled]}>
              {count === 0 ? 'Continue' : `Continue with ${count} friend${count !== 1 ? 's' : ''}`}
            </Text>
          </ScaleBtn>
        </View>
      </View>
    );
  };

  // ── Step 6: Best times ──────────────────────────────────────────────────────
  const renderTimes = () => (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.vibeHeading}>Best times for everyone</Text>
        <Text style={[s.stepSub, { marginTop: 6, marginBottom: 20 }]}>Based on your group's availability</Text>
        <View style={s.listGap}>
          {TIME_SLOTS.map(slot => {
            const sel = timeSlot === slot.id;
            return (
              <Pressable
                key={slot.id}
                style={({ pressed }) => [s.timeCard2, sel && s.timeCard2Selected, pressed && { opacity: 0.88 }]}
                onPress={() => setTimeSlot(slot.id)}
              >
                <View style={{ flex: 1 }}>
                  {slot.optimal && (
                    <View style={s.bestTimePill}>
                      <Text style={s.bestTimePillText}>Best time</Text>
                    </View>
                  )}
                  <Text style={s.timeCard2Main}>{slot.day}, {slot.date} · {slot.time}</Text>
                  <Text style={s.timeCard2Sub}>{slot.desc}</Text>
                </View>
                <View style={[s.radioOuter, sel && s.radioOuterSelected]}>
                  {sel && <View style={s.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable
        style={[s.circleNavBtn, { bottom: 24 }, !timeSlot && s.circleNavBtnDisabled]}
        onPress={next}
        disabled={!timeSlot}
      >
        <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  // ── Step 7: Plan details ────────────────────────────────────────────────────
  const renderDetails = () => (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.vibeHeading}>Name your plan</Text>

        <View style={[s.fieldGroup, { marginTop: 20 }]}>
          <Text style={s.fieldLabel}>Plan title</Text>
          <TextInput
            style={s.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Coffee at Cocoa Cinnamon..."
            placeholderTextColor="#B0B4BA"
          />
        </View>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>
            Description <Text style={{ color: Colors.naturalGrey, fontWeight: '400' }}>(optional)</Text>
          </Text>
          <TextInput
            style={[s.textInput, s.textArea]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Add any details for your crew..."
            placeholderTextColor="#B0B4BA"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* RSVP threshold */}
        <View style={s.thresholdSection}>
          <Text style={s.thresholdHeader}>How many people need to commit?</Text>
          <Text style={s.thresholdSub}>We'll notify you when you're ready to book</Text>

          <Pressable style={s.toggleRow} onPress={() => setSkipThreshold(v => !v)}>
            <Text style={s.toggleLabel}>Skip threshold — I'll book right away</Text>
            <Switch
              value={skipThreshold}
              onValueChange={setSkipThreshold}
              trackColor={{ false: '#E3E4E6', true: ACCENT }}
              thumbColor="#FFFFFF"
            />
          </Pressable>

          {!skipThreshold && (
            <>
              <View style={s.thresholdCard}>
                <Text style={s.thresholdCardLabel}>Minimum attendees</Text>
                <Stepper
                  value={minRsvp}
                  onDecrement={() => setMinRsvp(v => Math.max(1, v - 1))}
                  onIncrement={() => setMinRsvp(v => Math.min(maxCapacity, v + 1))}
                  min={1}
                  max={maxCapacity}
                />
              </View>

              <View style={s.thresholdCard}>
                <Text style={s.thresholdCardLabel}>Max capacity</Text>
                <Stepper
                  value={maxCapacity}
                  onDecrement={() => setMaxCapacity(v => Math.max(minRsvp, v - 1))}
                  onIncrement={() => setMaxCapacity(v => Math.min(50, v + 1))}
                  min={minRsvp}
                  max={50}
                />
              </View>

              <View style={s.thresholdCard}>
                <Text style={s.thresholdCardLabel}>RSVPs needed by</Text>
                <View style={s.deadlinePicker}>
                  <Pressable
                    onPress={() => setRsvpDeadlineIdx(i => Math.max(0, i - 1))}
                    disabled={rsvpDeadlineIdx === 0}
                    style={[st.stepperBtn, rsvpDeadlineIdx === 0 && st.stepperBtnDisabled]}
                  >
                    <Ionicons name="chevron-back" size={16} color={rsvpDeadlineIdx === 0 ? '#C0C4CA' : '#333333'} />
                  </Pressable>
                  <Text style={s.deadlineDate}>{RSVP_DEADLINES[rsvpDeadlineIdx]}</Text>
                  <Pressable
                    onPress={() => setRsvpDeadlineIdx(i => Math.min(RSVP_DEADLINES.length - 1, i + 1))}
                    disabled={rsvpDeadlineIdx === RSVP_DEADLINES.length - 1}
                    style={[st.stepperBtn, rsvpDeadlineIdx === RSVP_DEADLINES.length - 1 && st.stepperBtnDisabled]}
                  >
                    <Ionicons name="chevron-forward" size={16} color={rsvpDeadlineIdx === RSVP_DEADLINES.length - 1 ? '#C0C4CA' : '#333333'} />
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[s.stickyBottom, { paddingBottom: 24 }]}>
        <ScaleBtn
          style={[s.continueBtn, !title && s.continueBtnDisabled]}
          pressedStyle={{ backgroundColor: '#3D6E8F' }}
          onPress={next}
          disabled={!title}
        >
          <Text style={[s.continueBtnText, !title && s.continueBtnTextDisabled]}>Continue</Text>
        </ScaleBtn>
      </View>
    </View>
  );

  // ── Step 8: Card design ─────────────────────────────────────────────────────
const renderCardDesign = () => {
  const slot = TIME_SLOTS.find(t => t.id === timeSlot);
  const isLightEnvelope = envelopeColor === '#FCFCFC' || envelopeColor === '#F2C05A';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: 120, paddingHorizontal: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.cardDesignHeading, { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', marginBottom: 24 }]}>
          Design your invite
        </Text>
        
        <InvitePreviewCard 
          cardStyle={cardStyle}
          envelopeColor={envelopeColor}
          cardColor={cardColor}
          title={title}
          venue={venue}
          slot={slot}
          friends={friends}
          privacy={privacy}
        />

        <Text style={[s.customRowLabel, { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, color: '#8E8E93', marginTop: 32, marginBottom: 12 }]}>
          Sleeve Color
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 14, paddingVertical: 6 }}>
            {ENVELOPE_COLORS.map(col => (
              <Pressable
                key={col}
                onPress={() => setEnvelopeColor(col)}
                style={[
                  s.colorSwatch,
                  { backgroundColor: col, width: 40, height: 40, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
                  col === '#FCFCFC' && { borderWidth: 1, borderColor: '#E5E5EA' },
                  envelopeColor === col && { transform: [{ scale: 1.1 }], borderWidth: 2, borderColor: '#4A7FA5' },
                ]}
              />
            ))}
          </View>
        </ScrollView>

        <Text style={[s.customRowLabel, { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, color: '#8E8E93', marginBottom: 12 }]}>
          Card Color
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 14, paddingVertical: 6 }}>
            {CARD_COLORS.map(col => (
              <Pressable
                key={col}
                onPress={() => setCardColor(col)}
                style={[
                  s.colorSwatch,
                  { backgroundColor: col, width: 40, height: 40, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
                  col === '#FFFFFF' && { borderWidth: 1, borderColor: '#E5E5EA' },
                  cardColor === col && { transform: [{ scale: 1.1 }], borderWidth: 2, borderColor: '#4A7FA5' },
                ]}
              />
            ))}
          </View>
        </ScrollView>

        <Text style={[s.customRowLabel, { textTransform: 'uppercase', letterSpacing: 1, fontSize: 12, color: '#8E8E93', marginBottom: 16 }]}>
          Card Style
        </Text>
        <View style={[s.cardStyleRow, { flexDirection: 'row', gap: 12 }]}>
          {(['minimal', 'bold', 'photo'] as const).map(style => {
            const selStyle = cardStyle === style;
            const miniOnDark = style === 'bold' && !isLightEnvelope;
            return (
              <Pressable
                key={style}
                onPress={() => setCardStyle(style)}
                style={[{ flex: 1, alignItems: 'center' }]}
              >
                <View style={[
                  s.cardStyleMini,
                  { width: '100%', aspectRatio: 0.75, borderRadius: 12, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'flex-end', overflow: 'hidden' },
                  selStyle && { borderColor: '#007AFF', borderWidth: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
                  style === 'bold' && { backgroundColor: envelopeColor },
                ]}>
                  {style === 'photo' && venue?.image && (
                    <Image source={{ uri: venue.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  )}
                  {style === 'photo' && (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
                  )}
                  <View style={{ padding: 12, gap: 4, width: '100%' }}>
                    <View style={[s.miniLine, s.miniLineBold, { height: 4, borderRadius: 2, backgroundColor: miniOnDark || style === 'photo' ? '#FFF' : '#1A1A1A' }]} />
                    <View style={[s.miniLine, { height: 3, borderRadius: 1.5, backgroundColor: miniOnDark || style === 'photo' ? 'rgba(255,255,255,0.6)' : '#666', width: '80%' }]} />
                    <View style={[s.miniLine, { height: 3, borderRadius: 1.5, backgroundColor: miniOnDark || style === 'photo' ? 'rgba(255,255,255,0.6)' : '#666', width: '50%' }]} />
                  </View>
                </View>
                <Text style={[{ fontSize: 13, marginTop: 8, color: selStyle ? '#007AFF' : '#666', fontWeight: selStyle ? '600' : '400', fontFamily: 'Figtree' }]}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Pressable
        style={[s.circleNavBtn, { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 }]}
        onPress={next}
      >
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

  // ── Step 9: Envelope preview ─────────────────────────────────────────────────
  
  const renderEnvelopePreview = () => (
    <EnvelopePreview
      envelopeColor={envelopeColor}
      cardColor={cardColor}
      title={title}
      venue={venue}
      timeSlotId={timeSlot}
      friendIds={friends}
      privacy={privacy}
      tabBarHeight={TAB_BAR_HEIGHT}
      onSend={() => setStep(10)}
      onEdit={() => setStep(8)}
      cardStyle={cardStyle}
    />
  );

  // ── Step 10: Share plan ──────────────────────────────────────────────────────
  const renderSharePlan = () => {
    const slot        = TIME_SLOTS.find(t => t.id === timeSlot);

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[s.content, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[s.vibeHeading, { marginBottom: 20 }]}>Share your plan</Text>

          <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 8 }}>
            <View style={[ep.sleeveContainer, { backgroundColor: '#F9F9FA' }]}>
              <View style={ep.animatedCardWrapper}>
                <InvitePreviewCard 
                  cardStyle={cardStyle}
                  envelopeColor={envelopeColor}
                  cardColor={cardColor}
                  title={title}
                  venue={venue}
                  slot={slot}
                  friends={friends}
                  privacy={privacy}
                />
              </View>
              <View style={[ep.pocketBack, { backgroundColor: envelopeColor }]} />
              <View style={[ep.pocketFront, { backgroundColor: envelopeColor }]} />
            </View>
          </View>

          <View style={{ gap: 16, marginTop: -4 }}>
            <ScaleBtn
              style={s.shareBlyssBtn}
              onPress={() => setShareVisible(true)}
            >
              <Ionicons name="paper-plane-outline" size={20} color={Colors.white} />
              <Text style={s.shareBlyssBtnText}>Send to friends on Blyss</Text>
            </ScaleBtn>

            <View style={s.shareIconRow}>
              <Pressable
                style={({ pressed }) => [s.shareIconButton, pressed && { opacity: 0.8 }]}
                onPress={() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2200);
                }}
              >
                <Ionicons name={linkCopied ? "checkmark" : "link-outline"} size={24} color={ACCENT} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [s.shareIconButton, pressed && { opacity: 0.8 }]}
                onPress={() =>
                  Share.share({
                    message: `You're invited! Join ${title || venue?.name || 'our plan'} on Blyss.`,
                  })
                }
              >
                <Ionicons name="share-outline" size={24} color={ACCENT} />
              </Pressable>
            </View>
          </View>

          <Text style={s.shareLiveNote}>
            Your plan is live. Friends will be notified when they're invited.
          </Text>
        </ScrollView>

      <View style={[s.stickyBottom, { paddingBottom: 24 }]}>
          <ScaleBtn
            style={[s.continueBtn, { backgroundColor: '#E8F2F8' }]}
            pressedStyle={{ backgroundColor: '#D4E4F0' }}
            onPress={() => { resetFlow(); router.replace('/(tabs)/explore'); }}
          >
            <Text style={[s.continueBtnText, { color: '#375169', fontWeight: '600' }]}>Done</Text>
          </ScaleBtn>
        </View>

        <ShareSheet
          visible={shareVisible}
          onClose={() => setShareVisible(false)}
          type="event"
          id={venue?.venue_id || 'new-event'}
        />
      </View>
    );
  };

  // ── Step 11: Payment (reached via other flows) ────────────────────────────────
  const renderPayment = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
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
      <View style={[s.stickyBottom, { paddingBottom: 24 }]}>
        <ScaleBtn
          style={[s.continueBtn, !payment && s.continueBtnDisabled]}
          pressedStyle={{ backgroundColor: '#3D6E8F' }}
          onPress={next}
          disabled={!payment}
        >
          <Text style={[s.continueBtnText, !payment && s.continueBtnTextDisabled]}>Continue</Text>
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

      <ScaleBtn style={s.confirmBtn} pressedStyle={{ backgroundColor: '#3D6E8F' }} onPress={() => { resetFlow(); router.replace('/(tabs)/explore'); }}>
        <Text style={s.confirmBtnText}>Back to Home</Text>
      </ScaleBtn>
      <ScaleBtn style={s.planAnotherBtn} pressedStyle={{ opacity: 0.7 }} onPress={resetFlow}>
        <Text style={s.planAnotherText}>Plan Another Event</Text>
      </ScaleBtn>
    </View>
  );

  const steps: Record<number, () => React.ReactNode> = {
    1: renderStart,
    2: renderCategory,
    3: renderVenue,
    4: renderPrivacy,
    5: renderFriends,
    6: renderTimes,
    7: renderDetails,
    8: renderCardDesign,
    9: renderEnvelopePreview,
    10: renderSharePlan,
    11: renderPayment,
    12: renderConfirmation,
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {step < 10 && <StepHeader step={step} total={TOTAL_STEPS - 1} onBack={back} />}
      {steps[step]?.()}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },

  // Header
  headerWrap: { backgroundColor: Colors.screenBackground },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 14,
  },
  backBtn: { width: 24, height: 24, justifyContent: 'center' },
  progressBarContainer: { flex: 1 },
  progressBarBackground: {
    height: 7,
    borderRadius: 7,
    backgroundColor: '#E3E4E6',
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    borderRadius: 7,
    overflow: 'hidden',
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
  friendsHeaderSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
    backgroundColor: Colors.screenBackground,
  },
  friendSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  friendSearchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    padding: 0,
  },
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
  friendRowSelected: { borderColor: ACCENT, backgroundColor: '#E8F2F8' },
  friendAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  friendAvatarSelected: { backgroundColor: '#4A7FA5' },
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

  // Time card v2
  timeCard2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    padding: 16,
  },
  timeCard2Selected: { borderColor: ACCENT, backgroundColor: '#E8F2F8' },
  bestTimePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF5FB',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  bestTimePillText: { fontSize: 11, fontWeight: '700', color: ACCENT, letterSpacing: 0.2 },
  timeCard2Row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeCard2Main: { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 3 },
  timeCard2Sub: { fontSize: 13, color: Colors.naturalGrey },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C0C4CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: ACCENT },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT },

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

  // RSVP threshold
  thresholdSection: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  thresholdHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  thresholdSub: {
    fontSize: 13,
    color: Colors.naturalGrey,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: Colors.black, flex: 1, marginRight: 12 },
  thresholdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  thresholdCardLabel: { fontSize: 14, fontWeight: '500', color: Colors.black },
  deadlinePicker: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deadlineDate: { fontSize: 14, fontWeight: '600', color: Colors.black, minWidth: 80, textAlign: 'center' },

  // Sticky bottom
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.screenBackground,
  },
  continueBtn: {
    backgroundColor: ACCENT,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnDisabled: { backgroundColor: '#E3E4E6' },
  continueBtnText: { fontSize: 15, fontWeight: '500', color: Colors.white },
  continueBtnTextDisabled: { color: '#A0A4A8' },

  // Floating circle nav button (browse screens)
  circleNavBtn: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PLAN_BTN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  circleNavBtnDisabled: { backgroundColor: '#B8D9EC' },

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
  planAnotherBtn: { width: '100%', alignItems: 'center', paddingVertical: 14 },
  planAnotherText: { fontSize: 15, fontWeight: '600', color: ACCENT },

  // Card design screen
  cardDesignHeading: {
    fontSize: 32,
    fontFamily: 'Figtree_700Bold',
    color: '#333333',
    letterSpacing: -0.6,
    marginBottom: 20,
  },
  customRowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B8F94',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchLight: {
    borderWidth: 1.5,
    borderColor: '#E3E4E6',
  },
  colorSwatchRing: {
    shadowColor: '#5BA8D3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
    borderWidth: 3,
    borderColor: '#5BA8D3',
    transform: [{ scale: 1.12 }],
  },
  cardStyleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardStyleOption: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  cardStyleOptionSelected: {},
  cardStyleMini: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 10,
    backgroundColor: '#FCFCFC',
    borderWidth: 2,
    borderColor: '#E3E4E6',
    overflow: 'hidden',
  },
  miniLine: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D0D3D6',
    width: '80%',
  },
  miniLineBold: {
    height: 8,
    width: '90%',
    backgroundColor: '#333333',
    marginBottom: 2,
  },
  cardStyleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B8F94',
  },

  // Vibe category screen
  vibeHeading: {
    fontSize: 24,
    fontFamily: 'Figtree_700Bold',
    color: '#333333',
    letterSpacing: -0.4,
  },
  vibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  vibeRowSelected: {
    backgroundColor: '#E8F2F8',
    borderColor: '#4A7FA5',
  },
  vibeRowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  vibeRowLabelSelected: {
    color: '#4A7FA5',
  },

  // Start screen
  startHeading: {
    fontSize: 24,
    fontFamily: 'Figtree_700Bold',
    color: '#333333',
    letterSpacing: -0.4,
  },
  startCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  startIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTextWrap: { flex: 1 },
  startLabel: { fontSize: 16, fontFamily: 'Figtree_700Bold', color: Colors.black, marginBottom: 3 },
  startSub: { fontSize: 14, color: Colors.naturalGrey, lineHeight: 20 },

  // Share plan screen
  shareBlyssBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#375169',
    borderRadius: 14,
    height: 52,
  },
  shareBlyssBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  shareIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  shareIconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF5FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLiveNote: {
    fontSize: 13,
    color: Colors.naturalGrey,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 24,
    paddingHorizontal: 8,
  },
});
