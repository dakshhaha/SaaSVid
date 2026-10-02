import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FPS } from "../timing";

type CursorProps = {
  skin?: 'hand' | 'arrow';
  path: { t: number; x: number; y: number; click?: boolean }[];
};

export const Cursor: React.FC<CursorProps> = ({ skin = 'hand', path }) => {
  const frame = useCurrentFrame();
  const time = frame / FPS;

  // Find current segment in path
  let currentSegmentIndex = 0;
  for (let i = 0; i < path.length - 1; i++) {
    if (time >= path[i].t && time < path[i + 1].t) {
      currentSegmentIndex = i;
      break;
    } else if (time >= path[path.length - 1].t) {
      currentSegmentIndex = path.length - 2;
    }
  }

  const p0 = path[currentSegmentIndex] || path[0];
  const p1 = path[currentSegmentIndex + 1] || path[path.length - 1] || p0;

  // Ensure p0 and p1 are valid before interpolating
  let x = 0;
  let y = 0;
  let isClicking = false;

  if (p0 && p1 && p0.t !== p1.t) {
    const progress = Math.max(0, Math.min(1, (time - p0.t) / (p1.t - p0.t)));
    // Add springy motion to movement
    const easedProgress = spring({ frame: progress * 60, fps: 60, config: { damping: 12 } });
    x = interpolate(easedProgress, [0, 1], [p0.x, p1.x]);
    y = interpolate(easedProgress, [0, 1], [p0.y, p1.y]);
    
    // Check if clicking
    const clickDuration = 0.2; // 200ms click
    if (p1.click && time >= p1.t - clickDuration && time <= p1.t + clickDuration) {
       isClicking = true;
    }
  } else if (p0) {
    x = p0.x;
    y = p0.y;
  }

  // Jitter
  const jitterX = Math.sin(frame / 5) * 1.5;
  const jitterY = Math.cos(frame / 7) * 1.5;

  const clickScale = spring({ frame: isClicking ? frame % (FPS * 0.4) : 0, fps: FPS, config: { damping: 15 } });
  const scale = isClicking ? interpolate(clickScale, [0, 0.5, 1], [1, 0.82, 1]) : 1;

  return (
    <div style={{
      position: "absolute",
      left: x + jitterX,
      top: y + jitterY,
      width: "48px",
      height: "48px",
      transform: `scale(${scale})`,
      zIndex: 9999,
      pointerEvents: "none"
    }}>
      {/* Hand or Arrow SVG goes here */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5">
        {skin === 'hand' ? (
           <path d="M12 2v6... (placeholder for hand)" />
        ) : (
           <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.41 0 .75-.34.75-.75V3.96c0-.41-.34-.75-.75-.75H6.25c-.41 0-.75.34-.75.75Z" />
        )}
      </svg>
      
      {/* Click Ripple */}
      {isClicking && skin === 'hand' && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid var(--color-ink)",
          opacity: interpolate(clickScale, [0, 1], [1, 0])
        }} />
      )}
    </div>
  );
};
