import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { spacing } from "@/constants/theme";

type LoadingViewProps = {
  size?: ActivityIndicatorProps["size"];
  centered?: boolean;
  /** Optional label shown below the indicator (e.g. "Loading more...") */
  label?: string;
  /** Override for screen reader announcement (defaults to label or "Loading") */
  accessibilityLabel?: string;
};

export function LoadingView({
  size = "small",
  centered = false,
  label,
  accessibilityLabel: a11yLabel,
}: LoadingViewProps) {
  return (
    <View
      style={[
        styles.container,
        label && styles.containerWithLabel,
        centered && styles.centered,
      ]}
      accessibilityLabel={a11yLabel ?? label ?? "Loading"}
      accessibilityState={{ busy: true }}
    >
      <ActivityIndicator size={size} testID="loading-indicator" />
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
    </View>
  );
}

LoadingView.testIds = {
  loadingIndicator: "loading-indicator",
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing(2),
  },
  containerWithLabel: {
    flexDirection: "column",
  },
  centered: {
    flex: 1,
  },
  label: {
    marginTop: spacing(1.5),
    opacity: 0.8,
  },
});
