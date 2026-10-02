import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C } from "../theme";

export const FloatingIconCard: React.FC<{ icon: string, label: string, delay: number }> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const enter = Math.max(0, frame - delay);
  
  const scale = interpolate(enter, [0, 15], [0, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp' });
  const bob = Math.sin(frame / 30) * 8; // Idle bobbing

  return (
    <div style={{
      width: "132px",
      height: "132px",
      backgroundColor: C.white,
      border: `3px solid ${C.ink}`,
      boxShadow: `6px 6px 0 ${C.ink}`,
      borderRadius: "24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      transform: `scale(${scale}) translateY(${bob}px)`,
      gap: "12px"
    }}>
      <div style={{ fontSize: "32px" }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-general-sans)" }}>{label}</div>
    </div>
  );
};
