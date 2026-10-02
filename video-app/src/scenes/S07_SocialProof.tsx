import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI, cameraScale } from "../motion";
import { LogoMark, KineticText, Caption, useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";

export const S07_SocialProof: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(8.0);
  const EXIT_AT   = f(7.6);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.08);
  const exitStyle = useExitStyle(frame, EXIT_AT);

  const REVIEWS = [
    { name: "Arjun Mehta", role: "CEO, FinFlow", text: "UrbanXPixels built and launched our WA automation in 48 hours. 3x revenue in month one.", rating: 5, initial: "A" },
    { name: "Priya Sharma", role: "Founder, Aura Beauty", text: "The WhatsApp broadcast campaign drove ₹4.2L in sales in a single week. Outstanding.", rating: 5, initial: "P" },
    { name: "Karan Singh", role: "Director, NexoLogistics", text: "Their team delivered a full-stack Next.js + WA platform in under 72 hours. Unbelievable.", rating: 5, initial: "K" },
  ];

  const reviewStyle = (i: number) => {
    const p = spring({ frame: frame - (60 + i * 15), fps: FPS, config: SPRING_UI });
    return {
      opacity: interpolate(p, [0, 0.4, 1], [0, 1, 1]),
      transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
      willChange: "transform,opacity" as const,
    };
  };

  return (
    <AbsoluteFill style={{
      background: C.darkBand, // Very dark green background
      transform: `scale(${cam})`,
      ...exitStyle,
      willChange: "transform,filter,opacity",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <Sfx at={0.1}  src="whoosh"  volume={0.3} />
      <Sfx at={1.0}  src="switch"  volume={0.25} />
      <Sfx at={1.25} src="switch"  volume={0.22} playbackRate={0.95} />
      <Sfx at={1.5}  src="switch"  volume={0.20} playbackRate={1.05} />

      {/* Subtle spotlight radial gradient (static) */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 1100px 700px at 50% 40%, rgba(3,207,101,0.06) 0%, transparent 80%)`, pointerEvents:"none" }} />

      {/* ── Headline ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 50 }}>
        <LogoMark size={50} frame0={0} />
        <KineticText text="Trusted by 50+ growing brands" size={54} weight={800} color="#fff" frame0={10} stagger={3} align="center" />
        <Caption frame0={30} size={20} color="rgba(255,255,255,0.55)" align="center">
          Here's what real clients achieved in their first 30 days.
        </Caption>
      </div>

      {/* ── Reviews Grid ────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 24, marginBottom: 50 }}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{
            ...reviewStyle(i),
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "24px 28px",
            width: 400,
          }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {Array.from({ length: r.rating }).map((_, si) => (
                <span key={si} style={{ color: C.gold, fontSize: 16, lineHeight: 1 }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.85)", fontFamily: FONT.sans, lineHeight: 1.6, margin: "0 0 20px 0" }}>
              "{r.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                {r.initial}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: FONT.sans }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: FONT.sans, marginTop: 2 }}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
