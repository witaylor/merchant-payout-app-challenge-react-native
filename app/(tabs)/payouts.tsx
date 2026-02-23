import { useEffect } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { addScreenshotTakenListener } from "screen-security";

import { ConfirmPayoutModal } from "@/components/payout/confirm-payout-modal";
import { PayoutForm } from "@/components/payout/payout-form";
import { PayoutResultView } from "@/components/payout/payout-result-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScreenContent } from "@/components/ui/screen-content";
import { spacing } from "@/constants/theme";
import { usePayoutFlow } from "@/hooks/use-payout-flow";

const SCREENSHOT_ALERT = {
  title: "Security Reminder",
  message:
    "Please keep your financial data private. Screenshots may contain sensitive information.",
  button: { text: "OK" },
};

export default function PayoutsScreen() {
  const {
    state: { screenState, formData, errorMessage },
    handlers,
    formattedAmount,
    mutation,
    defaultFormData,
  } = usePayoutFlow();

  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = addScreenshotTakenListener(() => {
      Alert.alert(SCREENSHOT_ALERT.title, SCREENSHOT_ALERT.message, [
        SCREENSHOT_ALERT.button,
      ]);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScreenContent style={styles.safeContent}>
        <ThemedText
          type="title"
          style={styles.header}
          accessibilityRole="header"
        >
          Send Payout
        </ThemedText>

        {screenState === "form" && (
          <PayoutForm
            initialValues={formData ?? undefined}
            onSubmit={handlers.handleFormSubmit}
          />
        )}

        {screenState === "success" && (
          <PayoutResultView
            variant="success"
            formattedAmount={formattedAmount}
            onCreateAnother={handlers.handleCreateAnother}
          />
        )}
        {screenState === "failed" && (
          <PayoutResultView
            variant="error"
            message={errorMessage}
            onTryAgain={handlers.handleTryAgain}
          />
        )}
      </ScreenContent>

      <ConfirmPayoutModal
        visible={screenState === "confirming"}
        data={formData ?? defaultFormData}
        isSubmitting={mutation.isPending}
        onCancel={handlers.handleConfirmCancel}
        onConfirm={handlers.handleConfirmConfirm}
      />
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
  },
  header: {
    marginBottom: spacing(3),
  },
});
