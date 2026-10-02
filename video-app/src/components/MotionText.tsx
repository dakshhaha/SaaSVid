import React from "react";
import { useCurrentFrame, interpolate, spring, AbsoluteFill } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { RoughNotation } from "react-rough-notation";

// T1: Center hero: two-tone, words rise through a mask with unblur, 5-frame stagger
export const T1_RiseUnblur: React.FC<{
  text: string;
  frame0: number;
  size?: number;
  color?: string;
  stagger?: number;
}> = ({ text, frame0, size = 64, color = C.ink, stagger = 5 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3em", justifyContent: "center" }}>
      {words.map((word, i) => {
        const start = frame0 + i * stagger;
        const p = spring({ frame: frame - start, fps: FPS, config: { damping: 14, stiffness: 120 } });
        const y = interpolate(p, [0, 1], [60, 0]);
        const blur = interpolate(p, [0, 1], [20, 0]);
        const opacity = interpolate(p, [0, 0.5, 1], [0, 1, 1]);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
            <div style={{
              fontSize: size, color, fontWeight: 900, fontFamily: FONT.sans,
              transform: `translateY(${y}px)`, filter: `blur(${blur}px)`, opacity,
              willChange: "transform,filter,opacity", letterSpacing: "-0.03em"
            }}>
              {word}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// T2: Top-left giant stacked words, each line lands separately with weight shift 300->800
export const T2_StackedWeight: React.FC<{
  lines: { text: string; highlightWord?: string }[];
  frame0: number;
}> = ({ lines, frame0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      {lines.map((line, i) => {
        const start = frame0 + i * f(0.4);
        const p = spring({ frame: frame - start, fps: FPS, config: { damping: 15, stiffness: 150 } });
        
        const weight = Math.round(interpolate(p, [0, 1], [300, 800]));
        const y = interpolate(p, [0, 1], [40, 0]);
        const opacity = interpolate(p, [0, 0.2, 1], [0, 1, 1]);

        return (
          <div key={i} style={{
            fontSize: 120, fontFamily: FONT.sans, color: C.ink, letterSpacing: "-0.04em",
            fontWeight: weight, transform: `translateY(${y}px)`, opacity,
            lineHeight: 1
          }}>
            {line.highlightWord ? (
              <span>
                {line.text.split(line.highlightWord)[0]}
                <span style={{ display: "inline-block" }}>
                  <RoughNotation type="underline" show={frame >= start + f(0.6)} color={C.red} strokeWidth={8} padding={[2, 2, 2, 2]} animationDuration={400}>
                    {line.highlightWord}
                  </RoughNotation>
                </span>
                {line.text.split(line.highlightWord)[1]}
              </span>
            ) : (
              line.text
            )}
          </div>
        );
      })}
    </div>
  );
};

// T3: Word-swap (old words blur up and out, new words blur in)
export const T3_WordSwap: React.FC<{
  word1: string;
  word2: string;
  frame0: number;
  swapAt: number;
  size?: number;
}> = ({ word1, word2, frame0, swapAt, size = 64 }) => {
  const frame = useCurrentFrame();
  const w1In = spring({ frame: frame - frame0, fps: FPS, config: { damping: 15, stiffness: 200 } });
  const w1Out = spring({ frame: frame - swapAt, fps: FPS, config: { damping: 15, stiffness: 200 } });
  const w2In = spring({ frame: frame - swapAt, fps: FPS, config: { damping: 15, stiffness: 200 } });

  const commonStyle: React.CSSProperties = {
    position: "absolute", left: 0, top: 0, width: "100%", textAlign: "center",
    fontSize: size, fontWeight: 900, fontFamily: FONT.sans, color: C.ink, letterSpacing: "-0.03em"
  };

  return (
    <div style={{ position: "relative", width: 800, height: size * 1.5 }}>
      {frame < swapAt + 20 && (
        <div style={{
          ...commonStyle,
          opacity: w1Out > 0 ? 1 - w1Out : w1In,
          filter: `blur(${w1Out > 0 ? w1Out * 20 : (1 - w1In) * 20}px)`,
          transform: `translateY(${w1Out > 0 ? w1Out * -40 : (1 - w1In) * 40}px)`
        }}>
          {word1}
        </div>
      )}
      {frame >= swapAt && (
        <div style={{
          ...commonStyle,
          opacity: w2In,
          filter: `blur(${(1 - w2In) * 20}px)`,
          transform: `translateY(${(1 - w2In) * 40}px)`
        }}>
          {word2}
        </div>
      )}
    </div>
  );
};

// T4: Vertical side label rotated -90
export const T4_VerticalLabel: React.FC<{ text: string; frame0: number }> = ({ text, frame0 }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - frame0, fps: FPS, config: { damping: 15, stiffness: 150 } });
  const x = interpolate(p, [0, 1], [40, 0]);
  const op = interpolate(p, [0, 1], [0, 1]);

  return (
    <div style={{
      position: "absolute",
      transform: `rotate(-90deg) translateY(${x}px)`,
      transformOrigin: "bottom left",
      opacity: op,
      fontSize: 32, fontWeight: 800, fontFamily: FONT.sans,
      color: C.green, letterSpacing: "0.2em", whiteSpace: "nowrap"
    }}>
      {text}
    </div>
  );
};

// T5: Outline-to-fill text
export const T5_OutlineToFill: React.FC<{
  text: string;
  frame0: number;
  size?: number;
}> = ({ text, frame0, size = 180 }) => {
  const frame = useCurrentFrame();
  const startFill = frame0 + f(0.5);
  
  const slam = spring({ frame: frame - frame0, fps: FPS, config: { damping: 12, stiffness: 200 } });
  const scale = interpolate(slam, [0, 1], [3, 1], { extrapolateRight: "clamp" });
  const op = interpolate(slam, [0, 0.3, 1], [0, 1, 1]);
  
  const sweep = interpolate(frame - startFill, [0, f(0.8)], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{
      position: "relative", fontSize: size, fontWeight: 900, fontFamily: FONT.sans,
      letterSpacing: "-0.04em", transform: `scale(${scale})`, opacity: op,
    }}>
      <div style={{ WebkitTextStroke: `4px ${C.green}`, color: "transparent" }}>
        {text}
      </div>
      <div style={{
        position: "absolute", inset: 0, color: C.green,
        clipPath: `inset(0 ${100 - sweep}% 0 0)`
      }}>
        {text}
      </div>
    </div>
  );
};

// T6: Giant ghost word
export const T6_GhostWord: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, f(10)], [0, -200]);
  return (
    <div style={{
      position: "absolute", top: "20%", left: "5%",
      fontSize: 400, fontWeight: 900, fontFamily: FONT.sans,
      color: C.ink, opacity: 0.08, letterSpacing: "-0.05em",
      transform: `translateX(${x}px)`, pointerEvents: "none", zIndex: 0
    }}>
      {text}
    </div>
  );
};

// T7: Number slam counting up
export const T7_NumberSlam: React.FC<{
  target: number;
  unit?: string;
  subtitle?: string;
  frame0: number;
}> = ({ target, unit, subtitle, frame0 }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - frame0, fps: FPS, config: { damping: 14, stiffness: 100 } });
  
  // Start from 0 to avoid a weird 1% artifact, and clamp perfectly
  const val = Math.min(target, Math.max(0, Math.floor(interpolate(p, [0, 1], [0, target]))));
  const scale = interpolate(p, [0, 1], [2, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        fontSize: 240, fontWeight: 900, fontFamily: FONT.sans, color: C.green,
        letterSpacing: "-0.05em", transform: `scale(${scale})`, lineHeight: 0.8,
        fontVariantNumeric: "tabular-nums",
        zIndex: 2
      }}>
        {val}{unit}
      </div>
      {subtitle && (
        <div style={{
          fontSize: 48, fontWeight: 700, fontFamily: FONT.sans, color: C.ink,
          marginTop: 20, opacity: interpolate(frame - frame0, [0, f(0.5)], [0, 1], { extrapolateRight: "clamp" }),
          zIndex: 2
        }}>
          {subtitle}
        </div>
      )}
      {val === target && (
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
          width: 300, height: 300, borderRadius: "50%", border: `8px solid ${C.green}`,
          opacity: interpolate(frame - (frame0 + f(0.8)), [0, f(0.5)], [1, 0], { extrapolateRight: "clamp" }),
          transformOrigin: "center",
          scale: interpolate(frame - (frame0 + f(0.8)), [0, f(0.5)], [0.5, 3], { extrapolateRight: "clamp" }),
          pointerEvents: "none", zIndex: 1
        }} />
      )}
    </div>
  );
};

// T8: Typewriter
export const T8_Typewriter: React.FC<{ text: string; frame0: number; speed?: number; size?: number }> = ({ text, frame0, speed = 2, size = 32 }) => {
  const frame = useCurrentFrame();
  const visibleChars = Math.max(0, Math.floor((frame - frame0) / speed));
  const showCaret = frame % 30 < 15;

  return (
    <div style={{ fontSize: size, fontFamily: FONT.sans, fontWeight: 600, color: C.ink }}>
      {text.substring(0, visibleChars)}
      {visibleChars < text.length || showCaret ? <span style={{ opacity: showCaret ? 1 : 0 }}>|</span> : ""}
    </div>
  );
};

// T10: Callout chips with a line drawing to UI element
export const T10_CalloutChip: React.FC<{
  text: string;
  frame0: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}> = ({ text, frame0, x, y, targetX, targetY }) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - frame0, fps: FPS, config: { damping: 15, stiffness: 150 } });
  
  const op = interpolate(p, [0, 1], [0, 1]);
  const scale = interpolate(p, [0, 1], [0.8, 1]);

  const pathLen = Math.hypot(targetX - x, targetY - y);
  const strokeDashoffset = interpolate(p, [0, 1], [pathLen, 0]);

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
        <line
          x1={x} y1={y} x2={targetX} y2={targetY}
          stroke={C.green} strokeWidth={4} strokeLinecap="round" strokeDasharray={pathLen}
          strokeDashoffset={strokeDashoffset}
        />
        <circle cx={targetX} cy={targetY} r={8} fill={C.green} opacity={op} />
      </svg>
      <div style={{
        position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`,
        background: C.ink, color: "#fff", padding: "16px 24px", borderRadius: 99,
        fontSize: 32, fontWeight: 800, fontFamily: FONT.sans, opacity: op,
        boxShadow: "0 12px 32px rgba(0,0,0,0.15)", zIndex: 21, whiteSpace: "nowrap"
      }}>
        {text}
      </div>
    </>
  );
};
