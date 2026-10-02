import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { C } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";
import { AppShell, Topbar } from "./UI_Base";

export const UI_FlowBuilder: React.FC = () => {
  const frame = useCurrentFrame();

  // Nodes for the flow builder
  const Node: React.FC<{ type: string; title: string; desc: string; top: number; left: number; active?: boolean }> = ({ type, title, desc, top, left, active }) => (
    <div style={{
      position: "absolute", top, left, width: 280,
      background: C.canvas, border: `2px solid ${active ? C.green : C.border}`,
      borderRadius: 12, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      zIndex: active ? 10 : 1
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? C.mintLight : C.surface, color: active ? C.green : C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {type === 'trigger' ? '⚡' : type === 'msg' ? '💬' : '🔀'}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{title}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{type.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: C.body, lineHeight: 1.4, background: C.surface, padding: "8px 12px", borderRadius: 6 }}>
        {desc}
      </div>
      {/* Handles */}
      {type !== 'trigger' && <div style={{ position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: C.canvas, border: `2px solid ${C.muted}` }} />}
      <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: C.canvas, border: `2px solid ${active ? C.green : C.muted}` }} />
    </div>
  );

  return (
    <AppShell activeTab="flow">
      <Topbar title="Abandoned Cart Flow" subtitle="Last edited 2 mins ago" />
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#fcfcfc" }}>
        {/* Dot Grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.border} 2px, transparent 2px)`, backgroundSize: "32px 32px" }} />
        
        {/* Nodes */}
        <Node type="trigger" title="Cart Abandoned" desc="Triggers when checkout is abandoned for 30 mins." top={120} left={80} />
        <Node type="msg" title="Send WhatsApp" desc="Template: cart_recovery_1" top={180} left={480} active={true} />
        <Node type="condition" title="Has Purchased?" desc="Wait 24 hours" top={100} left={880} />
        
        {/* Connection Lines (SVG) */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <path d="M 360 170 C 420 170, 420 230, 480 230" fill="none" stroke={C.green} strokeWidth="3" />
          <path d="M 760 230 C 820 230, 820 150, 880 150" fill="none" stroke={C.muted} strokeWidth="2" strokeDasharray="6 4" />
        </svg>

        {/* Floating properties panel */}
        <div style={{
          position: "absolute", right: 24, top: 24, bottom: 24, width: 340,
          background: C.canvas, borderRadius: 12, border: `1px solid ${C.border}`,
          boxShadow: "0 12px 48px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column"
        }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>Send WhatsApp</div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>TEMPLATE</div>
              <div style={{ background: C.surface, padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13 }}>cart_recovery_1</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>VARIABLES</div>
              <div style={{ background: C.surface, padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 13 }}>{"1: {{customer.name}}, 2: {{cart.url}}"}</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
