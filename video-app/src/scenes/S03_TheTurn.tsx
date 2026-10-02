import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Img, staticFile } from "remotion";
import { FPS, f } from "../timing";
import { C } from "../theme";
import { T5_OutlineToFill, T3_WordSwap, T4_VerticalLabel } from "../components/MotionText";
import { cameraScale } from "../motion";
import { FilmGrain } from "../components/FilmGrain";
import { Sfx } from "../components/Sfx";

export const S03_TheTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(6.0); // 10-16s
  
  // Reduced scale to 1.05 so text doesn't hide/crop
  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.04);

  const pPhone = spring({ frame: frame - f(1.5), fps: FPS, config: { damping: 14, stiffness: 150 } });
  const phoneY = interpolate(pPhone, [0, 1], [1080, 50]); 
  const phoneRot = interpolate(pPhone, [0, 1], [25, 0]);
  const phoneRotY = interpolate(pPhone, [0, 1], [30, 0]); 
  
  const startTyping = f(2.5);
  const endTyping = f(3.5); // Faster typing so we see the reply sooner
  const isTyping = frame >= startTyping && frame < endTyping;
  
  const showReply = frame >= endTyping;
  const pReply = spring({ frame: frame - endTyping, fps: FPS, config: { damping: 15, stiffness: 200 } });
  
  return (
    <AbsoluteFill style={{
      background: "#fff",
      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"
    }}>
      <Sfx at={f(1.5)} src="whoosh" />
      <Sfx at={f(2.5)} src="typing" />
      <Sfx at={f(3.5)} src="chat-pop" />
      <Sfx at={f(3.8)} src="chime" />
      
      {/* Background scaled independently so text is safe */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, zIndex: 0 }}>
         <div style={{ position: "absolute", width: "100%", height: 1000, bottom: 0, background: `radial-gradient(ellipse at bottom, ${C.mintLight} 0%, transparent 70%)` }} />
         <FilmGrain opacity={0.03} />
      </div>

      {/* Typography layer (Not scaled out of view!) */}
      <div style={{ position: "absolute", left: 160, top: 150, zIndex: 5 }}>
        <T5_OutlineToFill text="Until now." frame0={f(0.2)} size={160} />
      </div>

      <div style={{ position: "absolute", left: 160, top: 700, zIndex: 5 }}>
        <T4_VerticalLabel text="OFFICIAL WHATSAPP API" frame0={f(2.0)} />
      </div>

      <div style={{ position: "absolute", right: 160, top: "45%", zIndex: 20 }}>
        <T3_WordSwap word1="Replied instantly." word2="Automatically. 24/7." frame0={f(2.0)} swapAt={f(3.8)} size={72} />
      </div>

      {/* 3D Phone Container (Centered) - Also scaled but kept well within bounds */}
      <div style={{
        position: "relative",
        width: 480, height: 860,
        perspective: 1200,
        transform: `translateY(${phoneY}px) rotateZ(${phoneRot}deg) rotateY(${phoneRotY}deg) scale(${cam})`,
        transformStyle: "preserve-3d",
        zIndex: 10,
        marginTop: 50
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: C.waBg, borderRadius: 48,
          border: "12px solid #111",
          boxShadow: "-30px 40px 80px rgba(0,0,0,0.15)",
          overflow: "hidden", display: "flex", flexDirection: "column"
        }}>
          {/* Header clearly identifies it as a business chat */}
          <div style={{ background: C.waHeader, padding: "20px 32px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Img src={staticFile("uxplogo.svg")} style={{ width: 32, height: "auto" }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Aura Beauty <span style={{fontSize: 16, color: "#a7f3d0"}}>✓ Official</span></div>
              <div style={{ fontSize: 16, color: "#e2e8f0" }}>Typically replies instantly</div>
            </div>
          </div>
          
          <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* User Message */}
            <div style={{ alignSelf: "flex-end", background: C.waBubbleOut, padding: "16px 24px", borderRadius: "24px 24px 4px 24px", fontSize: 22, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", maxWidth: "85%" }}>
              Where is my order? 😡
            </div>
            
            {/* Bot Typing Indicator */}
            {isTyping && (
              <div style={{ alignSelf: "flex-start", background: C.waBubbleIn, padding: "16px 24px", borderRadius: "24px 24px 24px 4px", fontSize: 22, color: C.muted }}>
                Aura Bot is typing...
              </div>
            )}
            
            {/* Bot Reply Message clearly styled as an automated system response */}
            {showReply && (
              <div style={{ alignSelf: "flex-start", transform: `scale(${interpolate(pReply, [0,1], [0.8, 1])})`, opacity: pReply, transformOrigin: "bottom left", maxWidth: "90%" }}>
                <div style={{ background: C.waBubbleIn, padding: "20px 24px", borderRadius: "24px 24px 24px 4px", fontSize: 22, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", marginBottom: 12, border: `2px solid ${C.green}` }}>
                  <div style={{ fontSize: 16, color: C.green, fontWeight: 800, textTransform: "uppercase", marginBottom: 8, letterSpacing: 1 }}>⚡ Auto-Reply</div>
                  Hi! Your order <strong>#4829</strong> is out for delivery. It will arrive today by 4PM.
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ background: "#fff", color: C.green, padding: "12px 24px", borderRadius: 99, fontSize: 18, fontWeight: 700, border: `2px solid ${C.green}` }}>Track Order</div>
                  <div style={{ background: "#fff", color: C.waMedium, padding: "12px 24px", borderRadius: 99, fontSize: 18, fontWeight: 700, border: `1px solid ${C.border}` }}>Talk to Agent</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
