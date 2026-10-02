import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE_OUT, SPRING_POP } from "../motion";

type Mode = 'type' | 'words' | 'swap';

type KineticTextProps = {
  text: string;
  mode?: Mode;
  /** Words to render in the brand green accent */
  highlight?: string[];
  size?: number;
  color?: string;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  startFrame?: number;
  letterSpacing?: string;
};

/** 
 * Professional kinetic text — word-by-word slide-up with hard mask clip + opacity.
 * Uses only transform+opacity for zero layout churn (60 fps safe).
 */
export const KineticText: React.FC<KineticTextProps> = ({
  text,
  mode = 'words',
  highlight = [],
  size = 80,
  color,
  weight = 700,
  align = 'left',
  startFrame = 0,
  letterSpacing = '-0.03em',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── TYPE MODE ─────────────────────────────────────────────────────────────
  if (mode === 'type') {
    const charsPerFrame = 1.2; // slightly faster than 1 char/frame
    const shown = Math.floor(Math.max(0, frame - startFrame) * charsPerFrame);
    return (
      <div style={{
        fontFamily: FONT.display, fontSize: size, fontWeight: weight,
        color: color ?? C.heading, letterSpacing, lineHeight: 1.1,
        textAlign: align,
      }}>
        {text.split('').map((ch, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>{ch}</span>
        ))}
        {/* Cursor blink */}
        <span style={{ opacity: (frame % 30 < 15) ? 1 : 0, color: C.brandGreen }}>|</span>
      </div>
    );
  }

  // ── WORDS MODE ────────────────────────────────────────────────────────────
  const words = text.split(' ');
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.22em',
      fontSize: size, fontFamily: FONT.display, fontWeight: weight,
      letterSpacing, lineHeight: 1.1, textAlign: align,
    }}>
      {words.map((word, i) => {
        const delay = startFrame + i * 4; // 4-frame word stagger @60fps
        const p = spring({ frame: frame - delay, fps, config: SPRING_POP });
        const translateY = interpolate(p, [0, 1], [size * 0.6, 0]);
        const opacity    = interpolate(p, [0, 0.4, 1], [0, 1, 1]);
        const isHl       = highlight.includes(word.replace(/[^a-zA-Z0-9%<\.xX]/g, ''));

        return (
          // Mask container — overflow:hidden creates the wipe-up effect
          <div key={i} style={{ overflow: 'hidden', lineHeight: 1.15 }}>
            <span style={{
              display: 'inline-block',
              color: isHl ? C.brandGreen : (color ?? C.heading),
              transform: `translateY(${translateY}px)`,
              opacity,
              // willChange allows GPU compositing of the transform
              willChange: 'transform, opacity',
            }}>
              {word}
            </span>
          </div>
        );
      })}
    </div>
  );
};
