import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";
import type { Currency } from "@/types/api";
import { formatAmount } from "@/utils/format";

import { BalanceItem } from "./balance-item";

type AccountBalanceSectionProps = {
  available_balance?: number;
  pending_balance?: number;
  currency?: Currency;
};

export function AccountBalanceSection({
  available_balance = 0,
  pending_balance = 0,
  currency = "GBP",
}: AccountBalanceSectionProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Account Balance</ThemedText>
      <View style={styles.balanceRow}>
        <BalanceItem
          title="Available"
          amount={formatAmount(available_balance, currency as Currency)}
        />
        <BalanceItem
          title="Pending"
          amount={formatAmount(pending_balance, currency as Currency)}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing(3),
  },
  balanceRow: {
    flexDirection: "row",
    gap: spacing(2),
    marginTop: spacing(1),
  },
});
