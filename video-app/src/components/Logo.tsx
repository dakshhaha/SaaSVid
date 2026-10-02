import React from "react";
import { Img, staticFile, useCurrentFrame, spring, interpolate } from "remotion";
import { FPS } from "../timing";
import { SPRING_POP, EASE_OUT } from "../motion";

/**
 * Renders the real UrbanXPixels SVG logo.
 * mode='icon' shows just the mark; mode='full' shows full wordmark.
 * The entire component pops in with SPRING_POP.
 */
export const Logo: React.FC<{
  mode?: 'icon' | 'full';
  height?: number;
  startFrame?: number;
}> = ({ mode = 'full', height = 80, startFrame = 0 }) => {
  const frame = useCurrentFrame();

  const p = spring({ frame: frame - startFrame, fps: FPS, config: SPRING_POP });
  const scale   = interpolate(p, [0, 1], [0.6, 1]);
  const opacity = interpolate(p, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      transform: `scale(${scale})`,
      opacity,
      willChange: 'transform, opacity',
    }}>
      <Img
        src={staticFile('brand/uxplogo.svg')}
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};
