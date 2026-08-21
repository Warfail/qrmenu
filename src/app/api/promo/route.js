import { NextResponse } from "next/server";
import { getSettingsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettingsCollection();
    const doc = await settings.findOne({ key: "promoText" });
    return NextResponse.json({ text: doc?.value?.trim() || "" });
  } catch (error) {
    console.error("GET /api/promo error:", error);
    return NextResponse.json({ text: "" });
  }
}