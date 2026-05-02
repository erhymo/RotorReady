import fs from "fs/promises";
import path from "path";

function devEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function GET() {
  if (!devEnabled()) {
    return new Response("Not enabled", { status: 404 });
  }
  try {
    const pdfPath = path.join(process.cwd(), "RFM AW169", "RFM Issue 3. Rev.1.pdf");
    const data = await fs.readFile(pdfPath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response("PDF not found", { status: 404 });
  }
}

