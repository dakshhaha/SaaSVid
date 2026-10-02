import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { f } from "./timing";
import { S01_BrandOpen } from "./scenes/S01_BrandOpen";
import { S02_ThePain } from "./scenes/S02_ThePain";
import { S03_TheTurn } from "./scenes/S03_TheTurn";
import { S04_Broadcast } from "./scenes/S04_Broadcast";
import { S05_Payments } from "./scenes/S05_Payments";
import { S06_Analytics } from "./scenes/S06_Analytics";
import { S07_Outro } from "./scenes/S07_Outro";
import { LightThread } from "./components/LightThread";

// Scene durations based on the prompt
const DUR = {
  s01: 4.0,  // 0–4s
  s02: 6.0,  // 4–10s
  s03: 6.0,  // 10–16s
  s04: 7.0,  // 16–23s
  s05: 7.0,  // 23–30s
  s06: 7.0,  // 30-37s
  s07: 6.0,  // 37-43s
};

export const UXPMain: React.FC = () => {
  const s1 = 0;
  const s2 = s1 + f(DUR.s01);
  const s3 = s2 + f(DUR.s02);
  const s4 = s3 + f(DUR.s03);
  const s5 = s4 + f(DUR.s04);
  const s6 = s5 + f(DUR.s05);
  const s7 = s6 + f(DUR.s06);

  return (
    <AbsoluteFill style={{ background: "#ffffff", overflow: "hidden" }}>
      <LightThread />
      
      <Sequence from={s1} durationInFrames={f(DUR.s01)}>
        <S01_BrandOpen />
      </Sequence>

      <Sequence from={s2} durationInFrames={f(DUR.s02)}>
        <S02_ThePain />
      </Sequence>

      <Sequence from={s3} durationInFrames={f(DUR.s03)}>
        <S03_TheTurn />
      </Sequence>

      <Sequence from={s4} durationInFrames={f(DUR.s04)}>
        <S04_Broadcast />
      </Sequence>

      <Sequence from={s5} durationInFrames={f(DUR.s05)}>
        <S05_Payments />
      </Sequence>

      <Sequence from={s6} durationInFrames={f(DUR.s06)}>
        <S06_Analytics />
      </Sequence>

      <Sequence from={s7} durationInFrames={f(DUR.s07)}>
        <S07_Outro />
      </Sequence>

    </AbsoluteFill>
  );
};
