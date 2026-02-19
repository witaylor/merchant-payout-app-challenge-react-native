import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RecentActivityModalHeader } from "@/components/recent-activity/recent-activity-modal-header";
import { RecentActivityModalList } from "@/components/recent-activity/recent-activity-modal-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ErrorView } from "@/components/ui/error-view";
import { LoadingView } from "@/components/ui/loading-view";
import { Colors, spacing } from "@/constants/theme";
import { useActivity } from "@/hooks/use-activity";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ModalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const tintColor = Colors[theme].tint;

  const {
    activities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useActivity();

  const handleDone = useCallback(() => {
    router.back();
  }, [router]);

  const handleLoadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const body = isLoading ? (
    <LoadingView
      size="large"
      centered
      accessibilityLabel="Loading recent activity"
    />
  ) : isError ? (
    <ErrorView
      message={
        error?.message ?? (error ? String(error) : "Unable to load activity")
      }
      onRetry={handleRetry}
      retryAccessibilityHint="Retries loading the activity list"
      centered
    />
  ) : activities.length === 0 ? (
    <View style={styles.emptyContainer} accessibilityLabel="No recent activity">
      <ThemedText style={styles.emptyText}>No recent activity</ThemedText>
    </View>
  ) : (
    <RecentActivityModalList
      activities={activities}
      onLoadMore={handleLoadMore}
      hasMore={hasNextPage ?? false}
      isLoadingMore={isFetchingNextPage}
    />
  );

  return (
    <ThemedView
      style={styles.container}
      accessibilityViewIsModal
      importantForAccessibility="yes"
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <RecentActivityModalHeader onDone={handleDone} tintColor={tintColor} />
        {body}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: spacing(2),
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
  },
  emptyText: {
    opacity: 0.8,
  },
});
