import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { C } from "../theme";
import { FPS, f, W } from "../timing";
import { cameraScale, SPRING_HERO } from "../motion";
import { useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";
import { UI_Dashboard } from "../components/UI_Dashboard";
import { AnimatedCursor } from "../components/AnimatedCursor";

export const S02_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(8.0);
  const EXIT_AT   = f(7.6);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.08);
  const exitStyle = useExitStyle(frame, EXIT_AT);

  const uiP = spring({ frame, fps: FPS, config: SPRING_HERO });
  const uiTX = interpolate(uiP, [0, 1], [-W, 0]);
  const uiOp = interpolate(uiP, [0, 0.15, 1], [0, 1, 1]);

  return (
    <AbsoluteFill style={{
      background: C.surface,
      transform: `scale(${cam})`,
      ...exitStyle,
      willChange: "transform,filter,opacity",
    }}>
      <Sfx at={0.1} src="whoosh" volume={0.3} />
      <Sfx at={2.0} src="click" volume={0.3} />

      <div style={{
        position: "absolute", left: 100, top: 60,
        transform: `translateX(${uiTX}px)`, opacity: uiOp,
        willChange: "transform,opacity"
      }}>
        <UI_Dashboard />
      </div>

      <AnimatedCursor waypoints={[
        { frame: 0, x: 1920 * 0.5, y: 1080 * 0.8 },
        { frame: f(2.0), x: 1920 * 0.35, y: 1080 * 0.25, click: true },
        { frame: f(8.0), x: 1920 * 0.4, y: 1080 * 0.3 }
      ]} />

      <FilmGrain opacity={0.025} />
    </AbsoluteFill>
  );
};
