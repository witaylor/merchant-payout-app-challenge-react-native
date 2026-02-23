import ExpoModulesCore
import LocalAuthentication
import UIKit

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return UIDevice.current.identifierForVendor?.uuidString
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      let context = LAContext()
      var error: NSError?

      guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
        promise.reject("BIOMETRIC_NOT_AVAILABLE", "Biometrics not available")
        return
      }

      var hasResolved = false
      context.evaluatePolicy(
        .deviceOwnerAuthenticationWithBiometrics,
        localizedReason: "Authenticate to authorise this payout"
      ) { success, _ in
        DispatchQueue.main.async {
          guard !hasResolved else { return }
          hasResolved = true
          promise.resolve(success)
        }
      }
    }
    .runOnQueue(.main)
  }
}
