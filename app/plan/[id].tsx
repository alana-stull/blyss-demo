import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

type PlanStatus = 'draft' | 'proposed' | 'ready' | 'confirmed' | 'expired';

type Plan = {
  id: string;
  title: string;
  venue: string;
  neighborhood: string;
  date: string;
  time: string;
  image: string;
  status: PlanStatus;
  guests: string[];
  rsvpCount?: number;
  rsvpThreshold?: number;
  rsvpDeadline?: string;
  confirmationNumber?: string;
  platform?: string;
};

const MOCK_PLANS: Record<string, Plan> = {
  '1': {
    id: '1',
    title: 'Sunset tapas on the patio',
    venue: 'Café Lumière',
    neighborhood: 'Downtown',
    date: 'Fri, Jun 20',
    time: '8:00 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    status: 'draft',
    guests: ['Maya R.', 'Alex T.', 'Sam L.', 'Jordan F.'],
  },
  '2': {
    id: '2',
    title: 'Rooftop dinner with the crew',
    venue: 'The Ember Room',
    neighborhood: 'East Village',
    date: 'Sat, Jun 22',
    time: '7:30 PM',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    status: 'proposed',
    guests: ['Maya R.', 'Alex T.', 'Sam L.', 'Jordan F.', 'Nina P.'],
    rsvpCount: 2,
    rsvpThreshold: 5,
    rsvpDeadline: 'Thu, Jun 20',
  },
  '3': {
    id: '3',
    title: 'Late-night sushi run',
    venue: 'Lotus & Co.',
    neighborhood: 'Warehouse District',
    date: 'Sun, Jun 23',
    time: '10:45 PM',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    status: 'ready',
    guests: ['Maya R.', 'Alex T.', 'Sam L.', 'Jordan F.', 'Nina P.', 'Theo K.'],
  },
  '4': {
    id: '4',
    title: 'Saturday brunch + live music',
    venue: 'Riverbend Hall',
    neighborhood: 'Old Market',
    date: 'Sat, Jun 29',
    time: '11:00 AM',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80',
    status: 'confirmed',
    guests: ['Maya R.', 'Alex T.', 'Sam L.', 'Jordan F.', 'Nina P.', 'Theo K.', 'Lena B.'],
    confirmationNumber: 'RD-90213',
    platform: 'VenueDirect',
  },
  '5': {
    id: '5',
    title: 'Sunday gallery opening',
    venue: 'Art House',
    neighborhood: 'Riverfront',
    date: 'Sun, May 11',
    time: '6:00 PM',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    status: 'expired',
    guests: ['Maya R.', 'Alex T.', 'Sam L.'],
  },
};

const STATUS_CONFIG: Record<PlanStatus, { color: string; textColor: string }> = {
  draft: { color: Colors.lightGrey, textColor: Colors.black },
  proposed: { color: Colors.accent, textColor: Colors.black },
  ready: { color: Colors.primaryBlue, textColor: Colors.white },
  confirmed: { color: Colors.deepSlate, textColor: Colors.white },
  expired: { color: Colors.naturalGrey, textColor: Colors.white },
};

function getStatusText(plan: Plan) {
  switch (plan.status) {
    case 'draft':
      return 'Draft · Not shared yet';
    case 'proposed':
      return `Waiting for RSVPs · ${plan.rsvpCount ?? 0} of ${plan.rsvpThreshold ?? 0} needed · Due ${plan.rsvpDeadline ?? ''}`;
    case 'ready':
      return 'Your crew is in! Time to secure it.';
    case 'confirmed':
      return "It's happening. See you there.";
    case 'expired':
      return 'This plan expired. What do you want to do?';
  }
}

export default function PlanDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const plan = id && MOCK_PLANS[id] ? MOCK_PLANS[id] : MOCK_PLANS['1'];
  const statusStyle = STATUS_CONFIG[plan.status];
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const visibleGuests = plan.guests.slice(0, 4);
  const extraGuests = plan.guests.length - visibleGuests.length;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />

      <View style={[s.topNav, { top: insets.top + 12 }]}>  
        <Pressable
          style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.72 }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.black} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.72 }]}
          onPress={() => setMenuOpen(true)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.black} />
        </Pressable>
      </View>

      <View style={s.hero}>  
        <Image source={{ uri: plan.image }} style={s.heroImage} resizeMode="cover" />
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 188 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.planTitle}>{plan.title}</Text>

        <View style={s.infoRow}>
          <Ionicons name="location-outline" size={16} color={Colors.primaryBlue} />
          <Text style={s.infoText}>{plan.venue} · {plan.neighborhood}</Text>
        </View>

        <View style={s.infoRow}>
          <Ionicons name="time-outline" size={16} color={Colors.primaryBlue} />
          <Text style={s.infoText}>{plan.date} · {plan.time}</Text>
        </View>

        <Pressable style={s.guestRow} onPress={() => setGuestModalOpen(true)}>
          <View style={s.avatarStack}>
            {visibleGuests.map((guest, index) => (
              <View key={guest} style={[s.avatarBubble, { left: index * 28, zIndex: visibleGuests.length - index }]}> 
                <Text style={s.avatarInitials}>{guest.split(' ').map(part => part[0]).join('').slice(0, 2)}</Text>
              </View>
            ))}
            {extraGuests > 0 && (
              <View style={[s.avatarBubble, s.moreBubble, { left: visibleGuests.length * 28, zIndex: 0 }]}> 
                <Text style={s.moreText}>+{extraGuests}</Text>
              </View>
            )}
          </View>
          <View style={s.guestLabelWrap}>
            <Text style={s.guestLabel}>{plan.guests.length} guest{plan.guests.length !== 1 ? 's' : ''}</Text>
            <Text style={s.guestHint}>Tap to expand</Text>
          </View>
        </Pressable>

        <View style={[s.statusBanner, { backgroundColor: statusStyle.color }]}> 
          <Text style={[s.statusText, { color: statusStyle.textColor }]}>{getStatusText(plan)}</Text>
        </View>

        {plan.status === 'proposed' && (
          <View style={s.progressSection}>
            <View style={s.progressBarBackground}>
              <View
                style={[s.progressBarFill, {
                  width: `${Math.min(100, Math.round(((plan.rsvpCount ?? 0) / (plan.rsvpThreshold ?? 1)) * 100))}%`,
                  backgroundColor: Colors.accent,
                }]}
              />
            </View>
            <Text style={s.progressLabel}>{plan.rsvpCount ?? 0} of {plan.rsvpThreshold ?? 0} RSVPs needed</Text>
          </View>
        )}

        {plan.status === 'confirmed' && plan.confirmationNumber && (
          <View style={s.confirmationRow}>
            <View style={s.confirmationIconWrap}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
            </View>
            <View style={s.confirmationTextWrap}>
              <Text style={s.confirmationHeading}>Booking confirmed</Text>
              <Text style={s.confirmationMeta}>#{plan.confirmationNumber} · {plan.platform}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[s.bottomActions, { paddingBottom: insets.bottom + 16 }]}> 
        {plan.status === 'draft' && (
          <Pressable style={s.primaryButton} onPress={() => { /* continue setup */ }}>
            <Text style={s.primaryButtonText}>Continue setting up</Text>
          </Pressable>
        )}

        {plan.status === 'proposed' && (
          <View style={s.buttonRow}>
            <Pressable style={s.outlineButton} onPress={() => { /* remind friends */ }}>
              <Text style={s.outlineButtonText}>Remind friends</Text>
            </Pressable>
            <Pressable style={s.primaryButton} onPress={() => { /* book anyway */ }}>
              <Text style={s.primaryButtonText}>Book anyway</Text>
            </Pressable>
          </View>
        )}

        {plan.status === 'ready' && (
          <Pressable style={s.secondaryButton} onPress={() => { /* book */ }}>
            <Text style={s.secondaryButtonText}>Continue to Book</Text>
          </Pressable>
        )}

        {plan.status === 'confirmed' && (
          <Pressable style={s.outlineButton} onPress={() => { /* share plan */ }}>
            <Text style={s.outlineButtonText}>Share plan</Text>
          </Pressable>
        )}

        {plan.status === 'expired' && (
          <View style={s.buttonRow}>
            <Pressable style={s.outlineButton} onPress={() => { /* extend deadline */ }}>
              <Text style={s.outlineButtonText}>Extend deadline</Text>
            </Pressable>
            <Pressable style={[s.outlineButton, s.cancelOutlineButton]} onPress={() => { /* cancel plan */ }}>
              <Text style={[s.outlineButtonText, { color: Colors.naturalGrey }]}>Cancel plan</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={s.menuCard}>
            {['Edit plan details', 'Edit venue', 'Change time', 'Edit guest list', 'Cancel plan'].map(option => (
              <Pressable
                key={option}
                style={({ pressed }) => [s.menuOption, pressed && { opacity: 0.7 }]}
                onPress={() => setMenuOpen(false)}
              >
                <Text style={s.menuOptionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={guestModalOpen} transparent animationType="slide" onRequestClose={() => setGuestModalOpen(false)}>
        <Pressable style={s.modalBackdrop} onPress={() => setGuestModalOpen(false)}>
          <View style={s.guestModalCard}>
            <Text style={s.modalTitle}>Who&apos;s invited</Text>
            {plan.guests.map(guest => (
              <View key={guest} style={s.guestRowItem}>
                <Text style={s.guestName}>{guest}</Text>
              </View>
            ))}
            <Pressable style={s.closeModalButton} onPress={() => setGuestModalOpen(false)}>
              <Text style={s.closeModalButtonText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  topNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  hero: {
    height: 200,
    backgroundColor: Colors.secondaryBlue,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  planTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Figtree_700Bold',
    color: Colors.black,
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    color: Colors.primaryBlue,
    fontSize: 15,
    fontWeight: '600',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginTop: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    width: 140,
    height: 40,
  },
  avatarBubble: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarInitials: {
    color: Colors.white,
    fontWeight: '700',
  },
  moreBubble: {
    backgroundColor: Colors.lightGrey,
  },
  moreText: {
    color: Colors.black,
    fontWeight: '700',
  },
  guestLabelWrap: {
    flex: 1,
    marginLeft: 12,
  },
  guestLabel: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: '700',
  },
  guestHint: {
    fontSize: 13,
    color: Colors.naturalGrey,
    marginTop: 2,
  },
  statusBanner: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginTop: 20,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 14,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    borderRadius: 999,
    backgroundColor: Colors.lightGrey,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.naturalGrey,
  },
  confirmationRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: Colors.deepSlate,
  },
  confirmationIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  confirmationTextWrap: {
    flex: 1,
  },
  confirmationHeading: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  confirmationMeta: {
    color: '#D4E4F0',
    fontSize: 13,
  },
  bottomActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.offWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: Colors.deepSlate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  outlineButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  outlineButtonText: {
    color: Colors.primaryBlue,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelOutlineButton: {
    borderColor: Colors.naturalGrey,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuOption: {
    paddingVertical: 16,
  },
  menuOptionText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '600',
  },
  guestModalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '62%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 14,
  },
  guestRowItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  guestName: {
    fontSize: 15,
    color: Colors.black,
  },
  closeModalButton: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
