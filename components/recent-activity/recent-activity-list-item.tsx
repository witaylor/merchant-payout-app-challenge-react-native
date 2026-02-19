import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ActivityItem } from "@/types/api";
import { formatAmount, formatDate } from "@/utils/format";
import { capitalize } from "@/utils/string";

export interface RecentActivityListItemProps {
  item: ActivityItem;
}

export const RecentActivityListItem = memo(
  function RecentActivityListItem({ item }: RecentActivityListItemProps) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? "dark" : "light";
    const isPositive = item.amount >= 0;
    const amountColor = isPositive
      ? Colors[theme].positiveAmount
      : Colors[theme].error;
    const secondaryColor = Colors[theme].textSecondary;

    const displayAmount = formatAmount(item.amount, item.currency);
    const displayDate = formatDate(item.date, { monthStyle: "abbreviated" });
    const displayType = capitalize(item.type);
    const displayStatus = capitalize(item.status);

    return (
      <View
        style={styles.container}
        accessibilityRole="none"
        accessibilityLabel={`${displayType}, ${item.description}, ${displayAmount}`}
        accessibilityHint={`${displayDate}, ${displayStatus}`}
      >
        <View style={styles.leftColumn}>
          <ThemedText style={styles.type}>{displayType}</ThemedText>
          <ThemedText
            style={[styles.description, { color: secondaryColor }]}
            lightColor={secondaryColor}
            darkColor={secondaryColor}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.description}
          </ThemedText>
          <ThemedText
            style={[styles.date, { color: secondaryColor }]}
            lightColor={secondaryColor}
            darkColor={secondaryColor}
          >
            {displayDate}
          </ThemedText>
        </View>
        <View style={styles.rightColumn}>
          <ThemedText
            style={[styles.amount, { color: amountColor }]}
            lightColor={amountColor}
            darkColor={amountColor}
          >
            {displayAmount}
          </ThemedText>
          <ThemedText
            style={[styles.status, { color: secondaryColor }]}
            lightColor={secondaryColor}
            darkColor={secondaryColor}
          >
            {displayStatus}
          </ThemedText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing(2),
  },
  leftColumn: {
    flex: 1,
    marginRight: spacing(2),
  },
  rightColumn: {
    alignItems: "flex-end",
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
  },
});
