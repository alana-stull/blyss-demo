import { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image, ScrollView, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_FRIENDS = [
  { id: '1', name: 'Maya Robinson', initials: 'MR' },
  { id: '2', name: 'Jordan Smith', initials: 'JS' },
  { id: '3', name: 'Alex Thompson', initials: 'AT' },
  { id: '4', name: 'Sam Lewis', initials: 'SL' },
  { id: '5', name: 'Priya Patel', initials: 'PP' },
  { id: '6', name: 'Marcus Webb', initials: 'MW' },
  { id: '7', name: 'Casey Williams', initials: 'CW' },
];

const PLANNED = [
  {
    id: 'event-upcoming-1',
    title: 'Trivia Tuesday at Ponysaurus',
    venue: 'Ponysaurus Brewing',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    ]
  },
  {
    id: 'event-update-1',
    title: 'Rooftop Mixer',
    venue: 'The Durham Hotel',
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    ]
  }
];

export default function FriendsListScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<'friends' | 'planned'>(tab === 'planned' ? 'planned' : 'friends');
  const scrollRef = useRef<ScrollView>(null);
  const [selectedFriend, setSelectedFriend] = useState<typeof MOCK_FRIENDS[0] | null>(null);

  useEffect(() => {
    if (tab === 'planned') {
      setActiveTab('planned');
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: width, animated: false });
      }, 0);
    } else {
      setActiveTab('friends');
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }, 0);
    }
  }, [tab]);

  function scrollTo(index: number) {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveTab(index === 0 ? 'friends' : 'planned');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.black} />
        </Pressable>
        <Text style={s.title}>Alana Stull</Text>
        <View style={s.backBtn} />
      </View>

      <View style={s.topNav}>
        <Pressable style={s.navItem} onPress={() => scrollTo(0)}>
          <Text style={[s.navText, activeTab === 'friends' && s.navTextActive]}>Friends</Text>
          {activeTab === 'friends' && <View style={s.navIndicator} />}
        </Pressable>
        <Pressable style={s.navItem} onPress={() => scrollTo(1)}>
          <Text style={[s.navText, activeTab === 'planned' && s.navTextActive]}>Planned</Text>
          {activeTab === 'planned' && <View style={s.navIndicator} />}
        </Pressable>
        <Pressable style={s.navItem} onPress={() => router.push('/journal')}>
          <Text style={s.navText}>Attended</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveTab(page === 0 ? 'friends' : 'planned');
        }}
      >
        <View style={{ width }}>
          <FlatList
            data={MOCK_FRIENDS}
            keyExtractor={item => item.id}
            contentContainerStyle={s.listContent}
            renderItem={({ item }) => (
              <View style={s.row}>
                <View style={s.avatar}><Text style={s.initials}>{item.initials}</Text></View>
                <View style={s.info}>
                  <Text style={s.name}>{item.name}</Text>
                </View>
                <View style={s.actions}>
                  <Pressable style={s.messageBtn} onPress={() => router.push('/chat')}>
                    <Text style={s.messageBtnText}>Message</Text>
                  </Pressable>
                  <Pressable style={s.removeBtn} onPress={() => setSelectedFriend(item)}>
                    <X size={16} color={Colors.black} />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>

        <View style={{ width }}>
          <FlatList
            data={PLANNED}
            keyExtractor={item => item.id}
            contentContainerStyle={s.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [s.plannedCard, pressed && { opacity: 0.95 }]}
                onPress={() => router.push({ pathname: '/event-detail', params: { id: item.id } })}
              >
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardVenue}>{item.venue}</Text>
                <View style={s.avatarStack}>
                  {item.avatars.map((uri, i) => (
                    <Image key={i} source={{ uri }} style={[s.stackAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }]} />
                  ))}
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>

      <Modal visible={!!selectedFriend} transparent animationType="fade" onRequestClose={() => setSelectedFriend(null)}>
        <View style={s.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedFriend(null)} />
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <View style={s.modalAvatarLg}>
                <Text style={s.modalInitialsLg}>{selectedFriend?.initials}</Text>
              </View>
              <Text style={s.modalTitle}>Remove {selectedFriend?.name}?</Text>
              <Text style={s.modalSub}>Blyss won't tell them they were removed from your friends.</Text>
            </View>
            <View style={s.modalButtons}>
              <Pressable style={s.modalRemoveBtn} onPress={() => setSelectedFriend(null)}>
                <Text style={s.modalRemoveText}>Remove</Text>
              </Pressable>
              <Pressable style={s.modalCancelBtn} onPress={() => setSelectedFriend(null)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.screenBackground },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.black },
  
  topNav: { flexDirection: 'row', backgroundColor: Colors.screenBackground },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 14, position: 'relative' },
  navText: { fontSize: 15, fontWeight: '600', color: Colors.naturalGrey },
  navTextActive: { color: '#375169' },
  navIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#375169' },
  
  listContent: { padding: 16 },
  
  // Friends
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.lightGrey },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 16, fontWeight: '700', color: '#4A7FA5' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', color: Colors.black },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  messageBtn: { backgroundColor: '#F0F1F3', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  messageBtnText: { fontSize: 13, fontWeight: '600', color: Colors.black },
  removeBtn: { width: 32, height: 32, backgroundColor: '#F0F1F3', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  
  // Planned
  plannedCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: Colors.lightGrey, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: Colors.primaryBlue, marginBottom: 6 },
  cardVenue: { fontSize: 14, color: Colors.naturalGrey, marginBottom: 14 },
  avatarStack: { flexDirection: 'row' },
  stackAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.white },
  
  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 32, paddingTop: 24, paddingHorizontal: 24, alignItems: 'center' },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  modalAvatarLg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EBF5FB', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalInitialsLg: { fontSize: 24, fontWeight: '700', color: '#4A7FA5' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.black, marginBottom: 8, textAlign: 'center' },
  modalSub: { fontSize: 14, color: Colors.naturalGrey, textAlign: 'center', lineHeight: 20 },
  modalButtons: { width: '100%', gap: 12 },
  modalRemoveBtn: { width: '100%', paddingVertical: 16, backgroundColor: '#FFEBEB', borderRadius: 12, alignItems: 'center' },
  modalRemoveText: { fontSize: 16, fontWeight: '600', color: '#D4183D' },
  modalCancelBtn: { width: '100%', paddingVertical: 16, backgroundColor: '#F0F1F3', borderRadius: 12, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '600', color: Colors.black },
});