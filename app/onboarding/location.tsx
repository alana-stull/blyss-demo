import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { OnboardingLayout } from '@/components/OnboardingLayout';
import { useOnboarding } from '@/lib/OnboardingContext';

const LOCATION_OPTIONS = [
  { city: 'Durham', state: 'NC' },
  { city: 'Chapel Hill', state: 'NC' },
  { city: 'Raleigh', state: 'NC' },
  { city: 'New York', state: 'NY' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Seattle', state: 'WA' },
];

export default function LocationScreen() {
  const { updateData } = useOnboarding();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = query.length > 0
    ? LOCATION_OPTIONS.filter(loc =>
        `${loc.city} ${loc.state}`.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function handleSelect(city: string, state: string) {
    const location = `${city}, ${state}`;
    setSelected(location);
    setQuery(location);
    setShowDropdown(false);
  }

  async function handleUseCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      await Location.getCurrentPositionAsync({});
      // Dummy reverse geocode for demo purposes
      const locStr = 'Durham, NC';
      setSelected(locStr);
      setQuery(locStr);
      setShowDropdown(false);
    }
  }

  function handleContinue() {
    updateData({ location: selected });
    router.push('/onboarding/photo');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.root}>
      <OnboardingLayout
        progress={45}
        question="Where are you based?"
        subtitle="We'll show you venues and plans near you."
        continueDisabled={!selected}
        onContinue={handleContinue}
      >
        <View style={s.container}>
          <View style={s.searchContainer}>
            <View style={s.iconWrapper}>
              <MapPin size={18} color="#8B8F94" />
            </View>
            <TextInput
              style={s.searchInput}
              placeholder="Search your city"
              placeholderTextColor="#A0A4A8"
              value={query}
              onChangeText={text => {
                setQuery(text);
                setShowDropdown(text.length > 0);
              }}
            />
          </View>

          {showDropdown && filtered.length > 0 && (
            <View style={s.dropdown}>
              {filtered.map((item, idx) => (
                <Pressable
                  key={idx}
                  style={s.dropdownRow}
                  onPress={() => handleSelect(item.city, item.state)}
                >
                  <View style={s.locationIcon}>
                    <MapPin size={14} color="#375169" strokeWidth={1.5} />
                  </View>
                  <View style={s.locationText}>
                    <Text style={s.cityName}>{item.city}</Text>
                    <Text style={s.stateName}>{item.state}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable style={s.useCurrentBtn} onPress={handleUseCurrentLocation}>
            <Navigation size={16} color="#4A7FA5" />
            <Text style={s.useCurrentText}>Use my current location</Text>
          </Pressable>
        </View>
      </OnboardingLayout>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  container: { marginTop: 8 },
  searchContainer: {
    position: 'relative',
    height: 48,
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconWrapper: {
    paddingLeft: 14,
    paddingRight: 10,
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    height: '100%',
    paddingRight: 14,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E3E4E6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E4E6',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#E8F2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: { flex: 1, gap: 2 },
  cityName: { fontSize: 13, fontWeight: '500', color: '#333333' },
  stateName: { fontSize: 11, color: '#8B8F94' },
  useCurrentBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  useCurrentText: { fontSize: 14, color: '#4A7FA5', fontWeight: '500' },
});
