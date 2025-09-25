'use client';

import { useEffect, useState } from 'react';
import { firebaseApp } from '../../lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function FirebaseCheck() {
  const [ok, setOk] = useState<'pending'|'ok'|'fail'>('pending');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore(firebaseApp);
        await getDoc(doc(db, '__healthcheck__', 'dummyDoc')); // dummy-read
        setOk('ok');
        setMsg('Firebase init OK og env tilgjengelig i klient.');
      } catch (e: any) {
        setOk('fail');
        setMsg(e?.message ?? String(e));
      }
    })();
  }, []);

  return (
    <div style={{padding:16}}>
      <h1>Firebase check</h1>
      <p>Status: {ok}</p>
      <pre style={{whiteSpace:'pre-wrap'}}>{msg}</pre>
      <p>Har apiKey? {String(!!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}</p>
    </div>
  );
}
