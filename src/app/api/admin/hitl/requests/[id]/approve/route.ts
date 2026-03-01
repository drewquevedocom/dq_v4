import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-request";
import { db } from "@/lib/db";
import { sendTelnyxSms } from "@/lib/telnyx";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) {
    return session;
  }

  const hitlRequest = await db.hitlRequest.findUnique({
    where: { id: params.id },
  });

  if (!hitlRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (hitlRequest.status !== "PENDING") {
    return NextResponse.json(
      { error: `Cannot approve request in status ${hitlRequest.status}` },
      { status: 409 },
    );
  }

  await db.hitlRequest.update({
    where: { id: params.id },
    data: {
      status: "APPROVED",
      approvedBy: session.adminId,
      approvedAt: new Date(),
    },
  });

  try {
    const messageId = await sendTelnyxSms({
      to: hitlRequest.destinationPhone,
      text: hitlRequest.smsBody,
    });

    const updated = await db.hitlRequest.update({
      where: { id: params.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        telnyxMessageId: messageId,
      },
    });

    return NextResponse.json({ status: "SENT", data: updated });
  } catch (error) {
    const failed = await db.hitlRequest.update({
      where: { id: params.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : "Failed to send SMS",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to send booking link SMS",
        data: failed,
      },
      { status: 500 },
    );
  }
}
