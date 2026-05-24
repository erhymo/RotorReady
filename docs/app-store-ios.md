# RotorReady iOS / App Store setup

This project uses Capacitor to wrap the production web app as an iOS app.

## Current wrapper config

- App name: `RotorReady`
- Bundle ID: `com.rotorready.app`
- URL loaded by the app: `https://rotor-ready.com`
- Capacitor config: `capacitor.config.ts`
- Xcode workspace: `ios/App/App.xcworkspace`

## Useful commands

```bash
npm run ios:sync
npm run ios:open
```

## Fastlane upload setup

Local App Store Connect API config is stored outside the repository:

```bash
~/Mayday/Secure/RotorReady/AppStore/appstore.env
```

The private `.p8` key must stay in the same secure folder and must not be committed.

Before uploading, run the local release doctor from the repository root:

```bash
npm run appstore:doctor
npm run appstore:doctor -- --api
```

The doctor checks installed tools, Xcode platform/runtime state, local App Store
Connect config, the private key file, Fastfile syntax, and optionally the actual
App Store Connect API connection. It never prints secret values.

After fastlane is installed, run lanes from the iOS folder:

```bash
cd ios
fastlane validate_api
fastlane beta
```

Or use the repository shortcuts:

```bash
npm run appstore:validate
npm run ios:beta
```

- `validate_api` checks App Store Connect API access without uploading.
- `beta` runs Capacitor iOS sync, builds a signed IPA, and uploads it to TestFlight.

Use `ios:sync` after changing Capacitor config, native plugins, or web assets that must be copied into the iOS project.

## Xcode first-time setup

1. Open Xcode.
2. Go to **Xcode > Settings > Components**.
3. Install the matching iOS platform/simulator runtime if Xcode prompts for it.
4. Open `ios/App/App.xcworkspace` — not `App.xcodeproj`.
5. Select the `App` target.
6. Set **Signing & Capabilities**:
   - Team: your Apple Developer team
   - Bundle Identifier: `com.rotorready.app`
7. Set version/build:
   - Version: the next App Store version, e.g. `1.0.1` or newer
   - Build: the next available build number for that version
8. Choose a real device or simulator and run.

## Native QA checklist before each upload

Run this checklist after Vercel has deployed the exact commit you want the iOS wrapper to load.

### iPhone layout and safe areas

- Test at least one small device/simulator, e.g. iPhone SE.
- Test one notched device, e.g. iPhone 13/14/15.
- Confirm the global header is below the status bar/notch.
- Confirm `AppTopBar` pages do not hide under the global header.
- Confirm sticky quiz bottom bar is above the home indicator and does not cover answer content.
- Confirm Home `Prod`/info bell/aircraft badge do not overlap on narrow screens.

### Native shell behavior

- Confirm status bar text/icons are readable in light and dark mode.
- Confirm splash/launch screen looks clean and does not show a web flash.
- Confirm external links open safely and do not trap the user in the wrapper.
- Confirm orientation behavior is acceptable for training pages and CWP panels.

### Offline and network behavior

- Open Home, Settings, Quiz, Offline, Weather and Airports once while online.
- Download at least one offline package.
- Disable network and confirm downloaded offline content still opens where expected.
- Re-enable network and confirm Weather/Airports recover without restarting the app.

### App Store build hygiene

- Bump the iOS build number for every upload attempt.
- Do not reuse a closed version train in App Store Connect.
- Archive from `ios/App/App.xcworkspace`, not `App.xcodeproj`.
- Use **Product > Clean Build Folder** before a final archive if Xcode behaves unexpectedly.

## App Store Connect checklist

- Create an app with bundle ID `com.rotorready.app`.
- Add app icon and launch screen branding in Xcode.
- Add screenshots for required device sizes.
- Add Support URL and Privacy Policy URL.
- Complete privacy nutrition labels.
- Add review notes explaining that RotorReady is a training aid, not operational flight documentation.
- Upload via **Product > Archive** in Xcode, then distribute to App Store Connect/TestFlight.

## Review notes suggestion

RotorReady is a study and recurrent-training aid for helicopter procedures, limitations, and systems knowledge. It is not operational documentation and must not be used as a substitute for approved RFM/QRH/operator manuals or pilot judgment.

## Known local setup note

If CLI builds fail with a message like `iOS 26.4 is not installed`, install the matching iOS platform/runtime in **Xcode > Settings > Components**, then reopen Xcode and retry.
