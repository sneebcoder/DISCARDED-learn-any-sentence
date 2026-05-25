"use client";

import { useState, useEffect, useRef } from "react";

interface OppositesMCQScreenProps {
  onClose: () => void;
}

export default function OppositesMCQScreen({ onClose }: OppositesMCQScreenProps) {
  const [selected, setSelected] = useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const a = new Audio("/opposites-mcq-question.mp3");
      audioRef.current = a;
      a.play().catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  function playAudio(src: string) {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const a = new Audio(src);
    audioRef.current = a;
    a.play().catch(() => {});
  }

  function handleSpeaker() { playAudio("/opposites-mcq-question.mp3"); }

  function handleTile(val: "up" | "down") {
    if (submitted) return;
    if (val === "up") {
      // wrong choice — play word audio first, then shake + error sound after it ends
      setSelected(null);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
      const a = new Audio("/opposites-word-up.mp3");
      audioRef.current = a;
      const onEnded = () => {
        new Audio("/wrong.mp3").play().catch(() => {});
        setWrongShake(true);
        setTimeout(() => setWrongShake(false), 450);
      };
      a.addEventListener("ended", onEnded, { once: true });
      a.play().catch(() => { onEnded(); });
    } else {
      // correct choice — select it
      setSelected("down");
      playAudio("/opposites-word-down.mp3");
    }
  }

  function handleSubmit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    new Audio("/yay.mp3").play().catch(() => {});
  }

  const bgColor = submitted ? "#D9F3DD" : "#EDE7F6";

  return (
    <div style={{ position: "fixed", inset: 0, background: bgColor, zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "var(--font-baloo2), sans-serif", overflow: "hidden", transition: "background 0.5s ease" }}>

      {/* Background sparkles */}
      <svg style={{ position: "absolute", top: 370, right: 16, pointerEvents: "none", zIndex: 0, animation: "mcq-twinkle 2.2s ease-in-out infinite" }} width="20" height="20" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFD93D" stroke="#E8B500" strokeWidth="1.5" />
      </svg>
      <svg style={{ position: "absolute", top: 420, left: 12, pointerEvents: "none", zIndex: 0, animation: "mcq-twinkle 2.6s ease-in-out infinite 0.4s" }} width="16" height="16" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FF9EB5" stroke="#D85A8C" strokeWidth="1.5" />
      </svg>

      {/* Top bar */}
      <div style={{ padding: "16px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 5, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <button onClick={onClose} style={{ width: 38, height: 38, background: "#fff", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 0 rgba(0,0,0,0.08)", cursor: "pointer" }}>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 16px 28px", gap: 16, position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Question card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)" }}>
          <button onClick={handleSpeaker} style={{ width: 46, height: 46, background: "#00A8E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 0 #0076A8", position: "relative", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2.5px solid #00A8E8", opacity: 0.5, animation: "mcq-ring 1.6s ease-out infinite", pointerEvents: "none" }} />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
              <path d="M15.5 8.5 Q18 12 15.5 15.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 6 Q23 12 19 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h2 style={{ fontFamily: "var(--font-fredoka)", fontSize: 20, fontWeight: 600, color: "#2C2C2A", margin: 0, lineHeight: 1.2 }}>
            <span style={{ color: "#7B1FA2" }}>"Up"</span> ka opposite kya hai?
          </h2>
        </div>

        {/* Choice cards */}
        <div style={{ width: "100%", display: "flex", gap: 14, justifyContent: "center" }}>

          {/* DOWN card */}
          <button
            onClick={() => handleTile("down")}
            style={{
              width: 150, height: 160, borderRadius: 26, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "space-between", padding: "20px 12px 16px",
              background: "linear-gradient(180deg, #E0EEFF 0%, #AECFFF 100%)",
              border: selected === "down" ? "3.5px solid #7B1FA2" : "3.5px solid transparent",
              boxShadow: selected === "down" ? "0 0 0 4px rgba(123,31,162,0.18), 0 7px 0 rgba(0,0,0,0.09)" : "0 7px 0 rgba(0,0,0,0.09), 0 14px 28px rgba(0,0,0,0.05)",
              cursor: submitted ? "default" : "pointer", flexShrink: 0, transition: "border 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="86" height="86" viewBox="0 0 80 90" style={{ animation: "mcq-float-down 2.8s ease-in-out infinite" }}>
                <path d="M28 6 Q28 6 52 6 Q52 6 52 44 L66 44 L40 78 L14 44 L28 44 Z" fill="#5B9BD5" stroke="#1A5FA8" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: 22, fontWeight: 700, margin: 0, color: "#1A5FA8" }}>DOWN</p>
          </button>

          {/* UP card */}
          <button
            onClick={() => handleTile("up")}
            style={{
              width: 150, height: 160, borderRadius: 26, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "space-between", padding: "20px 12px 16px",
              background: "linear-gradient(180deg, #F3E5F5 0%, #CE93D8 100%)",
              border: wrongShake ? "3.5px solid #E07B00" : "3.5px solid transparent",
              boxShadow: wrongShake ? "0 0 0 4px rgba(224,123,0,0.2), 0 7px 0 rgba(0,0,0,0.09)" : "0 7px 0 rgba(0,0,0,0.09), 0 14px 28px rgba(0,0,0,0.05)",
              cursor: submitted ? "default" : "pointer", flexShrink: 0,
              animation: wrongShake ? "mcq-shake 0.4s ease-out" : "none",
              transition: "border 0.15s, box-shadow 0.15s",
            }}
          >
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="86" height="86" viewBox="0 0 80 90" style={{ animation: "mcq-float-up 2.4s ease-in-out infinite" }}>
                <path d="M52 84 Q52 84 28 84 Q28 84 28 46 L14 46 L40 12 L66 46 L52 46 Z" fill="#B97FD4" stroke="#7B1FA2" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: 22, fontWeight: 700, margin: 0, color: "#7B1FA2" }}>UP</p>
          </button>

        </div>

        {/* CTA */}
        <button
          onClick={submitted ? onClose : handleSubmit}
          disabled={!selected && !submitted}
          style={{
            width: "100%",
            background: submitted ? "#1D9E75" : selected ? "#7B1FA2" : "rgba(123,31,162,0.25)",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "16px",
            fontFamily: "var(--font-fredoka)",
            fontSize: 20,
            fontWeight: 700,
            boxShadow: submitted ? "0 6px 0 #0F6E56" : selected ? "0 6px 0 #4A0080" : "none",
            cursor: selected || submitted ? "pointer" : "default",
            transition: "background 0.3s, box-shadow 0.3s",
            marginTop: "auto",
          }}
        >
          {submitted ? "Go Home" : "Submit"}
        </button>

      </div>

      <style>{`
        @keyframes mcq-float-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes mcq-float-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes mcq-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes mcq-twinkle { 0%, 100% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes mcq-shake { 0% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } 100% { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
