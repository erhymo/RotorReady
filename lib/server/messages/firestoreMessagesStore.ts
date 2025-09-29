import { Timestamp, FieldValue } from "firebase-admin/firestore";

import { adminDb } from "@/lib/firebase/admin";

export type ConversationMessage = {
  id: string;
  from: "user" | "admin";
  body: string;
  createdAt: string;
  readByAdmin: boolean;
  readByUser: boolean;
};

export type Conversation = {
  userId: string;
  userEmail?: string | null;
  createdAt: string;
  updatedAt: string;
  unreadForAdmin: number;
  unreadForUser: number;
};

const COLLECTION = "conversations";

function convDoc(userId: string) {
  return adminDb.collection(COLLECTION).doc(userId);
}

function messagesCollection(userId: string) {
  return convDoc(userId).collection("messages");
}

function toIso(timestamp: Timestamp | Date | string | null | undefined) {
  if (!timestamp) return new Date().toISOString();
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  if (timestamp instanceof Date) return timestamp.toISOString();
  if (typeof timestamp === "string") return timestamp;
  return new Date().toISOString();
}

export async function getConversation(userId: string) {
  const doc = await convDoc(userId).get();
  if (!doc.exists) return null;
  const data = doc.data() as Conversation;
  const messagesSnap = await messagesCollection(userId).orderBy("createdAt", "asc").get();
  const messages = messagesSnap.docs.map((d) => {
    const msg = d.data();
    return {
      id: d.id,
      from: msg.from,
      body: msg.body,
      createdAt: toIso(msg.createdAt),
      readByAdmin: Boolean(msg.readByAdmin),
      readByUser: Boolean(msg.readByUser),
    } satisfies ConversationMessage;
  });
  return {
    userId,
    userEmail: data.userEmail || null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    unreadForAdmin: data.unreadForAdmin ?? 0,
    unreadForUser: data.unreadForUser ?? 0,
    messages,
  };
}

export async function listConversations() {
  const snapshot = await adminDb.collection(COLLECTION).orderBy("updatedAt", "desc").get();
  return Promise.all(snapshot.docs.map((doc) => getConversation(doc.id))).then((list) => list.filter(Boolean));
}

export async function upsertUserMessage({
  userId,
  userEmail,
  body,
}: {
  userId: string;
  userEmail?: string | null;
  body: string;
}) {
  const now = new Date().toISOString();
  const docRef = convDoc(userId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) {
      tx.set(docRef, {
        userId,
        userEmail: userEmail || null,
        createdAt: now,
        updatedAt: now,
        unreadForAdmin: 1,
        unreadForUser: 0,
      });
    } else {
      tx.update(docRef, {
        userEmail: userEmail || snap.get("userEmail") || null,
        updatedAt: now,
        unreadForAdmin: FieldValue.increment(1),
        unreadForUser: 0,
      });
    }

    const msgRef = messagesCollection(userId).doc();
    tx.set(msgRef, {
      from: "user",
      body,
      createdAt: now,
      readByAdmin: false,
      readByUser: true,
    });
  });

  return getConversation(userId);
}

export async function upsertAdminMessage({
  userId,
  body,
}: {
  userId: string;
  body: string;
}) {
  const now = new Date().toISOString();
  const docRef = convDoc(userId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) {
      tx.set(docRef, {
        userId,
        userEmail: null,
        createdAt: now,
        updatedAt: now,
        unreadForAdmin: 0,
        unreadForUser: 1,
      });
    } else {
      tx.update(docRef, {
        updatedAt: now,
        unreadForAdmin: 0,
        unreadForUser: FieldValue.increment(1),
      });
    }

    const msgRef = messagesCollection(userId).doc();
    tx.set(msgRef, {
      from: "admin",
      body,
      createdAt: now,
      readByAdmin: true,
      readByUser: false,
    });
  });

  return getConversation(userId);
}

export async function markRead({
  userId,
  target,
}: {
  userId: string;
  target: "admin" | "user";
}) {
  const docRef = convDoc(userId);

  await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) return;
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (target === "admin") {
      updates.unreadForAdmin = 0;
      const messagesSnap = await tx.get(messagesCollection(userId));
      messagesSnap.docs.forEach((msg) => {
        if (!msg.get("readByAdmin")) {
          tx.update(msg.ref, { readByAdmin: true });
        }
      });
    } else {
      updates.unreadForUser = 0;
      const messagesSnap = await tx.get(messagesCollection(userId));
      messagesSnap.docs.forEach((msg) => {
        if (!msg.get("readByUser")) {
          tx.update(msg.ref, { readByUser: true });
        }
      });
    }

    tx.update(docRef, updates);
  });

  return getConversation(userId);
}
