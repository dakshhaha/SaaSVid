import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Img, staticFile } from "remotion";
import { FPS, f, W, H } from "../timing";
import { C, FONT } from "../theme";
import { T1_RiseUnblur } from "../components/MotionText";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { FilmGrain } from "../components/FilmGrain";
import { Sfx } from "../components/Sfx";

export const S07_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Enter CTA button
  const pCTA = spring({ frame: frame - f(2.0), fps: FPS, config: { damping: 14, stiffness: 120 } });
  const ctaScale = interpolate(pCTA, [0, 1], [0.8, 1]);
  const ctaOp = interpolate(pCTA, [0, 1], [0, 1]);

  // Circle expansion that fills the screen from the CTA button
  const pFill = spring({ frame: frame - f(4.0), fps: FPS, config: { damping: 20, stiffness: 80 } });
  const fillScale = interpolate(pFill, [0, 1], [0, 50]);

  return (
    <AbsoluteFill style={{
      background: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <Sfx at={f(1.0)} src="whoosh" />
      <Sfx at={f(2.0)} src="sub-hit" />
      <Sfx at={f(3.5)} src="click" />
      <Sfx at={f(4.0)} src="low-riser" />

      {/* Title */}
      <div style={{ marginBottom: 60 }}>
        <T1_RiseUnblur text="Stop waiting." frame0={f(0.5)} size={120} color={C.ink} stagger={3} />
        <div style={{ marginTop: 20 }}>
          <T1_RiseUnblur text="Start converting." frame0={f(1.5)} size={120} color={C.green} stagger={3} />
        </div>
      </div>

      {/* CTA Button */}
      <div style={{
        position: "relative",
        transform: `scale(${ctaScale})`, opacity: ctaOp,
        zIndex: 10
      }}>
        <div style={{
          background: C.ink, color: "#fff", padding: "24px 64px", borderRadius: 99,
          fontSize: 32, fontWeight: 700, fontFamily: FONT.sans,
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 16,
          transform: frame >= f(3.5) && frame < f(3.8) ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.1s"
        }}>
          Get Started <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        
        {/* Glow behind CTA */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 300, height: 100, background: C.green, filter: "blur(60px)", opacity: 0.3, zIndex: -1
        }} />
      </div>

      <AnimatedCursor waypoints={[
        { frame: 0, x: 800, y: 1500 },
        { frame: f(3.5), x: W/2, y: H/2 + 100, click: true }
      ]} />

      {/* Final Logo reveal on top of everything */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 100, height: 100, background: C.green, borderRadius: "50%",
        scale: fillScale, zIndex: 100, pointerEvents: "none"
      }} />
      
      {frame > f(4.5) && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 101, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: interpolate(frame - f(4.5), [0, f(0.5)], [0, 1])
        }}>
          <Img src={staticFile("uxplogo.svg")} style={{ width: 300, height: "auto", filter: "brightness(0) invert(1)" }} />
        </div>
      )}

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
