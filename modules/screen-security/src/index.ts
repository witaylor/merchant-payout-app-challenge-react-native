import { requireOptionalNativeModule } from "expo";

const ScreenSecurity = requireOptionalNativeModule("ScreenSecurity");

const NO_OP_SUBSCRIPTION = { remove: () => {} };

export function getDeviceId(): string | null {
  return ScreenSecurity?.getDeviceId() ?? null;
}

export function isBiometricAuthenticated(): Promise<boolean> {
  if (!ScreenSecurity?.isBiometricAuthenticated) {
    const error = Object.assign(new Error("Biometrics not available"), {
      code: "BIOMETRIC_NOT_AVAILABLE",
    });
    return Promise.reject(error);
  }
  return ScreenSecurity.isBiometricAuthenticated();
}

export function addScreenshotTakenListener(callback: () => void): { remove: () => void } {
  const subscription = ScreenSecurity?.addListener?.("onScreenshotTaken", callback);
  return subscription ?? NO_OP_SUBSCRIPTION;
}
