import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_HITL = process.env.HITL_ENABLED;

afterEach(() => {
  if (ORIGINAL_HITL === undefined) {
    delete process.env.HITL_ENABLED;
  } else {
    process.env.HITL_ENABLED = ORIGINAL_HITL;
  }
});

describe("booking-link sms gating", () => {
  it("requires approval when HITL is true", async () => {
    process.env.HITL_ENABLED = "true";
    vi.resetModules();
    const governance = await import("../src/lib/governance");

    expect(governance.requiresApproval("SEND_BOOKING_LINK")).toBe(true);
  });

  it("does not require approval when HITL is false", async () => {
    process.env.HITL_ENABLED = "false";
    vi.resetModules();
    const governance = await import("../src/lib/governance");

    expect(governance.requiresApproval("SEND_BOOKING_LINK")).toBe(false);
  });
});
