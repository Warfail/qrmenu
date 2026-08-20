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
