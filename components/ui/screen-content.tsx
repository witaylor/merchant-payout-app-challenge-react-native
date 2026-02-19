import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Edge } from "react-native-safe-area-context";

export type ScreenContentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
};

/**
 * Wraps screen content with SafeAreaView and a centered max-width layout for web.
 * Use for tab screens, modals, and full-screen views.
 */
export function ScreenContent({
  children,
  style,
  edges = ["top", "left", "right"],
}: ScreenContentProps) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
});
