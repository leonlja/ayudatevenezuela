import { NextRequest, NextResponse } from "next/server";
import { getTelegramBot } from "@/lib/telegram-bot";

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const gotSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (expectedSecret && expectedSecret !== gotSecret) {
    return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
  }

  const bot = getTelegramBot();
  if (!bot) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN missing" }, { status: 500 });
  }
  const update = await request.json();
  await bot.handleUpdate(update);
  return NextResponse.json({ ok: true });
}

// authored-by: gpt-5.3-codex
