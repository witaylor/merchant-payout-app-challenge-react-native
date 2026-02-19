import { StyleSheet } from "react-native";

import { AccountBalanceSection } from "@/components/balance-section";
import { RecentActivityListSection } from "@/components/recent-activity";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ErrorView } from "@/components/ui/error-view";
import { LoadingView } from "@/components/ui/loading-view";
import { ScreenContent } from "@/components/ui/screen-content";
import { spacing } from "@/constants/theme";
import { useMerchant } from "@/hooks/use-merchant";

export default function HomeScreen() {
  const { data, isLoading, isError, error, refetch } = useMerchant();

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ScreenContent style={styles.safeContent}>
          <LoadingView size="large" centered />
        </ScreenContent>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <ScreenContent style={styles.safeContent}>
          <ErrorView
            message={error?.message ?? "Unable to load account"}
            onRetry={() => refetch()}
            centered
          />
        </ScreenContent>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenContent style={styles.safeContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Business Account</ThemedText>
        </ThemedView>

        <AccountBalanceSection
          available_balance={data?.available_balance}
          pending_balance={data?.pending_balance}
          currency={data?.currency}
        />

        <RecentActivityListSection activities={data?.activity ?? []} />
      </ScreenContent>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContent: {
    padding: spacing(2),
  },
  header: {
    marginBottom: spacing(3),
  },
});
