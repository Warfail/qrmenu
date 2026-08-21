import { NextResponse } from "next/server";
import { getSettingsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

function cleanPromo(lines) {
  // Hapus baris "#promo", buang "-" di awal baris, saring baris kosong
  return lines
    .filter((line) => {
      const t = line.trim();
      return t && !t.toLowerCase().startsWith("#promo");
    })
    .map((line) => line.trim().replace(/^-\s*/, "").replace(/\s*-\s*$/, "").trim())
    .filter(Boolean);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const message = body?.message;
  if (!message) return NextResponse.json({ ok: true });

  const chatId = String(message?.chat?.id ?? "");
  const text = String(message?.text ?? "").trim();

  // Hanya owner yang diproses
  if (!OWNER_CHAT_ID || chatId !== String(OWNER_CHAT_ID)) {
    return NextResponse.json({ ok: true });
  }

  // Hanya pesan berawalan #promo
  if (!text || !text.toLowerCase().startsWith("#promo")) {
    return NextResponse.json({ ok: true });
  }

  const events = cleanPromo(text.split("\n"));
  if (events.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const promoText = events.join(" ● ");

  try {
    const settings = await getSettingsCollection();
    await settings.updateOne(
      { key: "promoText" },
      { $set: { value: promoText, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram route DB error:", error);
    return NextResponse.json({ ok: true }, { status: 500 });
  }
}