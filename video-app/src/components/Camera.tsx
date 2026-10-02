import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { FPS } from "../timing";
import { EASE_INOUT } from "../motion";

export const Camera: React.FC<{ 
  children: React.ReactNode, 
  targetScale?: number, 
  targetX?: number, 
  targetY?: number,
  zoomAt?: number // in seconds
}> = ({ children, targetScale = 1, targetX = 0, targetY = 0, zoomAt = 0 }) => {
  const frame = useCurrentFrame();
  
  const zoomProgress = interpolate(Math.max(0, frame - (zoomAt * FPS)), [0, FPS * 1.5], [0, 1], {
    easing: EASE_INOUT,
    extrapolateRight: 'clamp'
  });

  const scale = interpolate(zoomProgress, [0, 1], [1, targetScale]);
  const x = interpolate(zoomProgress, [0, 1], [0, targetX]);
  const y = interpolate(zoomProgress, [0, 1], [0, targetY]);

  return (
    <AbsoluteFill style={{
      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
      transformOrigin: "center center"
    }}>
      {children}
    </AbsoluteFill>
  );
};
