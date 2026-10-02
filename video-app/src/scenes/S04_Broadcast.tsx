import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Img, staticFile } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { T6_GhostWord, T10_CalloutChip, T7_NumberSlam } from "../components/MotionText";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";

export const S04_Broadcast: React.FC = () => {
  const frame = useCurrentFrame();
  
  const pCam = spring({ frame: frame - f(3.0), fps: FPS, config: { damping: 15, stiffness: 100 } });
  const camScale = interpolate(pCam, [0, 1], [1.0, 1.25]);
  const camX = interpolate(pCam, [0, 1], [0, -350]);
  const camY = interpolate(pCam, [0, 1], [0, 100]); 
  const bgOpacity = interpolate(pCam, [0, 1], [1, 0.4]);

  const pPanel = spring({ frame: frame - f(0.5), fps: FPS, config: { damping: 15, stiffness: 100 } });
  const panelY = interpolate(pPanel, [0, 1], [1000, 0]);
  const panelRot = interpolate(pPanel, [0, 1], [15, 0]);

  return (
    <AbsoluteFill style={{ background: "#f8fafc" }}>
      <Sfx at={f(0.0)} src="air-sweep" />
      <Sfx at={f(3.5)} src="click" />
      <Sfx at={f(4.5)} src="sub-hit" />

      <div style={{ position: "absolute", zIndex: 1 }}>
        <T6_GhostWord text="BROADCAST" />
      </div>

      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
        transformOrigin: "center center",
        willChange: "transform",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 10
      }}>
        {/* Hyper-Detailed DOM-based Broadcast UI */}
        <div style={{
          position: "relative",
          width: 1500, height: 850,
          transform: `perspective(2000px) rotateY(${interpolate(frame, [0, f(1.5)], [12, 0], { extrapolateRight: "clamp" })}deg) translateY(${panelY}px) rotateZ(${panelRot}deg)`
        }}>
          {/* Base Layer: Dashboard Background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#ffffff", borderRadius: 24, border: `1px solid ${C.border}`,
            boxShadow: "0 40px 100px rgba(0,0,0,0.08), 0 10px 30px rgba(0,0,0,0.04)", 
            display: "flex", overflow: "hidden",
            opacity: bgOpacity, transition: "opacity 0.2s"
          }}>
            {/* Nav Sidebar */}
            <div style={{ width: 80, borderRight: `1px solid ${C.border}`, background: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", gap: 32 }}>
              <div style={{ width: 40, height: 40, background: C.green, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Img src={staticFile("uxplogo.svg")} style={{ width: 24, height: 24 }} />
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e2e8f0" }} />
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e2e8f0" }} />
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e2e8f0" }} />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ padding: "24px 40px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
                <div>
                  <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Campaign Builder</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, fontFamily: FONT.sans }}>Summer Sale Announce</div>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ border: `1px solid ${C.border}`, padding: "10px 20px", borderRadius: 12, fontSize: 16, fontWeight: 600, color: C.ink }}>Save Draft</div>
                  <div style={{ background: C.green, color: "#fff", padding: "10px 24px", borderRadius: 12, fontSize: 16, fontWeight: 700, boxShadow: "0 4px 12px rgba(3,207,101,0.3)" }}>Next Step</div>
                </div>
              </div>
              
              <div style={{ display: "flex", flex: 1, background: "#fafbfc" }}>
                {/* Middle configuration area */}
                <div style={{ flex: 1, borderRight: `1px solid ${C.border}`, padding: 40 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 24 }}>Audience Selection</div>
                  
                  {/* Detailed Audience Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[ 
                      { title: "All Customers", count: "12,402", active: false },
                      { title: "VIP Members (Spent > $500)", count: "4,392", active: true },
                      { title: "Cart Abandoners (Last 7d)", count: "1,043", active: false }
                    ].map((tag, i) => (
                      <div key={i} style={{
                        padding: "20px 24px", 
                        background: tag.active ? "#ecfdf5" : "#fff", 
                        border: tag.active ? `2px solid ${C.green}` : `1px solid ${C.border}`,
                        borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
                        boxShadow: tag.active ? "0 4px 12px rgba(3,207,101,0.1)" : "0 2px 4px rgba(0,0,0,0.02)"
                      }}>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: tag.active ? C.green : C.ink }}>{tag.title}</div>
                          <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Synced from Shopify</div>
                        </div>
                        <div style={{ background: tag.active ? C.green : C.surface, color: tag.active ? "#fff" : C.ink, padding: "6px 12px", borderRadius: 99, fontSize: 14, fontWeight: 700 }}>
                          {tag.count}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: 40 }} />
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 24 }}>Template Details</div>
                  <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                     <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Template Name</div>
                     <div style={{ background: C.surface, padding: "12px 16px", borderRadius: 8, fontSize: 16, color: C.ink, fontWeight: 500 }}>summer_sale_2024</div>
                  </div>
                </div>
                
                {/* Right area: Realistic Phone Preview */}
                <div style={{ width: 450, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 24 }}>Live Preview</div>
                  
                  {/* iPhone Frame */}
                  <div style={{
                    width: 320, height: 650, background: C.waBg, borderRadius: 40, border: "12px solid #111",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.15)", overflow: "hidden", display: "flex", flexDirection: "column"
                  }}>
                    <div style={{ background: C.waHeader, padding: "16px", color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Img src={staticFile("uxplogo.svg")} style={{ width: 24, height: 24 }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>Aura Beauty</div>
                        <div style={{ fontSize: 12, color: "#a7f3d0" }}>Official Business Account</div>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
                      <div style={{ alignSelf: "center", background: "#e2e8f0", color: C.muted, padding: "4px 12px", borderRadius: 8, fontSize: 12, marginBottom: 20 }}>Today</div>
                      
                      <div style={{ background: C.waBubbleIn, padding: "16px", borderRadius: "16px 16px 16px 4px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>☀️</div>
                        <div style={{ fontSize: 15, lineHeight: 1.4, color: "#111" }}>
                          Hey <strong>Priya</strong>, our new Summer Collection is finally live!<br/><br/>
                          Get early access and 20% off your entire cart. Tap below to shop now.
                        </div>
                        <div style={{ marginTop: 12, color: C.green, fontSize: 12, fontWeight: 700 }}>Ends in 24 hours</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <div style={{ flex: 1, background: "#fff", color: "#007aff", padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: "center", border: `1px solid ${C.border}` }}>Shop Now</div>
                        <div style={{ flex: 1, background: "#fff", color: "#007aff", padding: "10px", borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: "center", border: `1px solid ${C.border}` }}>Opt Out</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Send Broadcast Button - Moved OUTSIDE the 3D perspective wrapper so it doesn't z-fight or jitter */}
        <div style={{
          position: "absolute", right: -50, bottom: -100, width: 320, height: 90,
          background: frame >= f(3.5) && frame < f(3.8) ? "#02a550" : C.green, 
          borderRadius: 20, color: "#fff",
          boxShadow: "0 24px 48px rgba(3,207,101,0.5), inset 0 2px 0 rgba(255,255,255,0.2)", 
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          fontSize: 26, fontWeight: 800, fontFamily: FONT.sans,
          transform: frame >= f(3.5) && frame < f(3.8) ? "scale(0.95)" : "scale(1)",
          transition: "all 0.1s",
          zIndex: 50
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Send Now
        </div>
      </div>

      <div style={{ zIndex: 20 }}>
        <T10_CalloutChip text="Official Meta API" frame0={f(1.5)} x={300} y={150} targetX={500} targetY={250} />
        <T10_CalloutChip text="Zero ban risk" frame0={f(2.0)} x={1600} y={150} targetX={1450} targetY={250} />
      </div>

      <div style={{ position: "absolute", right: 400, top: 200, zIndex: 30 }}>
        <T7_NumberSlam target={98} unit="%" subtitle="message open rate" frame0={f(4.0)} />
      </div>

      <div style={{ zIndex: 40 }}>
        <AnimatedCursor waypoints={[
          { frame: 0, x: 1500, y: 1500 },
          { frame: f(3.5), x: 1150, y: 700, click: true }
        ]} />
      </div>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
        <FilmGrain opacity={0.03} />
      </div>
    </AbsoluteFill>
  );
};
