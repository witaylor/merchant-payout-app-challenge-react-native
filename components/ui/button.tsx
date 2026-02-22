import { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import type { ComponentRef, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "error" | "tint";

type ButtonProps = PropsWithChildren<{
  variant?: ButtonVariant;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityRole?: "button";
  accessibilityHint?: string;
}>;

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      disabled = false,
      onPress,
      style,
      accessibilityLabel,
      accessibilityRole = "button",
      accessibilityHint,
    },
    ref,
  ) {
    const theme = useColorScheme() === "dark" ? "dark" : "light";
    const buttonColors = Colors[theme].button[variant];

    return (
      <Pressable
        ref={ref}
        testID="button"
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: buttonColors.background },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
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
},
);

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
  disabled: {
    opacity: 0.5,
  },
});
