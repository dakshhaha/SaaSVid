import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
  Img
} from "remotion";

const KineticText: React.FC<{ text: string, delay?: number, size?: string }> = ({ text, delay = 0, size = "120px" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const moveUp = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      stiffness: 200,
      mass: 0.8
    }
  });

  const translateY = interpolate(moveUp, [0, 1], [200, 0]);
  const skewY = interpolate(moveUp, [0, 1], [15, 0]);
  const opacity = interpolate(moveUp, [0, 0.5, 1], [0, 1, 1]);

  return (
    <div style={{ overflow: "hidden", padding: "10px 0" }}>
      <h1
        style={{
          fontSize: size,
          lineHeight: "0.9",
          color: "var(--color-ink)",
          transform: `translateY(${translateY}px) skewY(${skewY}deg)`,
          opacity,
          margin: 0,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          textTransform: "uppercase"
        }}
      >
        {text}
      </h1>
    </div>
  );
};

// Scene 1: High Energy Typography
const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const exitOpacity = interpolate(frame, [100, 115], [1, 0], { extrapolateRight: "clamp" });
  
  const scaleOut = spring({
    frame: frame - 90,
    fps: 60,
    config: { damping: 15 }
  });
  
  const scale = interpolate(scaleOut, [0, 1], [1, 3]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "var(--color-paper)", 
      justifyContent: "center", 
      padding: "80px",
      opacity: exitOpacity,
      transform: `scale(${scale})`
    }}>
      <KineticText text="SCALE" delay={0} />
      <KineticText text="YOUR" delay={5} />
      <KineticText text="BRAND" delay={10} />
      <KineticText text="5X" delay={15} size="160px" />
      <KineticText text="FASTER" delay={20} />
      
      <div style={{
         position: "absolute",
         top: "-200px",
         right: "-200px",
         width: "600px",
         height: "600px",
         borderRadius: "50%",
         background: "radial-gradient(circle, rgba(254,85,27,0.4) 0%, rgba(255,255,255,0) 70%)",
         filter: "blur(40px)",
         opacity: interpolate(frame, [0, 30], [0, 1])
      }} />
    </AbsoluteFill>
  );
};

// Scene 2: Bento Grid for "High Speed Web Platforms"
const BentoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  
  const yOffset = interpolate(entrance, [0, 1], [800, 0]);
  const exitY = interpolate(frame, [100, 120], [0, -1000], { easing: Easing.bezier(0.5, 0, 0.2, 1) });
  
  const Box = ({ delay, width, height, color, title, rotate = 0 }) => {
    const scale = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
    return (
      <div style={{
        width,
        height,
        backgroundColor: color,
        borderRadius: "32px",
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 24px 48px rgba(0,0,0,0.08)",
        padding: "40px",
        position: "relative",
        overflow: "hidden"
      }}>
        {title}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "var(--color-bone)",
      justifyContent: "center", 
      alignItems: "center",
      transform: `translateY(${exitY}px)`
    }}>
      <h2 style={{ 
        position: "absolute", 
        top: "160px", 
        fontSize: "80px", 
        textAlign: "center", 
        fontWeight: 800,
        letterSpacing: "-0.04em",
        transform: `translateY(${interpolate(entrance, [0, 1], [-100, 0])})`,
        opacity: entrance
      }}>
        HIGH-SPEED<br/>WEB PLATFORMS
      </h2>
      
      <div style={{ display: "flex", flexWrap: "wrap", width: "900px", gap: "24px", justifyContent: "center", marginTop: "200px" }}>
        <Box delay={10} width="500px" height="300px" color="var(--color-paper)" title={<h3 style={{fontSize: "48px"}}>Lighthouse 95+</h3>} />
        <Box delay={15} width="350px" height="300px" color="var(--color-flame-orange)" title={<h3 style={{fontSize: "64px", color: "white"}}>1.2s</h3>} rotate={2} />
        <Box delay={20} width="874px" height="250px" color="var(--color-ink)" title={<h3 style={{fontSize: "48px", color: "white"}}>2.8x Conversion Lift</h3>} />
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: WhatsApp Automation
const WhatsAppScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  
  const pop1 = spring({ frame: frame - 20, fps, config: { damping: 10, stiffness: 180 } });
  const pop2 = spring({ frame: frame - 40, fps, config: { damping: 10, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "var(--color-ink)", 
      justifyContent: "center", 
      alignItems: "center",
      overflow: "hidden"
    }}>
      <h2 style={{ 
        position: "absolute", 
        top: "160px", 
        fontSize: "80px", 
        textAlign: "center", 
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "var(--color-paper)",
        transform: `translateY(${interpolate(entrance, [0, 1], [-100, 0])})`,
        opacity: entrance
      }}>
        OFFICIAL API<br/>AUTOMATION
      </h2>

      <div style={{
        width: "700px",
        height: "800px",
        backgroundColor: "var(--color-paper)",
        borderRadius: "48px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        transform: `translateY(${interpolate(entrance, [0, 1], [1000, 100])}) rotateX(${interpolate(entrance, [0, 1], [30, 0])}deg)`,
        boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        perspective: "1000px"
      }}>
        {/* Floating Bubble 1 */}
        <div style={{
          alignSelf: "flex-start",
          backgroundColor: "var(--color-pebble)",
          padding: "32px",
          borderRadius: "32px 32px 32px 0",
          fontSize: "32px",
          fontWeight: 500,
          transform: `scale(${pop1})`,
          transformOrigin: "bottom left"
        }}>
          How can I track my order?
        </div>
        
        {/* Floating Bubble 2 */}
        <div style={{
          alignSelf: "flex-end",
          backgroundColor: "var(--color-flame-orange)",
          color: "white",
          padding: "32px",
          borderRadius: "32px 32px 0 32px",
          fontSize: "32px",
          fontWeight: 600,
          transform: `scale(${pop2})`,
          transformOrigin: "bottom right"
        }}>
          Your order #502 is out for delivery! 🚀
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LaunchVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "var(--color-paper)" }}>
      {/* Dynamic 6-second Reel */}
      <Sequence from={0} durationInFrames={120}>
        <HeroScene />
      </Sequence>
      
      <Sequence from={110} durationInFrames={120}>
        <BentoScene />
      </Sequence>

      <Sequence from={220} durationInFrames={140}>
        <WhatsAppScene />
      </Sequence>
    </AbsoluteFill>
  );
};
