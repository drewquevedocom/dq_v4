import { envBoolean } from "@/lib/env";

export const SENSITIVE_ACTIONS = [
  "SEND_EMAIL",
  "BOOK_CALL",
  "EXECUTE_PAYMENT",
  "PROVISION_AGENT",
  "SEND_BOOKING_LINK",
] as const;

export type ActionType = (typeof SENSITIVE_ACTIONS)[number];

export const GOVERNANCE_CONFIG = {
  HITL_ENABLED: envBoolean("HITL_ENABLED", true),
  SENSITIVE_ACTIONS,
} as const;

export const requiresApproval = (action: string): boolean => {
  if (!GOVERNANCE_CONFIG.HITL_ENABLED) {
    return false;
  }

  return GOVERNANCE_CONFIG.SENSITIVE_ACTIONS.includes(action as ActionType);
};

export const requiresBookingLinkApproval = (): boolean =>
  requiresApproval("SEND_BOOKING_LINK");
