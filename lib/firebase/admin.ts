import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

import { isProduction, serverEnv } from "@/lib/env";

function getConfig() {
  const projectId = serverEnv.FIREBASE_PROJECT_ID;
  const clientEmail = serverEnv.FIREBASE_CLIENT_EMAIL;
  const privateKey = serverEnv.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

const existing = getApps();
if (!existing.length) {
  const cfg = getConfig();
  if (cfg) {
    initializeApp({
      credential: cert({
        projectId: cfg.projectId,
        clientEmail: cfg.clientEmail,
        privateKey: cfg.privateKey,
      }),
    });
  } else {
    // Production fallback: do not throw during build; attempt applicationDefault.
    // In real production runtime, credentials should be provided via env/secrets.
    initializeApp({ credential: applicationDefault() });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
