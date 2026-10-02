import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { FPS, W, H, f } from "../timing";
import { SPRING_UI, SPRING_HERO, cameraScale, easeOutCubic } from "../motion";
import { Logo, KineticText, Caption, StatChip, Pill, useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";

/**
 * S01 — HERO (5.5s / 330 frames)
 *
 * FOCAL POINT: the UXP logo + headline, confirmed by the dashboard rising to its right.
 *
 * TIMELINE  (frame — event)
 *  0  — background + pill badge appear (never blank)
 *  6  — logo wordmark fades/rises in
 *  20 — headline word 1 reveals
 *  50 — caption + stats stagger in
 *  90 — dashboard screenshot enters (HERO element — one soft overshoot)
 *  150 — WA card enters bottom-right
 *  260 — camera slow push 1.0 → 1.06
 *  310 — exit blur starts
 *
 * CAMERA RULE: scale only, from center. Dashboard oversizes the right half so
 * no blank is ever visible at 1.10× zoom.
 */
export const S01_Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(5.5);
  const EXIT_AT   = f(5.1);

  // ── Camera: slow push-in from center, no translate ────────────────────────
  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.07);

  // ── Exit ──────────────────────────────────────────────────────────────────
  const exitStyle = useExitStyle(frame, EXIT_AT);

  // ── Dashboard screenshot — HERO element (one soft overshoot) ──────────────
  // Enters from bottom-right, rises into place. Content fills the right half
  // so camera scale never exposes blank edges.
  const dashP   = spring({ frame: frame - 80, fps: FPS, config: SPRING_HERO });
  const dashTY  = interpolate(dashP, [0, 1], [H * 0.6, 0]);
  const dashOp  = interpolate(dashP, [0, 0.15, 1], [0, 1, 1]);
  // Steady 3D tilt that eases to zero — NOT a continuous idle animation
  const dashRot = interpolate(dashP, [0, 1], [-3.5, 0]);

  // ── WA floating card ──────────────────────────────────────────────────────
  const waP  = spring({ frame: frame - 150, fps: FPS, config: SPRING_UI });
  const waOp = interpolate(waP, [0, 0.3, 1], [0, 1, 1]);
  const waTY = interpolate(waP, [0, 1], [32, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, #f0fdf6 0%, #e8f8f7 40%, #f8fafc 100%)`,
        transform: `scale(${cam})`,
        ...exitStyle,
        willChange: "transform,filter,opacity",
      }}
    >
      {/* SFX cues */}
      <Sfx at={0.08} src="whoosh" volume={0.3} />
      <Sfx at={1.4}  src="switch" volume={0.35} />
      <Sfx at={2.5}  src="switch" volume={0.3} />
      <Sfx at={5.1}  src="whoosh" volume={0.28} playbackRate={1.15} />

      {/* Subtle background layer — two static radial gradients, no animation */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 900px 700px at 18% 55%, rgba(3,207,101,0.10) 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 700px 600px at 80% 80%, rgba(0,158,70,0.06) 0%, transparent 70%)`, pointerEvents:"none" }} />

      {/* Fine grid — static, zero-cost */}
      <svg style={{ position:"absolute", inset:0, opacity:0.035 }} width={W} height={H} aria-hidden>
        {Array.from({length:11}).map((_,i)=><line key={i} x1={i*192} y1={0} x2={i*192} y2={H} stroke={C.ink} strokeWidth="1"/>)}
        {Array.from({length:7}).map((_,i)=><line key={i} x1={0} y1={i*180} x2={W} y2={i*180} stroke={C.ink} strokeWidth="1"/>)}
      </svg>

      {/* ══ LEFT COLUMN — positioned absolute, never fitted into the frame ══ */}
      <div style={{
        position: "absolute",
        left: 120,
        top: "50%",
        transform: "translateY(-50%)",
        width: 700,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}>
        <Pill label="India's Leading WhatsApp + Web SaaS" frame0={0} />

        <Logo width={420} frame0={6} />

        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <KineticText text="Scale Your Brand" size={68} weight={800} frame0={20} stagger={3} />
          <KineticText text="5× Faster." size={88} weight={900} frame0={30} stagger={3}
            highlight={["5×", "Faster."]} highlightColor={C.green} />
        </div>

        <Caption frame0={55} size={19} color={C.muted}>
          Official WhatsApp Business API · High-speed Web Platforms<br/>
          Graphic Design · Video Editing — one team, 48-hour delivery.
        </Caption>

        <div style={{ display:"flex", gap:12 }}>
          <StatChip value="98%" label="WA Open Rate"   accentColor={C.green}  frame0={65} />
          <StatChip value="<1.2s" label="Page Load"    accentColor={C.blue}   frame0={72} />
          <StatChip value="3×"   label="Revenue Lift"  accentColor={C.purple} frame0={79} />
          <StatChip value="50+"  label="Live Clients"  accentColor={C.orange} frame0={86} />
        </div>
      </div>

      {/* ══ RIGHT — Dashboard screenshot (oversized so no edge blank at zoom) ══ */}
      {/* Width 1200px on a 1920 canvas with right:-80 — at 1.07× scale still fills */}
      <div style={{
        position: "absolute",
        right: -100,
        top: "50%",
        transform: `translateY(calc(-50% + ${dashTY}px)) rotate(${dashRot}deg)`,
        opacity: dashOp,
        transformOrigin: "bottom center",
        willChange: "transform,opacity",
      }}>
        <Img
          src={staticFile("assets/feature-analytics.png")}
          style={{
            width: 1150,
            height: "auto",
            display: "block",
            borderRadius: 18,
            border: `1.5px solid ${C.border}`,
            boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {/* ══ WA floating card — foreground layer ══ */}
      <div style={{
        position: "absolute",
        right: 120,
        bottom: 80,
        opacity: waOp,
        transform: `translateY(${waTY}px)`,
        willChange: "transform,opacity",
        zIndex: 20,
      }}>
        <div style={{
          background: C.canvas,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
          overflow: "hidden",
          width: 260,
        }}>
          <Img src={staticFile("assets/whatsapp-hero.png")} style={{ width:"100%", display:"block" }} />
          <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.waGreen }} />
            <span style={{ fontSize:12.5, fontWeight:700, color:C.ink, fontFamily:FONT.sans }}>
              WhatsApp Live · 98% open rate
            </span>
          </div>
        </div>
      </div>

      <FilmGrain opacity={0.025} />
    </AbsoluteFill>
  );
};
