import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type { PayoutFormData } from "@/components/payout/payout-form";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { maskIban } from "@/utils/iban";
import { formatPayoutAmountForDisplay } from "@/utils/payout";

export type ConfirmPayoutModalProps = {
  visible: boolean;
  data: PayoutFormData;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmPayoutModal({
  visible,
  data,
  isSubmitting,
  onCancel,
  onConfirm,
}: ConfirmPayoutModalProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const formattedAmount = formatPayoutAmountForDisplay(data.amount, data.currency);
  const maskedIban = maskIban(data.iban);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isSubmitting ? () => {} : onCancel}
      accessibilityViewIsModal
      accessibilityLabel="Confirm Payout"
    >
      <Pressable
        style={styles.overlay}
        onPress={isSubmitting ? undefined : onCancel}
        accessibilityRole="button"
        accessibilityLabel={
          isSubmitting
            ? "Processing payout, please wait"
            : "Dismiss confirmation dialog"
        }
      >
        <Pressable style={styles.cardWrapper} onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 16,
                  },
                  android: { elevation: 16 },
                }),
              },
            ]}
          >
            <View>
              <ThemedText
                type="title"
                style={styles.title}
                accessibilityRole="header"
              >
                Confirm Payout
              </ThemedText>

              <View style={styles.row}>
                <ThemedText
                  type="default"
                  style={{ color: colors.textSecondary }}
                >
                  Amount:
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formattedAmount}
                </ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText
                  type="default"
                  style={{ color: colors.textSecondary }}
                >
                  Currency:
                </ThemedText>
                <ThemedText type="defaultSemiBold">{data.currency}</ThemedText>
              </View>
              <View style={styles.row}>
                <ThemedText
                  type="default"
                  style={{ color: colors.textSecondary }}
                >
                  IBAN:
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {maskedIban}
                </ThemedText>
              </View>
            </View>

            <View style={styles.buttons}>
              <View style={styles.buttonWrapper}>
                <Button
                  variant="secondary"
                  onPress={onCancel}
                  disabled={isSubmitting}
                  style={styles.button}
                  accessibilityLabel="Cancel"
                >
                  Cancel
                </Button>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  variant="tint"
                  onPress={onConfirm}
                  disabled={isSubmitting}
                  style={styles.button}
                  accessibilityLabel={
                    isSubmitting ? "Processing payout" : "Confirm payout"
                  }
                >
                  {isSubmitting ? (
                    "Processing…"
                  ) : (
                    "Confirm"
                  )}
                </Button>
                {isSubmitting && (
                  <View
                    style={[
                      styles.processingOverlay,
                      {
                        backgroundColor: colors.button.tint.background,
                      },
                    ]}
                    pointerEvents="none"
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                  >
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing(3),
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 400,
  },
  card: {
    borderRadius: 16,
    padding: spacing(3),
  },
  title: {
    fontSize: 24,
    marginBottom: spacing(3),
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing(2),
  },
  buttons: {
    flexDirection: "row",
    gap: spacing(2),
    marginTop: spacing(3),
  },
  buttonWrapper: {
    flex: 1,
    position: "relative",
    minWidth: 0,
  },
  button: {
    width: "100%",
    alignSelf: "stretch",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
