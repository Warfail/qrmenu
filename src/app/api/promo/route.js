import { NextResponse } from "next/server";
import { getSettingsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const FALLBACK_TEXT =
  "Open 24 Hours . VIP Studio . Big Screen . High Speed Wi-fi . Live Music . City View . Portable Skate Park";

export async function GET() {
  try {
    const settings = await getSettingsCollection();
    const doc = await settings.findOne({ key: "promoText" });
    const text = doc?.value?.trim();
    return NextResponse.json({ text: text || FALLBACK_TEXT });
  } catch (error) {
    console.error("GET /api/promo error:", error);
    return NextResponse.json({ text: FALLBACK_TEXT });
  }
}