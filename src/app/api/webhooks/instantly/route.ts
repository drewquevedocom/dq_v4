import { NextRequest, NextResponse } from "next/server";
import { optionalEnv, requireEnv } from "@/lib/env";
import { sendTelnyxSms } from "@/lib/telnyx";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};

const deepFindString = (value: unknown, aliases: string[]): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as JsonRecord;
  for (const [key, candidate] of Object.entries(record)) {
    if (aliases.includes(key.toLowerCase()) && typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed.length) {
        return trimmed;
      }
    }
  }

  for (const candidate of Object.values(record)) {
    if (candidate && typeof candidate === "object") {
      const nested = deepFindString(candidate, aliases);
      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
};

const normalizeEventType = (body: JsonRecord): string =>
  (
    deepFindString(body, ["event", "event_type", "type", "webhook_event"]) ?? ""
  ).toLowerCase();

const isReplyReceivedEvent = (eventType: string): boolean =>
  /reply[ ._-]*received/.test(eventType) || eventType.includes("reply");

const truncate = (value: string, max: number): string =>
  value.length <= max ? value : `${value.slice(0, max - 3)}...`;

const verifyInstantlyWebhookSecret = (request: NextRequest): boolean => {
  const expectedSecret = optionalEnv("INSTANTLY_WEBHOOK_SECRET");
  if (!expectedSecret) {
    return true;
  }

  const providedSecret =
    request.headers.get("x-instantly-webhook-secret") ??
    request.headers.get("x-webhook-secret");

  return providedSecret === expectedSecret;
};

export async function POST(request: NextRequest) {
  if (!verifyInstantlyWebhookSecret(request)) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  try {
    const body = asRecord(await request.json());
    const eventType = normalizeEventType(body);

    if (!isReplyReceivedEvent(eventType)) {
      return NextResponse.json({ status: "IGNORED" }, { status: 200 });
    }

    const leadEmail = deepFindString(body, ["email", "lead_email", "contact_email"]);
    const firstName = deepFindString(body, ["first_name", "firstname"]);
    const replyText =
      deepFindString(body, ["reply", "reply_text"]) ??
      deepFindString(body, ["text", "body", "message"]);

    const leadLabel = firstName || leadEmail || "A lead";
    const alertText = replyText
      ? `Instantly reply from ${leadLabel}: "${truncate(replyText, 90)}"`
      : `Instantly reply received from ${leadLabel}.`;

    await sendTelnyxSms({
      to: requireEnv("DREW_ALERT_PHONE"),
      text: alertText,
    });

    return NextResponse.json({ status: "ALERT_SENT" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Instantly webhook processing failed",
      },
      { status: 500 },
    );
  }
}
