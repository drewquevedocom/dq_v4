"use client";

import { useEffect, useMemo, useState } from "react";

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
    role: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  voiceCall?: {
    externalCallControlId: string;
  } | null;
};

export default function Dashboard() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inFlightAction, setInFlightAction] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "PENDING").length,
    [items],
  );

  const loadQueue = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/hitl/requests?status=pending", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to load HITL queue");
      }

      const body = (await response.json()) as { data: QueueItem[] };
      setItems(body.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async (id: string) => {
    setInFlightAction(`approve:${id}`);
    setError(null);

    try {
      const response = await fetch(`/api/admin/hitl/requests/${id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to approve request");
      }

      await loadQueue();
    } catch (approveError) {
      setError(approveError instanceof Error ? approveError.message : "Approval failed");
    } finally {
      setInFlightAction(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Optional rejection reason") ?? undefined;
    setInFlightAction(`reject:${id}`);
    setError(null);

    try {
      const response = await fetch(`/api/admin/hitl/requests/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to reject request");
      }

      await loadQueue();
    } catch (rejectError) {
      setError(rejectError instanceof Error ? rejectError.message : "Reject failed");
    } finally {
      setInFlightAction(null);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic">MISSION CONTROL</h1>
          <p className="text-zinc-400 font-mono">
            GOVERNANCE LEVEL: <span className="text-[#7a43e6]">HITL ENABLED</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="self-start px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-sm"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2">
            Pending Approvals ({pendingCount})
          </h2>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          {isLoading ? (
            <div className="glass-card p-6">Loading queue...</div>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="glass-card p-6 border-l-4 border-l-zinc-600">
              <p className="text-zinc-400">No pending requests.</p>
            </div>
          ) : null}

          {items.map((item) => {
            const createdAt = new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(item.createdAt));

            const isApproving = inFlightAction === `approve:${item.id}`;
            const isRejecting = inFlightAction === `reject:${item.id}`;

            return (
              <div key={item.id} className="glass-card p-6 border-l-4 border-l-yellow-500">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                      {item.actionType}
                    </span>
                    <h3 className="text-xl font-bold">
                      {item.lead?.name ?? "Unknown lead"} {item.lead?.company ? `- ${item.lead.company}` : ""}
                    </h3>
                    <p className="text-xs text-zinc-500">Request ID: {item.id}</p>
                  </div>
                  <span className="text-zinc-500 text-sm">{createdAt}</span>
                </div>

                <div className="space-y-2 text-sm text-zinc-300 mb-5">
                  <p>Phone: {item.destinationPhone}</p>
                  {item.lead?.email ? <p>Email: {item.lead.email}</p> : null}
                  {item.voiceCall?.externalCallControlId ? (
                    <p>Call Control ID: {item.voiceCall.externalCallControlId}</p>
                  ) : null}
                  <p className="text-zinc-400">SMS Preview: {item.smsBody}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => approve(item.id)}
                    disabled={isApproving || isRejecting}
                    className="bg-[#7a43e6] text-black px-4 py-2 rounded font-bold hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    {isApproving ? "Approving..." : "Approve + Send SMS"}
                  </button>
                  <button
                    onClick={() => reject(item.id)}
                    disabled={isApproving || isRejecting}
                    className="bg-zinc-800 text-white px-4 py-2 rounded font-bold hover:bg-zinc-700 transition-all disabled:opacity-60"
                  >
                    {isRejecting ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-2">Agent Status</h2>
          <div className="space-y-4">
            <div className="glass-card p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">Front-End</p>
                <p className="text-xs text-zinc-500">GSAP Animations</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#7a43e6] animate-pulse" />
            </div>
            <div className="glass-card p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">Back-End</p>
                <p className="text-xs text-zinc-500">Telnyx Voice</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#7a43e6] animate-pulse" />
            </div>
            <div className="glass-card p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">Governance</p>
                <p className="text-xs text-zinc-500">{pendingCount} pending approvals</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

