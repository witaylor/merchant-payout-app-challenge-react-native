import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { spacing } from "@/constants/theme";

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
  centered?: boolean;
  /** Optional hint for the Retry button (e.g. "Retries loading the activity list") */
  retryAccessibilityHint?: string;
};

export function ErrorView({
  message,
  onRetry,
  centered = false,
  retryAccessibilityHint = "Retries the failed action",
}: ErrorViewProps) {
  return (
    <View
      style={[styles.container, centered && styles.centered]}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${message}`}
    >
      <ThemedText type="subtitle" style={styles.message}>
        {message}
      </ThemedText>
      <Button
        variant="error"
        onPress={onRetry}
        style={styles.retryButton}
        accessibilityLabel="Retry"
        accessibilityHint={retryAccessibilityHint}
      >
        Retry
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing(2),
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing(2),
  },
});
