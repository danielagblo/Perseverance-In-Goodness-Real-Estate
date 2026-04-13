import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || undefined,
  forcePathStyle: !!process.env.AWS_ENDPOINT, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const bucket = process.env.AWS_S3_BUCKET!;
  const isImage = contentType.startsWith("image");

  let optimizedBuffer = file;
  let finalFileName = fileName;
  let finalContentType = contentType;

  if (isImage) {
    // Optimize with Sharp (matches Tres Jolie logic)
    optimizedBuffer = await sharp(file)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    
    // Change extension to webp
    finalFileName = `${fileName.split('.')[0]}.webp`;
    finalContentType = "image/webp";
  }

  const key = `uploads/${Date.now()}-${finalFileName.replace(/\s+/g, "-")}`;
  
  const params = {
    Bucket: bucket,
    Key: key,
    Body: optimizedBuffer,
    ContentType: finalContentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Return a relative Proxy URL for portability across domains
    return { url: `/api/images/${key}`, key };
  } catch (error: any) {
    console.error("S3 UPLOAD ERROR:", error.message);
    throw new Error(`Cloud Storage Error: ${error.message}`);
  }
}

// We keep this for the proxy route to fetch the private objects
export async function getS3Object(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });
  return await s3Client.send(command);
}

export default s3Client;
