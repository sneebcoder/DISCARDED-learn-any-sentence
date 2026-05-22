"use client";

import { useEffect } from "react";

interface SoftPassScreenProps {
  onClose: () => void;
  onNext: () => void;
}

const SPARKLES = [
  { top: 14, right: 28, size: 20, color: "#FFD93D", stroke: "#E8B500", delay: "0s" },
  { bottom: 50, right: 8, size: 16, color: "#FFC773", stroke: "#D89A40", delay: "0.6s" },
  { bottom: 70, left: 18, size: 14, color: "#FFD93D", stroke: "#E8B500", delay: "0.9s" },
];

export default function SoftPassScreen({ onClose, onNext }: SoftPassScreenProps) {
  useEffect(() => {
    const audio = new Audio("/thinking.mp3");
    audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#FFF1D6",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-baloo2), sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <svg style={{ position: "absolute", top: 90, right: -15, animation: "float-slow 7s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 0 }} width="70" height="44" viewBox="0 0 80 50">
        <ellipse cx="22" cy="32" rx="18" ry="14" fill="#fff" opacity="0.85" />
        <ellipse cx="40" cy="26" rx="22" ry="18" fill="#fff" opacity="0.85" />
        <ellipse cx="58" cy="32" rx="18" ry="14" fill="#fff" opacity="0.85" />
      </svg>
      <svg style={{ position: "absolute", bottom: 200, left: 14, pointerEvents: "none", zIndex: 0 }} width="20" height="20" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFD93D" stroke="#E8B500" strokeWidth="1.5" />
      </svg>
      <svg style={{ position: "absolute", bottom: 230, right: 20, pointerEvents: "none", zIndex: 0 }} width="22" height="22" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFC773" stroke="#D89A40" strokeWidth="1.5" />
      </svg>
      <svg style={{ position: "absolute", bottom: 280, left: 22, animation: "float-slow 5s ease-in-out infinite 0.5s", pointerEvents: "none", zIndex: 0 }} width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="#FFE5C2" stroke="#E8AC5A" strokeWidth="2" />
      </svg>

      {/* Top bar */}
      <div style={{ padding: "16px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 5, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <button
          onClick={onClose}
          style={{ width: 38, height: 38, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 rgba(0,0,0,0.08)", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <div style={{ background: "#fff", borderRadius: 20, padding: 4, display: "flex", boxShadow: "0 3px 0 rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#00A8E8", color: "#fff", padding: "4px 10px", borderRadius: 16, fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>EN</div>
          <div style={{ color: "#5F5E5A", padding: "4px 10px", fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>हिं</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px 20px", position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Reinforcement card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 5px 0 rgba(0,0,0,0.07)", marginBottom: 24 }}>
          {/* Pot thumb — left side */}
          <div style={{ width: 60, height: 60, background: "#FFF8E7", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="46" height="42" viewBox="0 0 170 140">
              <ellipse cx="85" cy="36" rx="55" ry="8" fill="#5A8FB8" stroke="#2C2C2A" strokeWidth="3" />
              <rect x="35" y="34" width="100" height="6" rx="3" fill="#7BAFD4" stroke="#2C2C2A" strokeWidth="3" />
              <circle cx="85" cy="28" r="6" fill="#FFB347" stroke="#2C2C2A" strokeWidth="3" />
              <path d="M30 42 L30 95 Q30 115 50 120 L120 120 Q140 115 140 95 L140 42 Z" fill="#4A90E2" stroke="#2C2C2A" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M30 55 Q12 55 12 70 Q12 85 30 80" fill="#4A90E2" stroke="#2C2C2A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M140 55 Q158 55 158 70 Q158 85 140 80" fill="#4A90E2" stroke="#2C2C2A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="68" cy="78" r="4" fill="#2C2C2A" />
              <circle cx="102" cy="78" r="4" fill="#2C2C2A" />
              <path d="M75 92 Q85 100 95 92" fill="none" stroke="#2C2C2A" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p style={{ color: "#B8731A", fontFamily: "var(--font-fredoka)", fontSize: 11, fontWeight: 600, letterSpacing: "1.3px", textTransform: "uppercase", margin: "0 0 2px" }}>
              Remember
            </p>
            <h3 style={{ color: "#2C2C2A", fontFamily: "var(--font-fredoka)", fontSize: 20, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
              "Pot" starts with <span style={{ color: "#D85A30", fontWeight: 700 }}>/p/</span>
            </h3>
          </div>
        </div>

        {/* Mascot zone */}
        <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 4 }}>
          <div style={{ position: "absolute", width: 240, height: 240, background: "#FAD897", borderRadius: "50%", opacity: 0.55, zIndex: 1, top: "50%", left: "50%", animation: "halo-pulse 2.2s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 200, height: 200, background: "#F5C167", borderRadius: "50%", opacity: 0.55, zIndex: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

          {/* Sparkles */}
          {SPARKLES.map((s, i) => (
            <svg
              key={i}
              style={{
                position: "absolute",
                zIndex: 2,
                pointerEvents: "none",
                top: s.top,
                // @ts-expect-error dynamic props
                right: s.right,
                bottom: s.bottom,
                left: s.left,
                animation: `sparkle-pop 1.4s ease-in-out infinite ${s.delay}`,
              }}
              width={s.size} height={s.size} viewBox="0 0 24 24"
            >
              <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill={s.color} stroke={s.stroke} strokeWidth="1.5" />
            </svg>
          ))}

          {/* Mascot — swaying instead of bouncing */}
          <div style={{ position: "relative", zIndex: 3, animation: "mascot-sway 2.5s ease-in-out infinite", transformOrigin: "bottom center" }}>
            <img src="/mascot.png" alt="Mascot" style={{ width: 165, height: "auto", display: "block" }} />
          </div>
        </div>

        {/* YAY! */}
        <div style={{ textAlign: "center", marginTop: -4, position: "relative", zIndex: 3 }}>
          <p style={{ color: "#B8731A", fontFamily: "var(--font-fredoka)", fontSize: 56, fontWeight: 700, letterSpacing: "1.5px", margin: 0, lineHeight: 1 }}>
            NICE TRY!
          </p>
        </div>

        {/* Next button */}
        <div style={{ width: "100%", marginTop: "auto", paddingTop: 16 }}>
          <button
            onClick={onNext}
            style={{ width: "100%", background: "#1D9E75", color: "#fff", border: "3px solid #fff", padding: "16px 22px", borderRadius: 22, fontFamily: "var(--font-fredoka)", fontSize: 18, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 0 #0F6E56, 0 10px 20px rgba(15,110,86,0.2)" }}
          >
            Next word
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
