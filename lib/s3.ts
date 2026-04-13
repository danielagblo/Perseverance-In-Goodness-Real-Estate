import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 client
// If using AWS, region is required. If using custom endpoint (Minio/R2), endpoint is required.
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || undefined,
  forcePathStyle: !!process.env.AWS_ENDPOINT, // Required for many custom S3 providers
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const key = `properties/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Note: ACL 'public-read' is disabled by default on many S3 providers (AWS/R2).
    // It is safer to make the bucket public via Policy instead.
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct the public URL
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION || "us-east-1";
    const endpoint = process.env.AWS_ENDPOINT;

    if (endpoint) {
      // For R2/Minio etc, the public URL often differs from the API endpoint.
      // We'll try to guess a standard path-style URL, but user may need to provide a PUBLIC_DOMAIN env.
      return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
    }
    
    // Standard AWS S3 URL
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error("S3 UPLOAD FAILED:", error.message);
    throw new Error(`Cloud Storage Error: ${error.message}`);
  }
}

export default s3Client;
