import fs from "fs";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "public", "quiz-data", "messages.json");

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
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  unreadForAdmin: number;
  unreadForUser: number;
};

export type MessageStore = {
  conversations: Conversation[];
};

function ensureStore(): MessageStore {
  if (!fs.existsSync(FILE)) {
    const initial: MessageStore = { conversations: [] };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const content = fs.readFileSync(FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.conversations)) {
      throw new Error("Invalid messages store structure");
    }
    const withDefaults: MessageStore = {
      conversations: parsed.conversations.map((conv: Conversation) => ({
        unreadForAdmin: 0,
        unreadForUser: 0,
        ...conv,
        messages: Array.isArray(conv.messages) ? conv.messages : [],
      })),
    };
    return withDefaults;
  } catch {
    const fallback: MessageStore = { conversations: [] };
    fs.writeFileSync(FILE, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

function writeStore(store: MessageStore) {
  fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
}

function findConversation(store: MessageStore, userId: string) {
  return store.conversations.find((conv) => conv.userId === userId) || null;
}

export function getConversation(userId: string): Conversation | null {
  const store = ensureStore();
  return findConversation(store, userId);
}

export function upsertUserMessage({
  userId,
  userEmail,
  body,
}: {
  userId: string;
  userEmail?: string | null;
  body: string;
}): Conversation {
  const store = ensureStore();
  const now = new Date().toISOString();
  let conversation = findConversation(store, userId);
  const message: ConversationMessage = {
    id: crypto.randomUUID(),
    from: "user",
    body,
    createdAt: now,
    readByAdmin: false,
    readByUser: true,
  };
  if (!conversation) {
    conversation = {
      userId,
      userEmail: userEmail || null,
      messages: [message],
      createdAt: now,
      updatedAt: now,
      unreadForAdmin: 1,
      unreadForUser: 0,
    };
    store.conversations.push(conversation);
  } else {
    conversation.messages.forEach((msg) => {
      if (msg.from === "admin") msg.readByUser = true;
    });
    conversation.messages.push(message);
    conversation.updatedAt = now;
    conversation.userEmail = userEmail || conversation.userEmail || null;
    conversation.unreadForAdmin += 1;
    conversation.unreadForUser = 0;
  }
  writeStore(store);
  return conversation;
}

export function upsertAdminMessage({
  userId,
  body,
}: {
  userId: string;
  body: string;
}): Conversation {
  const store = ensureStore();
  const now = new Date().toISOString();
  let conversation = findConversation(store, userId);
  const message: ConversationMessage = {
    id: crypto.randomUUID(),
    from: "admin",
    body,
    createdAt: now,
    readByAdmin: true,
    readByUser: false,
  };
  if (!conversation) {
    conversation = {
      userId,
      userEmail: null,
      messages: [message],
      createdAt: now,
      updatedAt: now,
      unreadForAdmin: 0,
      unreadForUser: 1,
    };
    store.conversations.push(conversation);
  } else {
    conversation.messages.push(message);
    conversation.updatedAt = now;
    conversation.unreadForUser += 1;
    conversation.unreadForAdmin = 0;
  }
  writeStore(store);
  return conversation;
}

export function markRead({
  userId,
  target,
}: {
  userId: string;
  target: "admin" | "user";
}): Conversation | null {
  const store = ensureStore();
  const conversation = findConversation(store, userId);
  if (!conversation) return null;
  if (target === "admin") {
    conversation.messages.forEach((msg) => {
      if (!msg.readByAdmin) msg.readByAdmin = true;
    });
    conversation.unreadForAdmin = 0;
  } else {
    conversation.messages.forEach((msg) => {
      if (!msg.readByUser) msg.readByUser = true;
    });
    conversation.unreadForUser = 0;
  }
  writeStore(store);
  return conversation;
}

export function listConversations(): Conversation[] {
  const store = ensureStore();
  return [...store.conversations].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}
