import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/constants/currencies";
import { Colors, spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { useMerchant } from "@/hooks/use-merchant";
import type { Currency } from "@/types/api";

import {
  getPayoutFormFieldErrors,
  validatePayoutForm,
} from "./payout-form-schema";
import { toMinorUnits } from "@/utils/payout";
import { INSUFFICIENT_FUNDS_MESSAGE } from "@/utils/payout-error";

const IBAN_DEBOUNCE_MS = 500;

export type PayoutFormData = {
  amount: string | number;
  currency: Currency;
  iban: string;
};

export type PayoutFormProps = {
  initialValues?: Partial<PayoutFormData>;
  onSubmit: (data: PayoutFormData) => void;
};

export function PayoutForm({ initialValues, onSubmit }: PayoutFormProps) {
  const [amount, setAmount] = useState(String(initialValues?.amount ?? ""));
  const [currency, setCurrency] = useState<Currency>(
    initialValues?.currency ?? DEFAULT_CURRENCY,
  );
  const [iban, setIban, debouncedIban] = useDebouncedState(
    initialValues?.iban ?? "",
    IBAN_DEBOUNCE_MS,
  );
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);
  const [ibanTouched, setIbanTouched] = useState(false);

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { data: merchant } = useMerchant();

  const fieldErrors = useMemo(
    () => getPayoutFormFieldErrors({ amount, currency, iban: debouncedIban }),
    [amount, currency, debouncedIban],
  );
  const amountError =
    amountTouched ? (fieldErrors.amount ?? null) : null;

  const amountNum = parseFloat(amount);
  const amountNumValid = !Number.isNaN(amountNum) && amountNum > 0;
  const insufficientFunds =
    merchant &&
    amountNumValid &&
    toMinorUnits(amountNum) > merchant.available_balance;
  const insufficientFundsError = amountTouched ? insufficientFunds : false;

  const ibanError = useMemo(() => {
    if (!ibanTouched) return null;
    return fieldErrors.iban ?? null;
  }, [fieldErrors.iban, ibanTouched]);

  // Use raw iban for Confirm button state; field errors use debouncedIban to reduce flicker
  const validation = useMemo(
    () => validatePayoutForm({ amount, currency, iban }),
    [amount, currency, iban],
  );
  const isConfirmEnabled = validation.success && !insufficientFunds;

  const showWebLimitHint =
    Platform.OS === "web" &&
    !Number.isNaN(amountNum) &&
    amountNum > 1000;

  const handleSubmit = useCallback(() => {
    setAmountTouched(true);
    setIbanTouched(true);
    if (!validation.success) return;

    onSubmit({
      amount: validation.data.amount,
      currency: validation.data.currency,
      iban: validation.data.iban,
    });
  }, [validation, onSubmit]);

  const handleSelectCurrency = useCallback((c: Currency) => {
    setCurrency(c);
    setShowCurrencyPicker(false);
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.section}>
            <View style={styles.twoColRow}>
              <View style={styles.colAmount}>
                <ThemedText type="subtitle" style={styles.label}>
                  Amount
                </ThemedText>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  onBlur={() => setAmountTouched(true)}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.separator,
                    },
                  ]}
                  accessibilityLabel="Amount"
                />
                {amountError ? (
                  <ThemedText
                    type="default"
                    style={[styles.hint, { color: colors.error }]}
                  >
                    {amountError}
                  </ThemedText>
                ) : insufficientFundsError ? (
                  <ThemedText
                    type="default"
                    style={[styles.hint, { color: colors.error }]}
                  >
                    {INSUFFICIENT_FUNDS_MESSAGE}
                  </ThemedText>
                ) : showWebLimitHint ? (
                  <ThemedText
                    type="default"
                    style={[styles.hint, { color: colors.textSecondary }]}
                  >
                    Maximum £1,000 on web. Use the mobile app for larger
                    payouts.
                  </ThemedText>
                ) : null}
              </View>
              <View style={styles.colCurrency}>
                <ThemedText type="subtitle" style={styles.label}>
                  Currency
                </ThemedText>
                <Pressable
                  onPress={() => setShowCurrencyPicker(true)}
                  style={[
                    styles.input,
                    styles.currencyPicker,
                    {
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.separator,
                    },
                  ]}
                  accessibilityLabel={`Currency, ${currency} selected`}
                  accessibilityRole="button"
                >
                  <ThemedText type="default">{currency}</ThemedText>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.label}>
              IBAN
            </ThemedText>
            <TextInput
              value={iban}
              onChangeText={setIban}
              onBlur={() => setIbanTouched(true)}
              placeholder="FR12123451234512345678901234567890"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.separator,
                },
              ]}
              accessibilityLabel="Destination IBAN"
            />
            {ibanError ? (
              <ThemedText
                type="default"
                style={[styles.hint, { color: colors.error }]}
              >
                {ibanError}
              </ThemedText>
            ) : (
              <ThemedText
                type="default"
                style={[styles.hint, { color: colors.textSecondary }]}
              >
                Enter the destination bank account IBAN
              </ThemedText>
            )}
          </ThemedView>

          <Button
            variant={isConfirmEnabled ? "accent" : "primary"}
            onPress={handleSubmit}
            disabled={!isConfirmEnabled}
            accessibilityLabel="Confirm payout"
          >
            Confirm
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showCurrencyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyPicker(false)}
        accessibilityViewIsModal
        accessibilityLabel="Currency selection"
      >
        <View style={styles.currencyModalOverlay}>
          <Pressable
            style={[StyleSheet.absoluteFill, styles.currencyModalBackdrop]}
            onPress={() => setShowCurrencyPicker(false)}
            accessibilityLabel="Close currency picker"
          />
          <View
            style={[
              styles.currencyModalContent,
              {
                backgroundColor: colors.surface,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                  },
                  android: { elevation: 16 },
                }),
              },
            ]}
          >
            {CURRENCIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => handleSelectCurrency(c)}
                style={styles.currencyOption}
                accessibilityRole="button"
                accessibilityLabel={`Select ${c}`}
              >
                <ThemedText type="default">{c}</ThemedText>
                {currency === c && (
                  <MaterialIcons name="check" size={20} color={colors.tint} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing(4),
  },
  section: {
    marginBottom: spacing(3),
  },
  label: {
    marginBottom: spacing(1),
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    fontSize: 16,
  },
  twoColRow: {
    flexDirection: "row",
    gap: spacing(2),
  },
  colAmount: {
    flex: 1,
  },
  colCurrency: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 88,
  },
  currencyPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 100,
    paddingVertical: 0,
  },
  hint: {
    marginTop: spacing(0.5),
    fontSize: 14,
  },
  currencyModalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  currencyModalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  currencyModalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: spacing(4),
    paddingTop: spacing(2),
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
  },
});
