import { NextResponse } from "next/server";
import { getSettingsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;

function cleanPromo(lines) {
  // Bersihkan baris "#promo", potong "-" di awal baris, buang baris kosong
  return lines
    .filter((line) => {
      const t = line.trim();
      return t && !t.startsWith("#promo") && !t.startsWith("# PROMO");
    })
    .map((line) =>
      line
        .trim()
        .replace(/^-\s*/, "")
        .replace(/\s*-\s*$/, "")
        .trim()
    )
    .filter(Boolean);
}

async function sendTelegram(chatId, text) {
  if (!BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // abaikan error kirim balasan
  }
}

export async function POST(request) {
  // Verifikasi token saat testing (opsional — komentar karena header berbeda)
  // const auth = request.headers.get("x-telegram-bot-api-secret-token");
  // if (auth && auth !== BOT_TOKEN) {
  //   return NextResponse.json({ ok: false }, { status: 401 });
  // }

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

  console.log("Telegram update chatId:", chatId, "text:", text);

  // Hanya owner yang boleh update
  if (!OWNER_CHAT_ID || chatId !== String(OWNER_CHAT_ID)) {
    await sendTelegram(chatId, "⛔ Maaf, kamu tidak berhak mengubah promo.");
    return NextResponse.json({ ok: true });
  }

  if (!text || !text.toLowerCase().startsWith("#promo")) {
    await sendTelegram(chatId, "Gunakan format:\n#promo - event pertama\n- event kedua\n- event ketiga");
    return NextResponse.json({ ok: true });
  }

  const events = cleanPromo(text.split("\n"));
  if (events.length === 0) {
    await sendTelegram(chatId, "Tidak ada event yang valid. Gunakan format #promo diikuti daftar event.");
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
    await sendTelegram(chatId, `✅ Promo diperbarui:\n${promoText}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook DB error:", error);
    await sendTelegram(chatId, "❌ Gagal menyimpan promo ke database.");
