package com.anonymous.reactnativeinterview.screensecurity

import android.os.Build
import android.app.Activity
import java.util.concurrent.atomic.AtomicBoolean
import android.provider.Settings
import androidx.biometric.BiometricManager
import androidx.core.os.bundleOf
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

  private val safeCurrentActivity
    get() = appContext.currentActivity

  private var screenCaptureCallback: Activity.ScreenCaptureCallback? = null
  private var isRegistered = false

  override fun definition() = ModuleDefinition {
    Name("ScreenSecurity")

    Events("onScreenshotTaken")

    OnCreate {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        screenCaptureCallback = Activity.ScreenCaptureCallback {
          this@ScreenSecurityModule.sendEvent("onScreenshotTaken", bundleOf())
        }
        registerScreenCaptureCallbackIfNeeded()
      }
    }

    OnActivityEntersForeground {
      registerScreenCaptureCallbackIfNeeded()
    }

    OnActivityEntersBackground {
      unregisterScreenCaptureCallback()
    }

    OnDestroy {
      unregisterScreenCaptureCallback()
    }

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

  private fun registerScreenCaptureCallbackIfNeeded() {
    if (isRegistered) return
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return
    val activity = safeCurrentActivity ?: return
    val callback = screenCaptureCallback ?: return
    activity.runOnUiThread {
      if (!isRegistered) {
        activity.registerScreenCaptureCallback(
          ContextCompat.getMainExecutor(context),
          callback,
        )
        isRegistered = true
      }
    }
  }

  private fun unregisterScreenCaptureCallback() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return
    val activity = safeCurrentActivity
    val callback = screenCaptureCallback
    if (activity != null && callback != null && isRegistered) {
      activity.runOnUiThread {
        try {
          activity.unregisterScreenCaptureCallback(callback)
        } catch (_: Throwable) {
          // Activity may be destroyed; ignore
        }
        isRegistered = false
      }
    } else {
      isRegistered = false
    }
  }
}
