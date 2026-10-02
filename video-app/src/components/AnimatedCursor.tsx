import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FPS, W, H } from "../timing";
import { SPRING_SLOW, easeInOut } from "../motion";

/**
 * AnimatedCursor — smooth bezier path cursor that follows key UI actions.
 *
 * RULES (from brief):
 *  - Smooth bezier movement with easing (no teleporting).
 *  - Soft press-scale on click moments.
 *  - Faint ripple on click (scale 1→1.8, opacity 1→0).
 *  - Camera-follow behavior: the cursor implicitly guides the viewer's eye.
 *
 * Usage: provide an array of waypoints with timestamps.
 * The cursor lerps between them using smooth interpolation.
 */

export type CursorWaypoint = {
  frame: number;  // absolute frame within scene
  x: number;      // 0..W
  y: number;      // 0..H
  click?: boolean; // triggers press animation + ripple
};

export const AnimatedCursor: React.FC<{
  waypoints: CursorWaypoint[];
  visible?: boolean;
}> = ({ waypoints, visible = true }) => {
  const frame = useCurrentFrame();
  if (!visible || waypoints.length < 1) return null;

  // ── Position interpolation ──────────────────────────────────────────────
  // Build frame/x and frame/y arrays from waypoints
  const frames = waypoints.map(w => w.frame);
  const xs = waypoints.map(w => w.x);
  const ys = waypoints.map(w => w.y);

  const cursorX = interpolate(frame, frames, xs, {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, frames, ys, {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Click: find the nearest click waypoint that just fired ─────────────
  const lastClick = waypoints
    .filter(w => w.click && frame >= w.frame)
    .sort((a, b) => b.frame - a.frame)[0];

  const clickFrame = lastClick?.frame ?? -999;
  const clickAge = frame - clickFrame;

  // Press scale — cursor shrinks on click then springs back
  const pressP = spring({
    frame: clickAge,
    fps: FPS,
    config: { damping: 200, stiffness: 400 },
  });
  // 1 → 0.75 → 1
  const pressScale = clickAge >= 0 && clickAge < 18
    ? interpolate(pressP, [0, 1], [1, 0.75])
    : 1;

  // Ripple: scale 1→2.2, opacity 1→0 over 22 frames
  const rippleScale = clickAge >= 0
    ? interpolate(Math.min(clickAge, 22), [0, 22], [1, 2.2], { extrapolateRight: "clamp" })
    : 0;
  const rippleOpacity = clickAge >= 0
    ? interpolate(Math.min(clickAge, 22), [0, 22], [0.28, 0], { extrapolateRight: "clamp" })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: cursorX,
        top: cursorY,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 10000,
        willChange: "left, top",
      }}
    >
      {/* Ripple */}
      {rippleOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `1.5px solid rgba(3,207,101,${rippleOpacity * 2})`,
            background: `rgba(3,207,101,${rippleOpacity * 0.3})`,
            transform: `translate(-50%,-50%) scale(${rippleScale})`,
            left: "50%",
            top: "50%",
            willChange: "transform,opacity",
          }}
        />
      )}

      {/* Arrow cursor SVG */}
      <div style={{ transform: `scale(${pressScale})`, willChange: "transform" }}>
        <svg
          width="28"
          height="32"
          viewBox="0 0 28 32"
          fill="none"
          style={{ display: "block", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
        >
          <path
            d="M4 2 L4 24 L9.5 18.5 L14 28 L17 26.5 L12.5 16.5 L20 16.5 Z"
            fill="white"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
