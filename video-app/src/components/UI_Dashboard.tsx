import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";
import { AppShell, Topbar, KpiCard } from "./UI_Base";
import { Counter } from "./Atoms";

export const UI_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();

  const rowAnim = (i: number) => {
    const p = spring({ frame: frame - (f(1.0) + i * 5), fps: FPS, config: SPRING_UI });
    return {
      opacity: interpolate(p, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(p, [0, 1], [10, 0])}px)`
    };
  };

  return (
    <AppShell activeTab="dashboard">
      <Topbar title="Overview" subtitle="Welcome back, Aura Beauty." />
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>
        {/* KPIs */}
        <div style={{ display: "flex", gap: 24 }}>
          <KpiCard title="Active Contacts" value="89,872" trend="+12.5%" delay={f(0.2)} />
          <KpiCard title="Messages Sent" value="1.24L" trend="+8.2%" delay={f(0.3)} />
          <KpiCard title="Avg. Open Rate" value="98.2%" trend="+1.1%" delay={f(0.4)} />
        </div>
        {/* Recent Activity */}
        <div style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, fontSize: 15, fontWeight: 700, color: C.ink }}>Recent Broadcasts</div>
          {[
            { name: "Diwali Mega Sale", sent: "45,000", open: "98%", status: "Completed" },
            { name: "Abandoned Cart Recovery", sent: "1,240", open: "94%", status: "Active" },
            { name: "New User Onboarding", sent: "890", open: "99%", status: "Active" },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: `1px solid ${C.border}`, alignItems: "center", ...rowAnim(i) }}>
              <div style={{ fontWeight: 600, color: C.ink }}>{row.name}</div>
              <div style={{ color: C.muted, fontSize: 14 }}>{row.sent} recipients</div>
              <div style={{ color: C.green, fontWeight: 700 }}>{row.open} Open</div>
              <div><span style={{ background: row.status === "Active" ? `${C.green}15` : `${C.muted}15`, color: row.status === "Active" ? C.greenDeep : C.muted, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{row.status}</span></div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};
