import { useCallback, useState } from "react";

import type { PayoutFormData } from "@/components/payout/payout-form";
import { DEFAULT_CURRENCY } from "@/constants/currencies";
import { useMerchant } from "@/hooks/use-merchant";
import { usePayoutMutation } from "@/hooks/use-payout-mutation";
import { normalizeIban } from "@/utils/iban";
import { formatPayoutAmountForDisplay, toMinorUnits } from "@/utils/payout";
import {
  getPayoutErrorMessage,
  INSUFFICIENT_FUNDS_MESSAGE,
} from "@/utils/payout-error";

type ScreenState = "form" | "confirming" | "success" | "failed";

export function usePayoutFlow() {
  const [screenState, setScreenState] = useState<ScreenState>("form");
  const [formData, setFormData] = useState<PayoutFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: merchant } = useMerchant();
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

    // Client-side balance check. When payout currency matches account currency we
    // compare directly. When it differs (e.g. EUR payout from GBP account), we use
    // a 1:1 minor-units heuristic since we don't have exchange rates client-side.
    if (merchant && amountInMinorUnits > merchant.available_balance) {
      setErrorMessage(INSUFFICIENT_FUNDS_MESSAGE);
      setScreenState("failed");
      return;
    }

    try {
      await mutation.mutateAsync({
        amount: amountInMinorUnits,
        currency: formData.currency,
        iban: ibanClean,
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
  }, [formData, merchant, mutation]);

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
