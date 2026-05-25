"use client";

import { useState, useRef, useEffect } from "react";

interface OppositesScreenProps {
  onClose: () => void;
  onNext: () => void;
}

type MatchValue = "up" | "down";
type TileState = "idle" | "selected" | "correct" | "wrong";

export default function OppositesScreen({ onClose, onNext }: OppositesScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const a = new Audio("/opposites-question.mp3");
      audioRef.current = a;
      a.play().catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const tileAudio: Record<string, string> = {
    "word-up":    "/opposites-word-up.mp3",
    "word-down":  "/opposites-word-down.mp3",
    "arrow-up":   "/opposites-arrow-up.mp3",
    "arrow-down": "/opposites-arrow-down.mp3",
    "question":   "/opposites-question.mp3",
  };

  function playAudio(key: string, onEnded?: () => void) {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const a = new Audio(tileAudio[key]);
    audioRef.current = a;
    if (onEnded) a.addEventListener("ended", onEnded, { once: true });
    a.play().catch(() => { onEnded?.(); });
  }

  function handleSpeaker() { playAudio("question"); }
  const [wordStates, setWordStates] = useState<Record<MatchValue, TileState>>({ up: "idle", down: "idle" });
  const [arrowStates, setArrowStates] = useState<Record<MatchValue, TileState>>({ up: "idle", down: "idle" });
  const [celebrate, setCelebrate] = useState(false);
  // tracks which tile is currently selected: { type, value } or null
  const [selection, setSelection] = useState<{ type: "word" | "arrow"; value: MatchValue } | null>(null);

  function handleTileTap(type: "word" | "arrow", value: MatchValue) {
    const states = type === "word" ? wordStates : arrowStates;
    if (states[value] === "correct") return;

    // If tapping the same tile again, deselect it
    if (selection?.type === type && selection?.value === value) {
      setSelection(null);
      const setter = type === "word" ? setWordStates : setArrowStates;
      setter((prev) => ({ ...prev, [value]: "idle" }));
      return;
    }

    // If no selection yet, or tapping same type (switch selection within column)
    if (!selection || selection.type === type) {
      // deselect previous in same column if any
      const setter = type === "word" ? setWordStates : setArrowStates;
      setter((prev) => {
        const next = { ...prev };
        (Object.keys(next) as MatchValue[]).forEach((k) => { if (next[k] === "selected") next[k] = "idle"; });
        next[value] = "selected";
        return next;
      });
      playAudio(`${type}-${value}`);
      setSelection({ type, value });
      return;
    }

    // Selection exists and is a different type — attempt match
    const wordVal  = type === "word"  ? value : selection.value;
    const arrowVal = type === "arrow" ? value : selection.value;

    playAudio(`${type}-${value}`, () => {
      if (wordVal === arrowVal) {
        // correct
        new Audio("/yay.mp3").play().catch(() => {});
        const newWordStates  = { ...wordStates,  [wordVal]:  "correct" as TileState };
        const newArrowStates = { ...arrowStates, [arrowVal]: "correct" as TileState };
        setWordStates(newWordStates);
        setArrowStates(newArrowStates);
        setSelection(null);
        const allDone = (Object.values(newWordStates) as TileState[]).every((s) => s === "correct");
        if (allDone) setTimeout(() => { setCelebrate(true); setTimeout(() => setCelebrate(false), 800); }, 400);
      } else {
        // wrong — shake both, reset both
        new Audio("/wrong.mp3").play().catch(() => {});
        setWordStates((prev)  => { const n = { ...prev };  n[wordVal]  = "wrong"; return n; });
        setArrowStates((prev) => { const n = { ...prev };  n[arrowVal] = "wrong"; return n; });
        setTimeout(() => {
          setWordStates((prev)  => { const n = { ...prev };  n[wordVal]  = "idle"; return n; });
          setArrowStates((prev) => { const n = { ...prev };  n[arrowVal] = "idle"; return n; });
        }, 450);
        setSelection(null);
      }
    });
  }

  function tileBorder(state: TileState) {
    if (state === "selected") return "3px solid #7B1FA2";
    if (state === "correct") return "3px solid #1D9E75";
    if (state === "wrong") return "3px solid #E07B00";
    return "3px solid transparent";
  }

  function tileBoxShadow(state: TileState) {
    if (state === "selected") return "0 0 0 4px rgba(123,31,162,0.18), 0 6px 0 rgba(0,0,0,0.08)";
    if (state === "correct") return "0 0 0 6px rgba(29,158,117,0.22), 0 6px 0 rgba(0,0,0,0.08)";
    return "0 6px 0 rgba(0,0,0,0.08), 0 10px 20px rgba(0,0,0,0.05)";
  }

  const allCorrect = wordStates.up === "correct" && wordStates.down === "correct";

  // arrows shown scrambled: down first, up second
  const arrowOrder: MatchValue[] = ["down", "up"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: celebrate ? "#D9F3DD" : "#EDE7F6",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-baloo2), sans-serif",
        overflow: "hidden",
        transition: "background 0.4s ease",
      }}
    >
      {/* Background sparkles */}
      {[
        { top: 480, left: 16, size: 22, color: "#CE93D8", stroke: "#AB47BC", delay: "0s" },
        { top: 520, right: 18, size: 18, color: "#FFD93D", stroke: "#E8B500", delay: "0.4s" },
        { top: 580, left: 26, size: 14, color: "#90CAF9", stroke: "#42A5F5", delay: "0.8s" },
        { top: 620, right: 28, size: 16, color: "#CE93D8", stroke: "#AB47BC", delay: "0.2s" },
      ].map((s, i) => (
        <svg
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            ...(s.left !== undefined ? { left: s.left } : { right: (s as { right: number }).right }),
            pointerEvents: "none",
            zIndex: 0,
            animation: `opp-twinkle 2.2s ease-in-out infinite ${s.delay}`,
          }}
          width={s.size} height={s.size} viewBox="0 0 24 24"
        >
          <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill={s.color} stroke={s.stroke} strokeWidth="1.2" />
        </svg>
      ))}

      {/* Floating bubble */}
      <svg style={{ position: "absolute", bottom: 130, left: 14, pointerEvents: "none", zIndex: 0, animation: "opp-float 5s ease-in-out infinite 0.5s" }} width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="#E1BEE7" stroke="#CE93D8" strokeWidth="2" />
        <ellipse cx="9" cy="9" rx="2" ry="3" fill="#fff" opacity="0.6" />
      </svg>
      <svg style={{ position: "absolute", bottom: 180, right: 20, pointerEvents: "none", zIndex: 0, animation: "opp-float 4.5s ease-in-out infinite 1s" }} width="16" height="16" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="#BBDEFB" stroke="#90CAF9" strokeWidth="2" />
        <ellipse cx="9" cy="9" rx="2" ry="3" fill="#fff" opacity="0.6" />
      </svg>

      {/* Top bar */}
      <div style={{ padding: "16px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 5, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 20px 28px", gap: 20, position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Question card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)" }}>
          <button
            onClick={handleSpeaker}
            style={{ width: 46, height: 46, background: "#00A8E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 0 #0076A8", position: "relative", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2.5px solid #00A8E8", opacity: 0.5, animation: "opp-ring 1.6s ease-out infinite", pointerEvents: "none" }} />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
              <path d="M15.5 8.5 Q18 12 15.5 15.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 6 Q23 12 19 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <h2 style={{ fontFamily: "var(--font-fredoka)", fontSize: 19, fontWeight: 600, color: "#2C2C2A", margin: 0, lineHeight: 1.3 }}>
            Word ko image se match karo.
          </h2>
        </div>

        {/* Match grid */}
        <div style={{ width: "100%", display: "flex", gap: 16, justifyContent: "center" }}>

          {/* Arrow column (scrambled: down, up) — left side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {arrowOrder.map((val) => (
              <button
                key={val}
                onClick={() => handleTileTap("arrow", val)}
                style={{
                  height: 120, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fff", border: tileBorder(arrowStates[val]),
                  boxShadow: tileBoxShadow(arrowStates[val]),
                  cursor: arrowStates[val] === "correct" ? "default" : "pointer",
                  position: "relative",
                  animation: arrowStates[val] === "wrong" ? "opp-shake 0.4s ease-out" : arrowStates[val] === "selected" ? "opp-selected-pulse 1.2s ease-in-out infinite" : "none",
                  transition: "box-shadow 0.15s",
                }}
              >
                {val === "down" ? (
                  <svg width="64" height="72" viewBox="0 0 80 90">
                    <path d="M28 6 Q28 6 52 6 Q52 6 52 44 L66 44 L40 78 L14 44 L28 44 Z" fill="#5B9BD5" stroke="#1A5FA8" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="64" height="72" viewBox="0 0 80 90">
                    <path d="M52 84 Q52 84 28 84 Q28 84 28 46 L14 46 L40 12 L66 46 L52 46 Z" fill="#B97FD4" stroke="#7B1FA2" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                )}
                {arrowStates[val] === "correct" && (
                  <div style={{ position: "absolute", top: -10, right: -10, width: 28, height: 28, background: "#1D9E75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", zIndex: 3 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Word column — right side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {(["up", "down"] as MatchValue[]).map((val) => (
              <button
                key={val}
                onClick={() => handleTileTap("word", val)}
                style={{
                  height: 120, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fff", border: tileBorder(wordStates[val]),
                  boxShadow: tileBoxShadow(wordStates[val]),
                  cursor: wordStates[val] === "correct" ? "default" : "pointer",
                  position: "relative",
                  animation: wordStates[val] === "selected" ? "opp-selected-pulse 1.2s ease-in-out infinite" : "none",
                  transition: "box-shadow 0.15s",
                }}
              >
                <span style={{ fontFamily: "var(--font-fredoka)", fontSize: 32, fontWeight: 700, color: "#2C2C2A" }}>
                  {val.toUpperCase()}
                </span>
                {wordStates[val] === "correct" && (
                  <div style={{ position: "absolute", top: -10, right: -10, width: 28, height: 28, background: "#1D9E75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", zIndex: 3 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* Next CTA */}
        {allCorrect && (
          <button
            onClick={onNext}
            style={{
              width: "100%", background: "#1D9E75", color: "#fff", border: "none",
              borderRadius: 20, padding: "16px", fontFamily: "var(--font-fredoka)",
              fontSize: 20, fontWeight: 700, boxShadow: "0 6px 0 #0F6E56", cursor: "pointer",
            }}
          >
            Next
          </button>
        )}

      </div>

      <style>{`
        @keyframes opp-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes opp-twinkle {
          0%, 100% { opacity: 0.5; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(15deg); }
        }
        @keyframes opp-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes opp-selected-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(123,31,162,0.18), 0 6px 0 rgba(0,0,0,0.08); }
          50%       { box-shadow: 0 0 0 8px rgba(123,31,162,0.10), 0 6px 0 rgba(0,0,0,0.08); }
        }
        @keyframes opp-shake {
          0%   { transform: translateX(0); }
          20%  { transform: translateX(-8px); }
          40%  { transform: translateX(8px); }
          60%  { transform: translateX(-5px); }
          80%  { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
