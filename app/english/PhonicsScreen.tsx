"use client";

import { useEffect, useRef, useState } from "react";

type MicState = "idle" | "recording" | "processing";

interface PhonicsScreenProps {
  onClose: () => void;
  onResult: (r: "success" | "softpass") => void;
}

const SILENCE_THRESHOLD = 10;    // RMS below this = silence
const SILENCE_DURATION_MS = 1800; // stop after this much continuous silence
const VOICE_THRESHOLD = 18;       // RMS above this = voice detected

export default function PhonicsScreen({ onClose, onResult }: PhonicsScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const [micState, setMicState] = useState<MicState>("idle");
  const micStateRef = useRef<MicState>("idle");
  const [debugHeard, setDebugHeard] = useState<string>("");
  const [debugError, setDebugError] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setMic(s: MicState) {
    micStateRef.current = s;
    setMicState(s);
  }

  function handleWordPlay() {
    if (!wordAudioRef.current) {
      wordAudioRef.current = new Audio("/phonics-word.mp3");
    }
    const word = wordAudioRef.current;
    word.currentTime = 0;
    word.play().catch(() => {});
  }

  useEffect(() => {
    const audio = new Audio("/phonics-instruction.mp3");
    audio.preload = "auto";
    audioRef.current = audio;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);

    const timer = setTimeout(() => {
      setIsPlaying(true);
      audio.play().catch(() => setIsPlaying(false));
    }, 2000);
    autoPlayTimerRef.current = timer;

    return () => {
      clearTimeout(timer);
      autoPlayTimerRef.current = null;
      audio.pause();
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function handleSpeakerClick() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audio.play().catch(() => setIsPlaying(false));
    }
  }

  function stopRecording() {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  async function handleMicTap() {
    if (micStateRef.current !== "idle") return;

    // Kill auto-play timer and stop all audio before recording so speaker output
    // doesn't bleed into the mic and get transcribed as the target word
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    if (wordAudioRef.current) {
      wordAudioRef.current.pause();
      wordAudioRef.current.currentTime = 0;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      alert("Microphone access is required. Please allow it and try again.");
      return;
    }

    // Set up AudioContext for silence detection
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      audioCtx.close();
      setMic("processing");
      setDebugError("");

      // Strip codec suffix — Deepgram only wants "audio/webm", not "audio/webm;codecs=opus"
      const rawMime = recorder.mimeType || "audio/webm";
      const contentType = rawMime.split(";")[0] || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: contentType });
      setDebugHeard(`recording: ${blob.size}b`);

      try {
        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: blob,
          headers: { "Content-Type": contentType },
        });
        const json = await res.json();
        if (!res.ok) {
          setDebugError(`API error ${res.status}: ${JSON.stringify(json)}`);
          setMic("idle");
          return;
        }
        const transcript: string = json.transcript ?? "";
        const clean = transcript.toLowerCase().trim().replace(/[^a-z\s]/g, "");
        setDebugHeard(`heard: "${clean}"`);
        const words = clean.split(/\s+/);
        const correct = words.some(w => ["pen", "pens", "pin"].includes(w));

        // Stop instruction audio before showing result screen
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        }

        onResult(correct ? "success" : "softpass");
      } catch (e) {
        setDebugError(`Fetch failed: ${String(e)}`);
        setMic("idle");
      }
    };

    recorder.start();
    setMic("recording");

    let hasSpoken = false;

    // Silence detection loop — only kicks in after voice is first detected
    function detectSilence() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = (dataArray[i] - 128) / 128;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / dataArray.length) * 100;

      if (!hasSpoken) {
        // Wait until we hear actual voice before starting silence detection
        if (rms > VOICE_THRESHOLD) hasSpoken = true;
      } else {
        if (rms < SILENCE_THRESHOLD) {
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              stopRecording();
            }, SILENCE_DURATION_MS);
          }
        } else {
          // Voice still going — reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
      }

      if (micStateRef.current === "recording") {
        animFrameRef.current = requestAnimationFrame(detectSilence);
      }
    }

    animFrameRef.current = requestAnimationFrame(detectSilence);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (wordAudioRef.current) {
        wordAudioRef.current.pause();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#FFF3D1",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-baloo2), sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Floating background elements */}
      <svg
        style={{ position: "absolute", top: 100, left: -10, animation: "float-slow 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }}
        width="80" height="50" viewBox="0 0 80 50"
      >
        <ellipse cx="22" cy="32" rx="18" ry="14" fill="#fff" opacity="0.9" />
        <ellipse cx="40" cy="26" rx="22" ry="18" fill="#fff" opacity="0.9" />
        <ellipse cx="58" cy="32" rx="18" ry="14" fill="#fff" opacity="0.9" />
      </svg>
      <svg
        style={{ position: "absolute", top: 160, right: -15, animation: "float-slow 7s ease-in-out infinite 1s", pointerEvents: "none", zIndex: 0 }}
        width="70" height="44" viewBox="0 0 80 50"
      >
        <ellipse cx="22" cy="32" rx="18" ry="14" fill="#fff" opacity="0.85" />
        <ellipse cx="40" cy="26" rx="22" ry="18" fill="#fff" opacity="0.85" />
        <ellipse cx="58" cy="32" rx="18" ry="14" fill="#fff" opacity="0.85" />
      </svg>
      <svg
        style={{ position: "absolute", top: 380, right: 16, animation: "twinkle 3s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }}
        width="22" height="22" viewBox="0 0 24 24"
      >
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FFD93D" stroke="#E8B500" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg
        style={{ position: "absolute", top: 340, left: 16, animation: "twinkle 3s ease-in-out infinite 0.8s", pointerEvents: "none", zIndex: 0 }}
        width="18" height="18" viewBox="0 0 24 24"
      >
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#FF9EB5" stroke="#D85A8C" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg
        style={{ position: "absolute", bottom: 200, right: 24, animation: "twinkle 3s ease-in-out infinite 1.5s", pointerEvents: "none", zIndex: 0 }}
        width="22" height="22" viewBox="0 0 24 24"
      >
        <polygon points="12,2 14.5,9 22,9 16,13.5 18.5,21 12,16.5 5.5,21 8,13.5 2,9 9.5,9" fill="#A8E1FF" stroke="#5DAEDC" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg
        style={{ position: "absolute", bottom: 180, left: 22, animation: "float-slow 5s ease-in-out infinite 0.5s", pointerEvents: "none", zIndex: 0 }}
        width="24" height="24" viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" fill="#B8E5C0" stroke="#7BC796" strokeWidth="2" />
        <ellipse cx="9" cy="9" rx="2" ry="3" fill="#fff" opacity="0.6" />
      </svg>

      {/* Top bar */}
      <div
        style={{
          padding: "16px 20px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 5,
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            background: "#fff",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 3px 0 rgba(0,0,0,0.08)",
            cursor: "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" strokeWidth="3" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        {/* Language toggle */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 4, display: "flex", boxShadow: "0 3px 0 rgba(0,0,0,0.08)" }}>
          <div style={{ background: "#00A8E8", color: "#fff", padding: "4px 10px", borderRadius: 16, fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>EN</div>
          <div style={{ color: "#5F5E5A", padding: "4px 10px", fontFamily: "var(--font-fredoka)", fontSize: 12, fontWeight: 600 }}>हिं</div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "4px 24px 24px",
          gap: 24,
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Word card */}
        <div
          style={{
            width: "100%",
            background: "#fff",
            borderRadius: 28,
            padding: "24px 20px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 6px 0 rgba(0,0,0,0.08), 0 12px 30px rgba(0,0,0,0.06)",
            position: "relative",
          }}
        >
          {/* Speaker button */}
          <button
            onClick={handleSpeakerClick}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 46,
              height: 46,
              background: "#00A8E8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 0 #0086BB",
              zIndex: 2,
              cursor: "pointer",
              border: "none",
              padding: 0,
            }}
          >
            {/* Pulse ring — only animates while playing */}
            {isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: -7,
                  borderRadius: "50%",
                  border: "3px solid #00A8E8",
                  opacity: 0.5,
                  animation: "ring-pulse 1.4s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
            )}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
              <path d="M15.5 8.5 Q18 12 15.5 15.5" fill="none" strokeLinecap="round" />
              <path d="M18.5 6 Q23 12 18.5 18" fill="none" strokeLinecap="round" />
            </svg>
          </button>

          {/* Pen illustration */}
          <div style={{ width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, animation: "gentle-bob 3s ease-in-out infinite" }}>
            <svg width="170" height="170" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
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

          {/* Word + play button row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, position: "relative", width: "100%" }}>
            <button
              onClick={handleWordPlay}
              style={{
                width: 42,
                height: 42,
                background: "#1D9E75",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 0 #0F6E56",
                position: "absolute",
                left: "calc(50% - 105px)",
                paddingLeft: 3,
                cursor: "pointer",
                flexShrink: 0,
                border: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="6,4 6,20 20,12" />
              </svg>
            </button>
            <h2
              style={{
                color: "#2C2C2A",
                fontFamily: "var(--font-fredoka)",
                fontSize: "clamp(44px, 12vw, 56px)",
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              pen
            </h2>
          </div>
        </div>

        {/* Mic section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
          <div style={{ position: "relative", width: 230, height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>

            {/* Outer halo — only shown when mic is active */}
            <div style={{
              position: "absolute", inset: 0,
              background: micState === "recording" ? "#FFBBBB" : "#FAD0BB",
              borderRadius: "50%",
              opacity: isPlaying ? 0 : 1,
              transition: "opacity 0.5s",
              animation: !isPlaying && micState === "idle"
                ? "mic-halo-outer 2.2s ease-in-out infinite"
                : micState === "recording"
                ? "mic-recording 1s ease-in-out infinite"
                : "none",
            }} />
            {/* Inner halo */}
            <div style={{
              position: "absolute", inset: 22,
              background: micState === "recording" ? "#FF9999" : "#F5A988",
              borderRadius: "50%",
              opacity: isPlaying ? 0 : 1,
              transition: "opacity 0.5s",
              animation: !isPlaying && micState === "idle"
                ? "mic-halo-inner 2.2s ease-in-out infinite 0.3s"
                : "none",
            }} />

            {/* Mic button */}
            <button
              onClick={handleMicTap}
              disabled={isPlaying || micState === "processing"}
              style={{
                position: "relative",
                width: 160,
                height: 160,
                background: isPlaying || micState === "processing"
                  ? "linear-gradient(180deg, #bbb 0%, #999 100%)"
                  : micState === "recording"
                  ? "linear-gradient(180deg, #e84040 0%, #c0201f 100%)"
                  : "linear-gradient(180deg, #E66E42 0%, #D85A30 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isPlaying || micState === "processing"
                  ? "0 8px 0 #777, 0 14px 24px rgba(0,0,0,0.15)"
                  : micState === "recording"
                  ? "0 8px 0 #8a1010, 0 14px 24px rgba(216,48,48,0.45)"
                  : "0 8px 0 #993C1D, 0 14px 24px rgba(216,90,48,0.4)",
                border: "4px solid #fff",
                cursor: isPlaying || micState === "processing" ? "default" : "pointer",
                transition: "background 0.4s, box-shadow 0.4s",
              }}
            >
              {micState === "processing" ? (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <svg width="82" height="82" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10v2a7 7 0 0 0 14 0v-2" fill="none" strokeWidth="2.3" />
                  <line x1="12" y1="19" x2="12" y2="22" strokeWidth="2.3" />
                </svg>
              )}
            </button>
          </div>

          {/* Label */}
          <p style={{
            fontFamily: "var(--font-fredoka)", fontSize: 14, marginTop: 12,
            color: isPlaying ? "#C8A882" : "#B87340",
            opacity: micState === "idle" ? 1 : 0,
            transition: "opacity 0.2s, color 0.4s",
          }}>
            {isPlaying ? "Listen first..." : "Tap and say the word!"}
          </p>

          {/* DEBUG — remove before shipping */}
          {debugHeard && (
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#888", marginTop: 6, background: "rgba(0,0,0,0.06)", padding: "4px 10px", borderRadius: 8, maxWidth: 300, wordBreak: "break-all", textAlign: "center" }}>
              {debugHeard}
            </p>
          )}
          {debugError && (
            <p style={{ fontFamily: "monospace", fontSize: 11, color: "#c00", marginTop: 4, background: "rgba(255,0,0,0.07)", padding: "4px 10px", borderRadius: 8, maxWidth: 300, wordBreak: "break-all", textAlign: "center" }}>
              {debugError}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
