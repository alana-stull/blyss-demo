import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, PenSquare, Search, CalendarDays, ChevronLeft, Send, Info } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// ─── Mock thread data ─────────────────────────────────────────────────────────

const PLAN_THREADS = [
  { id: 'pt1', name: 'Trivia Tuesday at Ponysaurus', eventId: 'event-upcoming-1', preview: 'Jordan: everyone still good for 7?',   time: '2m',  unread: true,  badge: 3 },
  { id: 'pt2', name: 'Saturday slow brunch',          eventId: 'event-update-2',   preview: 'Alana W: Vin Rouge at 11, confirmed!', time: '1h',  unread: false },
  { id: 'pt3', name: 'Rooftop for the sunset',        eventId: 'event-update-1',   preview: 'Theo: just booked the table',          time: '3h',  unread: true,  badge: 1 },
];

const DM_THREADS = [
  { id: 'dm1', userId: 'maya-r',   name: 'Maya R.',   initials: 'MR', bg: '#9FE1CB', fg: '#085041', preview: 'omg have you been to Epilogue??',   time: '12m',       unread: true,  badge: 2 },
  { id: 'dm2', userId: 'jordan-s', name: 'Jordan S.', initials: 'JS', bg: '#F5C4B3', fg: '#712B13', preview: 'sent you a venue',                  time: 'Yesterday', unread: false },
  { id: 'dm3', userId: 'kai-p',    name: 'Kai P.',    initials: 'KP', bg: '#C5D4E0', fg: '#2C4A5E', preview: 'are we still doing topgolf or nah', time: 'Mon',       unread: false },
  { id: 'dm4', userId: 'tara-r',   name: 'Tara R.',   initials: 'TR', bg: '#B7D3E0', fg: '#375169', preview: 'last night was so fun honestly',    time: 'Sun',       unread: false },
];

// ─── Mock conversations ───────────────────────────────────────────────────────

type Msg = { id: string; text: string; sender: string; time: string };

const MOCK_CONVOS: Record<string, Msg[]> = {
  pt1: [
    { id: '1', sender: 'Jordan',  text: 'hey are we still doing trivia tonight?', time: '6:42 PM' },
    { id: '2', sender: 'me',      text: 'yes!! i got us a table',                 time: '6:44 PM' },
    { id: '3', sender: 'Theo',    text: 'omg perfect, what time should we meet?', time: '6:45 PM' },
    { id: '4', sender: 'me',      text: "let's say 6:45 to grab a drink first",  time: '6:47 PM' },
    { id: '5', sender: 'Jordan',  text: 'everyone still good for 7?',             time: '7:01 PM' },
  ],
  pt2: [
    { id: '1', sender: 'me',      text: 'okay so vin rouge or toast?',            time: '10:12 AM' },
    { id: '2', sender: 'Maya',    text: 'vin rouge, always',                      time: '10:14 AM' },
    { id: '3', sender: 'Alana W', text: 'Vin Rouge at 11, confirmed!',            time: '10:20 AM' },
  ],
  pt3: [
    { id: '1', sender: 'me',    text: 'who wants rooftop for the sunset friday?', time: '3:15 PM' },
    { id: '2', sender: 'Priya', text: "yes!! i'm in",                             time: '3:22 PM' },
    { id: '3', sender: 'me',    text: 'same, should we grab food after?',         time: '3:50 PM' },
    { id: '4', sender: 'Theo',  text: 'just booked the table',                    time: '4:01 PM' },
  ],
  dm1: [
    { id: '1', sender: 'Maya R.', text: 'omg have you been to Epilogue??',         time: '12:03 PM' },
    { id: '2', sender: 'me',      text: 'not yet but I keep seeing it everywhere', time: '12:10 PM' },
    { id: '3', sender: 'Maya R.', text: 'we need to go like this week',            time: '12:11 PM' },
  ],
  dm2: [
    { id: '1', sender: 'Jordan S.', text: 'sent you a venue',           time: 'Yesterday' },
    { id: '2', sender: 'me',        text: 'ooh this looks fun, when?',  time: 'Yesterday' },
  ],
  dm3: [
    { id: '1', sender: 'Kai P.', text: 'are we still doing topgolf or nah',  time: 'Mon' },
    { id: '2', sender: 'me',     text: 'think so, let me check with Jordan', time: 'Mon' },
  ],
  dm4: [
    { id: '1', sender: 'Tara R.', text: 'last night was so fun honestly',   time: 'Sun' },
    { id: '2', sender: 'me',      text: "right?? need to do that again",     time: 'Sun' },
    { id: '3', sender: 'Tara R.', text: 'already looking at next weekend',   time: 'Sun' },
  ],
};

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: '#C5D4E0', fg: '#2C4A5E' },
  { bg: '#9FE1CB', fg: '#085041' },
  { bg: '#F5C4B3', fg: '#712B13' },
  { bg: '#B7D3E0', fg: '#375169' },
  { bg: '#E8D9F5', fg: '#5B2D8E' },
  { bg: '#FDEACC', fg: '#7A4510' },
];

function getSenderAvatar(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  const { bg, fg } = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  return { bg, fg, initials };
}

function groupMessages(msgs: Msg[]): Msg[][] {
  const groups: Msg[][] = [];
  for (const msg of msgs) {
    const last = groups[groups.length - 1];
    if (last && last[0].sender === msg.sender) last.push(msg);
    else groups.push([msg]);
  }
  return groups;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveThread = {
  id: string;
  name: string;
  isGroup: boolean;
  eventId?: string;
  userId?: string;
  dmBg?: string;
  dmFg?: string;
  dmInitials?: string;
};

// ─── Conversation view ────────────────────────────────────────────────────────

function MsgAvatar({ bg, fg, initials }: { bg: string; fg: string; initials: string }) {
  return (
    <View style={[s.msgAvatar, { backgroundColor: bg }]}>
      <Text style={[s.msgAvatarText, { color: fg }]}>{initials}</Text>
    </View>
  );
}

function ConversationView({ thread, onBack }: { thread: ActiveThread; onBack: () => void }) {
  const messages = MOCK_CONVOS[thread.id] ?? [];
  const groups   = groupMessages(messages);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={s.convHeader}>
        <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]} onPress={onBack}>
          <ChevronLeft size={22} strokeWidth={2} color={Colors.black} />
        </Pressable>
        <Text style={s.convTitle} numberOfLines={1}>{thread.name}</Text>
        <Pressable
          style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}
          onPress={() => {
            if (thread.isGroup && thread.eventId) {
              router.push({ pathname: '/event-detail', params: { id: thread.eventId } });
            } else if (thread.userId) {
              router.push(`/user-profile/${thread.userId}`);
            }
          }}
        >
          <Info size={22} strokeWidth={2} color="#375169" />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.convScroll}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group, gi) => {
          const isMe = group[0].sender === 'me';
          const avatar = isMe ? null : thread.isGroup
            ? getSenderAvatar(group[0].sender)
            : { bg: thread.dmBg!, fg: thread.dmFg!, initials: thread.dmInitials! };

          return (
            <View key={gi} style={s.msgGroup}>
              {group.map((msg, mi) => {
                const isFirst = mi === 0;
                const isLast  = mi === group.length - 1;
                // Bubble shape: full radius except tail corner on last bubble
                const bubbleRadius = {
                  borderTopLeftRadius:     18,
                  borderTopRightRadius:    18,
                  borderBottomLeftRadius:  isMe ? 18 : isLast ? 4 : 18,
                  borderBottomRightRadius: isMe ? (isLast ? 4 : 18) : 18,
                };

                return (
                  <View
                    key={msg.id}
                    style={[s.msgRow, isMe ? s.msgRowMe : s.msgRowOther, { marginBottom: isLast ? 0 : 2 }]}
                  >
                    {/* Avatar slot (received only) */}
                    {!isMe && (
                      isLast
                        ? <MsgAvatar bg={avatar!.bg} fg={avatar!.fg} initials={avatar!.initials} />
                        : <View style={s.msgAvatarSpacer} />
                    )}

                    {/* Bubble + sender name */}
                    <View style={[s.bubbleCol, isMe && s.bubbleColMe]}>
                      {!isMe && isFirst && thread.isGroup && (
                        <Text style={s.msgSenderName}>{msg.sender}</Text>
                      )}
                      <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther, bubbleRadius]}>
                        <Text style={isMe ? s.msgTextMe : s.msgTextOther}>{msg.text}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Timestamp under the last bubble in each group */}
              <Text style={[s.msgTime, isMe ? s.msgTimeMe : s.msgTimeOther]}>
                {group[group.length - 1].time}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input bar */}
      <View style={s.inputBar}>
        <TextInput
          style={s.msgInput}
          placeholder="Message..."
          placeholderTextColor="#8B8F94"
          editable={false}
        />
        <View style={s.sendBtn}>
          <Send size={16} strokeWidth={2} color={Colors.white} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Thread list rows ─────────────────────────────────────────────────────────

function PlanThread({ item, onPress }: { item: typeof PLAN_THREADS[number]; onPress: () => void }) {
  return (
    <>
      <Pressable style={({ pressed }) => [s.row, pressed && { opacity: 0.75 }]} onPress={onPress}>
        <View style={s.avatarWrap}>
          <View style={s.planAvatar}>
            <CalendarDays size={20} strokeWidth={2} color="#375169" />
          </View>
          {item.unread && <View style={s.unreadDot} />}
        </View>
        <View style={s.threadBody}>
          <View style={s.threadTopRow}>
            <Text style={s.threadName} numberOfLines={1}>{item.name}</Text>
            <Text style={s.threadTime}>{item.time}</Text>
          </View>
          <View style={s.threadPreviewRow}>
            <Text style={[s.threadPreview, item.unread && s.threadPreviewUnread]} numberOfLines={1}>{item.preview}</Text>
            {item.unread && item.badge != null && (
              <View style={s.badge}><Text style={s.badgeText}>{item.badge}</Text></View>
            )}
          </View>
        </View>
      </Pressable>
      <View style={s.divider} />
    </>
  );
}

function DMThread({ item, onPress }: { item: typeof DM_THREADS[number]; onPress: () => void }) {
  return (
    <>
      <Pressable style={({ pressed }) => [s.row, pressed && { opacity: 0.75 }]} onPress={onPress}>
        <View style={s.avatarWrap}>
          <View style={[s.dmAvatar, { backgroundColor: item.bg }]}>
            <Text style={[s.dmInitials, { color: item.fg }]}>{item.initials}</Text>
          </View>
          {item.unread && <View style={s.unreadDot} />}
        </View>
        <View style={s.threadBody}>
          <View style={s.threadTopRow}>
            <Text style={s.threadName} numberOfLines={1}>{item.name}</Text>
            <Text style={s.threadTime}>{item.time}</Text>
          </View>
          <View style={s.threadPreviewRow}>
            <Text style={[s.threadPreview, item.unread && s.threadPreviewUnread]} numberOfLines={1}>{item.preview}</Text>
            {item.unread && item.badge != null && (
              <View style={s.badge}><Text style={s.badgeText}>{item.badge}</Text></View>
            )}
          </View>
        </View>
      </Pressable>
      <View style={s.divider} />
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const [activeThread, setActiveThread] = useState<ActiveThread | null>(null);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {activeThread ? (
        <ConversationView thread={activeThread} onBack={() => setActiveThread(null)} />
      ) : (
        <>
          <View style={s.header}>
            <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
              <X size={22} strokeWidth={2} color={Colors.black} />
            </Pressable>
            <Text style={s.headerTitle}>Messages</Text>
            <Pressable style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.7 }]}>
              <PenSquare size={22} strokeWidth={2} color="#375169" />
            </Pressable>
          </View>

          <View style={s.searchBar}>
            <Search size={15} strokeWidth={2} color="#8B8F94" />
            <Text style={s.searchPlaceholder}>Search messages...</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
            <Text style={s.sectionLabel}>UPCOMING THIS WEEK</Text>
            {PLAN_THREADS.map(item => (
              <PlanThread
                key={item.id}
                item={item}
                onPress={() => setActiveThread({ id: item.id, name: item.name, isGroup: true, eventId: item.eventId })}
              />
            ))}

            <Text style={s.sectionLabel}>DIRECT MESSAGES</Text>
            {DM_THREADS.map(item => (
              <DMThread
                key={item.id}
                item={item}
                onPress={() => setActiveThread({
                  id: item.id, name: item.name, isGroup: false,
                  userId: item.userId, dmBg: item.bg, dmFg: item.fg, dmInitials: item.initials,
                })}
              />
            ))}

            <View style={{ height: 40 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#FCFCFC' },
  scroll: { paddingBottom: 20 },

  // Thread list
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12 },
  headerBtn:   { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '600', color: '#333333' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 18, marginBottom: 10,
    backgroundColor: '#F0F1F3', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  searchPlaceholder: { fontSize: 14, color: '#8B8F94' },

  sectionLabel: {
    fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7, color: '#8B8F94',
    paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6,
  },

  row:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 11 },
  avatarWrap:  { position: 'relative' },
  planAvatar:  { width: 46, height: 46, borderRadius: 14, backgroundColor: '#E8F2F8', alignItems: 'center', justifyContent: 'center' },
  dmAvatar:    { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  dmInitials:  { fontSize: 16, fontWeight: '700' },
  unreadDot:   { position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#375169', borderWidth: 2, borderColor: '#FCFCFC' },

  threadBody:          { flex: 1 },
  threadTopRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  threadName:          { fontSize: 14, fontWeight: '600', color: '#333333', flex: 1, marginRight: 8 },
  threadTime:          { fontSize: 11, color: '#8B8F94' },
  threadPreviewRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  threadPreview:       { fontSize: 13, color: '#8B8F94', flex: 1, marginRight: 8 },
  threadPreviewUnread: { color: '#555555' },

  badge:     { width: 18, height: 18, borderRadius: 9, backgroundColor: '#375169', alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 10, fontWeight: '600', color: Colors.white },
  divider:   { height: 0.5, backgroundColor: '#E3E4E6', marginLeft: 18 + 46 + 12 },

  // Conversation
  convHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#E3E4E6' },
  convTitle:  { flex: 1, fontSize: 16, fontWeight: '600', color: '#333333', textAlign: 'center', marginHorizontal: 4 },
  convScroll: { paddingHorizontal: 14, paddingVertical: 16 },

  // Message groups
  msgGroup:    { marginBottom: 14 },

  // Message rows
  msgRow:      { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  msgRowMe:    { justifyContent: 'flex-end' },
  msgRowOther: { justifyContent: 'flex-start' },

  // Inline avatars
  msgAvatar:       { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarText:   { fontSize: 11, fontWeight: '700' },
  msgAvatarSpacer: { width: 30, flexShrink: 0 },

  // Bubble columns
  bubbleCol:   { flexShrink: 1, alignItems: 'flex-start', gap: 2 },
  bubbleColMe: { alignItems: 'flex-end' },

  // Sender name (group chats only)
  msgSenderName: { fontSize: 11, fontWeight: '600', color: '#8B8F94', marginLeft: 12, marginBottom: 2 },

  // Bubbles
  bubble:      { paddingHorizontal: 13, paddingVertical: 9, maxWidth: 260 },
  bubbleMe:    { backgroundColor: '#375169' },
  bubbleOther: { backgroundColor: '#EBEBEB' },
  msgTextMe:    { fontSize: 15, color: Colors.white, lineHeight: 21 },
  msgTextOther: { fontSize: 15, color: '#1C1C1E', lineHeight: 21 },

  // Timestamps
  msgTime:    { fontSize: 10, color: '#8B8F94', marginTop: 3 },
  msgTimeMe:  { alignSelf: 'flex-end', marginRight: 2 },
  msgTimeOther: { alignSelf: 'flex-start', marginLeft: 36 },

  // Input bar
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: '#E3E4E6' },
  msgInput: { flex: 1, height: 38, backgroundColor: '#F0F1F3', borderRadius: 19, paddingHorizontal: 16, fontSize: 14, color: '#333333' },
  sendBtn:  { width: 36, height: 36, borderRadius: 18, backgroundColor: '#375169', alignItems: 'center', justifyContent: 'center' },
});
