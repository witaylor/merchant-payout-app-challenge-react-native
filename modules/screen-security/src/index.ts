import { requireOptionalNativeModule } from "expo";

const ScreenSecurity = requireOptionalNativeModule("ScreenSecurity");

export function getDeviceId(): string | null {
  return ScreenSecurity?.getDeviceId() ?? null;
}
