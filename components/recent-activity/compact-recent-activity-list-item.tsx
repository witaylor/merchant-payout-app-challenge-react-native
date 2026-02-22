import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CURRENCIES } from "@/constants/currencies";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ActivityItem } from "@/types/api";
import { formatAmount } from "@/utils/format";

export interface CompactRecentActivityListItemProps {
  item: ActivityItem;
}

function isValidItem(item: unknown): item is ActivityItem {
  if (!item || typeof item !== "object") return false;
  const a = item as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    typeof a.amount === "number" &&
    !Number.isNaN(a.amount) &&
    typeof a.currency === "string" &&
    CURRENCIES.includes(a.currency as (typeof CURRENCIES)[number]) &&
    typeof a.description === "string"
  );
}

export const CompactRecentActivityListItem = memo(
  function CompactRecentActivityListItem({
    item,
  }: CompactRecentActivityListItemProps) {
    const colorScheme = useColorScheme();

    if (!isValidItem(item)) {
      return null;
    }

    const theme = colorScheme === "dark" ? "dark" : "light";
    const isPositive = item.amount >= 0;
    const amountColor = isPositive
      ? Colors[theme].positiveAmount
      : Colors[theme].error;

    const displayAmount = formatAmount(item.amount, item.currency);

    return (
      <View
        style={styles.container}
        accessibilityLabel={`${item.description}, ${displayAmount}`}
      >
        <ThemedText
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </ThemedText>
        <ThemedText
          style={[styles.amount, { color: amountColor }]}
          lightColor={amountColor}
          darkColor={amountColor}
        >
          {displayAmount}
        </ThemedText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing(2),
  },
  description: {
    flex: 1,
    fontSize: 14,
    marginRight: spacing(2),
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
});
