import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isAdminApprovalConfigured,
} from "@/lib/admin-auth";
import { requireEnv } from "@/lib/env";

export const runtime = "nodejs";

const loginSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!isAdminApprovalConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_APPROVAL_TOKEN is not configured" },
      { status: 500 },
    );
  }

  try {
    const body = loginSchema.parse(await request.json());
    const configuredToken = requireEnv("ADMIN_APPROVAL_TOKEN");

    if (body.token !== configuredToken) {
      return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
    }

    const sessionToken = await createAdminSessionToken("admin");
    const response = NextResponse.json({ status: "OK" });

    const cookieOptions = getAdminSessionCookieOptions();
    response.cookies.set(cookieOptions.name, sessionToken, cookieOptions);

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
