import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight, Bell, Lock, HelpCircle, LogOut, User, Settings as SettingsIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Account Information', action: () => {} },
        { icon: Lock, label: 'Privacy', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: SettingsIcon, label: 'Edit Preferences', action: () => router.push('/onboarding/interests') },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.black} strokeWidth={2} />
        </Pressable>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {settingsSections.map((section) => (
          <View key={section.title} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.card}>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <View key={item.label}>
                    <Pressable
                      style={({ pressed }) => [s.row, pressed && { backgroundColor: '#F9F9FA' }]}
                      onPress={item.action}
                    >
                      <Icon size={20} color="#5BA8D3" strokeWidth={2} />
                      <Text style={s.rowLabel}>{item.label}</Text>
                      <ChevronRight size={20} color="#8B8F94" strokeWidth={2} />
                    </Pressable>
                    {index < section.items.length - 1 && <View style={s.divider} />}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Log out */}
        <Pressable 
          style={({ pressed }) => [s.card, s.logoutCard, pressed && { backgroundColor: '#F9F9FA' }]}
          onPress={async () => {
            await AsyncStorage.clear();
            router.replace('/onboarding');
          }}
        >
          <LogOut size={20} color="#D4183D" strokeWidth={2} />
          <Text style={s.logoutText}>Log Out</Text>
        </Pressable>

        {/* App version */}
        <Text style={s.versionText}>Blyss Social v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.screenBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.black },
  
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8B8F94', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginLeft: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.lightGrey,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 12 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
  divider: { height: 1.5, backgroundColor: Colors.lightGrey, marginLeft: 48 },
  
  logoutCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, marginTop: 8 },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#D4183D', flex: 1 },
  versionText: { textAlign: 'center', fontSize: 13, color: '#8B8F94', marginTop: 32 },
});