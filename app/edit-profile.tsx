import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    // Mock data load
    setFirstName('Alana');
    setLastName('Stull');
    setCity('Durham');
    setState('NC');
  }, []);

  const handleSave = async () => {
    // Save logic goes here 
    router.back();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.black} />
        </Pressable>
        <Text style={s.title}>Edit Profile</Text>
        <Pressable onPress={handleSave} style={s.saveWrap}>
          <Text style={s.saveBtn}>Save</Text>
        </Pressable>
      </View>
      <View style={s.content}>
        <Text style={s.label}>First Name</Text>
        <TextInput style={s.input} value={firstName} onChangeText={setFirstName} />
        
        <Text style={s.label}>Last Name</Text>
        <TextInput style={s.input} value={lastName} onChangeText={setLastName} />
        
        <Text style={s.label}>City</Text>
        <TextInput style={s.input} value={city} onChangeText={setCity} />
        
        <Text style={s.label}>State</Text>
        <TextInput style={s.input} value={state} onChangeText={setState} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.screenBackground },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.screenBackground, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.black },
  saveWrap: { width: 40, alignItems: 'flex-end', justifyContent: 'center' },
  saveBtn: { fontSize: 16, fontWeight: '600', color: Colors.primaryBlue },
  content: { padding: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#8B8F94', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  input: { height: 48, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.lightGrey, paddingHorizontal: 14, fontSize: 15, color: Colors.black },
});