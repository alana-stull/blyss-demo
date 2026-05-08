import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe, Users, CalendarPlus, Bell, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const ACTIVE   = '#4A7FA5';
const INACTIVE = Colors.navInactive;

function TabIcon({
  icon: Icon,
  focused,
}: {
  icon: React.ComponentType<{ size: number; strokeWidth: number; color: string }>;
  focused: boolean;
}) {
  return (
    <Icon size={24} strokeWidth={2} color={focused ? ACTIVE : INACTIVE} />
  );
}

function FloatingPlanButton({ onPress }: { onPress?: (e: any) => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }
  function onPressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  }

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={t.floatOuter}>
      {({ pressed }) => (
        <Animated.View style={[t.floatBtn, pressed && { backgroundColor: '#2A3F52' }, { transform: [{ scale }] }]}>
          <CalendarPlus size={24} strokeWidth={2} color={Colors.white} />
        </Animated.View>
      )}
    </Pressable>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0.5,
          borderTopColor: Colors.divider,
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          overflow: 'visible',
        },
        tabBarItemStyle: t.item,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Globe} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Users} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarButton: (props) => (
            <FloatingPlanButton onPress={props.onPress ?? undefined} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Bell} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const t = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  // Outer wrapper gives the button its slot in the tab bar and provides the lift
  floatOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  floatBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#375169',
    alignItems: 'center',
    justifyContent: 'center',
    // iOS shadow
    shadowColor: '#375169',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android
    elevation: 8,
  },
});
