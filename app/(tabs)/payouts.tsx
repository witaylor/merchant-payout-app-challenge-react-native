import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";

export default function PayoutsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={["top", "left", "right"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Initiate Payout</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Payout Amount</ThemedText>
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
  },
  header: {
    marginBottom: spacing(3),
  },
  section: {
    marginBottom: spacing(3),
  },
});
