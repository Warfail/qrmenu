import { NextResponse } from "next/server";
import { getProductsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();

    const collection = await getProductsCollection();

    const query = {};
    if (category && category !== "All" && category !== "") {
      query.category = category;
    }

    const products = await collection.find(query).toArray();

    return NextResponse.json({
      category: category || "All",
      count: products.length,
      products: products.map((p) => ({
        id: p._id.toString(),
        name: p.name || "",
        category: p.category || "",
        code: p.code || "",
        price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
        stock: typeof p.stock === "number" ? p.stock : Number(p.stock) || 0,
      })),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
