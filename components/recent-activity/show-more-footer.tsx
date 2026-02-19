import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/button";
import { spacing } from "@/constants/theme";

export interface ShowMoreFooterProps {
  onPress: () => void;
}

export function ShowMoreFooter({ onPress }: ShowMoreFooterProps) {
  return (
    <View style={styles.container}>
      <Button
        onPress={onPress}
        accessibilityLabel="Show more activity"
        accessibilityHint="Opens full list of recent transactions"
      >
        Show more
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing(2),
  },
});
