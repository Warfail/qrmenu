import { NextResponse } from "next/server";
import { getSettingsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_CHAT_ID = process.env.TELEGRAM_OWNER_CHAT_ID;


