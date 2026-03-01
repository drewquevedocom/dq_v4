import { describe, expect, it } from "vitest";
import { buildInstantlyLeadPayload } from "../src/lib/instantly";

describe("Instantly payload mapping", () => {
  it("maps email, first_name, and source for jarvis leads", () => {
    const payload = buildInstantlyLeadPayload({
      email: " Drew@Example.com ",
      name: "Drew Quevedo",
    });

    expect(payload).toEqual({
      email: "drew@example.com",
      first_name: "Drew",
      custom_variable: {
        source: "jarvis_chat",
      },
    });
  });

  it("uses explicit firstName when provided", () => {
    const payload = buildInstantlyLeadPayload({
      email: "ops@example.com",
      name: "Agent IQ",
      firstName: "Operations",
    });

    expect(payload?.first_name).toBe("Operations");
  });

  it("returns null when email is missing", () => {
    const payload = buildInstantlyLeadPayload({
      name: "No Email Lead",
    });

    expect(payload).toBeNull();
  });
});
