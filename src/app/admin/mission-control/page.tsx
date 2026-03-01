"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GovernanceStatus = {
  autonomousMode: boolean;
  hitlActive: boolean;
  sensitiveActions: string[];
};

type FeedItem = {
  id: string;
  type: "hitl" | "voice" | "lead";
  action: string;
  detail: string;
  status: string;
  timestamp: string;
  leadName: string | null;
};

type Stats = {
  pendingApprovals: number;
  approved: number;
  rejected: number;
  totalCalls: number;
  totalLeads: number;
};

type QueueItem = {
  id: string;
  actionType: string;
  status: string;
  destinationPhone: string;
  smsBody: string;
  bookingUrl: string;
  createdAt: string;
  lead?: {
    name: string | null;
    company: string | null;
    email: string | null;
  } | null;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POLL_INTERVAL = 8_000; // 8 seconds

const AGENT_ROSTER = [
  { name: "Jarvis", role: "Voice Qualifier", color: "bg-violet-400" },
  { name: "Front-01", role: "Lead Capture", color: "bg-violet-400" },
  { name: "Growth-01", role: "Outreach Seq", color: "bg-violet-400" },
  { name: "Back-01", role: "Ops & QA", color: "bg-yellow-400" },
  { name: "Revenue-01", role: "Sales Pipeline", color: "bg-violet-400" },
  { name: "Design-01", role: "Smart Website", color: "bg-cyan-400" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function statusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "text-yellow-400 bg-yellow-400/10";
    case "APPROVED":
    case "SENT":
    case "CAPTURED":
      return "text-violet-300 bg-violet-400/10";
    case "REJECTED":
    case "FAILED":
      return "text-red-400 bg-red-400/10";
    case "INITIATED":
    case "IN_PROGRESS":
    case "ANSWERED":
      return "text-cyan-400 bg-cyan-400/10";
    case "ENDED":
      return "text-zinc-400 bg-zinc-400/10";
    default:
      return "text-zinc-400 bg-zinc-400/10";
  }
}

function actionIcon(type: string): string {
  switch (type) {
    case "hitl":
      return "\u{1F6E1}"; // shield
    case "voice":
      return "\u{1F4DE}"; // phone
    case "lead":
      return "\u{1F464}"; // person
    default:
      return "\u{26A1}"; // bolt
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MissionControlCockpit() {
  // State
  const [governance, setGovernance] = useState<GovernanceStatus | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [toggling, setToggling] = useState(false);
  const [actionInFlight, setActionInFlight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const pendingCount = useMemo(
    () => queue.filter((q) => q.status === "PENDING").length,
    [queue],
  );

  // ----- Data fetching -----

  const fetchGovernance = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/governance", { cache: "no-store" });
      if (res.ok) setGovernance(await res.json());
    } catch {
      /* swallow – polling will retry */
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activity?limit=50", {
        cache: "no-store",
      });
      if (res.ok) {
        const body = await res.json();
        setFeed(body.feed ?? []);
        setStats(body.stats ?? null);
      }
    } catch {
      /* swallow */
    }
  }, []);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/hitl/requests?status=pending", {
        cache: "no-store",
      });
      if (res.ok) {
        const body = await res.json();
        setQueue(body.data ?? []);
      }
    } catch {
      /* swallow */
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchGovernance(), fetchActivity(), fetchQueue()]);
  }, [fetchGovernance, fetchActivity, fetchQueue]);

  // Initial load + polling
  useEffect(() => {
    void refreshAll();
    const id = setInterval(() => void refreshAll(), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [refreshAll]);

  // ----- Actions -----

  const toggleMode = async () => {
    if (!governance) return;
    setToggling(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autonomousMode: !governance.autonomousMode }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      setGovernance(await res.json());
      await fetchQueue();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Toggle failed");
    } finally {
      setToggling(false);
    }
  };

  const approveRequest = async (id: string) => {
    setActionInFlight(`approve:${id}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/hitl/requests/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Approval failed");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setActionInFlight(null);
    }
  };

  const rejectRequest = async (id: string) => {
    const reason = window.prompt("Optional rejection reason") ?? undefined;
    setActionInFlight(`reject:${id}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/hitl/requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Rejection failed");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rejection failed");
    } finally {
      setActionInFlight(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  // ----- Render -----

  const isAutonomous = governance?.autonomousMode ?? false;

  return (
    <div className="min-h-screen bg-[#06060B] text-white">
      {/* Cockpit noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 noise-overlay" />

      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-colors duration-1000"
        style={{
          background: isAutonomous
            ? "radial-gradient(ellipse at 50% 0%, rgba(122,67,230,0.09) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(75,0,130,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter italic sm:text-4xl">
                MISSION CONTROL
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest ${
                  isAutonomous
                    ? "bg-violet-400/10 text-violet-300"
                    : "bg-yellow-400/10 text-yellow-400"
                }`}
              >
                {isAutonomous ? "AUTONOMOUS" : "DRAFT MODE"}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 font-mono">
              GOD MODE // GOVERNANCE COCKPIT v2.0
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm hover:border-zinc-600 transition-colors"
            >
              Legacy Dashboard
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm hover:border-zinc-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── AUTONOMOUS MODE TOGGLE ── */}
        <section className="mb-8">
          <div className="glass-card overflow-hidden">
            <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black tracking-tight">
                  AUTONOMOUS MODE
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {isAutonomous
                    ? "Swarm executes freely. All agents are live."
                    : "Draft mode. Emails log, SMS queues, nothing sends without approval."}
                </p>
              </div>

              {/* The Toggle */}
              <button
                onClick={toggleMode}
                disabled={toggling || !governance}
                className="group relative flex-shrink-0"
                aria-label={`Turn autonomous mode ${isAutonomous ? "off" : "on"}`}
              >
                <div
                  className={`relative h-16 w-32 rounded-full border-2 transition-all duration-500 ${
                    isAutonomous
                      ? "border-violet-400/50 bg-violet-400/20 shadow-[0_0_40px_rgba(122,67,230,0.18)]"
                      : "border-zinc-700 bg-zinc-900"
                  } ${toggling ? "opacity-60" : "group-hover:border-white/30"}`}
                >
                  {/* Track label */}
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-[0.55rem] font-bold uppercase tracking-wider transition-all duration-500 ${
                      isAutonomous
                        ? "left-3 text-violet-300/60"
                        : "right-3 text-zinc-600"
                    }`}
                  >
                    {isAutonomous ? "ON" : "OFF"}
                  </span>

                  {/* Thumb */}
                  <div
                    className={`absolute top-1 h-[3.25rem] w-[3.25rem] rounded-full transition-all duration-500 ${
                      isAutonomous
                        ? "left-[4.5rem] bg-violet-400 shadow-[0_0_20px_rgba(122,67,230,0.4)]"
                        : "left-1 bg-zinc-600"
                    }`}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isAutonomous
                            ? "bg-emerald-900 animate-pulse"
                            : "bg-zinc-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Status bar */}
            <div
              className={`flex items-center gap-2 px-8 py-3 text-xs font-mono transition-colors duration-500 ${
                isAutonomous
                  ? "bg-violet-400/5 text-violet-300/70"
                  : "bg-yellow-400/5 text-yellow-400/70"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  isAutonomous ? "bg-violet-400" : "bg-yellow-400"
                }`}
              />
              {isAutonomous
                ? "SYSTEM: ALL AGENTS EXECUTING FREELY"
                : "SYSTEM: HUMAN APPROVAL REQUIRED FOR SENSITIVE ACTIONS"}
            </div>
          </div>
        </section>

        {/* ── Stats Row ── */}
        {stats && (
          <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard
              label="Pending"
              value={stats.pendingApprovals}
              color="text-yellow-400"
            />
            <StatCard
              label="Approved"
              value={stats.approved}
              color="text-violet-300"
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              color="text-red-400"
            />
            <StatCard
              label="Voice Calls"
              value={stats.totalCalls}
              color="text-cyan-400"
            />
            <StatCard
              label="Leads"
              value={stats.totalLeads}
              color="text-violet-400"
            />
          </section>
        )}

        {/* ── Main Grid: Feed + Sidebar ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Pending Queue (visible when HITL active or items exist) */}
            {(pendingCount > 0 || !isAutonomous) && (
              <section>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  Blocked Actions
                  {pendingCount > 0 && (
                    <span className="ml-2 rounded-full bg-yellow-400/10 px-2.5 py-0.5 text-xs font-bold text-yellow-400">
                      {pendingCount}
                    </span>
                  )}
                </h3>

                {queue.length === 0 ? (
                  <div className="glass-card p-6 text-center text-sm text-zinc-500">
                    No blocked actions. Queue is clear.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queue.map((item) => {
                      const isApproving =
                        actionInFlight === `approve:${item.id}`;
                      const isRejecting =
                        actionInFlight === `reject:${item.id}`;
                      return (
                        <div
                          key={item.id}
                          className="glass-card border-l-4 border-l-yellow-500 p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                            <div>
                              <span className="inline-block rounded bg-yellow-500/10 px-2 py-0.5 text-[0.6rem] font-mono text-yellow-400">
                                {item.actionType}
                              </span>
                              <h4 className="mt-1.5 text-base font-bold">
                                {item.lead?.name ?? "Unknown Lead"}
                                {item.lead?.company
                                  ? ` — ${item.lead.company}`
                                  : ""}
                              </h4>
                            </div>
                            <span className="text-xs text-zinc-500">
                              {relativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="mb-4 text-sm text-zinc-400">
                            SMS → {item.destinationPhone}:{" "}
                            <span className="text-zinc-300">
                              &quot;{item.smsBody.slice(0, 120)}
                              {item.smsBody.length > 120 ? "..." : ""}&quot;
                            </span>
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => approveRequest(item.id)}
                              disabled={isApproving || isRejecting}
                              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 disabled:opacity-50"
                            >
                              {isApproving ? "Sending..." : "APPROVE"}
                            </button>
                            <button
                              onClick={() => rejectRequest(item.id)}
                              disabled={isApproving || isRejecting}
                              className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-300 transition-all hover:border-zinc-500 disabled:opacity-50"
                            >
                              {isRejecting ? "..." : "DENY"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Real-Time Action Feed */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Action Feed
              </h3>

              <div className="glass-card max-h-[520px] overflow-y-auto p-1">
                {feed.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">
                    No activity yet. Waiting for signals...
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {feed.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                      >
                        <span className="mt-0.5 text-sm">
                          {actionIcon(item.type)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-white/80">
                              {item.action}
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[0.55rem] font-bold uppercase ${statusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                            {item.leadName && (
                              <span className="text-xs text-zinc-500">
                                — {item.leadName}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-zinc-500">
                            {item.detail}
                          </p>
                        </div>
                        <span className="flex-shrink-0 text-[0.6rem] text-zinc-600">
                          {relativeTime(item.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={feedEndRef} />
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Agent Roster */}
            <section>
              <h3 className="mb-4 text-lg font-bold">Agent Swarm</h3>
              <div className="space-y-2">
                {AGENT_ROSTER.map((agent) => (
                  <div
                    key={agent.name}
                    className="glass-card flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="text-sm font-bold">{agent.name}</p>
                      <p className="text-[0.6rem] text-zinc-500 uppercase tracking-wider">
                        {agent.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.55rem] text-zinc-600">
                        {isAutonomous ? "LIVE" : "STANDBY"}
                      </span>
                      <div
                        className={`h-2 w-2 rounded-full animate-pulse ${
                          isAutonomous ? agent.color : "bg-zinc-600"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Governance Rules */}
            <section>
              <h3 className="mb-4 text-lg font-bold">Governance Rules</h3>
              <div className="glass-card p-4">
                <p className="mb-3 text-[0.6rem] uppercase tracking-widest text-zinc-500">
                  Protected Actions
                </p>
                <div className="space-y-2">
                  {(governance?.sensitiveActions ?? []).map((action) => (
                    <div
                      key={action}
                      className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
                    >
                      <span className="text-xs font-mono text-zinc-300">
                        {action}
                      </span>
                      <span
                        className={`text-[0.55rem] font-bold ${
                          isAutonomous ? "text-violet-300" : "text-yellow-400"
                        }`}
                      >
                        {isAutonomous ? "AUTO" : "HITL"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* System Info */}
            <section>
              <div className="glass-card p-4">
                <p className="mb-3 text-[0.6rem] uppercase tracking-widest text-zinc-500">
                  System
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Engine</span>
                    <span className="font-mono text-zinc-300">AgentIQ v4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Voice</span>
                    <span className="font-mono text-zinc-300">Telnyx</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Mode</span>
                    <span
                      className={`font-mono font-bold ${
                        isAutonomous ? "text-violet-300" : "text-yellow-400"
                      }`}
                    >
                      {isAutonomous ? "AUTONOMOUS" : "HITL DRAFT"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Poll</span>
                    <span className="font-mono text-zinc-300">
                      {POLL_INTERVAL / 1000}s
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat Card sub-component
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass-card p-4 text-center">
      <div className={`text-2xl font-black tabular-nums ${color}`}>{value}</div>
      <div className="mt-1 text-[0.6rem] uppercase tracking-widest text-zinc-500">
        {label}
      </div>
    </div>
  );
}


