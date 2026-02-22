import { StyleSheet } from "react-native";

import { ConfirmPayoutModal } from "@/components/payout/confirm-payout-modal";
import { PayoutForm } from "@/components/payout/payout-form";
import { PayoutResultView } from "@/components/payout/payout-result-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScreenContent } from "@/components/ui/screen-content";
import { spacing } from "@/constants/theme";
import { usePayoutFlow } from "@/hooks/use-payout-flow";

export default function PayoutsScreen() {
  const {
    state: { screenState, formData, errorMessage },
    handlers,
    formattedAmount,
    mutation,
    defaultFormData,
  } = usePayoutFlow();

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
