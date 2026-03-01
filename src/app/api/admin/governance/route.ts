import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-request";
import {
  isAutonomousMode,
  isHitlActive,
  setAutonomousMode,
} from "@/lib/governance-state";
import { GOVERNANCE_CONFIG } from "@/lib/governance";

export const runtime = "nodejs";

/** GET /api/admin/governance — current governance status */
export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  return NextResponse.json({
    autonomousMode: isAutonomousMode(),
    hitlActive: isHitlActive(),
    sensitiveActions: GOVERNANCE_CONFIG.SENSITIVE_ACTIONS,
  });
}

/** POST /api/admin/governance — toggle autonomous mode */
export async function POST(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const body = (await request.json()) as { autonomousMode?: boolean };

  if (typeof body.autonomousMode !== "boolean") {
    return NextResponse.json(
      { error: "autonomousMode (boolean) is required" },
      { status: 400 },
    );
  }

  setAutonomousMode(body.autonomousMode);

  console.log(
    `[GOVERNANCE] ${session.adminId} set autonomous mode to ${body.autonomousMode}`,
  );

  return NextResponse.json({
    autonomousMode: isAutonomousMode(),
    hitlActive: isHitlActive(),
    toggledBy: session.adminId,
  });
}
