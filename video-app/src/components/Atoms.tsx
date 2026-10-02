/**
 * SHARED ATOM COMPONENTS
 *
 * MOTION RULES enforced here:
 *  - SPRING_UI  (damping 200, stiffness 90) for ALL UI elements — zero bounce.
 *  - SPRING_HERO (damping 18, stiffness 100, mass 1.1) — used ONLY when
 *    explicitly requested for the single hero element of a scene.
 *  - Text entrance: translateY(24px→0) + opacity(0→1) + blur(12→0), 3-frame stagger.
 *  - No idle bobbing. No Math.sin continuous animations.
 *  - Blur applied only to individual text spans, never large containers.
 */

import React from "react";
import { useCurrentFrame, spring, interpolate, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { FPS, f } from "../timing";
import { SPRING_UI, SPRING_HERO, easeOutCubic } from "../motion";

// ─── Word-mask text reveal ────────────────────────────────────────────────────

interface KineticTextProps {
  text: string;
  size?: number;
  weight?: number;
  color?: string;
  highlight?: string[];   // words that get C.green color
  frame0?: number;
  stagger?: number;       // frames between words (default 3)
  ls?: string;
  lh?: number;
  align?: "left" | "center" | "right";
}

/**
 * Reveals text word by word.
 * Each word: blur(12→0) + opacity(0→1) + translateY(24→0)
 * Pure CSS filter on a span — cheap, not applied to large areas.
 */
export const KineticText: React.FC<KineticTextProps> = ({
  text, size = 64, weight = 800, color, highlight = [],
  frame0 = 0, stagger = 3, ls = "-0.035em", lh = 1.1, align = "left",
}) => {
  const frame = useCurrentFrame();
  const col = color ?? C.ink;

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: "0.22em",
      justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
    }}>
      {text.split(" ").map((word, i) => {
        const delay = frame0 + i * stagger;
        const p = spring({ frame: frame - delay, fps: FPS, config: SPRING_UI });
        const ty   = interpolate(p, [0, 1], [24, 0]);
        const op   = interpolate(p, [0, 0.4, 1], [0, 0.85, 1]);
        const blur = interpolate(p, [0, 1], [12, 0]);
        const isHl = highlight.includes(word.replace(/[.,!?]/g, ""));

        return (
          <div key={i} style={{ overflow: "hidden" }}>
            <span style={{
              display: "inline-block",
              fontSize: size,
              fontFamily: FONT.sans,
              fontWeight: weight,
              letterSpacing: ls,
              lineHeight: lh,
              color: isHl ? C.green : col,
              transform: `translateY(${ty}px)`,
              opacity: op,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
              willChange: "transform,opacity,filter",
            }}>
              {word}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Caption (single line, no word split) ─────────────────────────────────────

export const Caption: React.FC<{
  children: React.ReactNode;
  frame0?: number;
  size?: number;
  color?: string;
  align?: "left" | "center";
}> = ({ children, frame0 = 0, size = 21, color, align = "left" }) => {
  const frame = useCurrentFrame();
  const p  = spring({ frame: frame - frame0, fps: FPS, config: SPRING_UI });
  const ty = interpolate(p, [0, 1], [24, 0]);
  const op = interpolate(p, [0, 0.3, 1], [0, 1, 1]);
  const bl = interpolate(p, [0, 1], [8, 0]);

  return (
    <div style={{
      fontSize: size, fontFamily: FONT.sans, fontWeight: 400,
      color: color ?? C.muted, lineHeight: 1.65,
      textAlign: align,
      transform: `translateY(${ty}px)`, opacity: op,
      filter: bl > 0.1 ? `blur(${bl}px)` : undefined,
      willChange: "transform,opacity,filter",
    }}>
      {children}
    </div>
  );
};

// ─── Pill badge ────────────────────────────────────────────────────────────────

export const Pill: React.FC<{
  label: string; color?: string; bg?: string; frame0?: number;
}> = ({ label, color, bg, frame0 = 0 }) => {
  const frame = useCurrentFrame();
  const p  = spring({ frame: frame - frame0, fps: FPS, config: SPRING_UI });
  const op = interpolate(p, [0, 0.3, 1], [0, 1, 1]);
  const ty = interpolate(p, [0, 1], [16, 0]);

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: bg ?? C.mint, border: `1px solid ${(color ?? C.green)}55`,
      borderRadius: 999, padding: "6px 18px",
      fontFamily: FONT.sans, fontSize: 13.5, fontWeight: 700,
      color: color ?? C.greenDeep, letterSpacing: "0.05em", textTransform: "uppercase",
      opacity: op, transform: `translateY(${ty}px)`,
      willChange: "transform,opacity",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color ?? C.green, flexShrink: 0 }} />
      {label}
    </div>
  );
};

// ─── Stat chip ─────────────────────────────────────────────────────────────────

export const StatChip: React.FC<{
  value: string; label: string; accentColor?: string; frame0?: number;
}> = ({ value, label, accentColor, frame0 = 0 }) => {
  const frame = useCurrentFrame();
  const p  = spring({ frame: frame - frame0, fps: FPS, config: SPRING_UI });
  const op = interpolate(p, [0, 0.3, 1], [0, 1, 1]);
  const ty = interpolate(p, [0, 1], [24, 0]);
  const bl = interpolate(p, [0, 1], [8, 0]);

  return (
    <div style={{
      background: C.canvas, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "14px 20px", minWidth: 130,
      opacity: op, transform: `translateY(${ty}px)`,
      filter: bl > 0.1 ? `blur(${bl}px)` : undefined,
      willChange: "transform,opacity,filter",
    }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: accentColor ?? C.green, fontFamily: FONT.sans, letterSpacing: "-0.04em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, fontFamily: FONT.sans, fontWeight: 600, marginTop: 5, letterSpacing: "0.02em" }}>
        {label}
      </div>
    </div>
  );
};

// ─── Logo wordmark (1774×887) ──────────────────────────────────────────────────

export const Logo: React.FC<{ width?: number; frame0?: number }> = ({
  width = 400, frame0 = 0,
}) => {
  const frame = useCurrentFrame();
  const p  = spring({ frame: frame - frame0, fps: FPS, config: SPRING_UI });
  const op = interpolate(p, [0, 0.3, 1], [0, 1, 1]);
  const ty = interpolate(p, [0, 1], [16, 0]);
  const bl = interpolate(p, [0, 1], [8, 0]);

  return (
    <div style={{
      opacity: op, transform: `translateY(${ty}px)`,
      filter: bl > 0.1 ? `blur(${bl}px)` : undefined,
      willChange: "transform,opacity,filter",
    }}>
      <Img src={staticFile("brand/uxplogo.svg")} style={{ width, height: "auto", display: "block" }} />
    </div>
  );
};

// ─── Logo mark / favicon (1254×1254 square) ───────────────────────────────────

export const LogoMark: React.FC<{ size?: number; frame0?: number }> = ({
  size = 60, frame0 = 0,
}) => {
  const frame = useCurrentFrame();
  const p  = spring({ frame: frame - frame0, fps: FPS, config: SPRING_UI });
  const op = interpolate(p, [0, 0.3, 1], [0, 1, 1]);
  const ty = interpolate(p, [0, 1], [12, 0]);

  return (
    <div style={{ opacity: op, transform: `translateY(${ty}px)`, willChange: "transform,opacity" }}>
      <Img
        src={staticFile("brand/favicon.svg")}
        style={{ width: size, height: size, display: "block", borderRadius: size * 0.22 }}
      />
    </div>
  );
};

// ─── Animated counter ─────────────────────────────────────────────────────────

export const Counter: React.FC<{
  to: number; prefix?: string; suffix?: string;
  frame0?: number; size?: number; color?: string;
}> = ({ to, prefix = "", suffix = "", frame0 = 0, size = 36, color }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - frame0, fps: FPS, config: { damping: 40, stiffness: 40 } });
  const value = Math.round(to * Math.min(p, 1));
  return (
    <span style={{ fontSize: size, fontWeight: 900, color: color ?? C.ink, fontFamily: FONT.sans, letterSpacing: "-0.04em" }}>
      {prefix}{value.toLocaleString("en-IN")}{suffix}
    </span>
  );
};

// ─── Scene exit helper (use in AbsoluteFill's inline style) ──────────────────

/**
 * Computes exit style: blur + slight scale-up over 14 frames.
 * @param frame  current frame within scene
 * @param exitAt frame when exit begins
 */
export const useExitStyle = (frame: number, exitAt: number): React.CSSProperties => {
  const age = frame - exitAt;
  if (age <= 0) return {};
  const t = Math.min(age / 14, 1);
  const blur  = easeOutCubic(t) * 14;
  const scale = 1 + easeOutCubic(t) * 0.04;
  const op    = 1 - easeOutCubic(t);
  return {
    transform: `scale(${scale})`,
    filter: `blur(${blur}px)`,
    opacity: op,
    willChange: "transform,filter,opacity",
  };
};

// ─── Scene enter helper (use in AbsoluteFill's inline style) ─────────────────

/**
 * Blur de-focus reveal for scene enters.
 * @param frame  current frame within scene
 * @param durationFrames  duration of entrance (default 18)
 */
export const useEnterStyle = (frame: number, durationFrames = 18): React.CSSProperties => {
  const t = Math.min(frame / durationFrames, 1);
  const blur  = (1 - easeOutCubic(t)) * 14;
  const scale = 0.97 + easeOutCubic(t) * 0.03;
  return {
    transform: `scale(${scale})`,
    filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
    willChange: "transform,filter",
  };
};
