import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";

export default function ActivityModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={["top", "left", "right"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Recent Activity</ThemedText>
          <Link
            href="/"
            dismissTo
            style={styles.closeLink}
            accessibilityLabel="Close activity modal"
            accessibilityHint="Returns to business account"
          >
            <ThemedText type="link">Close</ThemedText>
          </Link>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
    padding: spacing(2),
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeLink: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1),
  },
});
