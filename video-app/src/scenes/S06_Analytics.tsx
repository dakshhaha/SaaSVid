import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { T1_RiseUnblur, T7_NumberSlam, T10_CalloutChip } from "../components/MotionText";
import { cameraScale } from "../motion";
import { FilmGrain } from "../components/FilmGrain";
import { Sfx } from "../components/Sfx";
import { AnimatedCursor } from "../components/AnimatedCursor";

export const S06_Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(7.0); // 30-37s
  
  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.15); // Push in

  return (
    <AbsoluteFill style={{
      background: "#fff",
      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "0 180px"
    }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, zIndex: 0 }}>
        <FilmGrain opacity={0.03} />
      </div>
      <Sfx at={f(0.5)} src="whoosh" />
      <Sfx at={f(2.0)} src="sub-hit" />
      <Sfx at={f(2.5)} src="glassy-pop" />
      
      <div style={{ width: 600 }}>
        <T1_RiseUnblur text="Track exactly what" frame0={f(0.5)} size={96} stagger={2} />
        <div style={{ height: 20 }} />
        <T1_RiseUnblur text="drives revenue." frame0={f(1.0)} size={96} color={C.green} stagger={2} />
      </div>

      {/* Analytics Dashboard DOM */}
      <div style={{
        width: 1000, height: 700,
        background: C.canvas, borderRadius: 32, border: `2px solid ${C.border}`,
        boxShadow: "0 32px 80px rgba(0,0,0,0.08)", padding: 48,
        display: "flex", flexDirection: "column", gap: 32
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, fontFamily: FONT.sans }}>Campaign Performance</div>
        
        <div style={{ display: "flex", gap: 32 }}>
          {/* Revenue Card */}
          <div style={{ flex: 1, background: "#fff", padding: 32, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Total Revenue</div>
            <T7_NumberSlam target={42} unit="M" frame0={f(1.5)} />
            <div style={{ marginTop: 16, color: C.green, fontWeight: 700, fontSize: 20 }}>+ 3x lift this month</div>
          </div>
          
          {/* ROI Card */}
          <div style={{ flex: 1, background: "#fff", padding: 32, borderRadius: 24, border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.02)" }}>
             <div style={{ fontSize: 20, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Average ROI</div>
             <T7_NumberSlam target={480} unit="%" frame0={f(1.8)} />
          </div>
        </div>

        {/* Animated Bar Chart */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 16, paddingTop: 20 }}>
          {[30, 45, 25, 60, 90, 75, 100].map((h, i) => {
            const p = spring({ frame: frame - (f(2.0) + i * 4), fps: FPS, config: { damping: 14, stiffness: 120 } });
            const height = Math.max(0, interpolate(p, [0, 1], [0, h]));
            return (
              <div key={i} style={{
                flex: 1, background: i === 6 ? C.green : C.surface,
                height: `${height}%`, borderRadius: "8px 8px 0 0",
                transformOrigin: "bottom"
              }} />
            );
          })}
        </div>
      </div>

      <T10_CalloutChip text="Real-time syncing" frame0={f(3.0)} x={900} y={200} targetX={1100} targetY={400} />

      <AnimatedCursor waypoints={[
        { frame: 0, x: 1200, y: 1200 },
        { frame: f(2.5), x: 1400, y: 600, click: true }
      ]} />

      <FilmGrain opacity={0.03} />
    </AbsoluteFill>
  );
};
