import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from "remotion";
import { f } from "../timing";
import { cameraScale } from "../motion";
import { AnimatedCursor, CursorWaypoint } from "../components/AnimatedCursor";
import { Captions } from "../components/Captions";
import { Sfx } from "../components/Sfx";

// Load JSONs
import actions from "../actions.json";
import bboxes from "../bboxes.json";

// Helper to find bbox by id
const getBbox = (id: string) => bboxes.find((b) => b.id === id);

export const Walkthrough1: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(20.0); // 20s test

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.08);

  // Parse actions into cursor waypoints
  const waypoints: CursorWaypoint[] = [];
  
  // Start offscreen or at a default position
  waypoints.push({ frame: 0, x: 960, y: 1200 });

  actions.forEach((act) => {
    const box = getBbox(act.target);
    if (!box) return;

    // The cursor moves to the center of the bounding box
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    waypoints.push({
      frame: act.t,
      x: cx,
      y: cy,
      click: act.type === "click"
    });
  });

  // Current active caption
  const currentAction = [...actions].reverse().find(a => frame >= a.t);
  const captionText = currentAction?.caption || null;

  return (
    <AbsoluteFill style={{
      background: "#f0fdf6", // Soft mint gradient background
      transform: `scale(${cam})`,
      willChange: "transform",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* 
        Temporarily commented out Sfx components until SFX files are uploaded 
        by the user as requested in pro1.md. 
      */}
      {/* 
      <Sfx at={f(1.25)} src="click-layered" volume={0.4} />
      <Sfx at={f(3.0)} src="chat-pop" volume={0.4} />
      */}

      {/* Real site asset as-is */}
      <div style={{
        boxShadow: "0 24px 64px rgba(0,0,0,0.1)",
        borderRadius: 24,
        overflow: "hidden"
      }}>
        <Img src={staticFile("assets/feature-whatsapp-broadcast.png")} style={{ width: 1400, height: "auto" }} />
      </div>

      <AnimatedCursor waypoints={waypoints} />
      
      <Captions text={captionText} />
      
      {/* Debug view for bounding boxes (Contact Sheet check) */}
      {bboxes.map((b) => (
        <div key={b.id} style={{
          position: "absolute",
          left: b.x,
          top: b.y,
          width: b.width,
          height: b.height,
          border: "2px dashed rgba(254, 85, 27, 0.8)", // Flame Orange debugger
          background: "rgba(254, 85, 27, 0.1)",
          pointerEvents: "none",
          zIndex: 9999
        }}>
          <span style={{ background: "#fe551b", color: "#fff", fontSize: 10, padding: "2px 4px", position: "absolute", top: -16, left: -2 }}>
            {b.id}
          </span>
        </div>
      ))}
    </AbsoluteFill>
  );
};
