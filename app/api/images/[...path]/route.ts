import { getS3Object } from "@/lib/s3";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const key = path.join("/");

  try {
    const response = await getS3Object(key);

    if (!response.Body) {
      return new Response("Image not found", { status: 404 });
    }

    // Use transformToWebStream for compatibility with standard Response
    const stream = response.Body.transformToWebStream();

    return new Response(stream as BodyInit, {
      headers: {
        "Content-Type": response.ContentType || "image/webp",
        "Content-Length": response.ContentLength?.toString() || "",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("PROXY ERROR:", error);
    return new Response("Image not found", { status: 404 });
  }
}
