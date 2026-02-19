import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { spacing } from "@/constants/theme";

const DEFAULT_MESSAGE = "Failed to load recent activity";

export type RecentActivityListErrorViewProps = {
  message?: string | null;
  onTryAgainPress: () => void;
};

export function RecentActivityListErrorView({
  message = DEFAULT_MESSAGE,
  onTryAgainPress,
}: RecentActivityListErrorViewProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.message}>
        {message || DEFAULT_MESSAGE}
      </ThemedText>
      <Button
        onPress={onTryAgainPress}
        style={styles.button}
        accessibilityLabel="Try again"
        accessibilityHint="Retries loading recent activity"
      >
        Try again
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing(2),
  },
  message: {
    textAlign: "center",
    marginBottom: spacing(2),
  },
  button: {
    alignSelf: "center",
  },
});
