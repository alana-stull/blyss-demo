import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    AsyncStorage.clear()
      .catch(() => {})
      .then(() => {
        setComplete(false);
        setReady(true);
      });
  }, []);

  if (!ready) return <View style={{ flex: 1, backgroundColor: Colors.white }} />;
  if (complete) return <Redirect href="/(tabs)/explore" />;
  return <Redirect href="/onboarding/name" />;
}
