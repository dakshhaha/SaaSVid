import React from "react";
import { C, FONT } from "../theme";

type PhoneProps = {
  variant?: 'island' | 'notch';
  children?: React.ReactNode;
  scale?: number;
};

/**
 * Pixel-accurate iPhone shell.
 * - Dynamic Island (pill notch) or classic notch
 * - Proper status bar: time + carrier + battery
 * - Black aluminium bezel, 78px radius
 * - No overflow:hidden on outer so pop-out cards bleed over bezel
 */
export const Phone: React.FC<PhoneProps> = ({
  variant = 'island',
  children,
  scale = 1,
}) => {
  const W = 320; // phone width in px
  const H = 660; // phone height in px
  const BEZEL = 12;
  const RADIUS = 52;

  return (
    <div style={{
      position: 'relative',
      width: W + BEZEL * 2,
      height: H + BEZEL * 2,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {/* Outer bezel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: RADIUS + BEZEL,
        background: 'linear-gradient(145deg, #2a2a2a 0%, #111 60%, #1e1e1e 100%)',
        boxShadow: '0 0 0 1px #3a3a3a, 0 24px 60px rgba(0,0,0,0.55)',
      }} />

      {/* Screen inner */}
      <div style={{
        position: 'absolute',
        inset: BEZEL,
        borderRadius: RADIUS,
        background: C.canvas,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Status Bar */}
        <div style={{
          height: variant === 'island' ? 54 : 44,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: 6,
          paddingLeft: 20,
          paddingRight: 20,
          position: 'relative',
          zIndex: 10,
        }}>
          <span style={{ fontFamily: FONT.ui, fontSize: 14, fontWeight: 700, color: C.heading, letterSpacing: '-0.01em' }}>9:41</span>
          <div style={{ flex: 1 }} />
          {/* Battery + signal indicators */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {/* Signal bars */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill={C.heading}>
              <rect x="0" y="6" width="3" height="6" rx="1"/>
              <rect x="4.5" y="4" width="3" height="8" rx="1"/>
              <rect x="9" y="2" width="3" height="10" rx="1"/>
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.3"/>
            </svg>
            {/* Battery */}
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="3.5" stroke={C.heading} strokeWidth="1"/>
              <rect x="2" y="2" width="13" height="8" rx="2" fill={C.heading}/>
              <path d="M19.5 4.5v3a1.5 1.5 0 0 1 0-3z" fill={C.heading}/>
            </svg>
          </div>
        </div>

        {/* Dynamic Island */}
        {variant === 'island' && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 116,
            height: 34,
            background: '#000',
            borderRadius: 20,
            zIndex: 20,
          }} />
        )}

        {/* Notch variant */}
        {variant === 'notch' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 140,
            height: 28,
            background: '#000',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 20,
          }} />
        )}

        {/* Screen content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>

        {/* Home Indicator */}
        <div style={{
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{ width: 120, height: 4, borderRadius: 2, background: C.heading, opacity: 0.2 }} />
        </div>
      </div>
    </div>
  );
};
