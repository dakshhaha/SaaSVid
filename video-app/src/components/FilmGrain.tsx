import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * FilmGrain — subtle 3% noise overlay.
 * Uses an SVG feTurbulence with a seed that changes every 2 frames
 * so grain "breathes" without being distracting.
 * Zero layout cost — absolute fill, pointer-events none.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.028 }) => {
  const frame = useCurrentFrame();
  // Change seed every 2 frames — visible but not strobing
  const seed = Math.floor(frame / 2) % 64;

  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="${seed}" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="256" height="256" filter="url(#g)" opacity="1"/>
    </svg>`
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "overlay",
      }}
    />
  );
};
