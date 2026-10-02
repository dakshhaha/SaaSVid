import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { C } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";
import { AppShell, Topbar, KpiCard } from "./UI_Base";

export const UI_Analytics: React.FC = () => {
  const frame = useCurrentFrame();

  const barAnim = (i: number) => {
    const p = spring({ frame: frame - (f(1.0) + i * 4), fps: FPS, config: SPRING_UI });
    return interpolate(p, [0, 1], [0, 100]);
  };

  const BARS = [20, 35, 45, 80, 60, 90, 100, 75, 85, 40, 50, 70];

  return (
    <AppShell activeTab="analytics">
      <Topbar title="Analytics" subtitle="Last 30 Days" />
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 32, flex: 1, overflow: "hidden" }}>
        
        {/* KPIs */}
        <div style={{ display: "flex", gap: 24 }}>
          <KpiCard title="Total Revenue" value="₹4.2L" trend="+24%" delay={f(0.2)} />
          <KpiCard title="Conversion Rate" value="12.8%" trend="+3.1%" delay={f(0.3)} />
          <KpiCard title="Messages Read" value="98.5%" trend="+0.5%" delay={f(0.4)} />
        </div>

        {/* Chart */}
        <div style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 32 }}>Message Volume & Engagement</div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 16, position: "relative" }}>
            {/* Grid lines */}
            <div style={{ position: "absolute", inset: 0, borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: "50% 0 0 0", borderTop: `1px dashed ${C.border}`, pointerEvents: "none" }} />
            
            {/* Bars */}
            {BARS.map((height, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8, height: "100%", alignItems: "center" }}>
                <div style={{
                  width: "60%",
                  height: `${height * (barAnim(i) / 100)}%`,
                  background: `linear-gradient(to top, ${C.greenDeep}, ${C.green})`,
                  borderRadius: "8px 8px 0 0",
                  transformOrigin: "bottom"
                }} />
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{`Nov ${i + 1}`}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
};
