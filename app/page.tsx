import Image from "next/image";

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "#0a0a0a" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          top: "-160px",
          right: "-160px",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, rgba(216,90,48,0.32) 0%, rgba(216,90,48,0) 65%)",
        }}
      />
      <div
        className="pointer-events-none absolute z-0"
        style={{
          bottom: "-100px",
          left: "-100px",
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, rgba(0,168,232,0.12) 0%, rgba(0,168,232,0) 65%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col flex-1 w-full max-w-2xl mx-auto"
        style={{ padding: "clamp(24px, 5vw, 64px) clamp(24px, 6vw, 72px)" }}
      >
        {/* Top row */}
        <div className="flex items-center gap-3" style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <Image
            src="/mascot.png"
            alt="BabyBillion mascot"
            width={36}
            height={36}
            style={{ objectFit: "contain", flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "1.8px",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
            }}
          >
            A concept for BabyBillion
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-inter-tight), sans-serif",
            fontSize: "clamp(48px, 10vw, 80px)",
            fontWeight: 600,
            lineHeight: 0.98,
            letterSpacing: "-2.4px",
            color: "#fff",
            margin: "0 0 20px",
          }}
        >
          From
          <br />
          watching
          <br />
          to <span style={{ color: "#F0997B" }}>doing</span>.
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            maxWidth: 320,
          }}
        >
          A concept for what an interactive learning layer could look like.
        </p>

        {/* Body section */}
        <div style={{ marginTop: 48 }}>
          <div
            style={{
              width: 28,
              height: 2,
              background: "#D85A30",
              marginBottom: 16,
              borderRadius: 1,
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-inter-tight), sans-serif",
              fontSize: "clamp(18px, 3vw, 22px)",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.95)",
              margin: 0,
              maxWidth: 320,
              letterSpacing: "-0.4px",
            }}
          >
            Kids stay for the watching.
            <br />
            Parents pay for the{" "}
            <span style={{ color: "#F0997B" }}>learning</span>.
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1" style={{ minHeight: 40 }} />

        {/* Footer */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              marginBottom: 16,
              letterSpacing: "0.1px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
              Sneeghdha
            </span>
            <span style={{ margin: "0 6px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Product manager</span>
            <span style={{ margin: "0 6px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Bengaluru</span>
          </p>

          <a
            href="/english"
            style={{
              background: "#D85A30",
              color: "#fff",
              border: "none",
              padding: "16px 22px",
              borderRadius: 100,
              fontFamily: "var(--font-inter-tight), sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              textDecoration: "none",
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 8px 24px rgba(216,90,48,0.35)",
              letterSpacing: "-0.2px",
            }}
          >
            <span>See the prototype</span>
            <span
              style={{
                width: 28,
                height: 28,
                background: "rgba(255,255,255,0.18)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </span>
          </a>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.32)",
              margin: "12px 0 0",
              textAlign: "center",
              letterSpacing: "0.2px",
            }}
          >
            4-minute walkthrough · imagined, not shipped
          </p>
        </div>
      </div>
    </main>
  );
}
