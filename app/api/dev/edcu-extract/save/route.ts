import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

function devEnabled(): boolean {
  const v = String(process.env.DEV_TOOLS_ENABLED ?? process.env.DEV_TOOLS_ENABLE ?? "").toLowerCase();
  if (process.env.NODE_ENV === "development") return true; // allow in dev
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export async function POST(req: NextRequest) {
  if (!devEnabled()) {
    return new Response("Not enabled", { status: 404 });
  }
  try {
    const body = await req.json();
    const nameRaw = String(body?.name ?? "");
    const name = nameRaw.toLowerCase();
    const allowed = new Set(["home", "fuel", "lts"]);
    if (!allowed.has(name)) {
      return new Response("Invalid name", { status: 400 });
    }
    const dataUrl: string = String(body?.dataUrl ?? "");
    const prefix = "data:image/png;base64,";
    if (!dataUrl.startsWith(prefix)) {
      return new Response("Invalid data", { status: 400 });
    }
    const base64 = dataUrl.substring(prefix.length);
    const buf = Buffer.from(base64, "base64");

    const dir = path.join(process.cwd(), "public", "model-data", "AW169", "training", "edcu", "screens");
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${name}.png`);
    await fs.writeFile(filePath, buf);

    const publicPath = `/model-data/AW169/training/edcu/screens/${name}.png`;
    return new Response(JSON.stringify({ ok: true, path: publicPath }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Error saving image", { status: 500 });
  }
}

