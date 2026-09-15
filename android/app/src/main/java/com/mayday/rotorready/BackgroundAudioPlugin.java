package com.mayday.rotorready;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Thin bridge between the audio player (app/audio/play/AudioPlayerClient.tsx,
 * via lib/backgroundAudio.ts) and BackgroundAudioService.
 *
 * The JS side already knows exactly when playback starts and stops, so the
 * plugin carries no state of its own — it forwards two calls and nothing else.
 */
@CapacitorPlugin(name = "BackgroundAudio")
public class BackgroundAudioPlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
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
