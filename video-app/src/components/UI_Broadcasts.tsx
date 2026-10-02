import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI } from "../motion";
import { AppShell, Topbar } from "./UI_Base";

export const UI_Broadcasts: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AppShell activeTab="broadcast">
      <Topbar title="New Broadcast" />
      <div style={{ padding: 32, display: "flex", gap: 32, flex: 1, overflow: "hidden" }}>
        {/* Left Form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Audience */}
          <div style={{ background: C.canvas, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>1. Target Audience</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ background: C.mintLight, border: `1px solid ${C.green}`, padding: "12px 16px", borderRadius: 8, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.greenDeep }}>Tag: HOT LEADS</div>
                <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>45,210 contacts matched</div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "12px 16px", borderRadius: 8, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Upload CSV</div>
              </div>
            </div>
          </div>

          {/* Template */}
          <div style={{ background: C.canvas, padding: 24, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>2. Select Template</div>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 16, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>diwali_mega_sale_v2</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Approved (Marketing)</div>
              </div>
              <div style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>Change</div>
            </div>
          </div>
          
          <div style={{ flex: 1 }} />
          
          {/* Send Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <button style={{ padding: "12px 24px", background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 8, fontWeight: 600 }}>Save Draft</button>
            <button style={{ padding: "12px 24px", background: C.green, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, boxShadow: "0 4px 12px rgba(3,207,101,0.3)" }}>
              Send to 45,210 Contacts
            </button>
          </div>
        </div>

        {/* Right Preview */}
        <div style={{ width: 400, background: C.canvas, padding: 24, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 24, alignSelf: "flex-start", letterSpacing: "0.05em" }}>WHATSAPP PREVIEW</div>
          <div style={{ width: 280, height: 500, background: C.waBg, borderRadius: 32, border: "8px solid #111", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: C.waHeader, padding: "12px", color: "#fff", fontWeight: 600, fontSize: 13 }}>Aura Beauty</div>
            <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: C.waBubbleIn, padding: 10, borderRadius: "0 8px 8px 8px", fontSize: 13, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                <img src="https://remotion.media/placeholder.png" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 4, marginBottom: 8, background: C.surface }} />
                Hey Rahul! 🎉 Our Diwali Mega Sale is now live. Get flat 50% off on all products.
              </div>
              <div style={{ background: C.waBubbleIn, padding: 8, textAlign: "center", color: C.waMedium, fontWeight: 700, fontSize: 12, borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                Shop Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
