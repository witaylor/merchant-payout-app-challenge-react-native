import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  StyleSheet,
  View,
} from "react-native";

import { spacing } from "@/constants/theme";

type LoadingViewProps = {
  size?: ActivityIndicatorProps["size"];
  centered?: boolean;
};

export function LoadingView({
  size = "small",
  centered = false,
}: LoadingViewProps) {
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <ActivityIndicator size={size} testID="loading-indicator" />
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
  centered: {
    flex: 1,
  },
});
