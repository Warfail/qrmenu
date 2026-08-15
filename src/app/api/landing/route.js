import { NextResponse } from "next/server";
import { getLandingCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collection = await getLandingCollection();
    const landing = await collection.findOne({ _id: "main" });

    if (!landing) {
      return NextResponse.json(
        {
          menu: [],
          settings: {
            title: "",
            description: "",
            whatsappNumber: "",
            googlePlaceId: "",
            avatar: "",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      menu: landing.menu || [],
      settings: landing.settings || {},
    });
  } catch (error) {
    console.error("GET /api/landing error:", error);
    return NextResponse.json(
      { error: "Failed to load landing page data" },
      { status: 500 }
    );
  }
}