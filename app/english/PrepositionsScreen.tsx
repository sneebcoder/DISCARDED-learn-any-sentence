"use client";

import { useState, useEffect, useRef } from "react";

interface PrepositionsScreenProps {
  onClose: () => void;
}

export default function PrepositionsScreen({ onClose }: PrepositionsScreenProps) {
  const [selected, setSelected] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const a = new Audio("/prepositions-question.mp3");
      audioRef.current = a;
      a.play().catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function playAudio(src: string, onEnded?: () => void) {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const a = new Audio(src);
    audioRef.current = a;
    if (onEnded) a.addEventListener("ended", onEnded, { once: true });
    a.play().catch(() => { onEnded?.(); });
  }

  function handleSpeaker() { playAudio("/prepositions-question.mp3"); }

  function handleCorrect() {
    if (selected) return;
    setSelected(true);
    playAudio("/yay.mp3", () => {
      playAudio("/prepositions-correct.mp3", () => {
        setNextEnabled(true);
      });
    });
  }

  function handleWrong() {
    if (selected) return;
    new Audio("/wrong.mp3").play().catch(() => {});
    setWrongShake(true);
    setTimeout(() => setWrongShake(false), 450);
  }

  const bgColor = "#FFF8E7";

  const CatSVG = () => (
    <g>
      <path d="M16 44 Q40 44 40 18 Q40 4 26 6" fill="none" stroke="#F57C00" strokeWidth="6" strokeLinecap="round"/>
      <path d="M16 44 Q40 44 40 18 Q40 4 26 6" fill="none" stroke="#FFB74D" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="0" cy="32" rx="20" ry="20" fill="#FFB74D" stroke="#BF360C" strokeWidth="3"/>
      <ellipse cx="-8" cy="48" rx="5" ry="6" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5"/>
      <ellipse cx="8" cy="48" rx="5" ry="6" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5"/>
      <circle cx="0" cy="6" r="18" fill="#FFB74D" stroke="#BF360C" strokeWidth="3"/>
      <path d="M-16 0 L-22 -16 L-7 -8 Z" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M16 0 L22 -16 L7 -8 Z" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M-15 -2 L-19 -12 L-9 -7 Z" fill="#FFCDD2"/>
      <path d="M15 -2 L19 -12 L9 -7 Z" fill="#FFCDD2"/>
      <ellipse cx="-12" cy="10" rx="5" ry="3" fill="#FFCDD2" opacity="0.7"/>
      <ellipse cx="12" cy="10" rx="5" ry="3" fill="#FFCDD2" opacity="0.7"/>
      <ellipse cx="-6" cy="3" rx="2.8" ry="3.5" fill="#1a1a1a"/>
      <ellipse cx="6" cy="3" rx="2.8" ry="3.5" fill="#1a1a1a"/>
      <circle cx="-5" cy="2" r="1" fill="#fff"/>
      <circle cx="7" cy="2" r="1" fill="#fff"/>
      <path d="M-2.5 10 L2.5 10 L0 13 Z" fill="#BF360C"/>
      <path d="M0 13 L0 15" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M0 15 Q-3 17 -5 16" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M0 15 Q3 17 5 16" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="-22" y1="9" x2="-10" y2="11" stroke="#BF360C" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="-22" y1="13" x2="-10" y2="13" stroke="#BF360C" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="10" y1="11" x2="22" y2="9" stroke="#BF360C" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="10" y1="13" x2="22" y2="13" stroke="#BF360C" strokeWidth="1.3" strokeLinecap="round"/>
    </g>
  );

  const BoxSVG = () => (
    <g>
      <rect x="0" y="20" width="64" height="48" rx="4" fill="#FFB74D" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M0 20 L20 4 L84 4 L64 20 Z" fill="#FFCC80" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M64 20 L84 4 L84 52 L64 68 Z" fill="#F57C00" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
      <line x1="32" y1="20" x2="52" y2="4" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="20" x2="32" y2="68" stroke="#BF360C" strokeWidth="2" strokeDasharray="4,3"/>
    </g>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: bgColor, zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "var(--font-baloo2), sans-serif", overflow: "hidden", transition: "background 0.4s ease" }}>

      {/* Sparkles */}
      <svg style={{ position: "absolute", bottom: 80, left: 18, pointerEvents: "none", zIndex: 0, animation: "prep-twinkle 2.2s ease-in-out infinite" }} width="16" height="16" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFB74D" stroke="#F57C00" strokeWidth="1.2"/>
      </svg>
      <svg style={{ position: "absolute", bottom: 50, right: 20, pointerEvents: "none", zIndex: 0, animation: "prep-twinkle 2.6s ease-in-out infinite 0.4s" }} width="14" height="14" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFD93D" stroke="#E8B500" strokeWidth="1.2"/>
      </svg>

      {/* Top bar */}
      <div style={{ padding: "16px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 5, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <button onClick={onClose} style={{ width: 38, height: 38, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 rgba(0,0,0,0.08)", cursor: "pointer" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>
        <div style={{ background: "#fff", borderRadius: 20, padding: 4, display: "flex", boxShadow: "0 3px 0 rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#00A8E8", color: "#fff", padding: "4px 10px", borderRadius: 16, fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>EN</div>
          <div style={{ color: "#5F5E5A", padding: "4px 10px", fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>हिं</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 16px 24px", gap: 14, position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Question card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)" }}>
          <button onClick={handleSpeaker} style={{ width: 42, height: 42, background: "#00A8E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 0 #0076A8", position: "relative", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2.5px solid #00A8E8", opacity: 0.5, animation: "prep-ring 1.6s ease-out infinite", pointerEvents: "none" }}/>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M15.5 8.5 Q18 12 15.5 15.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 6 Q23 12 19 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 style={{ fontFamily: "var(--font-fredoka)", fontSize: 17, fontWeight: 600, color: "#2C2C2A", margin: 0, lineHeight: 1.25 }}>
            Kis picture mein cat box ke <span style={{ color: "#E07B00" }}>paas</span> hai?
          </h2>
        </div>

        {/* Card A — cat FAR (wrong) */}
        <button
          onClick={handleWrong}
          style={{
            width: "100%", height: 175, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(160deg, #E3F2FD 0%, #BBDEFB 100%)",
            border: wrongShake ? "3.5px solid #E07B00" : "3.5px solid transparent",
            boxShadow: wrongShake ? "0 0 0 3px rgba(224,123,0,0.2), 0 6px 0 rgba(0,0,0,0.08)" : "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)",
            animation: wrongShake ? "prep-shake 0.4s ease-out" : "none",
            cursor: selected ? "default" : "pointer", padding: 0, flexShrink: 0,
            transition: "border 0.15s, box-shadow 0.15s", overflow: "hidden",
          }}
        >
          <svg width="300" height="160" viewBox="0 0 300 170">
            <line x1="20" y1="138" x2="280" y2="138" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round"/>
            <g transform="translate(40, 70)"><BoxSVG /></g>
            <g transform="translate(238, 88)"><CatSVG /></g>
            <line x1="124" y1="138" x2="220" y2="138" stroke="#90A4AE" strokeWidth="2" strokeDasharray="4,5" opacity="0.6"/>
          </svg>
        </button>

        {/* Card B — cat NEAR (correct) */}
        <button
          onClick={handleCorrect}
          style={{
            width: "100%", height: 175, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(160deg, #FFF3E0 0%, #FFE0B2 100%)",
            border: selected ? "3.5px solid #1D9E75" : "3.5px solid transparent",
            boxShadow: selected ? "0 0 0 6px rgba(29,158,117,0.22), 0 6px 0 rgba(0,0,0,0.08)" : "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)",
            cursor: selected ? "default" : "pointer", padding: 0, flexShrink: 0,
            position: "relative", overflow: "visible",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
        >
          <svg width="300" height="160" viewBox="0 0 300 170" style={{ overflow: "visible" }}>
            <line x1="20" y1="138" x2="280" y2="138" stroke="#90A4AE" strokeWidth="3" strokeLinecap="round"/>
            <g transform="translate(110, 70)"><BoxSVG /></g>
            <g transform="translate(214, 88)"><CatSVG /></g>
          </svg>
          {selected && (
            <div style={{ position: "absolute", top: -10, right: -10, width: 34, height: 34, background: "#1D9E75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 3, animation: "prep-tick-pop 0.3s ease-out" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
          )}
        </button>

        {/* Next CTA */}
        <button
          onClick={nextEnabled ? onClose : undefined}
          disabled={!nextEnabled}
          style={{
            width: "100%",
            background: nextEnabled ? "#1D9E75" : "rgba(29,158,117,0.25)",
            color: "#fff", border: "none", borderRadius: 20, padding: "16px",
            fontFamily: "var(--font-fredoka)", fontSize: 20, fontWeight: 700,
            boxShadow: nextEnabled ? "0 6px 0 #0F6E56" : "none",
            cursor: nextEnabled ? "pointer" : "default",
            transition: "background 0.3s, box-shadow 0.3s", marginTop: "auto",
          }}
        >
          Next
        </button>

      </div>

      <style>{`
        @keyframes prep-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes prep-twinkle { 0%, 100% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes prep-shake { 0% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } 100% { transform: translateX(0); } }
        @keyframes prep-tick-pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}
