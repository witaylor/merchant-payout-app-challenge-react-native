import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import type { PropsWithChildren } from "react";

type ButtonVariant = "primary" | "error";

type ButtonProps = PropsWithChildren<{
  variant?: ButtonVariant;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityRole?: "button";
  accessibilityHint?: string;
}>;

export function Button({
  children,
  variant = "primary",
  onPress,
  style,
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityHint,
}: ButtonProps) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const buttonColors = Colors[theme].button[variant];

  return (
    <Pressable
      testID="button"
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: buttonColors.background },
        pressed && styles.pressed,
        style,
      ]}
    >
      <ThemedText
        lightColor={Colors.light.button[variant].text}
        darkColor={Colors.dark.button[variant].text}
        type="defaultSemiBold"
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
