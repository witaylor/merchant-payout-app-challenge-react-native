import ExpoModulesCore
import UIKit

public class ScreenSecurityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return UIDevice.current.identifierForVendor?.uuidString ?? ""
    }
  }
}
