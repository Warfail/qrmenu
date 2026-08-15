import { NextResponse } from "next/server";
import { getLandingCollection } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collection = await getLandingCollection();
    const landing = await collection.findOne({ _id: "main" });

    return NextResponse.json({
      menu: landing?.menu || [],
      settings: landing?.settings || {},
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}