import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_HITL = process.env.HITL_ENABLED;

afterEach(() => {
  if (ORIGINAL_HITL === undefined) {
    delete process.env.HITL_ENABLED;
  } else {
    process.env.HITL_ENABLED = ORIGINAL_HITL;
  }
});

describe("governance", () => {
  it("defaults HITL to true when env is not set", async () => {
    delete process.env.HITL_ENABLED;
    vi.resetModules();

    const governance = await import("../src/lib/governance");
    expect(governance.GOVERNANCE_CONFIG.HITL_ENABLED).toBe(true);
    expect(governance.requiresBookingLinkApproval()).toBe(true);
  });

  it("disables approvals when HITL_ENABLED=false", async () => {
    process.env.HITL_ENABLED = "false";
    vi.resetModules();

    const governance = await import("../src/lib/governance");
    expect(governance.GOVERNANCE_CONFIG.HITL_ENABLED).toBe(false);
    expect(governance.requiresBookingLinkApproval()).toBe(false);
  });
});
