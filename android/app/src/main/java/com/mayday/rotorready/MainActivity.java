package com.mayday.rotorready;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Before super.onCreate() on purpose: registerPlugin() only adds to
        // BridgeActivity's bridgeBuilder, and the Bridge itself is constructed
        // from that builder inside super.onCreate(). Registering afterwards
        // leaves the plugin invisible to JS.
        registerPlugin(BackgroundAudioPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
