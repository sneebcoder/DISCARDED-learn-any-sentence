"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PhonicsScreen from "./PhonicsScreen";
import SuccessScreen from "./SuccessScreen";
import SoftPassScreen from "./SoftPassScreen";
import OppositesScreen from "./OppositesScreen";
import OppositesMCQScreen from "./OppositesMCQScreen";
import PrepositionsScreen from "./PrepositionsScreen";
import PrepositionsDragScreen from "./PrepositionsDragScreen";

const CARDS = [
  {
    section: "Phonics",
    title: 'The "P" sound',
    desc: "Learn how to say words that start with /p/.",
    pill: "+ say it",
    duration: "0:18",
    thumbClass: "phonics",
    videoSrc: "/lesson.mp4",
    goPractice: true,
    practiceModal: "phonics" as ModalState,
    badge: "1 practice activity",
    thumbContent: (
      <span style={{ fontFamily: "var(--font-fredoka)", color: "#fff", fontSize: 32, fontWeight: 700 }}>
        P p
      </span>
    ),
  },
  {
    section: "Opposites",
    title: "Up & Down",
    desc: "Spot what's the opposite of what.",
    pill: "+ match it",
    duration: "0:22",
    thumbClass: "opposites",
    videoSrc: "/opposites.mp4",
    goPractice: true,
    practiceModal: "opposites" as ModalState,
    badge: "2 practice activities",
    thumbContent: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity={0.9}>
        <path d="M7 14l5-5 5 5z" />
        <path d="M7 14l5 5 5-5z" />
      </svg>
    ),
  },
  {
    section: "Prepositions",
    title: "Near",
    desc: "Where is the cat? Drag to place it.",
    pill: "+ place it",
    duration: "0:20",
    thumbClass: "prepositions",
    videoSrc: "/prepositions.mp4",
    goPractice: true,
    practiceModal: "prepositions" as ModalState,
    badge: "2 practice activities",
    thumbContent: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity={0.9}>
        <rect x="4" y="14" width="16" height="6" rx="1" fill="white" />
        <circle cx="12" cy="9" r="3" fill="white" />
      </svg>
    ),
  },
];

const thumbGradients: Record<string, string> = {
  phonics: "linear-gradient(135deg, #4A90E2 0%, #1D9E75 100%)",
  opposites: "linear-gradient(135deg, #87CEEB 0%, #F4D5B5 100%)",
  prepositions: "linear-gradient(135deg, #C9B89C 0%, #8B7355 100%)",
  animals: "linear-gradient(135deg, #7BC142 0%, #4A7728 100%)",
};

function PracticeBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -6,
        right: -4,
        background: "#D85A30",
        color: "#fff",
        fontFamily: "var(--font-fredoka)",
        fontSize: 10,
        fontWeight: 600,
        padding: "5px 9px",
        borderRadius: 12,
        boxShadow: "0 3px 0 #993C1D",
        display: "flex",
        alignItems: "center",
        gap: 4,
        letterSpacing: "0.5px",
        zIndex: 2,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" />
      </svg>
      {label}
    </div>
  );
}

function VideoModal({ src, onClose, onEnded }: { src: string; onClose: () => void; onEnded: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 101,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Video */}
      <video
        src={src}
        controls
        autoPlay
        playsInline
        onEnded={onEnded}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          maxHeight: "85vh",
          borderRadius: 16,
          outline: "none",
        }}
      />
    </div>
  );
}

type ModalState = null | "video" | "phonics" | "success" | "softpass" | "opposites" | "opposites-mcq" | "prepositions" | "prepositions-drag";

export default function EnglishClient() {
  const [modal, setModal] = useState<ModalState>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [canDismiss, setCanDismiss] = useState(false);
  const activeCard = useRef<typeof CARDS[0] | null>(null);

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-baloo2), sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "sticky",
          top: 0,
          background: "#0a0a0a",
          zIndex: 10,
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Link
          href="/"
          style={{
            width: 38,
            height: 38,
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </Link>
        <h1
          style={{
            color: "#fff",
            fontFamily: "var(--font-fredoka)",
            fontSize: 22,
            fontWeight: 600,
            margin: 0,
          }}
        >
          English
        </h1>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px 100px",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Hero ABC tile — not clickable */}
        <div
          style={{
            background: "#FFD93D",
            borderRadius: 22,
            aspectRatio: "2.2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            marginTop: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 4, fontFamily: "var(--font-fredoka)", fontSize: "clamp(48px, 10vw, 72px)", fontWeight: 700, position: "relative", zIndex: 1 }}>
            <span style={{ color: "#4A90E2", transform: "rotate(-8deg)", display: "inline-block" }}>A</span>
            <span style={{ color: "#7BC142", transform: "rotate(4deg) translateY(2px)", display: "inline-block" }}>B</span>
            <span style={{ color: "#E91E63", transform: "rotate(-2deg)", display: "inline-block" }}>C</span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "70%",
              height: "38%",
              background: "#E91E63",
              borderRadius: "18px 18px 0 0",
            }}
          >
            <div style={{ position: "absolute", top: 8, left: 8, right: 8, bottom: 0, background: "#fff", borderRadius: "14px 14px 0 0" }} />
            <div style={{ position: "absolute", top: 0, left: "50%", width: 2, height: "80%", background: "rgba(0,0,0,0.08)" }} />
          </div>
        </div>

        {/* Cards */}
        {CARDS.map((card) => (
          <div key={card.section}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 12px" }}>
              <h2 style={{ color: "#fff", fontFamily: "var(--font-fredoka)", fontSize: 19, fontWeight: 600, margin: 0 }}>
                {card.section}
              </h2>
            </div>

            <div
              onClick={() => { activeCard.current = card; setModal("video"); }}
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 16,
                display: "flex",
                gap: 14,
                alignItems: "center",
                boxShadow: "0 5px 0 rgba(0,0,0,0.2)",
                marginBottom: 20,
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 0 rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 5px 0 rgba(0,0,0,0.2)";
              }}
            >
              <PracticeBadge label={card.badge} />

              <div
                style={{
                  width: 84,
                  height: 110,
                  borderRadius: 14,
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: thumbGradients[card.thumbClass],
                }}
              >
                {card.thumbContent}
                <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 8 }}>
                  {card.duration}
                </div>
                <div style={{ position: "absolute", bottom: 8, right: 8, width: 28, height: 28, background: "rgba(0,0,0,0.5)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="6,4 6,20 20,12" /></svg>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ color: "#2C2C2A", fontFamily: "var(--font-fredoka)", fontSize: 18, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.2 }}>
                  {card.title}
                </h3>
                <p style={{ color: "#5F5E5A", fontSize: 12, margin: "0 0 8px", lineHeight: 1.4 }}>
                  {card.desc}
                </p>
                <span style={{ background: "rgba(216,90,48,0.1)", color: "#D85A30", padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 600, fontFamily: "var(--font-fredoka)" }}>
                  {card.pill}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#0a0a0a",
          padding: "14px 0 20px",
          display: "flex",
          justifyContent: "space-around",
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3z" /></svg>
          <span style={{ fontFamily: "var(--font-fredoka)", fontSize: 10, fontWeight: 500, color: "#fff" }}>Home</span>
        </div>
      </div>

      {/* Video modal */}
      {modal === "video" && (
        <VideoModal
          src={activeCard.current?.videoSrc ?? "/lesson.mp4"}
          onClose={() => setModal(null)}
          onEnded={() => setModal(activeCard.current?.goPractice ? (activeCard.current.practiceModal ?? null) : null)}
        />
      )}

      {/* Phonics practice screen */}
      {modal === "phonics" && (
        <PhonicsScreen
          onClose={() => setModal(null)}
          onResult={(r) => setModal(r)}
        />
      )}

      {/* Result screens — siblings of PhonicsScreen so it fully unmounts */}
      {modal === "success" && (
        <SuccessScreen onClose={() => setModal(null)} onNext={() => setModal(null)} />
      )}
      {modal === "softpass" && (
        <SoftPassScreen onClose={() => setModal(null)} onNext={() => setModal(null)} />
      )}
      {modal === "opposites" && (
        <OppositesScreen onClose={() => setModal(null)} onNext={() => setModal("opposites-mcq")} />
      )}
      {modal === "opposites-mcq" && (
        <OppositesMCQScreen onClose={() => setModal(null)} />
      )}
      {modal === "prepositions" && (
        <PrepositionsScreen onClose={() => setModal(null)} onNext={() => setModal("prepositions-drag")} />
      )}
      {modal === "prepositions-drag" && (
        <PrepositionsDragScreen onClose={() => setModal(null)} />
      )}

      {/* Onboarding overlay */}
      {showOnboarding && (
        <div
          onClick={() => setShowOnboarding(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "0 16px 28px", backdropFilter: "blur(2px)",
            animation: "onb-fade-in 0.3s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1a1a1a", borderRadius: 24, padding: "22px 20px 20px",
              width: "100%", maxWidth: 648,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.4)",
              animation: "onb-slide-up 0.35s ease-out",
            }}
          >
            <p style={{ fontFamily: "var(--font-fredoka)", fontSize: 10, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#D85A30", margin: "0 0 10px" }}>
              How to use this prototype
            </p>
            <p style={{ fontFamily: "var(--font-baloo2), sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.65, color: "rgba(255,255,255,0.82)", margin: "0 0 8px" }}>
              After every reel, kids get a <strong style={{ color: "#fff", fontWeight: 600 }}>practice activity</strong> based on what they just watched. There are 3 here — <strong style={{ color: "#fff", fontWeight: 600 }}>phonics, opposites, and prepositions</strong> — each with a different interaction.
            </p>
            <p style={{ fontFamily: "var(--font-baloo2), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 8px", lineHeight: 1.5 }}>
              Watch the reel first, then do the activity.
            </p>
            <p style={{ fontFamily: "var(--font-baloo2), sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 18px" }}>
              🔊 Turn your volume up before you start.
            </p>
            <button
              onClick={canDismiss ? () => setShowOnboarding(false) : undefined}
              style={{
                background: "#9B3D1E", color: "#fff", border: "none", width: "100%",
                padding: "13px 20px", borderRadius: 100,
                fontFamily: "var(--font-fredoka)", fontSize: 15, fontWeight: 600,
                cursor: canDismiss ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, boxShadow: "0 4px 16px rgba(216,90,48,0.35)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Fill sweeps left → right */}
              <div
                onAnimationEnd={() => setCanDismiss(true)}
                style={{
                  position: "absolute", inset: 0,
                  background: "#D85A30",
                  width: "0%",
                  animation: "onb-progress 6s linear forwards",
                }}
              />
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                Got it, let&apos;s go
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes onb-fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes onb-slide-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes onb-progress { 0% { width: 0%; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
}
