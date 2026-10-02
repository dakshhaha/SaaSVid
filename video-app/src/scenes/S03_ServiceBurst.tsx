import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { FPS, W, H, f } from "../timing";
import { SPRING_UI, SPRING_HERO, cameraScale } from "../motion";
import { LogoMark, KineticText, Caption, Counter, useExitStyle } from "../components/Atoms";
import { Sfx } from "../components/Sfx";
import { FilmGrain } from "../components/FilmGrain";
import { AnimatedCursor } from "../components/AnimatedCursor";

/**
 * S03 — Dashboard Contacts (9s / 540 frames)
 *
 * FOCAL POINT: The contacts table. Story: "One place for all 89k customers."
 *
 * TIMELINE
 *  0   — full-width app window slides in from left (HERO)
 *  30  — table header appears
 *  40  — rows stagger in, 3 frames apart
 *  120 — contact counter rolls 0 → 89,872
 *  200 — camera slow push-in 1.0→1.08 CENTERED ON THE TABLE (not a translate)
 *  350 — camera holds
 *  420 — "Live Chat" overlay rises bottom-right
 *  500 — exit blur
 *
 * CAMERA RULE: The app window is 1720px wide on a 1920 canvas — at 1.10×
 * zoom the content still fills the frame. No translate needed.
 */
export const S03_Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const SCENE_DUR = f(9.0);
  const EXIT_AT   = f(8.6);

  const cam = cameraScale(frame, SCENE_DUR, 1.0, 1.09);
  const exitStyle = useExitStyle(frame, EXIT_AT);

  // ── App window slide-in (HERO — soft overshoot) ───────────────────────────
  const winP  = spring({ frame, fps: FPS, config: SPRING_HERO });
  const winTX = interpolate(winP, [0, 1], [-W, 0]);
  const winOp = interpolate(winP, [0, 0.15, 1], [0, 1, 1]);

  // ── Table row stagger ─────────────────────────────────────────────────────
  const rowStyle = (i: number) => {
    const p = spring({ frame: frame - (40 + i * 9), fps: FPS, config: SPRING_UI });
    return {
      opacity: interpolate(p, [0, 0.4, 1], [0, 1, 1]),
      transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
      willChange: "transform,opacity" as const,
    };
  };

  // ── Checkbox ticks at specific frames ────────────────────────────────────
  const tickFrames = [f(3.0), f(3.2), f(3.4), f(3.6), f(3.8)];
  const ticked = tickFrames.map(tf => frame > tf);

  // ── Live Chat overlay ─────────────────────────────────────────────────────
  const chatP  = spring({ frame: frame - f(7.0), fps: FPS, config: SPRING_UI });
  const chatTY = interpolate(chatP, [0, 1], [60, 0]);
  const chatOp = interpolate(chatP, [0, 0.3, 1], [0, 1, 1]);

  // ── Cursor: moves through the table, ticks checkboxes ────────────────────
  const cursorWaypoints = [
    { frame: 0,      x: W * 0.3, y: H * 0.3 },
    { frame: f(2.0), x: W * 0.3, y: H * 0.45 },
    { frame: f(3.0), x: W * 0.13, y: H * 0.50, click: true },
    { frame: f(3.2), x: W * 0.13, y: H * 0.57, click: true },
    { frame: f(3.4), x: W * 0.13, y: H * 0.63, click: true },
    { frame: f(5.5), x: W * 0.7,  y: H * 0.5  },
    { frame: f(9.0), x: W * 0.65, y: H * 0.45 },
  ];

  const ROWS = [
    { name:"Rahul Sharma",   num:"+91 98765 43210", tag:"HOT",  tagC:C.red,    src:"IMPORT" },
    { name:"Ananya Verma",   num:"+91 91234 56789", tag:"WARM", tagC:C.orange, src:"IMPORT" },
    { name:"Mohit Kapoor",   num:"+91 99887 76655", tag:"COLD", tagC:C.blue,   src:"MAGNITE"},
    { name:"Sneha Iyer",     num:"+91 98712 34567", tag:"HOT",  tagC:C.red,    src:"IMPORT" },
    { name:"Rohan Malhotra", num:"+91 91199 88877", tag:"WARM", tagC:C.orange, src:"WEB"    },
  ];

  // Sidebar item helper
  const SideItem: React.FC<{ d: string; active?: boolean }> = ({ d, active }) => (
    <div style={{ width:42, height:42, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background: active ? `${C.green}22` : "transparent", color: active ? C.green : "rgba(255,255,255,0.38)" }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
    </div>
  );

  return (
    <AbsoluteFill style={{
      background: C.surface,
      transform: `scale(${cam})`,
      ...exitStyle,
      willChange: "transform,filter,opacity",
    }}>
      {/* SFX */}
      <Sfx at={0.05} src="whoosh"  volume={0.32} />
      <Sfx at={2.0}  src="switch"  volume={0.32} />
      <Sfx at={3.0}  src="click"   volume={0.35} />
      <Sfx at={3.2}  src="click"   volume={0.33} playbackRate={1.03} />
      <Sfx at={3.4}  src="click"   volume={0.31} playbackRate={0.97} />
      <Sfx at={7.0}  src="switch"  volume={0.30} />
      <Sfx at={8.6}  src="whoosh"  volume={0.28} playbackRate={1.1} />

      {/* ══ App Window — oversized (1720×940) so camera scale never shows blank ══ */}
      <div style={{
        position:"absolute",
        // Center-align: (1920-1720)/2 = 100
        left:100, top:70,
        width:1720, height:940,
        background:C.canvas, borderRadius:14,
        border:`1px solid ${C.border}`,
        boxShadow:"0 4px 24px rgba(0,0,0,0.07)",
        display:"flex", overflow:"hidden",
        transform:`translateX(${winTX}px)`,
        opacity: winOp,
        willChange:"transform,opacity",
      }}>
        {/* Sidebar */}
        <div style={{ width:66, background:C.darkBand, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:18, paddingBottom:18, gap:4, flexShrink:0 }}>
          <SideItem d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <SideItem d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <SideItem d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <SideItem d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" active />
          <SideItem d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <SideItem d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          <SideItem d="M1 4h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          <div style={{ flex:1 }} />
          <div style={{ width:32, height:32, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff", fontFamily:FONT.sans }}>R</div>
        </div>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Top bar */}
          <div style={{ height:52, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 22px", gap:12, flexShrink:0 }}>
            <LogoMark size={30} frame0={0} />
            <span style={{ fontSize:16, fontWeight:800, color:C.ink, fontFamily:FONT.sans, letterSpacing:"-0.025em" }}>Contacts</span>
            <div style={{ flex:1 }} />
            <div style={{ display:"flex", gap:8, alignItems:"center", background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 12px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span style={{ fontSize:12, color:C.muted, fontFamily:FONT.sans }}>Search contacts…</span>
            </div>
            <div style={{ width:30, height:30, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", background:C.surface, border:`1px solid ${C.border}` }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
          </div>

          {/* Page body */}
          <div style={{ flex:1, padding:18, overflow:"hidden", display:"flex", flexDirection:"column", gap:12 }}>
            {/* New feature banner */}
            <div style={{ background:"#e6fff3", border:`1px solid ${C.green}44`, borderRadius:8, padding:"8px 14px", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ background:C.green, color:"#fff", padding:"2px 7px", borderRadius:4, fontSize:10, fontWeight:800, letterSpacing:"0.06em", fontFamily:FONT.sans }}>NEW</span>
              <span style={{ fontSize:12.5, color:C.greenDeep, fontWeight:600, fontFamily:FONT.sans }}>AI bots &amp; abandoned-cart recovery are now live for all accounts.</span>
            </div>

            {/* Toolbar */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:10 }}>
                <Counter to={89872} frame0={120} size={26} color={C.ink} />
                <span style={{ fontSize:14, color:C.muted, fontFamily:FONT.sans }}>Contacts</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ padding:"7px 16px", background:C.green, color:"#fff", borderRadius:6, border:"none", fontSize:12.5, fontWeight:700, fontFamily:FONT.sans, cursor:"pointer" }}>Broadcast ↗</button>
                <button style={{ padding:"7px 13px", background:C.canvas, color:C.ink, borderRadius:6, border:`1px solid ${C.border}`, fontSize:12, fontWeight:600, fontFamily:FONT.sans, cursor:"pointer" }}>+ Add Contact</button>
                <button style={{ padding:"7px 13px", background:C.canvas, color:C.ink, borderRadius:6, border:`1px solid ${C.border}`, fontSize:12, fontWeight:600, fontFamily:FONT.sans, cursor:"pointer" }}>Import ▾</button>
              </div>
            </div>

            {/* Table */}
            <div style={{ borderRadius:10, border:`1px solid ${C.border}`, overflow:"hidden", flex:1 }}>
              {/* Header */}
              <div style={{ display:"grid", gridTemplateColumns:"34px 1fr 175px 120px 80px 95px 75px", gap:12, padding:"8px 16px", background:C.surface, borderBottom:`1px solid ${C.border}`, fontSize:10, fontWeight:800, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", fontFamily:FONT.sans }}>
                <div/><div>Name</div><div>Mobile</div><div>DoB</div><div>Tag</div><div>Source</div><div>Actions</div>
              </div>
              {ROWS.map((row, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"34px 1fr 175px 120px 80px 95px 75px", gap:12, padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background:C.canvas, fontSize:12.5, fontFamily:FONT.sans, alignItems:"center", ...rowStyle(i) }}>
                  {/* Checkbox */}
                  <div style={{ width:15, height:15, borderRadius:3, border:`2px solid ${ticked[i] ? C.green : C.border}`, background:ticked[i] ? C.green : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {ticked[i] && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><polyline points="1 3.5 3.5 6 8 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ fontWeight:600, color:C.ink }}>{row.name}</div>
                  <div style={{ color:C.body, fontVariantNumeric:"tabular-nums" }}>{row.num}</div>
                  <div style={{ color:C.muted }}>—</div>
                  <span style={{ background:`${row.tagC}18`, color:row.tagC, border:`1px solid ${row.tagC}44`, padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:800, letterSpacing:"0.05em" }}>{row.tag}</span>
                  <div style={{ color:C.muted, fontSize:10.5, fontWeight:600, letterSpacing:"0.04em" }}>{row.src}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat feature overlay */}
      <div style={{
        position:"absolute", bottom:50, right:60,
        opacity:chatOp, transform:`translateY(${chatTY}px)`,
        willChange:"transform,opacity",
        borderRadius:16, overflow:"hidden",
        border:`1.5px solid ${C.border}`,
        boxShadow:"0 20px 50px rgba(0,0,0,0.14)",
        width:320, zIndex:20,
      }}>
        <Img src={staticFile("assets/feature-live-chat.png")} style={{ width:"100%", display:"block" }} />
        <div style={{ padding:"9px 14px", background:C.canvas, display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.green }} />
          <span style={{ fontSize:12, fontWeight:700, color:C.ink, fontFamily:FONT.sans }}>Multi-Agent Live Chat · AI Routing</span>
        </div>
      </div>

      <AnimatedCursor waypoints={cursorWaypoints} />
      <FilmGrain opacity={0.025} />
    </AbsoluteFill>
  );
};
