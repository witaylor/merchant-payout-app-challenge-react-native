import { useCallback, useState } from "react";
import { Platform } from "react-native";
import { getDeviceId, isBiometricAuthenticated } from "screen-security";

import type { PayoutFormData } from "@/components/payout/payout-form";
import { DEFAULT_CURRENCY } from "@/constants/currencies";
import { usePayoutMutation } from "@/hooks/use-payout-mutation";
import { normalizeIban } from "@/utils/iban";
import {
  BIOMETRIC_THRESHOLD_MINOR_UNITS,
  formatPayoutAmountForDisplay,
  toMinorUnits,
} from "@/utils/payout";
import {
  BIOMETRIC_CANCELLED_MESSAGE,
  BIOMETRIC_NOT_AVAILABLE_MESSAGE,
  getPayoutErrorMessage,
  WEB_PAYOUT_LIMIT_MESSAGE,
} from "@/utils/payout-error";

type ScreenState = "form" | "confirming" | "success" | "failed";

export function usePayoutFlow() {
  const [screenState, setScreenState] = useState<ScreenState>("form");
  const [formData, setFormData] = useState<PayoutFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const mutation = usePayoutMutation();

  const handleFormSubmit = useCallback((data: PayoutFormData) => {
    setFormData(data);
    setScreenState("confirming");
  }, []);

  const handleConfirmCancel = useCallback(() => {
    setScreenState("form");
  }, []);

  const handleConfirmConfirm = useCallback(async () => {
    if (!formData) return;

    const amountInMinorUnits = toMinorUnits(formData.amount);
    const ibanClean = normalizeIban(formData.iban);

    if (amountInMinorUnits > BIOMETRIC_THRESHOLD_MINOR_UNITS) {
      try {
        const authenticated = await isBiometricAuthenticated();
        if (!authenticated) {
          setErrorMessage(BIOMETRIC_CANCELLED_MESSAGE);
          setScreenState("failed");
          return;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const code = (error as Error & { code?: string }).code;
        const msg = error.message ?? "";
        if (
          code === "BIOMETRIC_NOT_AVAILABLE" ||
          msg.includes("BIOMETRIC_NOT_AVAILABLE")
        ) {
          setErrorMessage(
            Platform.OS === "web"
              ? WEB_PAYOUT_LIMIT_MESSAGE
              : BIOMETRIC_NOT_AVAILABLE_MESSAGE,
          );
        } else {
          setErrorMessage(getPayoutErrorMessage(error));
        }
        setScreenState("failed");
        return;
      }
    }

    try {
      const deviceId = getDeviceId();
      await mutation.mutateAsync({
        amount: amountInMinorUnits,
        currency: formData.currency,
        iban: ibanClean,
        ...(deviceId && { device_id: deviceId }),
      });
      setScreenState("success");
    } catch (err) {
      setErrorMessage(
        getPayoutErrorMessage(
          err instanceof Error ? err : new Error(String(err)),
        ),
      );
      setScreenState("failed");
    }
  }, [formData, mutation]);

  const handleCreateAnother = useCallback(() => {
    setFormData(null);
    setScreenState("form");
  }, []);

  const handleTryAgain = useCallback(() => {
    setErrorMessage("");
    setScreenState("form");
  }, []);

  const formattedAmount =
    formData && formData.amount
      ? formatPayoutAmountForDisplay(formData.amount, formData.currency)
      : "";

  return {
    state: { screenState, formData, errorMessage },
    handlers: {
      handleFormSubmit,
      handleConfirmCancel,
      handleConfirmConfirm,
      handleCreateAnother,
      handleTryAgain,
    },
    formattedAmount,
    mutation,
    defaultFormData: {
      amount: "",
      currency: DEFAULT_CURRENCY,
      iban: "",
    } as PayoutFormData,
  };
}
