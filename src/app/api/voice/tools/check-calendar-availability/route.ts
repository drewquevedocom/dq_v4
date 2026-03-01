import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkCalendarAvailability } from "@/lib/calendar";
import { calendarAvailabilitySchema } from "@/lib/voice-schemas";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const payload = calendarAvailabilitySchema.parse(await request.json());
    const availability = await checkCalendarAvailability({
      date: payload.date,
      timezone: payload.timezone,
      durationMinutes: payload.duration_minutes,
    });

    return NextResponse.json({
      status: "OK",
      data: availability,
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
        error: error instanceof Error ? error.message : "Failed to check availability",
      },
      { status: 500 },
    );
  }
}
