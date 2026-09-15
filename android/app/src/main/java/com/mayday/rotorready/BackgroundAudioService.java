package com.mayday.rotorready;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.app.Service;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

/**
 * Keeps the app's process alive while a podcast episode is playing.
 *
 * Android suspends a backgrounded process within seconds of the screen going
 * off, which silences the WebView's <audio> element — the reason playback died
 * the moment the phone went into a pocket. A foreground service is the
 * supported way to tell the OS this process is doing something the user
 * knowingly started, and the notification it requires doubles as the playback
 * tile on the lock screen.
 *
 * The service deliberately owns no player of its own: the WebView is still the
 * thing decoding audio. This only holds the process open, which keeps the fix
 * small and avoids a second source of truth for playback state.
 */
public class BackgroundAudioService extends Service {

    public static final String ACTION_START = "com.mayday.rotorready.AUDIO_START";
    public static final String ACTION_STOP = "com.mayday.rotorready.AUDIO_STOP";
    public static final String EXTRA_TITLE = "title";
    public static final String EXTRA_ARTIST = "artist";

    private static final String CHANNEL_ID = "rotorready_playback";
    private static final int NOTIFICATION_ID = 142;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            removeNotificationAndStop();
            return START_NOT_STICKY;
        }

        String title = "RotorReady";
        String artist = "Audio";
        if (intent != null) {
            if (intent.getStringExtra(EXTRA_TITLE) != null) title = intent.getStringExtra(EXTRA_TITLE);
            if (intent.getStringExtra(EXTRA_ARTIST) != null) artist = intent.getStringExtra(EXTRA_ARTIST);
        }

        createChannel();
        startForeground(NOTIFICATION_ID, buildNotification(title, artist));

        // START_NOT_STICKY: if the OS kills the process under memory pressure the
        // audio is gone anyway, so resurrecting a service with no player behind
        // it would only leave a notification for something that is not playing.
        return START_NOT_STICKY;
    }

    /** stopForeground(boolean) is deprecated from API 33; the flag form is the replacement. */
    private void removeNotificationAndStop() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(Service.STOP_FOREGROUND_REMOVE);
        } else {
            stopForeground(true);
        }
        stopSelf();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager == null || manager.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Playback",
                // LOW keeps it silent and un-intrusive: this notification exists to
                // satisfy the foreground-service requirement and to carry the
                // playback tile, not to get the user's attention.
                NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Shows the episode while audio is playing");
        channel.setShowBadge(false);
        manager.createNotificationChannel(channel);
    }

    private Notification buildNotification(String title, String artist) {
        Intent open = new Intent(this, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, open, flags);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(artist)
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(contentIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setOngoing(true)
                .setSilent(true)
                .build();
    }

    public static void start(Context context, String title, String artist) {
        Intent intent = new Intent(context, BackgroundAudioService.class);
        intent.setAction(ACTION_START);
        intent.putExtra(EXTRA_TITLE, title);
        intent.putExtra(EXTRA_ARTIST, artist);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }

    public static void stop(Context context) {
        Intent intent = new Intent(context, BackgroundAudioService.class);
        intent.setAction(ACTION_STOP);
        // startService rather than stopService so the running instance gets the
        // STOP action and can call stopForeground(true); stopService would kill it
        // without clearing the notification on some versions.
        context.startService(intent);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
