import { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';

interface Props {
  onPress?: () => void;
  /** Applied to the outer Pressable — use for position:absolute, flex, margin */
  containerStyle?: StyleProp<ViewStyle>;
  /** Applied to the Animated.View — background, border-radius, padding, shadow */
  style?: StyleProp<ViewStyle>;
  /** Overrides applied on press (e.g. darker background) */
  pressedStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ScaleBtn({
  onPress,
  containerStyle,
  style,
  pressedStyle,
  children,
  disabled,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }

  function onPressOut() {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }

  return (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      {({ pressed }) => (
        <Animated.View
          style={[style, pressed && !disabled && pressedStyle, { transform: [{ scale }] }]}
        >
          {children}
        </Animated.View>
      )}
    </Pressable>
  );
}
