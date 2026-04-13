import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT || undefined,
  // Force path style is often needed for custom S3 providers like Minio/R2
  forcePathStyle: !!process.env.AWS_ENDPOINT, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const bucket = process.env.AWS_S3_BUCKET!;
  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.AWS_ENDPOINT;
  const publicUrl = process.env.AWS_PUBLIC_URL;
  const key = `properties/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
  
  const getPublicUrl = () => {
    if (publicUrl) return `${publicUrl.replace(/\/$/, '')}/${key}`;
    if (endpoint) return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  };

  const params = {
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Re-adding public-read. 
    // IMPORTANT: Your S3 bucket must have "Block Public Access" DISABLED and "Object Ownership" set to "Bucket owner preferred" to allow this.
    ACL: 'public-read' as ObjectCannedACL,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return getPublicUrl();
  } catch (error: any) {
    console.error("S3 UPLOAD ERROR:", error.message);
    
    // If 'public-read' fails, try one more time without ACL 
    // (some buckets don't allow ACLs but allow public access via bucket policy)
    if (error.message.includes("Access Denied") || error.message.includes("Forbidden") || error.message.includes("Acl")) {
      console.log("ACL upload failed, attempting without ACL...");
      try {
        const { ACL, ...paramsWithoutAcl } = params;
        const command = new PutObjectCommand(paramsWithoutAcl);
        await s3Client.send(command);
        return getPublicUrl();
      } catch (retryError: any) {
        throw new Error(`Cloud Storage Error: ${retryError.message}`);
      }
    }
    throw new Error(`Cloud Storage Error: ${error.message}`);
  }
}

export default s3Client;
