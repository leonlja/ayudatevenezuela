import { Bot, Context, InlineKeyboard, Keyboard } from "grammy";
import { CATEGORIES, URGENCIES, ZONES } from "@/lib/categories";
import { supabaseAdmin } from "@/lib/supabase";
import { fuzzCoord } from "@/lib/geo";

type SessionState = {
  step: "category" | "urgency" | "zone" | "description";
  category?: string;
  urgency?: string;
  zone?: string;
  lat_exact?: number;
  lng_exact?: number;
};

const memory = new Map<number, SessionState>();

async function getSession(userId: number): Promise<SessionState | null> {
  const cached = memory.get(userId);
  if (cached) return cached;

  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from("telegram_sessions")
    .select("state")
    .eq("user_id", userId)
    .single();
  if (data) {
    const state = data.state as SessionState;
    memory.set(userId, state);
    return state;
  }
  return null;
}

async function setSession(userId: number, state: SessionState): Promise<void> {
  memory.set(userId, state);
  if (supabaseAdmin) {
    await supabaseAdmin
      .from("telegram_sessions")
      .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  }
}

async function deleteSession(userId: number): Promise<void> {
  memory.delete(userId);
  if (supabaseAdmin) {
    await supabaseAdmin.from("telegram_sessions").delete().eq("user_id", userId);
  }
}

export function getTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  const bot = new Bot(token);

  const startFlow = async (ctx: Context) => {
    if (!ctx.from) return;
    await setSession(ctx.from.id, { step: "category" });
    const keyboard = new InlineKeyboard();
    CATEGORIES.forEach((cat) => keyboard.text(cat.label, `cat:${cat.value}`).row());
    await ctx.reply("Selecciona categoria de ayuda:", { reply_markup: keyboard });
  };

  bot.command("start", startFlow);
  bot.command("ayuda", startFlow);

  bot.on("callback_query:data", async (ctx) => {
    if (!ctx.from) return;
    const state = await getSession(ctx.from.id);
    if (!state) {
      await ctx.answerCallbackQuery({ text: "Escribe /ayuda para empezar" });
      return;
    }

    const data = ctx.callbackQuery.data;
    if (data.startsWith("cat:")) {
      state.category = data.replace("cat:", "");
      state.step = "urgency";
      await setSession(ctx.from.id, state);
      const keyboard = new InlineKeyboard();
      URGENCIES.forEach((item) => keyboard.text(item.label, `urg:${item.value}`).row());
      await ctx.reply("Selecciona urgencia:", { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    }

    if (data.startsWith("urg:")) {
      state.urgency = data.replace("urg:", "");
      state.step = "zone";
      await setSession(ctx.from.id, state);
      const keyboard = new InlineKeyboard();
      ZONES.forEach((zone) => keyboard.text(zone, `zone:${zone}`).row());
      await ctx.reply("Selecciona zona:", { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
      return;
    }

    if (data.startsWith("zone:")) {
      state.zone = data.replace("zone:", "");
      state.step = "description";
      await setSession(ctx.from.id, state);
      await ctx.reply("Comparte ubicacion (opcional) y luego describe la situacion.", {
        reply_markup: new Keyboard().requestLocation("Compartir ubicacion").resized(),
      });
      await ctx.answerCallbackQuery();
      return;
    }
  });

  bot.on("message:text", async (ctx) => {
    if (!ctx.from) return;
    const state = await getSession(ctx.from.id);
    if (!state || state.step !== "description") return;
    const description = ctx.message?.text ?? "";
    const fuzzy =
      state.lat_exact && state.lng_exact ? fuzzCoord(state.lat_exact, state.lng_exact) : { lat: null, lng: null };

    if (!supabaseAdmin) {
      await ctx.reply("Error interno: base de datos no disponible.");
      return;
    }

    const hasLocation = state.lat_exact != null && state.lng_exact != null;
    const { error } = await supabaseAdmin.from("reports").insert({
      zone: state.zone || "Otro",
      address: null,
      lat: fuzzy.lat,
      lng: fuzzy.lng,
      lat_exact: state.lat_exact ?? null,
      lng_exact: state.lng_exact ?? null,
      category: state.category || "otro",
      urgency: state.urgency || "media",
      people_count: 1,
      description,
      contact_name: ctx.from?.first_name ?? null,
      contact_phone: null,
      status: "pending",
      source: "telegram",
      telegram_username: ctx.from?.username ?? null,
      ip_hash: "telegram",
      device_id: `tg-${ctx.from?.id ?? "unknown"}`,
      location_source: hasLocation ? "gps" : "none",
    });

    if (error) {
      await ctx.reply("Error al guardar el reporte. Intenta de nuevo con /ayuda.");
      return;
    }

    await deleteSession(ctx.from.id);
    await ctx.reply("Gracias. Tu reporte fue recibido y guardado.");
  });

  bot.on("message:location", async (ctx) => {
    if (!ctx.from) return;
    const state = await getSession(ctx.from.id);
    if (!state) return;
    await setSession(ctx.from.id, {
      ...state,
      lat_exact: ctx.message.location.latitude,
      lng_exact: ctx.message.location.longitude,
    });
    await ctx.reply("Ubicacion recibida. Ahora describe la situacion.");
  });

  return bot;
}

// authored-by: claude-opus-4-7
