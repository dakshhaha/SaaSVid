/**
 * MOTION SYSTEM — UrbanXPixels SaaS Launch Video
 *
 * RULES (from brief):
 *  - UI springs: overdamped (no bounce). damping 200, stiffness 80-100.
 *  - Hero element: ONE soft overshoot only. damping 18, stiffness 100, mass 1.1 → ~6% overshoot.
 *  - Camera: scale 1.0→1.12 from center only. Never translate to blank areas.
 *  - Text entrance: translateY(24px→0) + opacity(0→1) + blur(12px→0), 3-frame word stagger.
 *  - Exit: blur(0→14px) + scale(1→1.04), 12 frames.
 *  - No idle bobbing, no spinning, no decorative wiggle.
 */

import { EasingFunction } from "remotion";

// ─── Spring configs ────────────────────────────────────────────────────────────

/** UI / layout elements — fast settle, zero bounce. */
export const SPRING_UI   = { damping: 200, stiffness: 90,  mass: 1 };
/** Single hero element per scene — soft ~6% overshoot. */
export const SPRING_HERO = { damping: 18,  stiffness: 100, mass: 1.1 };
/** Slow, cinematic moves — parallax, background shifts. */
export const SPRING_SLOW = { damping: 200, stiffness: 40,  mass: 1 };

// ─── Easing ───────────────────────────────────────────────────────────────────

/** Ease-out cubic — for opacity, blur ramps where springs aren't used. */
export const easeOutCubic: EasingFunction = (t) => 1 - Math.pow(1 - t, 3);

/** Ease-in-out — for camera pushes. */
export const easeInOut: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ─── Camera rule ──────────────────────────────────────────────────────────────

/**
 * Compute a safe camera scale for a scene.
 * @param frame  current frame
 * @param durationFrames  total scene length in frames
 * @param from   start scale (default 1.0)
 * @param to     end scale (default 1.10) — content must overflow frame at this zoom
 * @returns      scale value — apply as CSS scale() transform only, no translate
 */
export const cameraScale = (
  frame: number,
  durationFrames: number,
  from = 1.0,
  to   = 1.10,
): number => {
  const t = easeInOut(Math.min(1, frame / durationFrames));
  return from + (to - from) * t;
};
