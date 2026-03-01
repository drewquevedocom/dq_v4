import { jwtVerify, SignJWT } from "jose";
import { requireEnv } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "jarvis_admin_session";

const ADMIN_SESSION_SCOPE = "jarvis-admin";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

const getSigningSecret = (): Uint8Array => {
  return encoder.encode(requireEnv("ADMIN_APPROVAL_TOKEN"));
};

export const isAdminApprovalConfigured = (): boolean => {
  return Boolean(process.env.ADMIN_APPROVAL_TOKEN);
};

export const createAdminSessionToken = async (adminId = "admin"): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ scope: ADMIN_SESSION_SCOPE })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt(now)
    .setExpirationTime(now + ADMIN_SESSION_TTL_SECONDS)
    .sign(getSigningSecret());
};

export const verifyAdminSessionToken = async (
  token: string | undefined,
): Promise<{ adminId: string } | null> => {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSigningSecret(), {
      algorithms: ["HS256"],
    });

    if (payload.scope !== ADMIN_SESSION_SCOPE) {
      return null;
    }

    return {
      adminId: String(payload.sub ?? "admin"),
    };
  } catch {
    return null;
  }
};

export const getAdminSessionCookieOptions = () => ({
  name: ADMIN_SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_SESSION_TTL_SECONDS,
});
