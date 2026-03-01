import { Prisma, Lead } from "@prisma/client";
import { db } from "@/lib/db";

export type LeadQualificationInput = {
  name?: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  useCase?: string;
  budgetRange?: string;
  timeline?: string;
  source?: string;
  notes?: string;
  metadata?: Prisma.InputJsonValue;
};

const normalizeValue = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const deepFindKey = (value: unknown, aliases: string[]): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  for (const [key, candidate] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase();
    if (aliases.includes(normalizedKey)) {
      const normalized = normalizeValue(candidate);
      if (normalized) {
        return normalized;
      }
    }
  }

  for (const candidate of Object.values(record)) {
    if (candidate && typeof candidate === "object") {
      const nested = deepFindKey(candidate, aliases);
      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
};

export const extractLeadFromInsights = (results: unknown): LeadQualificationInput => {
  const source = Array.isArray(results) ? { results } : results;

  return {
    name: deepFindKey(source, ["name", "full_name", "lead_name", "contact_name"]),
    company: deepFindKey(source, ["company", "company_name", "organization"]),
    role: deepFindKey(source, ["role", "title", "job_title"]),
    email: deepFindKey(source, ["email", "work_email"]),
    phone: deepFindKey(source, ["phone", "phone_number", "mobile"]),
    useCase: deepFindKey(source, ["use_case", "usecase", "pain_point", "goal"]),
    budgetRange: deepFindKey(source, ["budget_range", "budget", "budget_band"]),
    timeline: deepFindKey(source, ["timeline", "buying_timeline", "decision_timeline"]),
  };
};

export const upsertLead = async (
  input: LeadQualificationInput,
): Promise<Lead | null> => {
  const email = normalizeValue(input.email);
  const phone = normalizeValue(input.phone);

  if (!email && !phone) {
    return null;
  }

  const existing = await db.lead.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  const payload: Prisma.LeadUncheckedCreateInput = {
    name: normalizeValue(input.name),
    company: normalizeValue(input.company),
    role: normalizeValue(input.role),
    email,
    phone,
    useCase: normalizeValue(input.useCase),
    budgetRange: normalizeValue(input.budgetRange),
    timeline: normalizeValue(input.timeline),
    source: normalizeValue(input.source),
    notes: normalizeValue(input.notes),
    metadata: input.metadata ?? Prisma.JsonNull,
  };

  if (!existing) {
    return db.lead.create({ data: payload });
  }

  return db.lead.update({
    where: { id: existing.id },
    data: payload,
  });
};
