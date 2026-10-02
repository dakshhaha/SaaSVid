import React from "react";
import { Audio, Sequence, useCurrentFrame } from "remotion";
import { f } from "../timing";

/**
 * SFX — soft, precise, tied to motion.
 *
 * RULES:
 *  - Max 1 sound per 3 seconds; never stack >2.
 *  - Each fires 3 frames before the visual hit.
 *  - Volumes are pre-mixed for ≈ −15 LUFS final output.
 *  - No cartoon/meme sounds. Only: soft tick, gentle whoosh, glass tap, chime.
 *
 * Sound map:
 *  'whoosh' → camera push / scene transition   (gentle air, pitch rises on push-in)
 *  'click'  → UI tap / button                  (muted soft tick)
 *  'ding'   → success / completion             (glassy chime)
 *  'switch' → view switch / panel reveal       (soft UI sound)
 */

// Re-enable — use the browser preview for audio; CLI renderer handles final mix.
const AUDIO_ENABLED = true;

const URLS = {
  whoosh: "https://remotion.media/whoosh.wav",
  click:  "https://remotion.media/mouse-click.wav",
  ding:   "https://remotion.media/ding.wav",
  switch: "https://remotion.media/switch.wav",
  "sub-hit": "https://remotion.media/whoosh.wav", // fallback
  "glassy-pop": "https://remotion.media/switch.wav", // fallback
  "pill-ticks": "https://remotion.media/mouse-click.wav", // fallback
  "notification-ping": "https://remotion.media/ding.wav", // fallback
  "low-riser": "https://remotion.media/whoosh.wav", // fallback
  "chat-pop": "https://remotion.media/switch.wav", // fallback
  "air-sweep": "https://remotion.media/whoosh.wav", // fallback
  "typing": "https://remotion.media/mouse-click.wav", // fallback
  "chime": "https://remotion.media/ding.wav", // fallback
  "sheet-whoosh": "https://remotion.media/whoosh.wav", // fallback
};

export type SfxName = keyof typeof URLS;

/**
 * Drop inside a <Sequence> so `at` is scene-relative seconds.
 * Fires PRE_ROLL frames before the visual hit (default: 3).
 */
export const Sfx: React.FC<{
  at: number;         // scene-relative seconds
  src: SfxName;
  volume?: number;
  playbackRate?: number;
}> = ({ at, src, volume = 0.45, playbackRate = 1 }) => {
  if (!AUDIO_ENABLED) return null;

  const PRE_ROLL = 3; // frames before visual hit
  const startFrame = Math.max(0, f(at) - PRE_ROLL);

  // Subtle pitch variation per-instance (±4%) so repeated sounds don't feel identical
  const jitterSeed = Math.round(at * 100) % 7;
  const rate = playbackRate * (1 + (jitterSeed - 3) * 0.014);

  return (
    <Sequence from={startFrame} durationInFrames={f(1.2)}>
      <Audio
        src={URLS[src]}
        volume={volume}
        playbackRate={rate}
      />
    </Sequence>
  );
};
