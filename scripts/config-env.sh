#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Konfigurerer .env.local (interaktivt). Tomt svar hopper over et felt."

read -rp "NEXT_PUBLIC_FIREBASE_API_KEY: " F_API || true
read -rp "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: " F_AUTH || true
read -rp "NEXT_PUBLIC_FIREBASE_PROJECT_ID: " F_PID || true
read -rp "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: " F_BUCKET || true
read -rp "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: " F_MSG || true
read -rp "NEXT_PUBLIC_FIREBASE_APP_ID: " F_APP || true

read -rp "Konfigurere Firebase Admin nå? (y/N): " ADMIN || true
ADMIN=${ADMIN:-N}

F_ADMIN_PID=""
F_ADMIN_EMAIL=""
F_ADMIN_KEY_ESC=""

if [[ "${ADMIN,,}" == "y" ]]; then
  read -rp "FIREBASE_PROJECT_ID (admin): " F_ADMIN_PID || true
  read -rp "FIREBASE_CLIENT_EMAIL: " F_ADMIN_EMAIL || true
  echo "Lim inn FIREBASE_PRIVATE_KEY (multi-line). Avslutt med en linje som kun inneholder: __END_KEY__"
  RAW=""
  while IFS= read -r LINE; do
    [[ "$LINE" == "__END_KEY__" ]] && break
    RAW+="${LINE}"$'\n'
  done
  # escape til \n for env
  F_ADMIN_KEY_ESC=$(printf '%s' "$RAW" | sed ':a;N;$!ba;s/\n/\\n/g')
fi

read -rp "STRIPE_SECRET_KEY (sk_test_...): " STRIPE_KEY || true
read -rp "STRIPE_WEBHOOK_SECRET (whsec_...): " STRIPE_WH || true
read -rp "STRIPE_PORTAL_RETURN_URL [default http://localhost:3000/account]: " STRIPE_RET || true
STRIPE_RET=${STRIPE_RET:-http://localhost:3000/account}

cat > .env.local <<EOF
# --- Firebase client (web SDK) ---
NEXT_PUBLIC_FIREBASE_API_KEY=${F_API}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${F_AUTH}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${F_PID}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${F_BUCKET}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${F_MSG}
NEXT_PUBLIC_FIREBASE_APP_ID=${F_APP}

# --- Firebase Admin (server) ---
FIREBASE_PROJECT_ID=${F_ADMIN_PID}
FIREBASE_CLIENT_EMAIL=${F_ADMIN_EMAIL}
FIREBASE_PRIVATE_KEY=${F_ADMIN_KEY_ESC}

# --- Stripe ---
STRIPE_SECRET_KEY=${STRIPE_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WH}
STRIPE_PORTAL_RETURN_URL=${STRIPE_RET}
EOF

echo "✅ Skrev .env.local"

