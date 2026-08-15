import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminsCollection } from "@/lib/mongodb";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const collection = await getAdminsCollection();
    const admin = await collection.findOne({ _id: "main" });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found. Run `npm run seed` first." },
        { status: 500 }
      );
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    await setSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}