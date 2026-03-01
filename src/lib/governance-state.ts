/**
 * Runtime governance state.
 *
 * The env-based HITL_ENABLED flag sets the *initial* value.
 * The admin can toggle autonomy at runtime via the Mission Control cockpit.
 *
 * NOTE: In-memory state resets on deploy/restart. For persistence across
 * deploys, swap the backing store for a DB row or KV key.
 */

import { GOVERNANCE_CONFIG } from "@/lib/governance";

let autonomousMode = !GOVERNANCE_CONFIG.HITL_ENABLED;

/** When autonomous mode is ON the swarm executes freely (HITL is OFF). */
export function isAutonomousMode(): boolean {
  return autonomousMode;
}

/** When HITL is ON the system operates in draft/approval mode. */
export function isHitlActive(): boolean {
  return !autonomousMode;
}

export function setAutonomousMode(enabled: boolean): void {
  autonomousMode = enabled;
}

export function toggleAutonomousMode(): boolean {
  autonomousMode = !autonomousMode;
  return autonomousMode;
}
