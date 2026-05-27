"use client";

import { useEffect } from "react";

interface SuccessScreenProps {
  onClose: () => void;
  onNext: () => void;
}

const SPARKLES = [
  { top: 14, right: 28, size: 22, color: "#FFD93D", stroke: "#E8B500", delay: "0s" },
  { top: 40, left: 12, size: 18, color: "#FF9EB5", stroke: "#D85A8C", delay: "0.3s" },
  { bottom: 50, right: 8, size: 20, color: "#A8E1FF", stroke: "#5DAEDC", delay: "0.6s" },
  { bottom: 70, left: 18, size: 16, color: "#FFD93D", stroke: "#E8B500", delay: "0.9s" },
  { top: 100, right: -8, size: 14, color: "#FF9EB5", stroke: "#D85A8C", delay: "0.45s" },
  { top: 120, left: -8, size: 14, color: "#A8E1FF", stroke: "#5DAEDC", delay: "0.75s" },
];

function SparklesStar({ size, color, stroke, style }: { size: number; color: string; stroke: string; style: React.CSSProperties }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24">
      <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill={color} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

export default function SuccessScreen({ onClose, onNext }: SuccessScreenProps) {
  useEffect(() => {
    const audio = new Audio("/yay.mp3");
    audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#D9F3DD",
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
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#A8E1FF" stroke="#5DAEDC" strokeWidth="1.5" />
      </svg>
      <svg style={{ position: "absolute", bottom: 280, left: 22, animation: "float-slow 5s ease-in-out infinite 0.5s", pointerEvents: "none", zIndex: 0 }} width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="#FFE5C2" stroke="#E8AC5A" strokeWidth="2" />
      </svg>

      {/* Top bar */}
      <div style={{ padding: "16px 20px 16px", display: "flex", alignItems: "center", justifyContent: "flex-start", position: "relative", zIndex: 5, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <button
          onClick={onClose}
          style={{ width: 38, height: 38, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 rgba(0,0,0,0.08)", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 20px 20px", position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Learning summary card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 5px 0 rgba(0,0,0,0.07)", marginBottom: 24 }}>
          <div style={{ width: 60, height: 60, background: "#F0F8FF", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="46" height="46" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
              <g transform="rotate(28, 160, 160)">
                <rect x="148" y="36" width="24" height="22" rx="4" fill="#1E2A6B" stroke="#0F1742" strokeWidth="2"/>
                <rect x="152" y="40" width="5" height="14" rx="2.5" fill="#3949AB" opacity="0.6"/>
                <rect x="142" y="56" width="36" height="6" fill="#E0A92B" stroke="#A67A1A" strokeWidth="1.5"/>
                <rect x="140" y="60" width="40" height="50" rx="3" fill="#1A5FA8" stroke="#0E3D6F" strokeWidth="2.5"/>
                <rect x="146" y="64" width="6" height="40" rx="3" fill="#4A8BC8" opacity="0.55"/>
                <rect x="172" y="62" width="6" height="46" fill="#0E3D6F" opacity="0.4"/>
                <path d="M134 64 Q132 70 134 86 L134 108 Q134 112 138 112 L138 76 Q138 70 142 66 Z" fill="#2A78C2" stroke="#0E3D6F" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="135" y="76" width="2" height="28" fill="#5C9DD8" opacity="0.7"/>
                <rect x="140" y="110" width="40" height="10" fill="#E0A92B" stroke="#A67A1A" strokeWidth="1.5"/>
                <rect x="143" y="112" width="3" height="6" fill="#F5D27A" opacity="0.8"/>
                <rect x="140" y="120" width="40" height="115" rx="2" fill="#1F6FB5" stroke="#0E3D6F" strokeWidth="2.5"/>
                <rect x="146" y="124" width="7" height="105" rx="3.5" fill="#4A8BC8" opacity="0.55"/>
                <rect x="172" y="124" width="6" height="107" fill="#0E3D6F" opacity="0.35"/>
                <rect x="140" y="235" width="40" height="9" fill="#E0A92B" stroke="#A67A1A" strokeWidth="1.5"/>
                <rect x="143" y="237" width="3" height="5" fill="#F5D27A" opacity="0.8"/>
                <path d="M140 244 L180 244 L168 274 L152 274 Z" fill="#7EC2E8" stroke="#3F8BC8" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M145 247 L150 247 L151 270 L148 270 Z" fill="#B5DBF0" opacity="0.8"/>
                <path d="M175 247 L178 247 L170 272 L168 272 Z" fill="#3F8BC8" opacity="0.4"/>
                <path d="M152 274 L160 290 L168 274 Z" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="160" cy="289" r="1.8" fill="#1a1a1a"/>
              </g>
            </svg>
          </div>
          <div>
            <p style={{ color: "#1D9E75", fontFamily: "var(--font-fredoka)", fontSize: 11, fontWeight: 600, letterSpacing: "1.3px", textTransform: "uppercase", margin: "0 0 2px", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#1D9E75"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
              You learned
            </p>
            <h3 style={{ color: "#2C2C2A", fontFamily: "var(--font-fredoka)", fontSize: 20, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
              "Pen" starts with <span style={{ color: "#1D9E75", fontWeight: 700 }}>/p/</span>
            </h3>
          </div>
        </div>

        {/* Mascot zone */}
        <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 4 }}>
          {/* Halos */}
          <div style={{ position: "absolute", width: 240, height: 240, background: "#B5EAC1", borderRadius: "50%", opacity: 0.55, zIndex: 1, top: "50%", left: "50%", animation: "halo-pulse 2.2s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 200, height: 200, background: "#87D69B", borderRadius: "50%", opacity: 0.55, zIndex: 1, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

          {/* Sparkles */}
          {SPARKLES.map((s, i) => (
            <SparklesStar
              key={i}
              size={s.size}
              color={s.color}
              stroke={s.stroke}
              style={{
                position: "absolute",
                zIndex: 2,
                pointerEvents: "none",
                top: s.top,
                right: s.right,
                bottom: s.bottom,
                left: s.left,
                animation: `sparkle-pop 1.4s ease-in-out infinite ${s.delay}`,
              }}
            />
          ))}

          {/* Mascot */}
          <div style={{ position: "relative", zIndex: 3, animation: "mascot-bounce 1.1s ease-in-out infinite" }}>
            <img src="/mascot.png" alt="Mascot" style={{ width: 165, height: "auto", display: "block" }} />
          </div>
        </div>

        {/* GREAT! */}
        <div style={{ textAlign: "center", marginTop: -4, position: "relative", zIndex: 3 }}>
          <p style={{ color: "#0F6E56", fontFamily: "var(--font-fredoka)", fontSize: 56, fontWeight: 700, letterSpacing: "1.5px", margin: 0, lineHeight: 1 }}>
            GREAT!
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
