import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { spacing } from "@/constants/theme";
import type { ActivityItem } from "@/types/api";

import { RecentActivityList } from "./recent-activity-list";

export type RecentActivityListSectionProps = {
  activities: ActivityItem[];
};

export function RecentActivityListSection({
  activities,
}: RecentActivityListSectionProps) {
  return (
    <ThemedView style={styles.section} accessibilityRole="summary">
      <ThemedText type="subtitle" style={styles.title}>
        Recent Activity
      </ThemedText>
      <RecentActivityList activities={activities} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing(3),
    flex: 1,
  },
  title: {
    marginBottom: spacing(1),
  },
});
