import { useState, useEffect, useRef } from 'react';
import {
  View, Text, Modal, Pressable, ScrollView, StyleSheet,
  Animated, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, Check } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// ─── Mock share targets ───────────────────────────────────────────────────────

const FRIENDS = [
  { id: 'maya-r',   name: 'Maya R.',   initials: 'MR', bg: '#9FE1CB', fg: '#085041' },
  { id: 'jordan-s', name: 'Jordan S.', initials: 'JS', bg: '#F5C4B3', fg: '#712B13' },
  { id: 'kai-p',    name: 'Kai P.',    initials: 'KP', bg: '#C5D4E0', fg: '#2C4A5E' },
  { id: 'tara-r',   name: 'Tara R.',   initials: 'TR', bg: '#B7D3E0', fg: '#375169' },
];

const GROUPS = [
  { id: 'pt1', name: 'Trivia Tuesday at Ponysaurus' },
  { id: 'pt2', name: 'Saturday slow brunch' },
];

type ShareTarget = { id: string; name: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  type: 'post' | 'venue' | 'event';
  id: string;
};

// ─── Friend bubble (horizontal row) ──────────────────────────────────────────

function FriendBubble({ friend, selected, onPress }: {
  friend: typeof FRIENDS[number]; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [s.friendBubble, pressed && { opacity: 0.75 }]} onPress={onPress}>
      <View style={[s.friendAvatarWrap, selected && s.friendAvatarSelected]}>
        <View style={[s.friendAvatar, { backgroundColor: friend.bg }]}>
          <Text style={[s.friendInitials, { color: friend.fg }]}>{friend.initials}</Text>
        </View>
        {selected && (
          <View style={s.friendCheck}>
            <Check size={10} strokeWidth={2.5} color={Colors.white} />
          </View>
        )}
      </View>
      <Text style={s.friendName} numberOfLines={1}>{friend.name.split(' ')[0]}</Text>
    </Pressable>
  );
}

// ─── Group row (vertical list) ────────────────────────────────────────────────

function GroupRow({ group, selected, onPress }: {
  group: typeof GROUPS[number]; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [s.groupRow, pressed && { opacity: 0.75 }]} onPress={onPress}>
      <View style={s.groupAvatar}>
        <CalendarDays size={18} strokeWidth={1.5} color="#375169" />
      </View>
      <Text style={s.groupLabel} numberOfLines={1}>{group.name}</Text>
      <View style={[s.selCircle, selected && s.selCircleFilled]}>
        {selected && <Check size={12} strokeWidth={2.5} color={Colors.white} />}
      </View>
    </Pressable>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ShareSheet({ visible, onClose, type, id }: Props) {
  const insets    = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(480)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query,    setQuery]    = useState('');

  useEffect(() => {
    if (visible) {
      setSelected(new Set());
      setQuery('');
      Animated.spring(slideAnim, { toValue: 0, bounciness: 0, speed: 20, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 480, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible]);

  function toggle(target: ShareTarget) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(target.id) ? next.delete(target.id) : next.add(target.id);
      return next;
    });
  }

  function handleSend() {
    console.log('share', { type, id, to: [...selected] });
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  }

  const q               = query.toLowerCase();
  const filteredFriends = FRIENDS.filter(f => f.name.toLowerCase().includes(q));
  const filteredGroups  = GROUPS.filter(g => g.name.toLowerCase().includes(q));
  const sendLabel       = selected.size > 1 ? `Send to ${selected.size}` : 'Send';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />

        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.handle} />
          <Text style={s.headerTitle}>Send to</Text>

          {/* Search */}
          <View style={s.searchBar}>
            <TextInput
              style={s.searchInput}
              placeholder="Search friends and groups..."
              placeholderTextColor="#8B8F94"
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
            {/* Friends — horizontal bubbles */}
            {filteredFriends.length > 0 && (
              <>
                <Text style={s.sectionLabel}>FRIENDS</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.friendsRow}
                >
                  {filteredFriends.map(f => (
                    <FriendBubble
                      key={f.id}
                      friend={f}
                      selected={selected.has(f.id)}
                      onPress={() => toggle(f)}
                    />
                  ))}
                </ScrollView>
              </>
            )}

            {/* Groups — vertical rows */}
            {filteredGroups.length > 0 && (
              <>
                <Text style={[s.sectionLabel, { marginTop: 16 }]}>GROUPS</Text>
                {filteredGroups.map(g => (
                  <GroupRow
                    key={g.id}
                    group={g}
                    selected={selected.has(g.id)}
                    onPress={() => toggle(g)}
                  />
                ))}
              </>
            )}

            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Send */}
          <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable
              style={[s.sendBtn, selected.size === 0 && s.sendBtnDisabled]}
              onPress={handleSend}
              disabled={selected.size === 0}
            >
              <Text style={s.sendBtnText}>{sendLabel}</Text>
            </Pressable>
          </View>

          {/* Toast */}
          <Animated.View style={[s.toast, { opacity: toastAnim }]} pointerEvents="none">
            <Text style={s.toastText}>Sent!</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay:  { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.38)' },

  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 10,
    maxHeight: '80%',
  },

  handle:      { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E3E4E6', alignSelf: 'center', marginBottom: 14 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333333', textAlign: 'center', marginBottom: 14 },

  searchBar: {
    marginHorizontal: 18, marginBottom: 6,
    backgroundColor: '#F0F1F3', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  searchInput: { fontSize: 14, color: Colors.black },

  scroll:       { flexGrow: 0 },
  sectionLabel: { fontSize: 10, fontWeight: '700', color: Colors.naturalGrey, letterSpacing: 1,
                  textTransform: 'uppercase', paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10 },

  // Friend bubbles
  friendsRow:        { paddingHorizontal: 14, paddingBottom: 4, gap: 6 },
  friendBubble:      { alignItems: 'center', width: 68 },
  friendAvatarWrap:  { marginBottom: 6, borderRadius: 30, padding: 2, borderWidth: 2, borderColor: 'transparent' },
  friendAvatarSelected: { borderColor: '#375169' },
  friendAvatar:      { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  friendInitials:    { fontSize: 17, fontWeight: '700' },
  friendCheck:       { position: 'absolute', bottom: 0, right: 0,
                       width: 18, height: 18, borderRadius: 9,
                       backgroundColor: '#375169', borderWidth: 1.5, borderColor: Colors.white,
                       alignItems: 'center', justifyContent: 'center' },
  friendName:        { fontSize: 12, color: Colors.black, textAlign: 'center' },

  // Group rows
  groupRow:    { flexDirection: 'row', alignItems: 'center', gap: 12,
                 paddingHorizontal: 18, height: 52,
                 borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  groupAvatar: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#E8F2F8',
                 alignItems: 'center', justifyContent: 'center' },
  groupLabel:  { flex: 1, fontSize: 15, color: Colors.black, fontWeight: '500' },

  selCircle:       { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#C8C9CB', alignItems: 'center', justifyContent: 'center' },
  selCircleFilled: { backgroundColor: '#375169', borderColor: '#375169' },

  footer:          { paddingHorizontal: 18, paddingTop: 12 },
  sendBtn:         { height: 48, borderRadius: 12, backgroundColor: '#375169', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText:     { fontSize: 16, fontWeight: '600', color: Colors.white },

  toast:     { position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center' },
  toastText: { backgroundColor: '#333333', color: Colors.white, fontSize: 14, fontWeight: '600',
               paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
});
