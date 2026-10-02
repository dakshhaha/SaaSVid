import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI, cameraScale } from "../motion";
import { Logo, KineticText, Caption } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";

/**
 * S05 — CTA / Outro (6.0s / 360 frames)
 *
 * FOCAL POINT: The final offer and URL.
 *
 * TIMELINE
 *  0   — Background continues from S04 (Dark green)
 *  20  — Logo fades in
 *  30  — Headline wipes in
 *  70  — CTA box with 2 stats fades in (Removed Code Ownership as requested)
 *  120 — URL bar pops in
 *
 * CAMERA: Slow continuous scale 1.0 → 1.06. No translate.
 */
export const S05_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(6.0);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.06);

  // ── Content Springs (UI spring) ───────────────────────────────────────────
  const ctaP = spring({ frame: frame - 70, fps: FPS, config: SPRING_UI });
  const ctaOp = interpolate(ctaP, [0, 0.4, 1], [0, 1, 1]);
  const ctaTY = interpolate(ctaP, [0, 1], [24, 0]);

  const urlP = spring({ frame: frame - 120, fps: FPS, config: SPRING_UI });
  const urlOp = interpolate(urlP, [0, 0.4, 1], [0, 1, 1]);
  const urlTY = interpolate(urlP, [0, 1], [16, 0]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.darkBand} 0%, #0d2e21 50%, ${C.darkBand} 100%)`,
      transform: `scale(${cam})`,
      willChange: "transform",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32
    }}>
      {/* SFX */}
      <Sfx at={0.1} src="whoosh" volume={0.3} />
      <Sfx at={1.1} src="switch" volume={0.3} />
      <Sfx at={2.0} src="ding"   volume={0.35} />

      {/* Subtle radial spotlight (static) */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 900px 600px at 50% 50%, rgba(3,207,101,0.08) 0%, transparent 70%)`, pointerEvents:"none" }} />

      {/* ── Logo ───────────────────────────────────────────────────────────── */}
      <Logo width={340} frame0={10} />

      {/* ── Headline & Sub ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <KineticText text="Your Brand Deserves to Dominate." size={68} weight={900} color="#fff" frame0={30} stagger={4} align="center" />
        <Caption frame0={50} size={20} color="rgba(255,255,255,0.6)" align="center">
          Web · WhatsApp API · Design · Video — delivered in 48 hours.
        </Caption>
      </div>

      {/* ── CTA Box ────────────────────────────────────────────────────────── */}
      <div style={{
        opacity: ctaOp,
        transform: `translateY(${ctaTY}px)`,
        willChange: "transform,opacity",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "32px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        marginTop: 10,
      }}>
        {/* Stats - ONLY 2 stats as requested */}
        <div style={{ display: "flex", gap: 64, alignItems: "center" }}>
          {[
            { v: "48h", l: "Go-Live Guarantee" },
            { v: "₹0", l: "Setup Fee" },
          ].map(({ v, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 44, fontWeight: 900, color: C.green, fontFamily: FONT.sans, letterSpacing: "-0.04em" }}>{v}</div>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", fontFamily: FONT.sans, fontWeight: 600, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.1)" }} />
        {/* Note */}
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: FONT.sans, letterSpacing: "-0.01em" }}>
          🇮🇳 Made for Indian businesses ready to scale.
        </div>
      </div>

      {/* ── URL Bar ────────────────────────────────────────────────────────── */}
      <div style={{
        opacity: urlOp,
        transform: `translateY(${urlTY}px)`,
        willChange: "transform,opacity",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 999,
        padding: "12px 36px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 10,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: FONT.sans, letterSpacing: "0.02em" }}>urbanxpixels.com</span>
      </div>

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
