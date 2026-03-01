import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { upsertLead } from "@/lib/lead";
import { requiresBookingLinkApproval } from "@/lib/governance";
import { sendBookingLinkSchema } from "@/lib/voice-schemas";
import { sendTelnyxSms } from "@/lib/telnyx";

export const runtime = "nodejs";

const composeBookingMessage = ({
  bookingUrl,
  name,
}: {
  bookingUrl: string;
  name?: string;
}) => {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return `${greeting} thanks for speaking with AgentIQAgents. Book your next step here: ${bookingUrl}`;
};

export async function POST(request: NextRequest) {
  try {
    const payload = sendBookingLinkSchema.parse(await request.json());
    const bookingUrl = requireEnv("BOOKING_LINK_URL");

    const lead = await upsertLead({
      name: payload.name,
      company: payload.company,
      role: payload.role,
      email: payload.email,
      phone: payload.phone,
      useCase: payload.use_case,
      budgetRange: payload.budget_range,
      timeline: payload.timeline,
      source: "jarvis_voice_tool",
      metadata: payload as unknown as Prisma.InputJsonValue,
    });

    const voiceCall = payload.call_control_id
      ? await db.voiceCall.findUnique({
          where: {
            externalCallControlId: payload.call_control_id,
          },
        })
      : null;

    const smsBody = composeBookingMessage({
      bookingUrl,
      name: payload.name,
    });

    if (requiresBookingLinkApproval()) {
      const queued = await db.hitlRequest.create({
        data: {
          actionType: "SEND_BOOKING_LINK",
          status: "PENDING",
          destinationPhone: payload.phone,
          smsBody,
          bookingUrl,
          requestedBy: "jarvis",
          requestPayload: payload as unknown as Prisma.InputJsonValue,
          leadId: lead?.id,
          voiceCallId: voiceCall?.id,
        },
      });

      return NextResponse.json(
        {
          status: "PENDING_APPROVAL",
          request_id: queued.id,
          message: "Booking link queued for HITL approval",
        },
        { status: 202 },
      );
    }

    const messageId = await sendTelnyxSms({
      to: payload.phone,
      text: smsBody,
    });

    await db.hitlRequest.create({
      data: {
        actionType: "SEND_BOOKING_LINK",
        status: "SENT",
        destinationPhone: payload.phone,
        smsBody,
        bookingUrl,
        requestedBy: "jarvis",
        approvedBy: "automation",
        approvedAt: new Date(),
        sentAt: new Date(),
        telnyxMessageId: messageId,
        requestPayload: payload as unknown as Prisma.InputJsonValue,
        leadId: lead?.id,
        voiceCallId: voiceCall?.id,
      },
    });

    return NextResponse.json({
      status: "SENT",
      message_id: messageId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send booking link",
      },
      { status: 500 },
    );
  }
}
