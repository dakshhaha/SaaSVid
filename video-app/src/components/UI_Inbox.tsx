import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";
import { AppShell, Topbar } from "./UI_Base";

export const UI_Inbox: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AppShell activeTab="inbox">
      <Topbar title="Live Inbox" subtitle="3 Agents Online" />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Chat List */}
        <div style={{ width: 340, borderRight: `1px solid ${C.border}`, background: C.canvas, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: C.muted }}>Search chats...</div>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            {[
              { name: "Arjun Mehta", msg: "Payment completed, thanks!", time: "Just now", active: true },
              { name: "Priya Sharma", msg: "When will my order arrive?", time: "2m ago" },
              { name: "Karan Singh", msg: "Can I change my shipping address?", time: "15m ago" },
              { name: "Neha Gupta", msg: "Refund requested.", time: "1h ago" },
            ].map((c, i) => (
              <div key={i} style={{ padding: "16px", borderBottom: `1px solid ${C.border}`, background: c.active ? `${C.green}10` : "transparent", display: "flex", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.muted }}>{c.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: C.ink, fontSize: 14 }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: 220 }}>{c.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat View */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.surface }}>
          {/* Chat Header */}
          <div style={{ height: 64, background: C.canvas, borderBottom: `1px solid ${C.border}`, padding: "0 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.muted }}>A</div>
            <div>
              <div style={{ fontWeight: 700, color: C.ink }}>Arjun Mehta</div>
              <div style={{ fontSize: 12, color: C.green }}>Online</div>
            </div>
            <div style={{ flex: 1 }} />
            <button style={{ background: C.canvas, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Assign to Agent</button>
          </div>
          {/* Chat Body */}
          <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 16, justifyContent: "flex-end" }}>
            <div style={{ alignSelf: "flex-start", background: C.canvas, border: `1px solid ${C.border}`, padding: "12px 16px", borderRadius: "12px 12px 12px 2px", maxWidth: "60%", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>Hi, I tried checking out but the payment failed.</div>
            </div>
            <div style={{ alignSelf: "flex-end", background: C.mintLight, border: `1px solid ${C.green}44`, padding: "12px 16px", borderRadius: "12px 12px 2px 12px", maxWidth: "60%" }}>
              <div style={{ fontSize: 14, color: C.greenDeep, lineHeight: 1.5 }}>Hi Arjun, sorry about that! I've sent a new payment link to your WhatsApp.</div>
            </div>
            
            {/* Animated incoming message */}
            {frame > f(2.0) && (
              <div style={{ alignSelf: "flex-start", background: C.canvas, border: `1px solid ${C.border}`, padding: "12px 16px", borderRadius: "12px 12px 12px 2px", maxWidth: "60%", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", transform: `translateY(${interpolate(spring({frame: frame - f(2.0), fps: FPS, config: SPRING_UI}), [0,1], [10,0])}px)`, opacity: spring({frame: frame - f(2.0), fps: FPS, config: SPRING_UI}) }}>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.5 }}>Payment completed, thanks!</div>
              </div>
            )}
          </div>
          {/* Chat Input */}
          <div style={{ padding: 24, background: C.canvas, borderTop: `1px solid ${C.border}` }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center" }}>
              <span style={{ color: C.muted, fontSize: 14 }}>Type a message...</span>
              <div style={{ flex: 1 }} />
              <div style={{ width: 32, height: 32, background: C.green, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
