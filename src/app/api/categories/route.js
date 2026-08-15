import { NextResponse } from "next/server";
import { getCategoriesCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collection = await getCategoriesCollection();
    const categories = await collection.find({}).sort({ name: 1 }).toArray();

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        icon: c.icon || "",
        description: c.description || "",
      })),
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}