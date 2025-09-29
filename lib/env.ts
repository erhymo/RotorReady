// Centralized environment access with minimal validation.
// - Never import this into client components.
// - Only validate strictly in production to keep DX smooth.

function isProd() {
  return process.env.NODE_ENV === "production";
}

function get(name: string) {
  return process.env[name];
}

function requireIfProd(name: string) {
  const v = get(name);
  if (isProd() && (!v || v.length === 0)) {
    throw new Error(`Missing required env: ${name}`);
  }
  return v || "";
}

// Public (exposed) env — only NEXT_PUBLIC_* keys should be here.
export const publicEnv = {
  NEXT_PUBLIC_BASE_URL: get("NEXT_PUBLIC_BASE_URL") || "",
  NEXT_PUBLIC_STRIPE_PRICE_ID: get("NEXT_PUBLIC_STRIPE_PRICE_ID") || "",
  NEXT_PUBLIC_FIREBASE_API_KEY: get("NEXT_PUBLIC_FIREBASE_API_KEY") || "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: get("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") || "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: get("NEXT_PUBLIC_FIREBASE_PROJECT_ID") || "",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: get("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") || "",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: get("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") || "",
  NEXT_PUBLIC_FIREBASE_APP_ID: get("NEXT_PUBLIC_FIREBASE_APP_ID") || "",
};

// Server-only env and validation
export const serverEnv = {
  // Stripe
  STRIPE_SECRET_KEY: get("STRIPE_SECRET_KEY") || "",
  STRIPE_WEBHOOK_SECRET: get("STRIPE_WEBHOOK_SECRET") || "",
  STRIPE_PRICE_ID: get("STRIPE_PRICE_ID") || "",
  STRIPE_PORTAL_RETURN_URL: get("STRIPE_PORTAL_RETURN_URL") || "",

  // Firebase Admin
  FIREBASE_PROJECT_ID: get("FIREBASE_PROJECT_ID") || "",
  FIREBASE_CLIENT_EMAIL: get("FIREBASE_CLIENT_EMAIL") || "",
  FIREBASE_PRIVATE_KEY: (get("FIREBASE_PRIVATE_KEY") || "").replace(/\\n/g, "\n"),

  // Admin auth
  ADMIN_USERNAME: get("ADMIN_USERNAME") || "",
  ADMIN_PASSWORD: get("ADMIN_PASSWORD") || "",
};

export const isProduction = isProd();
