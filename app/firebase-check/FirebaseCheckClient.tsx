"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { firebaseApp } from "../../lib/firebase";

export default function FirebaseCheckClient() {
  const [ok, setOk] = useState<"pending" | "ok" | "fail">("pending");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore(firebaseApp);
        await getDoc(doc(db, "__healthcheck__", "dummyDoc"));
        setOk("ok");
        setMsg("Firebase init OK and env available in client.");
      } catch (e: any) {
        setOk("fail");
        setMsg(e?.message ?? String(e));
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Firebase check</h1>
      <p>Status: {ok}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{msg}</pre>
      <p>Has apiKey? {String(!!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}</p>
    </div>
  );
}