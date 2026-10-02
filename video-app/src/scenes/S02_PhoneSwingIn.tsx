import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { FPS, W, H, f } from "../timing";
import { SPRING_UI, SPRING_HERO, cameraScale, easeOutCubic } from "../motion";
import { LogoMark, KineticText, Caption, useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";
import { AnimatedCursor } from "../components/AnimatedCursor";

/**
 * S02 — WhatsApp Platform (7.5s / 450 frames)
 *
 * FOCAL POINT: The broadcast feature screenshot + WA chat bubbles on phone.
 * Story: "Send to 89k contacts, they respond in real-time."
 *
 * TIMELINE
 *  0   — feature broadcast screenshot slides in from left (HERO)
 *  40  — three stat chips stagger in below
 *  80  — phone swings in from right
 *  100 — WA chat messages animate in one by one
 *  300 — camera: slow rightward pan 1.0→1.08 (push toward phone)
 *  390 — exit blur
 *
 * CAMERA: scale only (1.0→1.08) — content oversizes the frame on right side.
 * Cursor: glides from broadcast button → phone → tap.
 */
export const S02_WhatsApp: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(7.5);
  const EXIT_AT   = f(7.1);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.08);
  const exitStyle = useExitStyle(frame, EXIT_AT);

  // ── Broadcast screenshot — HERO (soft overshoot) ─────────────────────────
  const featP  = spring({ frame, fps: FPS, config: SPRING_HERO });
  const featTX = interpolate(featP, [0, 1], [-W * 0.55, 0]);
  const featOp = interpolate(featP, [0, 0.15, 1], [0, 1, 1]);

  // ── Second feature screenshot (forms) rises from below — UI spring ────────
  const feat2P  = spring({ frame: frame - 35, fps: FPS, config: SPRING_UI });
  const feat2TY = interpolate(feat2P, [0, 1], [60, 0]);
  const feat2Op = interpolate(feat2P, [0, 0.3, 1], [0, 1, 1]);

  // ── Stat row ──────────────────────────────────────────────────────────────
  const stat1P = spring({ frame: frame - 40, fps: FPS, config: SPRING_UI });
  const stat2P = spring({ frame: frame - 52, fps: FPS, config: SPRING_UI });
  const stat3P = spring({ frame: frame - 64, fps: FPS, config: SPRING_UI });

  const statStyle = (p: number) => ({
    opacity: interpolate(p, [0, 0.3, 1], [0, 1, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
    filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
    willChange: "transform,opacity,filter" as const,
  });

  // ── Phone — UI spring (no overshoot, it's not the hero) ───────────────────
  const phoneP   = spring({ frame: frame - 70, fps: FPS, config: SPRING_UI });
  const phoneTY  = interpolate(phoneP, [0, 1], [H, 0]);
  const phoneRot = interpolate(phoneP, [0, 1], [8, 0]);
  const phoneOp  = interpolate(phoneP, [0, 0.15, 1], [0, 1, 1]);

  // ── WA chat messages ──────────────────────────────────────────────────────
  const MSG_TIMES = [f(1.8), f(2.6), f(4.2), f(5.0)];
  const MSGS = [
    { from:"in",  text:"Your order #AUB-2241 is confirmed. Amount: ₹1,500.", isSystem: true },
    { from:"in",  text:"Complete payment below:", hasBtn: true },
    { from:"out", text:"₹1,500.00 · Payment sent" },
    { from:"in",  text:"Thank you! Dispatching in 2 hours. Track: bit.ly/aub2241" },
  ];

  // ── Cursor waypoints ──────────────────────────────────────────────────────
  const cursorWaypoints = [
    { frame: 0,    x: W * 0.35, y: H * 0.75 },
    { frame: f(1.8), x: W * 0.38, y: H * 0.72, click: true },
    { frame: f(3.5), x: W * 0.75, y: H * 0.6  },
    { frame: f(4.0), x: W * 0.75, y: H * 0.68, click: true },
    { frame: f(7.5), x: W * 0.72, y: H * 0.55 },
  ];

  return (
    <AbsoluteFill style={{
      background: C.canvas,
      transform: `scale(${cam})`,
      ...exitStyle,
      willChange: "transform,filter,opacity",
    }}>
      {/* SFX */}
      <Sfx at={0.05} src="whoosh"  volume={0.32} />
      <Sfx at={1.8}  src="click"   volume={0.38} />
      <Sfx at={4.2}  src="ding"    volume={0.40} />
      <Sfx at={7.1}  src="whoosh"  volume={0.28} playbackRate={1.15} />

      {/* Subtle BG tint — left side has a barely-visible mint wash */}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(105deg, rgba(232,248,247,0.7) 0%, transparent 50%)`, pointerEvents:"none" }} />

      {/* ══ LEFT — Broadcast screenshot (oversized: 860px wide, starts at left:120) ══ */}
      <div style={{
        position:"absolute", left:120, top:"50%",
        transform:`translateY(-50%) translateX(${featTX}px)`,
        opacity: featOp,
        willChange:"transform,opacity",
        width: 860,
      }}>
        {/* Main feature screenshot */}
        <div style={{ borderRadius:16, overflow:"hidden", border:`1.5px solid ${C.border}`, boxShadow:"0 24px 64px rgba(0,0,0,0.13)" }}>
          <Img src={staticFile("assets/feature-whatsapp-broadcast.png")} style={{ width:"100%", display:"block" }} />
        </div>

        {/* Stat chips row */}
        <div style={{ display:"flex", gap:16, marginTop:20 }}>
          {[
            { p: stat1P, v:"98%",    l:"Avg. Open Rate",        c: C.green  },
            { p: stat2P, v:"45%",    l:"Avg. Reply Rate",       c: C.blue   },
            { p: stat3P, v:"1.24L",  l:"Messages Last Month",   c: C.purple },
          ].map(({ p, v, l, c }) => (
            <div key={l} style={{
              flex:1, background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:10, padding:"12px 16px",
              ...statStyle(p),
            }}>
              <div style={{ fontSize:26, fontWeight:900, color:c, fontFamily:FONT.sans, letterSpacing:"-0.04em" }}>{v}</div>
              <div style={{ fontSize:11, color:C.muted, fontFamily:FONT.sans, fontWeight:600, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Second feature screenshot */}
        <div style={{
          marginTop:20,
          borderRadius:14, overflow:"hidden", border:`1.5px solid ${C.border}`, boxShadow:"0 16px 40px rgba(0,0,0,0.10)",
          transform:`translateY(${feat2TY}px)`, opacity: feat2Op,
          willChange:"transform,opacity",
        }}>
          <Img src={staticFile("assets/feature-whatsapp-forms.png")} style={{ width:"100%", display:"block" }} />
        </div>
      </div>

      {/* ══ RIGHT — Phone with live WA chat ══ */}
      {/* Phone + content is 360px wide, positioned right:100 → at 1.08× still in frame */}
      <div style={{
        position:"absolute", right:110, top:"50%",
        transform:`translateY(calc(-50% + ${phoneTY}px)) rotate(${phoneRot}deg)`,
        opacity: phoneOp,
        transformOrigin: "bottom center",
        willChange:"transform,opacity",
      }}>
        {/* Phone shell */}
        <div style={{
          width:320, borderRadius:52, border:"12px solid #111",
          background:"#f9f9f9", overflow:"hidden", display:"flex", flexDirection:"column",
          boxShadow:"0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.45)",
        }}>
          {/* Dynamic island + status */}
          <div style={{ height:52, background:"#f9f9f9", position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", top:13, left:"50%", transform:"translateX(-50%)", width:120, height:32, background:"#111", borderRadius:18 }} />
            <span style={{ position:"absolute", left:20, bottom:10, fontSize:13, fontWeight:700, color:"#111", fontFamily:FONT.sans }}>9:41</span>
          </div>

          {/* WA Header */}
          <div style={{ background:C.waHeader, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:13, fontFamily:FONT.sans }}>A</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", fontFamily:FONT.sans, display:"flex", alignItems:"center", gap:4 }}>
                Aura Beauty
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#53bdeb"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.55)", fontFamily:FONT.sans }}>business account</div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex:1, background:C.waBg, padding:"10px 10px 6px", display:"flex", flexDirection:"column", gap:7, overflow:"hidden", minHeight:360 }}>
            {MSGS.map((msg, i) => {
              const msgFrame = MSG_TIMES[i];
              if (frame < msgFrame - f(0.65)) return null;

              // Typing indicator
              if (frame < msgFrame && msg.from === "in") {
                return (
                  <div key={i} style={{ alignSelf:"flex-start" }}>
                    <div style={{ background:C.waBubbleIn, borderRadius:"10px 10px 10px 2px", padding:"7px 12px", display:"flex", gap:4, boxShadow:"0 1px 2px rgba(0,0,0,0.08)" }}>
                      {[0,1,2].map(d => {
                        // Static stepped animation — not Math.sin continuous
                        const step = Math.floor(frame / 8) % 3;
                        return <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:C.muted, opacity: step === d ? 1 : 0.35, transform: step === d ? "translateY(-2px)" : "none" }} />;
                      })}
                    </div>
                  </div>
                );
              }
              if (frame < msgFrame) return null;

              const p = spring({ frame: frame - msgFrame, fps: FPS, config: SPRING_UI });
              const ty = interpolate(p, [0, 1], [16, 0]);
              const op = interpolate(p, [0, 0.4, 1], [0, 1, 1]);

              return (
                <div key={i} style={{ alignSelf: msg.from === "out" ? "flex-end" : "flex-start", maxWidth:"88%", transform:`translateY(${ty}px)`, opacity:op, willChange:"transform,opacity" }}>
                  <div style={{
                    background: msg.from === "out" ? C.waBubbleOut : C.waBubbleIn,
                    padding:"8px 11px", fontSize:12.5, color:C.ink, lineHeight:1.45,
                    borderRadius: msg.from === "out" ? "10px 2px 10px 10px" : "2px 10px 10px 10px",
                    boxShadow:"0 1px 2px rgba(0,0,0,0.07)", fontFamily:FONT.sans,
                  }}>
                    {msg.text}
                    <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:3, marginTop:2 }}>
                      <span style={{ fontSize:10, color:C.muted }}>{new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span>
                      {msg.from === "out" && <svg width="14" height="10" viewBox="0 0 16 11" fill={C.waTick}><path d="M1 5.5L5 9.5L15 1.5"/><path d="M6 5.5L10 9.5" opacity="0.6"/></svg>}
                    </div>
                  </div>
                  {msg.hasBtn && (
                    <div style={{ background:C.waBubbleIn, padding:"8px 11px", textAlign:"center", color:C.waMedium, fontWeight:700, fontSize:12, borderRadius:"0 0 10px 10px", boxShadow:"0 1px 2px rgba(0,0,0,0.07)", marginTop:1, fontFamily:FONT.sans }}>
                      Pay ₹1,500 →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input bar */}
          <div style={{ background:"#f0f2f5", padding:"6px 10px", display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
            <div style={{ flex:1, background:"#fff", borderRadius:20, padding:"6px 12px", fontSize:12, color:C.muted, fontFamily:FONT.sans }}>Message</div>
            <div style={{ width:30, height:30, borderRadius:"50%", background:C.waGreen, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor */}
      <AnimatedCursor waypoints={cursorWaypoints} />

      <FilmGrain opacity={0.025} />
    </AbsoluteFill>
  );
};
