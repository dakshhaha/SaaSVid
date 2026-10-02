import React from "react";
import { AbsoluteFill, useCurrentFrame, spring } from "remotion";
import { FPS, f } from "../timing";
import { FONT } from "../theme";

export const Captions: React.FC<{ text: string | null }> = ({ text }) => {
  const frame = useCurrentFrame();
  
  if (!text) return null;

  // Simple pop-in animation
  const scale = spring({ frame, fps: FPS, config: { damping: 15, mass: 0.5, stiffness: 200 } });

  return (
    <AbsoluteFill style={{
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: 80,
      pointerEvents: "none"
    }}>
      <div style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        borderRadius: 999,
        padding: "16px 32px",
        transform: `scale(${scale})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)"
      }}>
        <span style={{
          color: "#fff",
          fontSize: 48,
          fontWeight: 800,
          fontFamily: FONT.sans,
          letterSpacing: "-0.02em",
          textAlign: "center"
        }}>
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
