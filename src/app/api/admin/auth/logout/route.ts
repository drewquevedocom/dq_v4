import { NextResponse } from "next/server";
import { getAdminSessionCookieOptions } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ status: "OK" });
  const cookieOptions = getAdminSessionCookieOptions();

  response.cookies.set(cookieOptions.name, "", {
    ...cookieOptions,
    maxAge: 0,
  });

  return response;
}
