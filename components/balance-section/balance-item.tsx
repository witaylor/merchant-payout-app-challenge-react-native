import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, spacing } from "@/constants/theme";

export interface BalanceItemProps {
  title: string;
  amount: string;
}

export const BalanceItem = memo(function BalanceItem({
  title,
  amount,
}: BalanceItemProps) {
  return (
    <View style={styles.container}>
      <ThemedText
        style={styles.label}
        lightColor={Colors.light.textSecondary}
        darkColor={Colors.dark.textSecondary}
      >
        {title}
      </ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.amount}>
        {amount}
      </ThemedText>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: spacing(0.5),
  },
  amount: {
    fontSize: 18,
  },
});
