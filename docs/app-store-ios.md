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
   - Version: `1.0`
   - Build: `1` or next available build number
8. Choose a real device or simulator and run.

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
