import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-request";
import { db } from "@/lib/db";

export const runtime = "nodejs";

/** GET /api/admin/activity — recent agent actions feed */
export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const limit = Math.min(
    Number(request.nextUrl.searchParams.get("limit")) || 50,
    100,
  );

  const [hitlRequests, voiceCalls, recentLeads] = await Promise.all([
    db.hitlRequest.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { lead: true },
    }),
    db.voiceCall.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { lead: true },
    }),
    db.lead.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Merge into a unified activity feed sorted by time
  type FeedItem = {
    id: string;
    type: "hitl" | "voice" | "lead";
    action: string;
    detail: string;
    status: string;
    timestamp: string;
    leadName: string | null;
  };

  const feed: FeedItem[] = [];

  for (const req of hitlRequests) {
    feed.push({
      id: req.id,
      type: "hitl",
      action: req.actionType,
      detail: `SMS to ${req.destinationPhone}: "${req.smsBody.slice(0, 80)}${req.smsBody.length > 80 ? "..." : ""}"`,
      status: req.status,
      timestamp: req.createdAt.toISOString(),
      leadName: req.lead?.name ?? null,
    });
  }

  for (const call of voiceCalls) {
    feed.push({
      id: call.id,
      type: "voice",
      action: "VOICE_CALL",
      detail: `${call.fromNumber ?? "Unknown"} → ${call.toNumber ?? "Jarvis"}${call.durationSeconds ? ` (${call.durationSeconds}s)` : ""}`,
      status: call.status,
      timestamp: call.createdAt.toISOString(),
      leadName: call.lead?.name ?? null,
    });
  }

  for (const lead of recentLeads) {
    feed.push({
      id: lead.id,
      type: "lead",
      action: "LEAD_CAPTURED",
      detail: `${lead.name ?? "Unknown"} ${lead.company ? `@ ${lead.company}` : ""}${lead.email ? ` (${lead.email})` : ""}`,
      status: "CAPTURED",
      timestamp: lead.createdAt.toISOString(),
      leadName: lead.name,
    });
  }

  feed.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Stats
  const pendingCount = hitlRequests.filter((r) => r.status === "PENDING").length;
  const approvedCount = hitlRequests.filter((r) =>
    ["APPROVED", "SENT"].includes(r.status),
  ).length;
  const rejectedCount = hitlRequests.filter(
    (r) => r.status === "REJECTED",
  ).length;
  const totalCalls = voiceCalls.length;
  const totalLeads = recentLeads.length;

  return NextResponse.json({
    feed: feed.slice(0, limit),
    stats: {
      pendingApprovals: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      totalCalls,
      totalLeads,
    },
  });
}
