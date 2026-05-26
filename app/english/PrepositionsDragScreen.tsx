"use client";

import { useState, useEffect, useRef } from "react";

interface PrepositionsDragScreenProps {
  onClose: () => void;
}

export default function PrepositionsDragScreen({ onClose }: PrepositionsDragScreenProps) {
  const [solved, setSolved] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  const [dropCorrect, setDropCorrect] = useState(false);
  const [dropWrong, setDropWrong] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [catPixelPos, setCatPixelPos] = useState<{ x: number; y: number } | null>(null);

  const arenaRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDraggingRef = useRef(false);
  const solvedRef = useRef(false);
  const dragData = useRef<{ startCX: number; startCY: number; catLeft0: number; catTop0: number } | null>(null);
  const lastCatPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const a = new Audio("/prepositions-drag-question.mp3");
      audioRef.current = a;
      a.play().catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function handleSpeaker() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const a = new Audio("/prepositions-drag-question.mp3");
    audioRef.current = a;
    a.play().catch(() => {});
  }

  function isOverZoneAt(arenaX: number, arenaY: number) {
    const arena = arenaRef.current;
    const dz = dropZoneRef.current;
    if (!arena || !dz) return false;
    const ar = arena.getBoundingClientRect();
    const z = dz.getBoundingClientRect();
    return (ar.left + arenaX) > z.left && (ar.left + arenaX) < z.right &&
           (ar.top + arenaY) > z.top  && (ar.top + arenaY) < z.bottom;
  }

  function onPointerDown(e: React.MouseEvent | React.TouchEvent) {
    if (solvedRef.current) return;
    e.preventDefault();
    const arena = arenaRef.current;
    const cat = catRef.current;
    if (!arena || !cat) return;

    const touch = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const ar = arena.getBoundingClientRect();
    const cr = cat.getBoundingClientRect();
    const catLeft0 = cr.left - ar.left + cr.width / 2;
    const catTop0  = cr.top  - ar.top  + cr.height / 2;

    dragData.current = { startCX: touch.clientX, startCY: touch.clientY, catLeft0, catTop0 };
    lastCatPos.current = { x: catLeft0, y: catTop0 };
    isDraggingRef.current = true;
    setIsDragging(true);
    setCatPixelPos({ x: catLeft0, y: catTop0 });
  }

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!isDraggingRef.current || !dragData.current) return;
      e.preventDefault();
      const touch = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      const { startCX, startCY, catLeft0, catTop0 } = dragData.current;
      const newX = catLeft0 + touch.clientX - startCX;
      const newY = catTop0  + touch.clientY - startCY;
      lastCatPos.current = { x: newX, y: newY };
      setCatPixelPos({ x: newX, y: newY });
      setDropHover(isOverZoneAt(newX, newY));
    }

    function onUp() {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      setDropHover(false);

      const pos = lastCatPos.current;
      if (!pos) { setCatPixelPos(null); return; }

      if (isOverZoneAt(pos.x, pos.y)) {
        solvedRef.current = true;
        setSolved(true);
        setDropCorrect(true);

        // Snap to drop zone center (after one frame so transition fires)
        const arena = arenaRef.current;
        const dz = dropZoneRef.current;
        if (arena && dz) {
          const ar = arena.getBoundingClientRect();
          const dzr = dz.getBoundingClientRect();
          const snapX = dzr.left - ar.left + dzr.width / 2;
          const snapY = dzr.top  - ar.top  + dzr.height / 2;
          requestAnimationFrame(() => setCatPixelPos({ x: snapX, y: snapY }));
        }

        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        const yay = new Audio("/yay.mp3");
        yay.preload = "auto";
        audioRef.current = yay;
        yay.addEventListener("ended", () => {
          const correct = new Audio("/prepositions-correct.mp3");
          audioRef.current = correct;
          correct.addEventListener("ended", () => setNextEnabled(true), { once: true });
          correct.play().catch(() => setNextEnabled(true));
        }, { once: true });
        yay.play().catch(() => setNextEnabled(true));
      } else {
        setDropWrong(true);
        new Audio("/wrong.mp3").play().catch(() => {});
        setTimeout(() => {
          setDropWrong(false);
          setCatPixelPos(null);
          lastCatPos.current = null;
        }, 450);
      }
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const catStyle: React.CSSProperties = catPixelPos
    ? {
        position: "absolute",
        width: 80, height: 80,
        left: catPixelPos.x, top: catPixelPos.y,
        transform: "translate(-50%, -50%)",
        cursor: solved ? "default" : isDragging ? "grabbing" : "grab",
        touchAction: "none", zIndex: 10, userSelect: "none",
        filter: solved
          ? "drop-shadow(0 0 12px rgba(29,158,117,.9))"
          : isDragging
            ? "drop-shadow(0 8px 16px rgba(0,0,0,0.22))"
            : "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
        transition: "left 0.3s ease, top 0.3s ease",
      }
    : {
        position: "absolute",
        width: 80, height: 80,
        top: 44, left: "50%",
        transform: "translateX(-50%)",
        cursor: "grab", touchAction: "none", zIndex: 10, userSelect: "none",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
        animation: "prep-drag-cat-float 2.5s ease-in-out infinite",
      };

  const dropZoneStyle: React.CSSProperties = {
    position: "absolute",
    width: 82, height: 82,
    bottom: 90, left: "calc(50% + 10px)",
    borderRadius: 18,
    border: `3px dashed ${dropCorrect ? "#1D9E75" : dropHover ? "#E07B00" : "#CFD8DC"}`,
    background: dropCorrect ? "rgba(29,158,117,0.1)" : dropHover ? "rgba(224,123,0,0.08)" : "rgba(207,216,220,0.08)",
    zIndex: 1,
    transition: "border-color 0.2s, background 0.2s",
    animation: dropWrong ? "prep-drag-zone-shake 0.4s ease-out" : dropCorrect ? "prep-drag-zone-pop 0.5s ease-out" : "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#FFF8E7", zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "var(--font-baloo2), sans-serif", overflow: "hidden" }}>

      {/* Sparkles */}
      <svg style={{ position: "absolute", bottom: 80, left: 18, pointerEvents: "none", zIndex: 0, animation: "prep-drag-twinkle 2.2s ease-in-out infinite" }} width="18" height="18" viewBox="0 0 24 24">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFB74D" stroke="#F57C00" strokeWidth="1.2"/>
      </svg>
      <svg style={{ position: "absolute", bottom: 50, right: 22, pointerEvents: "none", zIndex: 0, animation: "prep-drag-twinkle 2.6s ease-in-out infinite 0.5s" }} width="14" height="14" viewBox="0 0 24 24">
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 16px 24px", gap: 16, position: "relative", zIndex: 2, maxWidth: 680, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* Question card */}
        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)" }}>
          <button onClick={handleSpeaker} style={{ width: 42, height: 42, background: "#00A8E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 0 #0076A8", position: "relative", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2.5px solid #00A8E8", opacity: 0.5, animation: "prep-drag-ring 1.6s ease-out infinite", pointerEvents: "none" }}/>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M15.5 8.5 Q18 12 15.5 15.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 6 Q23 12 19 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 style={{ fontFamily: "var(--font-fredoka)", fontSize: 17, fontWeight: 600, color: "#2C2C2A", margin: 0, lineHeight: 1.25 }}>
            cat ko box ke <span style={{ color: "#E07B00" }}>NEAR</span> rakho
          </h2>
        </div>

        {/* Arena */}
        <div ref={arenaRef} style={{ width: "100%", background: "#fff", borderRadius: 26, boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 24px rgba(0,0,0,0.05)", position: "relative", flex: 1, minHeight: 260, overflow: "visible" }}>

          {/* Box */}
          <div style={{ position: "absolute", bottom: 90, left: "calc(50% - 78px)", zIndex: 2, pointerEvents: "none" }}>
            <svg width="100" height="86" viewBox="0 0 100 86">
              <rect x="0" y="22" width="64" height="54" rx="5" fill="#FFB74D" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
              <path d="M0 22 L18 4 L82 4 L64 22 Z" fill="#FFCC80" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
              <path d="M64 22 L82 4 L82 58 L64 76 Z" fill="#F57C00" stroke="#BF360C" strokeWidth="3.5" strokeLinejoin="round"/>
              <line x1="32" y1="22" x2="50" y2="4" stroke="#E65100" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="22" x2="32" y2="76" stroke="#BF360C" strokeWidth="2" strokeDasharray="5,3" opacity="0.5"/>
            </svg>
          </div>

          {/* Drop zone */}
          <div ref={dropZoneRef} style={dropZoneStyle}/>

          {/* Cat */}
          <div ref={catRef} style={catStyle} onMouseDown={onPointerDown} onTouchStart={onPointerDown}>
            <svg width="80" height="80" viewBox="0 0 60 70" style={{ overflow: "visible" }}>
              <path d="M44 58 Q60 56 58 38 Q56 24 44 26" fill="none" stroke="#F57C00" strokeWidth="5" strokeLinecap="round"/>
              <path d="M44 58 Q60 56 58 38 Q56 24 44 26" fill="none" stroke="#FFB74D" strokeWidth="2.5" strokeLinecap="round"/>
              <ellipse cx="28" cy="46" rx="22" ry="18" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5"/>
              <ellipse cx="18" cy="60" rx="6" ry="5" fill="#FFB74D" stroke="#BF360C" strokeWidth="2"/>
              <ellipse cx="32" cy="61" rx="6" ry="5" fill="#FFB74D" stroke="#BF360C" strokeWidth="2"/>
              <circle cx="28" cy="22" r="20" fill="#FFB74D" stroke="#BF360C" strokeWidth="2.5"/>
              <path d="M11 10 L4 -4 L18 6 Z" fill="#FFB74D" stroke="#BF360C" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M45 10 L52 -4 L38 6 Z" fill="#FFB74D" stroke="#BF360C" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 9 L7 -1 L17 6 Z" fill="#FFCDD2"/>
              <path d="M44 9 L49 -1 L39 6 Z" fill="#FFCDD2"/>
              <ellipse cx="14" cy="26" rx="5" ry="3" fill="#FFCDD2" opacity="0.7"/>
              <ellipse cx="42" cy="26" rx="5" ry="3" fill="#FFCDD2" opacity="0.7"/>
              <ellipse cx="21" cy="18" rx="3.5" ry="4" fill="#1a1a1a"/>
              <ellipse cx="35" cy="18" rx="3.5" ry="4" fill="#1a1a1a"/>
              <circle cx="22" cy="17" r="1.2" fill="#fff"/>
              <circle cx="36" cy="17" r="1.2" fill="#fff"/>
              <path d="M25.5 27 L30 27 L27.5 30 Z" fill="#BF360C"/>
              <path d="M27.5 30 L27.5 32" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M27.5 32 Q23 35 20 33" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M27.5 32 Q32 35 35 33" fill="none" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="24" x2="18" y2="26" stroke="#BF360C" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="2" y1="29" x2="18" y2="28" stroke="#BF360C" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="37" y1="26" x2="53" y2="24" stroke="#BF360C" strokeWidth="1.2" strokeLinecap="round"/>
              <line x1="37" y1="28" x2="53" y2="29" stroke="#BF360C" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Hint */}
          {!solved && (
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", fontSize: 12, color: "rgba(95,94,90,0.55)", pointerEvents: "none" }}>
              Drag the cat to the dotted box
            </div>
          )}
        </div>

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
            transition: "background 0.3s, box-shadow 0.3s",
            marginTop: "auto",
          }}
        >
          Go Home
        </button>

      </div>

      <style>{`
        @keyframes prep-drag-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes prep-drag-twinkle { 0%, 100% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes prep-drag-cat-float { 0%, 100% { transform: translateX(-50%) translateY(0px); } 50% { transform: translateX(-50%) translateY(-10px); } }
        @keyframes prep-drag-zone-pop { 0% { box-shadow: 0 0 0 0 rgba(29,158,117,.6); } 100% { box-shadow: 0 0 0 14px rgba(29,158,117,0); } }
        @keyframes prep-drag-zone-shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-7px); } 40% { transform: translateX(7px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
}
