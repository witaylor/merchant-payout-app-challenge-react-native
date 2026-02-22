import { StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export type PayoutResultViewProps =
  | {
      variant: "success";
      formattedAmount: string;
      onCreateAnother: () => void;
    }
  | {
      variant: "error";
      message: string;
      onTryAgain: () => void;
    };

export function PayoutResultView(props: PayoutResultViewProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  if (props.variant === "success") {
    return (
      <PayoutSuccessView
        formattedAmount={props.formattedAmount}
        onCreateAnother={props.onCreateAnother}
      />
    );
  }

  return <PayoutErrorView message={props.message} onTryAgain={props.onTryAgain} colors={colors} />;
}

function PayoutSuccessView({
  formattedAmount,
  onCreateAnother,
}: {
  formattedAmount: string;
  onCreateAnother: () => void;
}) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.positiveAmount }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <MaterialIcons name="check" size={48} color="#fff" />
      </View>
      <ThemedText
        type="title"
        style={styles.title}
        accessibilityRole="header"
      >
        Payout Completed
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.message, { color: colors.textSecondary }]}
      >
        Your payout of {formattedAmount} has been processed successfully.
      </ThemedText>
      <Button
        onPress={onCreateAnother}
        accessibilityLabel="Create another payout"
      >
        Create Another Payout
      </Button>
    </ThemedView>
  );
}

function PayoutErrorView({
  message,
  onTryAgain,
  colors,
}: {
  message: string;
  onTryAgain: () => void;
  colors: ReturnType<typeof Colors.light>;
}) {

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.error }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        <MaterialIcons name="close" size={48} color="#fff" />
      </View>
      <ThemedText
        type="title"
        style={[styles.title, { color: colors.error }]}
        accessibilityRole="header"
      >
        Unable to Process Payout
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.message, { color: colors.error }]}
      >
        {message}
      </ThemedText>
      <Button
        onPress={onTryAgain}
        accessibilityLabel="Try again"
      >
        Try Again
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing(3),
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing(3),
  },
  title: {
    textAlign: "center",
    marginBottom: spacing(2),
  },
  message: {
    textAlign: "center",
    marginBottom: spacing(4),
    alignSelf: "stretch",
  },
});
