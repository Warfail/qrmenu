import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

function getLandingUrl() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base.replace(/\/+$/, "")}/landing`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get("format") || "png").toLowerCase();

    const url = getLandingUrl();

    if (format === "svg") {
      const svg = await QRCode.toString(url, {
        type: "svg",
        margin: 2,
        width: 512,
        errorCorrectionLevel: "M",
      });

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": 'attachment; filename="landing-qr.svg"',
          "Cache-Control": "no-store",
        },
      });
    }

    // Default to PNG
    const pngBuffer = await QRCode.toBuffer(url, {
      type: "png",
      margin: 2,
      width: 1024,
      errorCorrectionLevel: "M",
    });

    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="landing-qr.png"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/qr error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}