import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { C, FONT } from "../theme";
import { FPS } from "../timing";

export type WAMsg = {
  t: number;         // seconds this message appears
  from: 'in' | 'out';
  type?: 'text' | 'buttons' | 'image' | 'payment';
  text: string;
  buttons?: string[];
  imageUrl?: string;
  paid?: boolean;
};

/**
 * Declarative WhatsApp chat renderer.
 * Each message slides up from below and fades in at time t.
 * Typing indicator shown 0.8s before message appears.
 */
export const WAChat: React.FC<{
  businessName?: string;
  script: WAMsg[];
}> = ({ businessName = 'Aura Beauty', script }) => {
  const frame = useCurrentFrame();
  const time = frame / FPS;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FONT.ui }}>
      {/* WA Header */}
      <div style={{
        background: C.waDark,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Back arrow */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: C.brandGreen,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, color: '#fff', fontSize: 14,
        }}>
          {businessName.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
            {businessName}
            {/* Blue verified tick */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#53bdeb"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>business account</div>
        </div>
        <div style={{ flex: 1 }} />
        {/* Video + call + menu icons */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.75"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.75" style={{marginLeft:10}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.53 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.75" style={{marginLeft:10}}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E") ${C.waChatBg}`,
        backgroundColor: C.waChatBg,
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        overflowY: 'hidden',
        position: 'relative',
      }}>
        {script.map((msg, i) => {
          if (time < msg.t - 0.8) return null;
          const isTyping = time >= msg.t - 0.8 && time < msg.t && msg.from === 'in';
          if (isTyping) {
            return (
              <div key={`typing-${i}`} style={{ alignSelf: 'flex-start' }}>
                <div style={{
                  background: C.waBubbleIn, borderRadius: '10px 10px 10px 2px',
                  padding: '8px 12px', display: 'flex', gap: 4, alignItems: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  {[0, 1, 2].map(dot => {
                    const dotBounce = Math.sin((frame / 6) + dot * 1.5) * 3;
                    return <div key={dot} style={{ width: 6, height: 6, borderRadius: '50%', background: C.muted, transform: `translateY(${dotBounce}px)` }} />;
                  })}
                </div>
              </div>
            );
          }
          if (time < msg.t) return null;

          const p = spring({ frame: frame - msg.t * FPS, fps: FPS, config: { damping: 14, stiffness: 160 } });
          const ty = interpolate(p, [0, 1], [20, 0]);
          const op = interpolate(p, [0, 0.4, 1], [0, 1, 1]);

          const isOut = msg.from === 'out';
          return (
            <div key={i} style={{
              alignSelf: isOut ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              transform: `translateY(${ty}px)`,
              opacity: op,
              willChange: 'transform, opacity',
            }}>
              {msg.type === 'image' && msg.imageUrl && (
                <div style={{
                  background: C.waBubbleIn, borderRadius: '10px 10px 10px 2px',
                  overflow: 'hidden', marginBottom: 2,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}>
                  <img src={msg.imageUrl} style={{ width: '100%', display: 'block', borderRadius: 8 }} alt="" />
                </div>
              )}

              <div style={{
                background: isOut ? C.waBubbleOut : C.waBubbleIn,
                borderRadius: isOut ? '10px 2px 10px 10px' : '2px 10px 10px 10px',
                padding: msg.buttons ? '10px 10px 4px' : '8px 10px',
                fontSize: 13.5,
                color: C.heading,
                lineHeight: 1.4,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}>
                {msg.text}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: C.muted }}>
                    {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isOut && (
                    <svg width="14" height="10" viewBox="0 0 16 11" fill={C.waTick}>
                      <path d="M1 5.5L5 9.5L15 1.5"/>
                      <path d="M6 5.5L10 9.5" opacity="0.6"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Buttons */}
              {msg.buttons && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
                  {msg.buttons.map((b, bi) => (
                    <div key={bi} style={{
                      background: C.waBubbleIn,
                      borderRadius: bi === msg.buttons!.length - 1 ? '0 0 10px 10px' : 0,
                      padding: '9px',
                      textAlign: 'center',
                      color: C.waMedium,
                      fontWeight: 600,
                      fontSize: 13,
                      borderTop: `1px solid rgba(0,0,0,0.06)`,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.waMedium} strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <div style={{
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        padding: '8px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        <div style={{
          flex: 1, background: C.canvas, borderRadius: 20,
          padding: '7px 14px', fontSize: 13, color: C.muted,
          border: `1px solid ${C.border}`,
        }}>
          Message
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.75"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: C.waGreen,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </div>
      </div>
    </div>
  );
};
