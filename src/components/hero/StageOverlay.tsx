import GlassCard from "@/components/ui/GlassCard";

interface StageOverlayProps {
  type: "metrics" | "blueprint";
}

function MetricsOverlay() {
  return (
    <GlassCard className="w-64 space-y-4">
      <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
        Live Revenue Metrics
      </p>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/60">ARR</span>
          <span className="font-display text-xl font-semibold text-jesper-electric-blue">
            $2.4M
          </span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/60">MRR</span>
          <span className="font-display text-xl font-semibold text-green-400">
            $198K
          </span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/60">Conversion</span>
          <span className="font-display text-xl font-semibold text-jesper-gold">
            12.8%
          </span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-white/60">Lead Velocity</span>
          <span className="font-display text-xl font-semibold text-jesper-purple">
            +34%
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function BlueprintOverlay() {
  const agents = [
    { name: "Front-01", role: "Lead Capture", status: "active" },
    { name: "Growth-01", role: "Outreach", status: "active" },
    { name: "Back-01", role: "Ops & QA", status: "active" },
    { name: "Jarvis", role: "Coaching AI", status: "learning" },
    { name: "Revenue-01", role: "Sales Pipeline", status: "active" },
    { name: "Design-01", role: "Smart Website", status: "building" },
  ];

  return (
    <GlassCard className="w-72 space-y-4">
      <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
        AgentIQ Blueprint
      </p>
      <div className="space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
          >
            <div>
              <span className="text-xs font-semibold text-white">
                {agent.name}
              </span>
              <span className="ml-2 text-[0.6rem] text-white/40">
                {agent.role}
              </span>
            </div>
            <div
              className={`h-2 w-2 rounded-full ${
                agent.status === "active"
                  ? "bg-green-400"
                  : agent.status === "learning"
                  ? "bg-jesper-gold"
                  : "bg-jesper-electric-blue"
              } animate-pulse`}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function StageOverlay({ type }: StageOverlayProps) {
  if (type === "metrics") return <MetricsOverlay />;
  return <BlueprintOverlay />;
}
