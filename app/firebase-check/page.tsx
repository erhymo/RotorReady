'use client';

import { useEffect, useState } from 'react';
import { firebaseApp } from '../../lib/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function FirebaseCheck() {
  const [ok, setOk] = useState<'pending'|'ok'|'fail'>('pending');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    (async () => {
      try {
        const db = getFirestore(firebaseApp);
        await getDoc(doc(db, '__healthcheck__', 'dummyDoc')); // dummy-read
        setOk('ok');
	        setMsg('Firebase init OK and env available in client.');
      } catch (e: any) {
        setOk('fail');
        setMsg(e?.message ?? String(e));
      }
    })();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return (
      <div style={{padding:16}}>
        <h1>Firebase check</h1>
        <p>This page is only available in development.</p>
      </div>
    );
  }

  return (
    <div style={{padding:16}}>
      <h1>Firebase check</h1>
      <p>Status: {ok}</p>
      <pre style={{whiteSpace:'pre-wrap'}}>{msg}</pre>
	      <p>Has apiKey? {String(!!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)}</p>
    </div>
  );
}
