import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-request";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const rejectSchema = z.object({
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const existing = await db.hitlRequest.findUnique({
    where: { id: params.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (existing.status !== "PENDING") {
    return NextResponse.json(
      { error: `Cannot reject request in status ${existing.status}` },
      { status: 409 },
    );
  }

  let reason: string | undefined;
  try {
    reason = rejectSchema.parse(await request.json()).reason;
  } catch {
    reason = undefined;
  }

  const updated = await db.hitlRequest.update({
    where: { id: params.id },
    data: {
      status: "REJECTED",
      rejectedBy: session.adminId,
      rejectedAt: new Date(),
      rejectionReason: reason,
    },
  });

  return NextResponse.json({ status: "REJECTED", data: updated });
}
