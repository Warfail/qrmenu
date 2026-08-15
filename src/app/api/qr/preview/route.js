import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

function getLandingUrl() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base.replace(/\/+$/, "")}/landing`;
}

export async function GET() {
  try {
    const url = getLandingUrl();

    const dataUrl = await QRCode.toDataURL(url, {
      type: "image/png",
      margin: 2,
      width: 512,
      errorCorrectionLevel: "M",
    });

    return NextResponse.json({
      dataUrl,
      url,
    });
  } catch (error) {
    console.error("GET /api/qr/preview error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR preview" },
      { status: 500 }
    );
  }
}