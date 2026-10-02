import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { T2_StackedWeight, T6_GhostWord } from "../components/MotionText";
import { cameraScale } from "../motion";
import { FilmGrain } from "../components/FilmGrain";
import { Sfx } from "../components/Sfx";

export const S02_ThePain: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(6.0); // 4-10s
  
  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.15); // Push in

  const MESSAGES = [
    "Hi, is this available?",
    "When will my order arrive?",
    "Can I talk to an agent?",
    "I need a refund.",
    "Do you deliver to Mumbai?",
    "Hello?"
  ];

  const startCounter = f(1.0);
  const pCount = interpolate(frame - startCounter, [0, f(3.5)], [1, 47], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const count = Math.floor(pCount);
  
  const shakeFrame = frame % 30;
  const shake = shakeFrame < 10 && frame > startCounter ? Math.sin(shakeFrame) * 4 : 0;

  return (
    <AbsoluteFill style={{
      background: "#f8fafc",
      display: "flex", flexDirection: "row", alignItems: "center"
    }}>
      {/* Background scaled independently */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, zIndex: 0 }}>
        <FilmGrain opacity={0.04} />
      </div>

      <Sfx at={f(1.0)} src="notification-ping" />
      <Sfx at={f(1.5)} src="notification-ping" />
      <Sfx at={f(2.0)} src="notification-ping" />
      <Sfx at={f(2.5)} src="notification-ping" />
      <Sfx at={f(3.0)} src="notification-ping" />
      <Sfx at={f(0.5)} src="low-riser" />

      <div style={{ position: "absolute", zIndex: 1 }}>
        <T6_GhostWord text="UNREAD" />
      </div>

      {/* Red unread badge */}
      <div style={{
        position: "absolute", top: 120, right: 300,
        background: C.red, color: "#fff",
        fontSize: 48, fontWeight: 900, fontFamily: FONT.sans,
        padding: "16px 32px", borderRadius: 99,
        transform: `translateX(${shake}px)`,
        boxShadow: "0 12px 32px rgba(220, 38, 38, 0.3)",
        zIndex: 10
      }}>
        {count} NEW
      </div>

      <div style={{ padding: "0 180px", position: "relative", zIndex: 5, flex: 1 }}>
        <T2_StackedWeight
          frame0={f(0.5)}
          lines={[
            { text: "Leads message you." },
            { text: "Nobody replies" },
            { text: "fast enough.", highlightWord: "fast" }
          ]}
        />
      </div>

      {/* Stacked notification deck */}
      <div style={{ position: "relative", width: 600, height: 600, right: 180, zIndex: 10 }}>
        {MESSAGES.map((msg, i) => {
          const dropF = f(1.0) + i * f(0.5);
          if (frame < dropF) return null;

          const pDrop = spring({ frame: frame - dropF, fps: FPS, config: { damping: 12, stiffness: 200 } });
          const y = interpolate(pDrop, [0, 1], [-400, i * 40]);
          const rot = interpolate(pDrop, [0, 1], [-10, (i % 2 === 0 ? 1 : -1) * (i * 1.5)]);
          
          return (
            <div key={i} style={{
              position: "absolute",
              top: 100, left: 0, width: "100%",
              background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
              border: `2px solid ${C.border}`, borderRadius: 24,
              padding: "32px",
              transform: `translateY(${y}px) rotate(${rot}deg)`,
              boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
              display: "flex", gap: 24, alignItems: "center"
            }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.ink, fontFamily: FONT.sans, marginBottom: 8 }}>WhatsApp</div>
                <div style={{ fontSize: 28, color: C.muted, fontFamily: FONT.sans }}>{msg}</div>
              </div>
            </div>
          );
        })}
      </div>

      <FilmGrain opacity={0.04} />
    </AbsoluteFill>
  );
};
