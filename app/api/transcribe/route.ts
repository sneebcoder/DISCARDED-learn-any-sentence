import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const audioBuffer = await req.arrayBuffer();
  const rawMime = req.headers.get("content-type") || "audio/webm";
  const ext = rawMime.includes("mp4") ? "mp4" : rawMime.includes("ogg") ? "ogg" : "webm";

  const form = new FormData();
  form.append("model", "whisper-1");
  form.append("language", "en");
  form.append(
    "file",
    new Blob([audioBuffer], { type: rawMime }),
    `audio.${ext}`
  );

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const transcript: string = data.text ?? "";

  return NextResponse.json({ transcript });
}
