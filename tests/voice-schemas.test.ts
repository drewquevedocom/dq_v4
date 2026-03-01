import { describe, expect, it } from "vitest";
import {
  calendarAvailabilitySchema,
  sendBookingLinkSchema,
} from "../src/lib/voice-schemas";

describe("voice tool schemas", () => {
  it("accepts a valid calendar availability payload", () => {
    const parsed = calendarAvailabilitySchema.parse({
      date: "2026-02-18",
      timezone: "America/New_York",
      duration_minutes: 30,
    });

    expect(parsed.date).toBe("2026-02-18");
    expect(parsed.duration_minutes).toBe(30);
  });

  it("rejects malformed calendar date", () => {
    const result = calendarAvailabilitySchema.safeParse({
      date: "18-02-2026",
      timezone: "America/New_York",
    });

    expect(result.success).toBe(false);
  });

  it("requires a phone number for booking link requests", () => {
    const result = sendBookingLinkSchema.safeParse({
      name: "Drew",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an MVP lead qualification payload", () => {
    const parsed = sendBookingLinkSchema.parse({
      name: "Drew Quevedo",
      company: "AgentIQAgents",
      role: "Founder",
      email: "drew@example.com",
      phone: "+15555550100",
      use_case: "AI agent deployment",
      budget_range: "$5k-$15k",
      timeline: "30 days",
      call_control_id: "v3:control-id",
    });

    expect(parsed.phone).toBe("+15555550100");
    expect(parsed.use_case).toBe("AI agent deployment");
  });
});
