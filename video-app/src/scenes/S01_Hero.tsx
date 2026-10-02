import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { C } from "../theme";
import { FPS, f } from "../timing";
import { cameraScale } from "../motion";
import { Logo, KineticText, Caption, useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";

export const S01_Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(6.0);
  const EXIT_AT   = f(5.6);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.06);
  const exitStyle = useExitStyle(frame, EXIT_AT);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(155deg, #f0fdf6 0%, #e8f8f7 40%, #f8fafc 100%)`,
      transform: `scale(${cam})`,
      ...exitStyle,
      willChange: "transform,filter,opacity",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <Sfx at={0.1} src="whoosh" volume={0.3} />
      <Sfx at={1.4} src="switch" volume={0.35} />

      <Logo width={480} frame0={10} />

      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop: 40, alignItems: "center" }}>
        <KineticText text="The Ultimate WhatsApp SaaS Platform" size={68} weight={800} frame0={30} stagger={3} align="center" />
        <KineticText text="Scale Your Brand 5× Faster." size={88} weight={900} frame0={45} stagger={3}
          highlight={["5×", "Faster."]} highlightColor={C.green} align="center" />
      </div>

      <div style={{ marginTop: 24 }}>
        <Caption frame0={70} size={22} color={C.muted} align="center">
          Marketing · Support · Automation — all in one place.
        </Caption>
      </div>

      <FilmGrain opacity={0.025} />
    </AbsoluteFill>
  );
};
