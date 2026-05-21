import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Figtree_400Regular, Figtree_600SemiBold, Figtree_600SemiBold_Italic, Figtree_700Bold } from '@expo-google-fonts/figtree';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_600SemiBold_Italic,
    Figtree_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index"      options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"     options={{ headerShown: false }} />
        <Stack.Screen name="venue/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="journal"    options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="event-detail" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="modal"      options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat"             options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="user-profile/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="settings"   options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile"   options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="friends-list"   options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="planned-events" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="new-post"       options={{ headerShown: false, animation: 'slide_from_bottom', presentation: 'fullScreenModal' }} />
        <Stack.Screen name="post-details"   options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="tag/[name]"     options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack>
    </ThemeProvider>
  );
}
