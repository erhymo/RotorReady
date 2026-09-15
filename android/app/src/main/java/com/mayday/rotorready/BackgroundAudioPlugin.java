package com.mayday.rotorready;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * Thin bridge between the audio player (app/audio/play/AudioPlayerClient.tsx,
 * via lib/backgroundAudio.ts) and BackgroundAudioService.
 *
 * The JS side already knows exactly when playback starts and stops, so the
 * plugin carries no state of its own — it forwards two calls and nothing else.
 */
@CapacitorPlugin(
    name = "BackgroundAudio",
    permissions = {
        @Permission(alias = BackgroundAudioPlugin.NOTIFICATIONS, strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public class BackgroundAudioPlugin extends Plugin {

    static final String NOTIFICATIONS = "notifications";

    @PluginMethod
    public void start(PluginCall call) {
        // Android 13+ hides the foreground service's notification unless
        // POST_NOTIFICATIONS is granted. The service — and therefore playback —
        // runs either way, so this is asked for once to get the playback tile on
        // the lock screen, never treated as a precondition for starting.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !hasNotificationPermission()) {
            // Save the call so the result survives the permission dialog, then
            // start regardless of the answer in the callback below.
            requestPermissionForAlias(NOTIFICATIONS, call, "afterPermission");
            return;
        }
        startService(call);
    }

    @PermissionCallback
    private void afterPermission(PluginCall call) {
        // Granted or denied, the service is what keeps audio alive — start it.
        startService(call);
    }

    private boolean hasNotificationPermission() {
        return ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void startService(PluginCall call) {
        String title = call.getString("title", "RotorReady");
        String artist = call.getString("artist", "Audio");
        try {
            BackgroundAudioService.start(getContext(), title, artist);
            call.resolve();
        } catch (Exception e) {
            // Starting a foreground service can be refused (for example under
            // background-start restrictions). Reject rather than crash — the JS
            // caller treats this as best-effort and keeps playing.
            call.reject("Could not start playback service", e);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        try {
            BackgroundAudioService.stop(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject("Could not stop playback service", e);
        }
    }
}
