import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { spacing } from "@/constants/theme";

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
  centered?: boolean;
};

export function ErrorView({
  message,
  onRetry,
  centered = false,
}: ErrorViewProps) {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <ThemedText type="subtitle" style={styles.message}>
        {message}
      </ThemedText>
      <Button variant="error" onPress={onRetry} style={styles.retryButton}>
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
