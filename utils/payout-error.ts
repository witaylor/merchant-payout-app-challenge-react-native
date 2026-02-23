export const INSUFFICIENT_FUNDS_MESSAGE = "Insufficient funds.";

export const BIOMETRIC_NOT_AVAILABLE_MESSAGE =
  "Please set up biometric authentication in your device settings to complete payouts over £1,000.";

export const BIOMETRIC_CANCELLED_MESSAGE =
  "Biometric authentication was cancelled.";

export const WEB_PAYOUT_LIMIT_MESSAGE =
  "Payouts over £1,000 are only available in the mobile app.";

const NETWORK_ERROR_PATTERNS = [
  "failed to fetch",
  "network request failed",
  "network error",
  "load failed",
  "connection",
];

/**
 * Maps API and network errors to user-friendly payout error messages.
 */
export function getPayoutErrorMessage(error: Error): string {
  const msg = error.message.toLowerCase();

  if (msg.includes("insufficient funds")) {
    return INSUFFICIENT_FUNDS_MESSAGE;
  }
  if (msg.includes("service temporarily unavailable")) {
    return "Service temporarily unavailable. Please try again later.";
  }
  if (NETWORK_ERROR_PATTERNS.some((p) => msg.includes(p))) {
    return "A network error occurred. Please check your connection and try again.";
  }

  return error.message || "Something went wrong. Please try again.";
}
