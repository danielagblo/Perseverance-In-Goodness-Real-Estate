import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT, // Optional custom endpoint (e.g., for R2)
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `properties/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct the public URL
    // If a custom endpoint is used (like R2), we construct the URL differently
    const endpoint = process.env.AWS_ENDPOINT;
    if (endpoint) {
      // For R2 or custom providers, common path is endpoint/bucket/key
      // or a custom public domain if configured.
      return `${endpoint}/${process.env.AWS_S3_BUCKET}/${params.Key}`;
    }
    
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export default s3Client;
