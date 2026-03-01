import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { optionalEnv, requireEnv } from "@/lib/env";

const DEFAULT_INSTANTLY_BASE_URL = "https://api.instantly.ai";
const INSTANTLY_SOURCE = "jarvis_chat";
const INSTANTLY_METADATA_ROOT_KEY = "growth_engine";
const INSTANTLY_METADATA_KEY = "instantly";

type JsonRecord = Record<string, unknown>;

export type InstantlyLeadInput = {
  id?: string;
  email?: string | null;
  name?: string | null;
  firstName?: string | null;
  metadata?: Prisma.JsonValue | null;
};

export type InstantlyLeadPayload = {
  email: string;
  first_name: string;
  custom_variable: {
    source: typeof INSTANTLY_SOURCE;
  };
};

export type InstantlyInjectionResult =
  | { status: "SKIPPED_NO_EMAIL" }
  | { status: "SKIPPED_ALREADY_INJECTED" }
  | {
      status: "INJECTED";
      response: unknown;
    };

const asRecord = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? ({ ...value } as JsonRecord)
    : {};

const normalizeEmail = (email?: string | null): string | null => {
  if (!email) {
    return null;
  }

  const normalized = email.trim().toLowerCase();
  return normalized.length ? normalized : null;
};

const normalizeFirstName = ({
  firstName,
  name,
}: {
  firstName?: string | null;
  name?: string | null;
}): string => {
  const explicit = firstName?.trim();
  if (explicit) {
    return explicit;
  }

  const fullName = name?.trim();
  if (!fullName) {
    return "there";
  }

  const [candidate] = fullName.split(/\s+/);
  return candidate || "there";
};

export const buildInstantlyLeadPayload = (
  lead: InstantlyLeadInput,
): InstantlyLeadPayload | null => {
  const email = normalizeEmail(lead.email);
  if (!email) {
    return null;
  }

  return {
    email,
    first_name: normalizeFirstName({
      firstName: lead.firstName,
      name: lead.name,
    }),
    custom_variable: {
      source: INSTANTLY_SOURCE,
    },
  };
};

const wasInjectedFromJarvisChat = (
  metadata?: Prisma.JsonValue | null,
): boolean => {
  const root = asRecord(metadata);
  const growthEngine = asRecord(root[INSTANTLY_METADATA_ROOT_KEY]);
  const instantly = asRecord(growthEngine[INSTANTLY_METADATA_KEY]);

  return instantly.source === INSTANTLY_SOURCE && typeof instantly.injected_at === "string";
};

const withInjectionMetadata = (
  metadata: Prisma.JsonValue | null | undefined,
): Prisma.InputJsonValue => {
  const root = asRecord(metadata);
  const growthEngine = asRecord(root[INSTANTLY_METADATA_ROOT_KEY]);
  const instantly = asRecord(growthEngine[INSTANTLY_METADATA_KEY]);

  const nextGrowthEngine = {
    ...growthEngine,
    [INSTANTLY_METADATA_KEY]: {
      ...instantly,
      source: INSTANTLY_SOURCE,
      injected_at: new Date().toISOString(),
    },
  };

  return {
    ...root,
    [INSTANTLY_METADATA_ROOT_KEY]: nextGrowthEngine,
  } as Prisma.InputJsonValue;
};

const parseResponseBody = (rawBody: string): unknown => {
  if (!rawBody.length) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
};

const getInstantlyEndpoint = (): string => {
  const configuredBase = optionalEnv("INSTANTLY_API_BASE_URL");
  const base = (configuredBase ?? DEFAULT_INSTANTLY_BASE_URL).replace(/\/$/, "");
  return `${base}/api/v2/leads/add`;
};

export const injectIntoInstantly = async (
  lead: InstantlyLeadInput,
): Promise<InstantlyInjectionResult> => {
  const payload = buildInstantlyLeadPayload(lead);
  if (!payload) {
    return { status: "SKIPPED_NO_EMAIL" };
  }

  if (wasInjectedFromJarvisChat(lead.metadata)) {
    return { status: "SKIPPED_ALREADY_INJECTED" };
  }

  const requestBody: Record<string, unknown> = payload;
  const campaignId = optionalEnv("INSTANTLY_CAMPAIGN_ID");
  if (campaignId) {
    requestBody.campaign_id = campaignId;
  }

  const response = await fetch(getInstantlyEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("INSTANTLY_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const rawBody = await response.text();
  const parsedBody = parseResponseBody(rawBody);
  if (!response.ok) {
    throw new Error(
      `Instantly lead injection failed with ${response.status}: ${
        typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody)
      }`,
    );
  }

  if (lead.id) {
    await db.lead.update({
      where: { id: lead.id },
      data: {
        metadata: withInjectionMetadata(lead.metadata),
      },
    });
  }

  return {
    status: "INJECTED",
    response: parsedBody,
  };
};
