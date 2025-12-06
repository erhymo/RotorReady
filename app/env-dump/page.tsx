'use client';
export default function EnvDump() {
	  if (process.env.NODE_ENV === "production") {
	    return (
	      <div style={{ padding: 16 }}>
	        <h1>Env dump</h1>
	        <p>This page is only available in development.</p>
	      </div>
	    );
	  }
	  return (
	    <div style={{padding:16}}>
	      <h1>Env dump</h1>
	      <ul>
	        <li><b>NEXT_PUBLIC_FIREBASE_API_KEY</b>: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</b>: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_PROJECT_ID</b>: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</b>: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</b>: {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_APP_ID</b>: {process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.slice(0,6) || 'undefined'}</li>
	        <li><b>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID</b>: {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.slice(0,6) || 'undefined'}</li>
	      </ul>
	    </div>
	  );
}
