import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
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
    
    // Construct the public URL (Note: this assumes the bucket is public or has a policy for public access)
    // If using CloudFront, this would be the CloudFront URL.
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export default s3Client;
