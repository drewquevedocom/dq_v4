import { HitlRequestStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-request";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const parseStatus = (raw: string | null): HitlRequestStatus | undefined => {
  if (!raw) {
    return undefined;
  }

  const normalized = raw.toUpperCase();
  if (!(normalized in HitlRequestStatus)) {
    return undefined;
  }

  return normalized as HitlRequestStatus;
};

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const status = parseStatus(request.nextUrl.searchParams.get("status")) ?? "PENDING";

  const requests = await db.hitlRequest.findMany({
    where: { status },
    include: {
      lead: true,
      voiceCall: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    status: "OK",
    data: requests,
    requested_by: session.adminId,
  });
}
