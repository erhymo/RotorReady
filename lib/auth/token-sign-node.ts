export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h

function b64urlEncode(input: Uint8Array): string {
  const bin = Buffer.from(input).toString('base64');
  return bin.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlEncodeString(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export type AdminSessionPayload = { sub: 'admin'; iat: number; exp: number };

// Node-only signer using crypto HMAC (for API route runtime: nodejs)
export async function signAdminToken(payload: AdminSessionPayload, secret: string): Promise<string> {
  const { createHmac } = await import('crypto');
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64urlEncodeString(payloadStr);
  const sig = createHmac('sha256', secret).update(payloadB64).digest();
  const sigB64 = b64urlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

