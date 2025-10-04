import { getAuth } from "firebase-admin/auth";

export type VerifiedAppUser = {
  uid: string;
  email?: string;
  name?: string;
};

function extractBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  if (header && header.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.split(";").find((item) => item.trim().startsWith("__session="));
    if (match) {
      return match.split("=")[1]?.trim() || null;
    }
  }
  const tokenHeader = req.headers.get("x-firebase-token");
  if (tokenHeader) return tokenHeader.trim();
  return null;
}

export async function verifyIdToken(req: Request): Promise<VerifiedAppUser | null> {
  const token = extractBearerToken(req);
  if (!token) return null;
  try {
    const decoded = await getAuth().verifyIdToken(token, true);
    return {
      uid: decoded.uid,
      email: decoded.email || undefined,
      name: decoded.name || undefined,
    };
  } catch (error) {
    console.warn("verifyIdToken: kunne ikke verifisere token", error);
    return null;
  }
}

export async function requireIdToken(req: Request): Promise<VerifiedAppUser> {
  const user = await verifyIdToken(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
