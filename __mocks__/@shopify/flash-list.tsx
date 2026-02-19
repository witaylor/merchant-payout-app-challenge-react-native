import React from "react";
import { View } from "react-native";

type FlashListProps<T> = {
  data: T[];
  renderItem: (info: { item: T }) => React.ReactElement;
  keyExtractor?: (item: T) => string;
  ItemSeparatorComponent?: React.ComponentType;
  ListFooterComponent?: React.ComponentType;
};

export function FlashList<T>({
  data,
  renderItem,
  ListFooterComponent,
}: FlashListProps<T>) {
  return (
    <View testID="flash-list">
      {data.map((item, index) => (
        <View key={(item as { id?: string }).id ?? index} testID="list-item">
          {renderItem({ item })}
        </View>
      ))}
      {ListFooterComponent ? <ListFooterComponent /> : null}
    </View>
  );
}
