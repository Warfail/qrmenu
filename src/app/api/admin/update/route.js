import { NextResponse } from "next/server";
import { getLandingCollection } from "@/lib/mongodb";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const validMenuTypes = ["link", "popup"];

function sanitizeMenu(menu) {
  if (!Array.isArray(menu)) return [];

  return menu
    .map((item, index) => {
      const type = validMenuTypes.includes(item?.type)
        ? item.type
        : "link";

      return {
        title: String(item?.title || "").trim(),
        link: String(item?.link || "").trim(),
        type,
        icon: String(item?.icon || "").trim(),
        order: typeof item?.order === "number" ? item.order : index,
      };
    })
    .filter((item) => item.title.length > 0);
}

function sanitizeSettings(settings) {
  const s = settings || {};
  return {
    title: String(s.title || "").trim(),
    description: String(s.description || "").trim(),
    whatsappNumber: String(s.whatsappNumber || "").trim(),
    googlePlaceId: String(s.googlePlaceId || "").trim(),
    avatar: String(s.avatar || "").trim(),
  };
}

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const menu = sanitizeMenu(body.menu);
    const settings = sanitizeSettings(body.settings);

    const collection = await getLandingCollection();

    await collection.updateOne(
      { _id: "main" },
      {
        $set: {
          menu,
          settings,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      menu,
      settings,
    });
  } catch (error) {
    console.error("POST /api/admin/update error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}