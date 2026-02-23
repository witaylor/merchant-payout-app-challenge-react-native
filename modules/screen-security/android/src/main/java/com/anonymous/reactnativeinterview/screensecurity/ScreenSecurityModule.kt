package com.anonymous.reactnativeinterview.screensecurity

import java.util.concurrent.atomic.AtomicBoolean
import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

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

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      val activity = appContext.currentActivity as? FragmentActivity
        ?: run {
          promise.reject("NO_ACTIVITY", "No activity available", null)
          return@AsyncFunction
        }

      val biometricManager = BiometricManager.from(context)
      when (biometricManager.canAuthenticate(BIOMETRIC_STRONG)) {
        BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED,
        BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE,
        BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE,
        BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> {
          promise.reject("BIOMETRIC_NOT_AVAILABLE", "Biometrics not available", null)
          return@AsyncFunction
        }
      }

      val settled = AtomicBoolean(false)
      fun settleOnce(resolved: Boolean) {
        if (settled.compareAndSet(false, true)) {
          try {
            promise.resolve(resolved)
          } catch (_: Throwable) {
            // Bridge may have been torn down (e.g. during reload); ignore
          }
        }
      }

      activity.runOnUiThread {
        val executor = ContextCompat.getMainExecutor(context)
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
          .setTitle("Authenticate")
          .setSubtitle("Authenticate to authorise this payout")
          .setNegativeButtonText("Cancel")
          .build()

        val biometricPrompt = BiometricPrompt(
          activity,
          executor,
          object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
              settleOnce(true)
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
              settleOnce(false)
            }

            override fun onAuthenticationFailed() {
              // Do not resolve - device prompts user to retry; wait for success or error (cancel)
            }
          }
        )

        biometricPrompt.authenticate(promptInfo)
      }
    }
  }
}
