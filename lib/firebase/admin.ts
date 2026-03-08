import { createRequire } from "module";

import { serverEnv } from "@/lib/env";

type FirebaseAdminAppModule = {
  getApps: () => unknown[];
  initializeApp: (options?: unknown) => unknown;
  applicationDefault: () => unknown;
  cert: (serviceAccount: { projectId: string; clientEmail: string; privateKey: string }) => unknown;
};

type FirebaseAdminFirestoreModule = {
  getFirestore: () => any;
};

type FirebaseAdminAuthModule = {
  getAuth: () => any;
};

type FirebaseAdminServices = {
  adminDb: any;
  adminAuth: any;
};

const require = createRequire(import.meta.url);
const firebaseAdminModuleIds = {
  app: ["firebase-admin", "app"].join("/"),
  firestore: ["firebase-admin", "firestore"].join("/"),
  auth: ["firebase-admin", "auth"].join("/"),
} as const;

function getConfig() {
  const projectId = serverEnv.FIREBASE_PROJECT_ID;
  const clientEmail = serverEnv.FIREBASE_CLIENT_EMAIL;
  const privateKey = serverEnv.FIREBASE_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

let cachedServices: FirebaseAdminServices | null = null;
let cachedLoadError: Error | null = null;

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

function getFirebaseAdminServices(): FirebaseAdminServices {
  if (cachedServices) return cachedServices;
  if (cachedLoadError) throw cachedLoadError;

  try {
    const appModule = require(firebaseAdminModuleIds.app) as FirebaseAdminAppModule;
    const firestoreModule = require(firebaseAdminModuleIds.firestore) as FirebaseAdminFirestoreModule;
    const authModule = require(firebaseAdminModuleIds.auth) as FirebaseAdminAuthModule;

    const existing = appModule.getApps();
    if (!existing.length) {
      const cfg = getConfig();
      if (cfg) {
        appModule.initializeApp({
          credential: appModule.cert({
            projectId: cfg.projectId,
            clientEmail: cfg.clientEmail,
            privateKey: cfg.privateKey,
          }),
        });
      } else {
        // Do not fail at import/build time; try default credentials when the SDK is actually used.
        appModule.initializeApp({ credential: appModule.applicationDefault() });
      }
    }

    cachedServices = {
      adminDb: firestoreModule.getFirestore(),
      adminAuth: authModule.getAuth(),
    };

    return cachedServices;
  } catch (error) {
    const reason = toError(error);
    cachedLoadError = new Error(`Firebase Admin SDK er ikke tilgjengelig i dette miljøet: ${reason.message}`);
    throw cachedLoadError;
  }
}

function createBoundProxy<T extends object>(getter: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const target = getter();
      const value = Reflect.get(target as object, property, target as object);
      return typeof value === "function" ? value.bind(target) : value;
    },
    set(_target, property, value) {
      const target = getter() as Record<PropertyKey, unknown>;
      target[property] = value;
      return true;
    },
    has(_target, property) {
      return property in getter();
    },
    ownKeys() {
      return Reflect.ownKeys(getter());
    },
    getOwnPropertyDescriptor(_target, property) {
      return Object.getOwnPropertyDescriptor(getter(), property) ?? {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined,
      };
    },
  });
}

export const adminDb = createBoundProxy(() => getFirebaseAdminServices().adminDb);
export const adminAuth = createBoundProxy(() => getFirebaseAdminServices().adminAuth);
