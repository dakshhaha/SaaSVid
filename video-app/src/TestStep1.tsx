import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { GradientBG } from "./components/GradientBG";
import { Logo } from "./components/Logo";
import { KineticText } from "./components/KineticText";
import { Cursor } from "./components/Cursor";

export const TestStep1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <GradientBG />
      
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Sequence from={0} durationInFrames={120}>
           <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)" }}>
             <Logo mode="full" />
           </div>
           <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translateX(-50%)", width: "800px", textAlign: "center" }}>
             <KineticText text="Scale Your Brand 5X Faster" highlight={["5X", "Faster"]} size={80} />
           </div>
        </Sequence>
      </AbsoluteFill>

      <Cursor skin="hand" path={[
        { t: 0.2, x: 800, y: 1500 },
        { t: 1.0, x: 540, y: 960, click: true },
        { t: 1.8, x: 200, y: 1200 }
      ]} />
    </AbsoluteFill>
  );
};
