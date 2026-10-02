import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { W, H, FPS } from "../timing";

export const GradientBG: React.FC = () => {
  const frame = useCurrentFrame();
  const ph1 = Math.sin(frame / (FPS * 7));
  const ph2 = Math.sin(frame / (FPS * 9) + 2);
  const ph3 = Math.sin(frame / (FPS * 6) + 4);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(145deg, ${C.canvas} 0%, ${C.mint} 55%, ${C.mintLight} 100%)`,
      }}
    >
      {/* Blob 1 */}
      <div style={{ position:"absolute", top: -100 + ph1*60, left: -80 + ph2*80, width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle, ${C.green}1A 0%, transparent 70%)` }} />
      {/* Blob 2 */}
      <div style={{ position:"absolute", bottom: -100 + ph2*60, right: -100 + ph3*60, width:900, height:900, borderRadius:"50%", background:`radial-gradient(circle, ${C.greenDeep}14 0%, transparent 70%)` }} />
      {/* Blob 3 */}
      <div style={{ position:"absolute", top: 300 + ph3*60, left: 700 + ph1*50, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.waGreen}0E 0%, transparent 70%)` }} />
    </AbsoluteFill>
  );
};
