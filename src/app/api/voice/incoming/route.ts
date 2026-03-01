import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { injectIntoInstantly } from "@/lib/instantly";
import { extractLeadFromInsights, upsertLead } from "@/lib/lead";
import {
  getTelnyxClient,
  normalizeTelnyxHeaders,
  shouldSkipTelnyxWebhookVerification,
} from "@/lib/telnyx";

export const runtime = "nodejs";

type TelnyxWebhookData = {
  id?: string;
  event_type?: string;
  occurred_at?: string;
  payload?: Record<string, unknown>;
};

type TelnyxWebhookEvent = {
  data?: TelnyxWebhookData;
};

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const toDateOrUndefined = (value: string | undefined): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
};

const upsertVoiceCallFromPayload = async ({
  payload,
  eventType,
  occurredAt,
}: {
  payload: Record<string, unknown>;
  eventType: string;
  occurredAt?: Date;
}) => {
  const callControlId = asString(payload.call_control_id);
  if (!callControlId) {
    return null;
  }

  const externalCallLegId = asString(payload.call_leg_id);
  const externalCallSessionId = asString(payload.call_session_id);
  const fromNumber = asString(payload.from);
  const toNumber = asString(payload.to);

  const startedAt =
    toDateOrUndefined(asString(payload.start_time)) ??
    (eventType === "call.initiated" ? occurredAt : undefined);

  return db.voiceCall.upsert({
    where: { externalCallControlId: callControlId },
    create: {
      externalCallControlId: callControlId,
      externalCallLegId,
      externalCallSessionId,
      fromNumber,
      toNumber,
      startedAt,
      status: eventType === "call.conversation.ended" ? "ENDED" : "INITIATED",
      rawLastEvent: payload as Prisma.InputJsonValue,
    },
    update: {
      externalCallLegId,
      externalCallSessionId,
      fromNumber,
      toNumber,
      startedAt,
      rawLastEvent: payload as Prisma.InputJsonValue,
      status: eventType === "call.conversation.ended" ? "ENDED" : undefined,
    },
  });
};

const maybeInjectUnbookedLead = async (callControlId: string) => {
  const voiceCall = await db.voiceCall.findUnique({
    where: { externalCallControlId: callControlId },
    include: {
      lead: {
        include: {
          hitlRequests: {
            where: {
              actionType: "SEND_BOOKING_LINK",
            },
            select: { id: true },
            take: 1,
          },
        },
      },
      hitlRequests: {
        where: {
          actionType: "SEND_BOOKING_LINK",
        },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!voiceCall || voiceCall.status !== "ENDED") {
    return;
  }

  if (
    !voiceCall.lead ||
    voiceCall.hitlRequests.length > 0 ||
    voiceCall.lead.hitlRequests.length > 0
  ) {
    return;
  }

  try {
    await injectIntoInstantly({
      id: voiceCall.lead.id,
      email: voiceCall.lead.email,
      name: voiceCall.lead.name,
      metadata: voiceCall.lead.metadata as Prisma.JsonValue | null,
    });
  } catch (error) {
    console.error(
      `[Instantly] failed to inject unbooked lead for call ${callControlId}`,
      error,
    );
  }
};

export async function POST(request: NextRequest) {
  const client = getTelnyxClient();
  const rawBody = await request.text();

  let event: TelnyxWebhookEvent;
  try {
    if (shouldSkipTelnyxWebhookVerification()) {
      event = client.webhooks.unwrap(rawBody) as TelnyxWebhookEvent;
    } else {
      event = client.webhooks.unwrap(rawBody, {
        headers: normalizeTelnyxHeaders(request.headers),
      }) as TelnyxWebhookEvent;
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid Telnyx webhook signature",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 401 },
    );
  }

  const data = event.data;
  if (!data) {
    return NextResponse.json({ status: "IGNORED" }, { status: 200 });
  }

  const eventId = asString(data.id);
  if (eventId) {
    const existing = await db.voiceWebhookEvent.findUnique({
      where: { externalEventId: eventId },
    });
    if (existing) {
      return NextResponse.json({ status: "DUPLICATE" }, { status: 200 });
    }
  }

  const eventType = asString(data.event_type) ?? "unknown";
  const payload = (data.payload ?? {}) as Record<string, unknown>;
  const occurredAt = toDateOrUndefined(asString(data.occurred_at));
  const callControlId = asString(payload.call_control_id);

  const voiceCall = await upsertVoiceCallFromPayload({
    payload,
    eventType,
    occurredAt,
  });

  let webhookRecord = null as Awaited<ReturnType<typeof db.voiceWebhookEvent.create>> | null;
  try {
    webhookRecord = await db.voiceWebhookEvent.create({
      data: {
        externalEventId: eventId,
        eventType,
        occurredAt,
        payload: payload as Prisma.InputJsonValue,
        processingStatus: "RECEIVED",
        voiceCallId: voiceCall?.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ status: "DUPLICATE" }, { status: 200 });
    }
    throw error;
  }

  try {
    if (eventType === "call.initiated" && callControlId) {
      await client.calls.actions.answer(callControlId, {
        command_id: eventId ? `${eventId}-answer` : undefined,
      });
      await client.calls.actions.startAIAssistant(callControlId, {
        assistant: {
          id: requireEnv("TELNYX_ASSISTANT_ID"),
        },
        command_id: eventId ? `${eventId}-assistant` : undefined,
      });

      await db.voiceCall.update({
        where: { externalCallControlId: callControlId },
        data: {
          status: "IN_PROGRESS",
        },
      });
    } else if (eventType === "call.conversation.ended" && callControlId) {
      await db.voiceCall.update({
        where: { externalCallControlId: callControlId },
        data: {
          status: "ENDED",
          endedAt: occurredAt ?? new Date(),
          durationSeconds: asNumber(payload.duration_sec),
          assistantId: asString(payload.assistant_id),
          conversationId: asString(payload.conversation_id),
          rawLastEvent: payload as Prisma.InputJsonValue,
        },
      });

      await maybeInjectUnbookedLead(callControlId);
    } else if (eventType === "call.conversation_insights.generated") {
      const extracted = extractLeadFromInsights(payload.results);
      const lead = await upsertLead({
        ...extracted,
        source: "telnyx_conversation_insights",
        metadata: payload as Prisma.InputJsonValue,
      });

      if (lead && callControlId) {
        await db.voiceCall.update({
          where: { externalCallControlId: callControlId },
          data: {
            leadId: lead.id,
            rawLastEvent: payload as Prisma.InputJsonValue,
          },
        });
      }

      if (callControlId) {
        await maybeInjectUnbookedLead(callControlId);
      }
    }

    await db.voiceWebhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processingStatus: "PROCESSED",
      },
    });

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    await db.voiceWebhookEvent.update({
      where: { id: webhookRecord.id },
      data: {
        processingStatus: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown processing error",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
