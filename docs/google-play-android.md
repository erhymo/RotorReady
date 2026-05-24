# RotorReady Android / Google Play setup

This project uses Capacitor to wrap the production web app as an Android app.

## Current wrapper config

- App name: `RotorReady`
- Android package name: `com.mayday.rotorready`
- URL loaded by the app: `https://rotor-ready.com`
- Capacitor config: `capacitor.config.ts`
- Android project: `android/`

## Local signing

Release signing is configured by local files that must never be committed:

```bash
android/keystore.properties
android/app/upload-keystore.jks
```

The upload keystore is also backed up under:

```bash
~/Mayday/Secure/RotorReady/Android/
```

## Google Play API setup

Google Play upload automation needs a Google Play Developer API service account
JSON key. Firebase Admin SDK JSON keys are not sufficient unless that exact
service account is also granted access in Play Console.

Store the Play API config outside the repository:

```bash
~/Mayday/Secure/RotorReady/GooglePlay/playstore.env
```

Expected variables:

```bash
GOOGLE_PLAY_PACKAGE_NAME=com.mayday.rotorready
GOOGLE_PLAY_JSON_KEY_PATH=/Users/oyvindmyhre/Mayday/Secure/RotorReady/GooglePlay/google-play-service-account.json
GOOGLE_PLAY_TRACK=internal
```

The private JSON key must stay in the same secure folder and must not be committed.

## Doctor and upload commands

Run the local release doctor from the repository root:

```bash
npm run googleplay:doctor
npm run googleplay:doctor -- --api
```

The doctor checks installed tools, Android signing files, local Google Play API
config, the private JSON key file, Fastfile syntax, and optionally the actual
Google Play API connection. It never prints secret values.

Upload to internal testing:

```bash
npm run googleplay:internal
```

## Creating the Google Play API key

In Google Play Console:

1. Go to **Setup > API access**.
2. Link or create a Google Cloud project if prompted.
3. Create a service account for release uploads.
4. Grant it access to RotorReady in Play Console.
5. Use a role that can upload releases, e.g. Release Manager.
6. Download the JSON key once and store it in:

```bash
~/Mayday/Secure/RotorReady/GooglePlay/
```

Then update `playstore.env` to point at that JSON file.