import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Img, staticFile } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { T1_RiseUnblur } from "../components/MotionText";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { FilmGrain } from "../components/FilmGrain";
import { Sfx } from "../components/Sfx";

export const S01_BrandOpen: React.FC = () => {
  const frame = useCurrentFrame();
  
  const tapFrame = f(0.3);

  const pLogo = spring({ frame: frame - tapFrame, fps: FPS, config: { damping: 12, stiffness: 200 } });
  const logoScale = frame < tapFrame ? 1 : interpolate(pLogo, [0, 1], [0.8, 1]);

  const start5X = f(1.5);
  const p5X = spring({ frame: frame - start5X, fps: FPS, config: { damping: 10, stiffness: 180 } });
  const val5X = Math.min(5, Math.max(1, Math.floor(interpolate(p5X, [0, 1], [1, 5]))));
  const scale5X = interpolate(p5X, [0, 1], [3, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const PILLS = ["Web", "WhatsApp", "Design", "Video"];

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(circle at 50% 30%, ${C.mintLight} 0%, #fff 80%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <Sfx at={f(0.0)} src="sub-hit" />
      <Sfx at={f(0.3)} src="glassy-pop" />
      <Sfx at={f(1.5)} src="whoosh" />
      <Sfx at={f(2.5)} src="pill-ticks" />
      
      <div style={{ position: "absolute", inset: 0, opacity: 0.3, filter: "blur(60px)" }}>
        <div style={{ position: "absolute", width: 800, height: 800, background: C.green, borderRadius: "50%", left: "10%", top: "10%", transform: `translateY(${Math.sin(frame / 60) * 50}px)` }} />
        <div style={{ position: "absolute", width: 600, height: 600, background: "#a7f3d0", borderRadius: "50%", right: "10%", bottom: "10%", transform: `translateY(${Math.cos(frame / 50) * -50}px)` }} />
      </div>

      <div style={{ position: "relative", marginBottom: 60, transform: `scale(${logoScale})` }}>
        <Img src={staticFile("uxplogo.svg")} style={{ width: 140, height: "auto" }} />
        {frame >= tapFrame && frame < tapFrame + f(0.6) && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", borderRadius: "50%",
            border: `6px solid ${C.green}`,
            width: interpolate(frame - tapFrame, [0, f(0.6)], [140, 400]),
            height: interpolate(frame - tapFrame, [0, f(0.6)], [140, 400]),
            opacity: interpolate(frame - tapFrame, [0, f(0.6)], [1, 0]),
          }} />
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <T1_RiseUnblur text="Scale Your Brand" frame0={f(0.8)} size={140} color={C.ink} stagger={3} />
        
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: -20 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              fontSize: 220, fontWeight: 900, fontFamily: FONT.sans, color: C.green,
              transform: `scale(${scale5X})`, letterSpacing: "-0.05em",
              opacity: frame > start5X ? 1 : 0
            }}>
              {val5X}X
            </div>
          </div>
          <div style={{ opacity: frame > start5X ? 1 : 0 }}>
             <T1_RiseUnblur text="Faster." frame0={start5X + f(0.3)} size={140} color={C.green} stagger={0} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 50 }}>
        {PILLS.map((pill, i) => {
          const p = spring({ frame: frame - (f(2.5) + i * 5), fps: FPS, config: { damping: 14, stiffness: 200 } });
          const y = interpolate(p, [0, 1], [30, 0]);
          const op = interpolate(p, [0, 1], [0, 1]);
          return (
            <div key={pill} style={{
              background: C.canvas, border: `2px solid ${C.border}`, borderRadius: 99,
              padding: "16px 32px", fontSize: 24, fontWeight: 700, color: C.ink, fontFamily: FONT.sans,
              transform: `translateY(${y}px)`, opacity: op,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)"
            }}>
              {pill}
            </div>
          );
        })}
      </div>

      <AnimatedCursor waypoints={[
        { frame: 0, x: 1200, y: 1500 },
        { frame: tapFrame, x: 960, y: 350, click: true },
        { frame: f(3.0), x: 200, y: 1800 }
      ]} />

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
