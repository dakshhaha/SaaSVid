import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { f, FPS, W, H } from "../timing";
import { C } from "../theme";

/**
 * A glowing green line that traverses across scenes.
 * It's drawn using SVG path with strokeDasharray to simulate drawing.
 */
export const LightThread: React.FC = () => {
  const frame = useCurrentFrame();

  // The total duration is 30s. The line draws continuously.
  const TOTAL_FRAMES = f(30);
  
  // Approximate path covering the entire screen over 30s
  const pathData = `M ${W/2} ${H} 
                    C ${W/2} ${H*0.8} ${W*0.2} ${H*0.6} ${W*0.2} ${H*0.4}
                    S ${W*0.8} ${H*0.2} ${W*0.8} ${H*0.1}
                    C ${W*0.5} ${0} ${W*0.5} ${0} ${W/2} -100`;

  // Animate the line drawing
  const pDraw = frame / TOTAL_FRAMES;
  const pathLength = 5000; // rough length of path
  const dashOffset = interpolate(pDraw, [0, 1], [pathLength, 0]);

  // Bright head position (not perfectly aligned with SVG stroke without getPointAtLength,
  // but we can simulate a simple glowing blob that moves down vertically as a fallback,
  // or just use the stroke with a glowing filter).

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ filter: "drop-shadow(0 0 16px rgba(3,207,101,0.8))" }}>
        <path
          d={pathData}
          fill="none"
          stroke={C.green}
          strokeWidth={4}
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          opacity={0.6}
        />
        {/* The head is simply a smaller dasharray riding the path */}
        <path
          d={pathData}
          fill="none"
          stroke="#fff"
          strokeWidth={6}
          strokeDasharray={`0 ${pathLength}`}
          strokeDashoffset={dashOffset}
          style={{ strokeDasharray: `20 ${pathLength}` }}
        />
      </svg>
    </AbsoluteFill>
  );
};
