import { getS3Object } from "@/lib/s3";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Await params if using Next.js 15+ patterns, though standard App Router works with direct access
  const pathParts = await params.path;
  const key = pathParts.join("/");

  try {
    const response = await getS3Object(key);

    // Convert S3 stream to a web-supported Response
    // We use response.Body as a readable stream
    return new Response(response.Body as BodyInit, {
      headers: {
        "Content-Type": response.ContentType || "image/webp",
        // Aggressive caching (1 year)
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("PROXY ERROR:", error);
    return new Response("Image not found", { status: 404 });
  }
}
