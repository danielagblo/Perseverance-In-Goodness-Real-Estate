"use server";

import dbConnect from "./mongodb";
import Property from "@/models/Property";
import s3Client, { uploadToS3 } from "./s3";
import { PutBucketPolicyCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function createProperty(formData: FormData) {
  try {
    await dbConnect();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const location = formData.get("location") as string;
    const mediaFiles = formData.getAll("media") as File[];
    
    const beds = formData.get("beds") ? Number(formData.get("beds")) : undefined;
    const baths = formData.get("baths") ? Number(formData.get("baths")) : undefined;
    const area = formData.get("area") as string;

    const mediaItems = [];

    for (const file of mediaFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // uploadToS3 now returns the Proxy URL
        const { url, key } = await uploadToS3(buffer, file.name, file.type);
        mediaItems.push({
          url,
          key,
          type: file.type.startsWith("video") ? "video" : "image",
        });
      }
    }

    const propertyData = {
      title: title || undefined,
      description: description || undefined,
      price: price || undefined,
      location: location || undefined,
      media: mediaItems,
      specs: {
        beds,
        baths,
        area: area || undefined,
      },
    };

    const property = await Property.create(propertyData);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, id: property._id.toString() };
  } catch (error) {
    console.error("Error creating property:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create property" };
  }
}

export async function updateProperty(id: string, formData: FormData) {
  await dbConnect();
  
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const location = formData.get("location") as string;
  const mediaFiles = formData.getAll("media") as File[];
  const existingMediaRaw = formData.get("existingMedia") as string;
  // Use the curated list of existing media sent from the UI (respects removed items)
  const keptMedia = existingMediaRaw ? JSON.parse(existingMediaRaw) : [];
  
  const beds = formData.get("beds") ? Number(formData.get("beds")) : undefined;
  const baths = formData.get("baths") ? Number(formData.get("baths")) : undefined;
  const area = formData.get("area") as string;

  try {
    // Start with kept existing media, then append any newly uploaded files
    const mediaItems = [...keptMedia];

    for (const file of mediaFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { url, key } = await uploadToS3(buffer, file.name, file.type);
        mediaItems.push({
          url,
          key,
          type: file.type.startsWith("video") ? "video" : "image",
        });
      }
    }

    const updateData: any = {
      title: title || undefined,
      description: description || undefined,
      price: price || undefined,
      location: location || undefined,
      media: mediaItems,
      specs: {
        beds,
        baths,
        area: area || undefined,
      },
    };

    await Property.findByIdAndUpdate(id, updateData);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating property:", error);
    return { success: false, error: error.message || "Failed to update property" };
  }
}

export async function getProperties() {
  await dbConnect();
  const properties = await Property.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(properties));
}

export async function getProperty(id: string) {
  await dbConnect();
  const property = await Property.findById(id);
  if (!property) return null;
  return JSON.parse(JSON.stringify(property));
}

export async function deleteProperty(id: string) {
  await dbConnect();
  try {
    const property = await Property.findById(id);
    
    // Delete from S3
    if (property?.media) {
      for (const item of property.media) {
        if (item.key) {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: item.key
          }));
        }
      }
    }

    await Property.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return { success: false, error: error.message || "Failed to delete property" };
  }
}

export async function makeBucketPublic() {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) return { success: false, error: "Bucket name missing" };

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };

  try {
    const command = new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy),
    });
    await s3Client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to set bucket policy:", error);
    return { success: false, error: error.message };
  }
}
