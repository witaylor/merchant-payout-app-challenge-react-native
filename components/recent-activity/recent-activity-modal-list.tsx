import { FlashList } from "@shopify/flash-list";
import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";

import { LoadingView } from "@/components/ui/loading-view";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { ActivityItem } from "@/types/api";

import { RecentActivityListItem } from "./recent-activity-list-item";

const LOADING_MORE_LABEL = "Loading more transactions";

const ListFooter = memo(function ListFooter({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (!isLoading) return null;
  return (
    <LoadingView
      size="small"
      label={LOADING_MORE_LABEL}
      accessibilityLabel={LOADING_MORE_LABEL}
    />
  );
});

export type RecentActivityModalListProps = {
  activities: ActivityItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
};

export function RecentActivityModalList({
  activities,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: RecentActivityModalListProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";

  const renderItem = useCallback(
    ({ item }: { item: ActivityItem }) => <RecentActivityListItem item={item} />,
    [],
  );

  const ItemSeparatorComponent = useCallback(
    () => (
      <View
        style={[styles.separator, { backgroundColor: Colors[theme].separator }]}
      />
    ),
    [theme],
  );

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  const ListFooterComponent = useCallback(
    () => <ListFooter isLoading={isLoadingMore} />,
    [isLoadingMore],
  );

  return (
    <FlashList
      data={activities}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListFooterComponent={ListFooterComponent}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.listContent}
      accessibilityLabel="Recent activity list"
      accessibilityHint="Scroll to load more transactions"
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: spacing(2),
  },
});
