package com.anonymous.reactnativeinterview.screensecurity

import android.provider.Settings
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Function("getDeviceId") {
      Settings.Secure.getString(
        context.contentResolver,
        Settings.Secure.ANDROID_ID,
      )
    }
  }
}
