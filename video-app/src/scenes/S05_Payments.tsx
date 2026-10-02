import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { FPS, f } from "../timing";
import { C, FONT } from "../theme";
import { T1_RiseUnblur, T8_Typewriter } from "../components/MotionText";
import { cameraScale } from "../motion";
import { FilmGrain } from "../components/FilmGrain";
import { RoughNotation } from "react-rough-notation";
import { Sfx } from "../components/Sfx";

export const S05_Payments: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(7.0); // 23-30s
  
  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.08);

  const pSheet = spring({ frame: frame - f(1.0), fps: FPS, config: { damping: 15, stiffness: 120 } });
  const sheetY = interpolate(pSheet, [0, 1], [1000, 0]);
  const sheetRot = interpolate(pSheet, [0, 1], [10, 0]);

  const startPay = f(4.0);
  const pPay = spring({ frame: frame - startPay, fps: FPS, config: { damping: 12, stiffness: 180 } });
  
  // Entire form collapses into a single green circle
  const formScale = Math.max(0, interpolate(pPay, [0, 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  
  // Success bubble expanding from the collapse
  const payScale = Math.max(0, interpolate(pPay, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  
  // Receipt dropping in
  const pReceipt = spring({ frame: frame - (startPay + f(0.5)), fps: FPS, config: { damping: 14, stiffness: 150 } });
  const receiptY = interpolate(pReceipt, [0, 1], [-200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "#f0fdf6",
      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "0 250px"
    }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, zIndex: 0 }}>
        <FilmGrain opacity={0.03} />
      </div>
      
      <Sfx at={f(1.0)} src="sheet-whoosh" />
      <Sfx at={f(1.5)} src="typing" />
      <Sfx at={f(3.5)} src="click" />
      <Sfx at={f(4.2)} src="chime" />

      {/* T1 Headline */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <T1_RiseUnblur text="Capture leads. Collect" frame0={f(0.2)} size={88} />
        <div style={{ marginTop: 24, fontSize: 88, fontWeight: 900, fontFamily: FONT.sans, color: C.ink, textAlign: "left", lineHeight: 1.2 }}>
          {frame > f(1.0) ? (
            <RoughNotation type="circle" show={true} color={C.green} strokeWidth={8} padding={[12, 12, 12, 12]} animationDuration={600}>
              payments.
            </RoughNotation>
          ) : "payments."}
        </div>
      </div>

      {/* 3D Premium Phone Container */}
      <div style={{
        position: "relative", width: 500, height: 900,
        background: "#000", borderRadius: 56, border: "14px solid #111",
        boxShadow: "0 60px 140px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.1)", 
        overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end",
        zIndex: 10
      }}>
        {/* Fake website background */}
        <div style={{ position: "absolute", inset: 0, background: "#fafafa" }}>
          <div style={{ width: "100%", height: 300, background: "#e2e8f0" }} />
          <div style={{ padding: 32 }}>
            <div style={{ width: "60%", height: 32, background: "#cbd5e1", borderRadius: 8, marginBottom: 16 }} />
            <div style={{ width: "40%", height: 24, background: "#cbd5e1", borderRadius: 8 }} />
          </div>
        </div>

        {/* Dark overlay for bottom sheet */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />

        {/* Form Sheet collapsing into success */}
        <div style={{
          position: "absolute", bottom: 0, width: "100%",
          transform: `scale(${formScale})`, transformOrigin: "bottom center",
          display: "flex", flexDirection: "column", justifyContent: "flex-end"
        }}>
          {/* Form Sheet sliding up */}
          <div style={{
            background: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32,
            padding: "40px 32px", transform: `translateY(${sheetY}px) rotate(${sheetRot}deg)`,
            boxShadow: "0 -20px 60px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, fontFamily: FONT.sans }}>Checkout</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>₹2,298</div>
            </div>
            
            {/* Order Summary */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 64, height: 64, background: "#f1f5f9", borderRadius: 12, border: `1px solid ${C.border}` }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>Premium Plan (Annual)</div>
                <div style={{ fontSize: 16, color: C.muted }}>Includes all pro features</div>
              </div>
            </div>
            
            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div style={{ background: C.surface, padding: "16px 24px", borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Name</div>
                <T8_Typewriter text="Arjun Mehta" frame0={f(1.5)} size={22} speed={2} />
              </div>
              <div style={{ background: C.surface, padding: "16px 24px", borderRadius: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 14, color: C.muted, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>UPI ID</div>
                <T8_Typewriter text="arjun.mehta@okicici" frame0={f(2.5)} size={22} speed={1.5} />
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 50, border: `2px solid ${C.green}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#ecfdf5", color: C.green, fontWeight: 700 }}>UPI</div>
              <div style={{ flex: 1, height: 50, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: C.muted }}>Card</div>
              <div style={{ flex: 1, height: 50, border: `1px solid ${C.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: C.muted }}>Net</div>
            </div>

            <div style={{
              background: frame >= f(3.5) && frame < f(3.8) ? "#02a550" : C.green, 
              color: "#fff", padding: "24px", borderRadius: 20,
              textAlign: "center", fontSize: 24, fontWeight: 800, fontFamily: FONT.sans,
              boxShadow: "0 16px 32px rgba(3,207,101,0.3)",
              transform: frame >= f(3.5) && frame < f(3.8) ? "scale(0.95)" : "scale(1)",
              transition: "transform 0.1s"
            }}>
              Pay ₹2,298 securely
            </div>
          </div>
        </div>

        {/* Hyper-Detailed Success State */}
        {frame > startPay + f(0.3) && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            transform: `scale(${payScale})`
          }}>
            {/* Green Expanding Background */}
            <div style={{ position: "absolute", inset: 0, background: C.green }} />
            
            {/* Dropping Receipt */}
            <div style={{
              background: "#fff", width: "80%", padding: 40, borderRadius: 24,
              boxShadow: "0 32px 64px rgba(0,0,0,0.2)", zIndex: 2,
              transform: `translateY(${receiptY}px)`,
              display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              {/* Animated Checkmark SVG */}
              <svg width="80" height="80" viewBox="0 0 100 100" style={{ marginBottom: 24 }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke={C.green} strokeWidth="8" 
                        strokeDasharray={300} strokeDashoffset={interpolate(frame - (startPay + f(0.5)), [0, f(0.5)], [300, 0], { extrapolateRight: "clamp" })} />
                <path d="M30 50 L45 65 L70 35" fill="none" stroke={C.green} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
                      strokeDasharray={100} strokeDashoffset={interpolate(frame - (startPay + f(0.7)), [0, f(0.3)], [100, 0], { extrapolateRight: "clamp" })} />
              </svg>

              <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, fontFamily: FONT.sans, marginBottom: 8 }}>Payment Successful</div>
              <div style={{ fontSize: 18, color: C.muted, marginBottom: 32 }}>Transaction ID: TXN-894201</div>
              
              <div style={{ width: "100%", height: 1, background: C.border, marginBottom: 24, borderStyle: "dashed" }} />
              
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: C.ink }}>
                <span>Amount Paid</span>
                <span>₹2,298</span>
              </div>
            </div>

            {/* Shockwave Rings */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 400, height: 400, borderRadius: "50%", border: `12px solid rgba(255,255,255,0.4)`,
              opacity: interpolate(frame - (startPay + f(0.3)), [0, f(0.5)], [1, 0], { extrapolateRight: "clamp" }),
              scale: interpolate(frame - (startPay + f(0.3)), [0, f(0.5)], [0.2, 1.5], { extrapolateRight: "clamp" })
            }} />
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 120, right: 120, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: C.canvas, padding: "20px 40px", borderRadius: 99, fontSize: 28, fontWeight: 800, color: C.ink, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", border: `2px solid ${C.border}` }}>⚡ UPI</div>
        <div style={{ background: C.canvas, padding: "20px 40px", borderRadius: 99, fontSize: 28, fontWeight: 800, color: C.ink, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", border: `2px solid ${C.border}` }}>Razorpay</div>
      </div>
    </AbsoluteFill>
  );
};
