import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ActivityItem } from "@/types/api";

import { CompactRecentActivityListItem } from "./compact-recent-activity-list-item";
import { ShowMoreFooter } from "./show-more-footer";

const RECENT_ACTIVITY_LIMIT = 3;

export type RecentActivityListProps = {
  activities: ActivityItem[];
  onShowMore?: () => void;
};

export function RecentActivityList({
  activities,
  onShowMore,
}: RecentActivityListProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const recentItems = activities.slice(0, RECENT_ACTIVITY_LIMIT);

  const handleShowMore = useCallback(() => {
    if (onShowMore) {
      onShowMore();
    } else {
      router.push("/modal" as never);
    }
  }, [onShowMore, router]);

  const renderItem = useCallback(
    ({ item }: { item: ActivityItem }) => (
      <CompactRecentActivityListItem item={item} />
    ),
    [],
  );

  const ListFooterComponent = useCallback(
    () => <ShowMoreFooter onPress={handleShowMore} />,
    [handleShowMore],
  );

  const ItemSeparatorComponent = useCallback(
    () => (
      <View
        style={[styles.separator, { backgroundColor: Colors[theme].separator }]}
      />
    ),
    [theme],
  );

  if (recentItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No recent activity</ThemedText>
        <Button
          onPress={handleShowMore}
          style={styles.emptyButton}
          accessibilityLabel="Show more activity"
          accessibilityHint="Opens full list of recent transactions"
        >
          Show more
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlashList
        data={recentItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: 0,
  },
  emptyContainer: {
    paddingVertical: spacing(2),
  },
  emptyText: {
    marginBottom: spacing(2),
    opacity: 0.8,
  },
  emptyButton: {
    alignSelf: "flex-start",
  },
});
