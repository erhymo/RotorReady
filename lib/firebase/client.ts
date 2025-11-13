'use client';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

function hasValidConfig() {
  // Require the minimum keys; others are optional for our usage
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

let firebaseApp: FirebaseApp | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;

try {
  if (hasValidConfig()) {
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
    auth = getAuth(firebaseApp);
    // Note: Do not auto sign in anonymously at startup; wait for real session to restore.
    // If anonymous access is needed for a specific feature, sign in there on-demand.
    db = getFirestore(firebaseApp);
  } else {
    // Running locally without env vars: leave undefined so callers can guard
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[firebase/client] Missing NEXT_PUBLIC_FIREBASE_* env vars; Firebase disabled on client.');
    }
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('[firebase/client] Failed to initialize Firebase:', err);
}

export { firebaseApp, auth, db };
export { firebaseConfig };
