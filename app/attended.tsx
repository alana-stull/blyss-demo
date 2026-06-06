import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Clock } from 'lucide-react-native';
import { MOCK_JOURNAL } from '@/lib/store';
import { VENUES } from '@/lib/venues';
import { Colors } from '@/constants/Colors';

type AttendedItem = {
  id: string;
  venueName: string;
  venueId: string;
  date: string;
  note: string;
  with_who: string[];
  rating: number;
  image: string;
  subcategory: string;
};

function parseDate(iso: string) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return {
    month: months[d.getMonth()],
    day:   String(d.getDate()),
    dow:   days[d.getDay()],
  };
}

const ITEMS: AttendedItem[] = MOCK_JOURNAL.map(entry => {
  const venue = VENUES.find(v => v.venue_id === entry.venue_id);
  return {
    id:          entry.id,
    venueName:   entry.venue_name,
    venueId:     entry.venue_id,
    date:        entry.date,
    note:        entry.note ?? '',
    with_who:    entry.with_who ?? [],
    rating:      entry.rating ?? 0,
    image:       venue?.image ?? '',
    subcategory: venue?.subcategory ?? '',
  };
});

function AttendedCard({ item }: { item: AttendedItem }) {
  const { month, day, dow } = parseDate(item.date);
  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]}
      onPress={() => router.push(`/venue/${item.venueId}`)}
    >
      <View style={s.dateBlock}>
        <Text style={s.dateMonth}>{month.toUpperCase()}</Text>
        <Text style={s.dateDay}>{day}</Text>
        <Text style={s.dateDow}>{dow.toUpperCase()}</Text>
      </View>
      <View style={s.divider} />
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={s.venueName} numberOfLines={1}>{item.venueName}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MapPin size={11} strokeWidth={2} color="#8B8F94" />
          <Text style={s.meta} numberOfLines={1}>{item.subcategory}</Text>
        </View>
        {item.note ? (
          <Text style={s.note} numberOfLines={2}>{item.note}</Text>
        ) : null}
        {item.with_who.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            {item.with_who.slice(0, 3).map((name, i) => (
              <View key={i} style={s.attendeeCircle}>
                <Text style={s.attendeeInitial}>{name[0]}</Text>
              </View>
            ))}
            <Text style={[s.meta, { marginLeft: 4 }]}>
              {item.with_who.length === 1
                ? `with ${item.with_who[0]}`
                : `with ${item.with_who.slice(0, 2).join(', ')}${item.with_who.length > 2 ? ' +' + (item.with_who.length - 2) : ''}`}
            </Text>
          </View>
        )}
        {item.rating > 0 && (
          <Text style={s.rating}>{'★'.repeat(item.rating)}</Text>
        )}
      </View>
    </Pressable>
  );
}

export default function AttendedScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} strokeWidth={1.75} color={Colors.black} />
        </Pressable>
        <Text style={s.title}>Attended</Text>
        <View style={s.backBtn} />
      </View>

      <FlatList
        data={ITEMS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AttendedCard item={item} />}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Clock size={48} strokeWidth={1.5} color="#E3E4E6" />
            <Text style={s.emptyText}>No attended events yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.screenBackground },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 17, fontWeight: '700', color: Colors.black },
  list:    { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 12 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: Colors.white, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10, shadowRadius: 10, elevation: 4,
    padding: 16,
  },
  dateBlock: { width: 40, alignItems: 'center', gap: 1, paddingTop: 2 },
  dateMonth: { fontSize: 9, fontWeight: '600', color: '#8B8F94', letterSpacing: 0.5 },
  dateDay:   { fontSize: 22, fontWeight: '600', color: '#375169', lineHeight: 26 },
  dateDow:   { fontSize: 9, fontWeight: '500', color: '#8B8F94', letterSpacing: 0.5 },
  divider:   { width: 1, alignSelf: 'stretch', backgroundColor: '#E3E4E6' },

  venueName: { fontSize: 15, fontWeight: '700', color: '#333333' },
  meta:      { fontSize: 11.5, color: '#8B8F94', flexShrink: 1 },
  note:      { fontSize: 13, color: Colors.naturalGrey, fontStyle: 'italic', lineHeight: 18 },
  rating:    { fontSize: 13, color: '#F5A623' },

  attendeeCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#E8F0F5', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  attendeeInitial: { fontSize: 9, fontWeight: '700', color: Colors.primaryBlue },

  empty:     { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.naturalGrey },
});
