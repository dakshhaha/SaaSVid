import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";

// Helper for generic icon placeholder
export const Icon: React.FC<{ name: string; color?: string; size?: number }> = ({ name, color = C.muted, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {name === "home" && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
    {name === "flow" && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
    {name === "inbox" && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
    {name === "broadcast" && <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />}
    {name === "analytics" && <path d="M18 20V10M12 20V4M6 20v-6" />}
    {name === "settings" && <circle cx="12" cy="12" r="3" />}
  </svg>
);

// ─── Base Shell ─────────────────────────────────────────────────────────────

export const AppShell: React.FC<{ children: React.ReactNode; activeTab: string }> = ({ children, activeTab }) => {
  return (
    <div style={{
      width: 1720, height: 960, background: C.canvas, borderRadius: 16,
      border: `1px solid ${C.border}`, boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
      display: "flex", overflow: "hidden", fontFamily: FONT.sans
    }}>
      {/* Sidebar */}
      <div style={{ width: 72, background: C.darkBand, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: C.green, marginBottom: 20 }} />
        {[
          { id: "dashboard", icon: "home" },
          { id: "flow", icon: "flow" },
          { id: "inbox", icon: "inbox" },
          { id: "broadcast", icon: "broadcast" },
          { id: "analytics", icon: "analytics" },
        ].map(t => (
          <div key={t.id} style={{
            width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            background: activeTab === t.id ? `${C.green}22` : "transparent",
            color: activeTab === t.id ? C.green : "rgba(255,255,255,0.4)"
          }}>
            <Icon name={t.icon} color="currentColor" size={20} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
          <Icon name="settings" color="currentColor" size={20} />
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.surface }}>
        {children}
      </div>
    </div>
  );
};

// ─── Topbar ─────────────────────────────────────────────────────────────────

export const Topbar: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div style={{ height: 64, background: C.canvas, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 24px" }}>
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, color: C.muted, display: "flex", gap: 8, alignItems: "center" }}>
        <Icon name="search" size={14} /> Search...
      </div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
    </div>
  </div>
);

// ─── KPI Card ───────────────────────────────────────────────────────────────

export const KpiCard: React.FC<{ title: string; value: string; trend: string; delay?: number }> = ({ title, value, trend, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - delay, fps: FPS, config: SPRING_UI });
  return (
    <div style={{
      background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24,
      flex: 1, display: "flex", flexDirection: "column", gap: 8,
      transform: `translateY(${interpolate(p, [0,1], [20,0])}px)`,
      opacity: interpolate(p, [0,1], [0,1])
    }}>
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.ink }}>{value}</div>
      <div style={{ fontSize: 12, color: C.green, fontWeight: 600, display: "flex", gap: 4, alignItems: "center" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        {trend} vs last month
      </div>
    </div>
  );
};
