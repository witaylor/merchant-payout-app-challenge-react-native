import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountBalanceSection } from "@/components/balance-section";
import { RecentActivityListSection } from "@/components/recent-activity";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ErrorView } from "@/components/ui/error-view";
import { LoadingView } from "@/components/ui/loading-view";
import { spacing } from "@/constants/theme";
import { useMerchant } from "@/hooks/use-merchant";

export default function HomeScreen() {
  const { data, isLoading, isError, error, refetch } = useMerchant();

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView
          style={styles.safeContent}
          edges={["top", "left", "right"]}
        >
          <LoadingView size="large" centered />
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView
          style={styles.safeContent}
          edges={["top", "left", "right"]}
        >
          <ErrorView
            message={error?.message ?? "Unable to load account"}
            onRetry={() => refetch()}
            centered
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={["top", "left", "right"]}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Business Account</ThemedText>
        </ThemedView>

        <AccountBalanceSection
          available_balance={data?.available_balance}
          pending_balance={data?.pending_balance}
          currency={data?.currency}
        />

        <RecentActivityListSection activities={data?.activity ?? []} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
    padding: spacing(2),
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    marginBottom: spacing(3),
  },
});
