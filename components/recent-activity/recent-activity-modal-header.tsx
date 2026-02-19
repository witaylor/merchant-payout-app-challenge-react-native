import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { spacing } from "@/constants/theme";

export type RecentActivityModalHeaderProps = {
  onDone: () => void;
  tintColor: string;
};

export function RecentActivityModalHeader({
  onDone,
  tintColor,
}: RecentActivityModalHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText
        type="title"
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Recent Activity"
      >
        Recent Activity
      </ThemedText>
      <Pressable
        onPress={onDone}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Close"
        accessibilityRole="button"
        accessibilityHint="Closes the recent activity modal"
      >
        <ThemedText
          type="link"
          style={styles.doneButton}
          lightColor={tintColor}
          darkColor={tintColor}
        >
          Done
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
  },
  title: {
    fontSize: 20,
  },
  doneButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1),
  },
});
