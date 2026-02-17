import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={["top", "left", "right"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Business Account</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account Balance</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Activity</ThemedText>
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
    marginBottom: spacing(3),
  },
  section: {
    marginBottom: spacing(3),
  },
});
