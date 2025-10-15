export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h

function b64urlEncode(input: Uint8Array): string {
  const bin = Buffer.from(input).toString('base64');
  return bin.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlEncodeString(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecodeToString(b64: string): string {
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
  return Buffer.from(b64 + pad, 'base64').toString('utf-8');
}

export type AdminSessionPayload = { sub: 'admin'; iat: number; exp: number };

// Node-compatible signer using crypto HMAC (runtime: node)
export async function signAdminToken(payload: AdminSessionPayload, secret: string): Promise<string> {
  const { createHmac } = await import('crypto');
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64urlEncodeString(payloadStr);
  const sig = createHmac('sha256', secret).update(payloadB64).digest();
  const sigB64 = b64urlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

// Edge-compatible verifier using WebCrypto (middleware)
export async function verifyAdminToken(token: string, secret: string): Promise<{ valid: boolean; payload?: AdminSessionPayload }>{
  try {
    const [payloadB64, sigB64] = token.split('.') as [string, string];
    if (!payloadB64 || !sigB64) return { valid: false };
    const payloadStr = b64urlDecodeToString(payloadB64);
    const payload = JSON.parse(payloadStr) as AdminSessionPayload;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
    const sigBuf = Uint8Array.from(Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
    const expected = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
    const expectedB64 = b64urlEncode(new Uint8Array(expected));
    if (expectedB64 !== sigB64) return { valid: false };
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) return { valid: false };
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

