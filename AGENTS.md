# RotorReady agent workflow

This file defines the preferred AI-assistant workflow for this repository. Future chats/agents should read this before doing release or git work.

## Project context

- RotorReady is a Next.js/React/TypeScript training app for helicopter pilots.
- Native iOS and Android apps are Capacitor wrappers that load `https://rotor-ready.com`.
- The app is a training aid only. It must not be described as operational documentation.
- Do not search for, print, or expose secrets.

## Safety rules

- Do not commit, push, deploy, submit, or promote anything unless the user explicitly asks.
- Never print secret values, private keys, service account JSON, keystore passwords, tokens, cookies, or environment files.
- Local secret material is stored outside the repo under `~/Mayday/Secure/RotorReady/`.
- Use the existing doctor scripts before store uploads.
- Prefer small, conservative changes and run relevant checks after edits.

## User command: `commit og push`

When the user writes `commit og push`, treat it as explicit permission to:

1. Check `git status`.
2. Review changed files without exposing secrets.
3. Run relevant safe checks when appropriate, such as:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build` for larger/riskier app changes
4. Create a concise commit message.
5. Commit the current intended changes.
6. Push to GitHub.

Expected result:

- GitHub receives the commit.
- Vercel should normally deploy the web app from the pushed branch.
- Summarize commit hash, branch, checks run, and push result.

Do not include unrelated local files or obvious secret files in the commit.

## User command: `doctor`

When the user writes `doctor`, run release readiness checks only:

```bash
npm run appstore:doctor -- --api
npm run googleplay:doctor -- --api
```

Stop and report if either doctor fails. Do not upload builds from this command.

## User command: `deploy`

When the user writes `deploy`, treat it as explicit permission to upload new native builds to the configured test/release staging destinations.

Default flow:

1. Run both release doctors:
   ```bash
   npm run appstore:doctor -- --api
   npm run googleplay:doctor -- --api
   ```
2. If both pass, run iOS upload:
   ```bash
   npm run ios:beta
   ```
3. If iOS succeeds, run Android internal upload:
   ```bash
   npm run googleplay:internal
   ```

Meaning:

- iOS: build and upload to App Store Connect/TestFlight.
- Android: build and upload to Google Play internal testing.

Stop immediately and report if any step fails.

## User command: `ios deploy`

Run only the iOS part:

```bash
npm run appstore:doctor -- --api
npm run ios:beta
```

## User command: `android deploy`

Run only the Android part:

```bash
npm run googleplay:doctor -- --api
npm run googleplay:internal
```

## User command: `promoter til prod`

This is a separate, higher-risk command.

Meaning:

- Move or release an already uploaded build to public production users.
- For iOS this may involve App Store Connect review/release steps.
- For Android this may involve promoting a build from internal/closed/open testing to production.

Do not run production promotion unless the user explicitly asks for `promoter til prod` or gives equally clear instructions.

## Current RotorReady release commands

```bash
npm run appstore:doctor -- --api
npm run ios:beta
npm run googleplay:doctor -- --api
npm run googleplay:internal
```

## How to reuse this workflow in other apps

Copy this `AGENTS.md` file to the root of each app repository and adapt the project-specific commands. The command names can stay the same, but the underlying scripts may differ per app.