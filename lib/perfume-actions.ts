"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "./mongodb";
import Perfume from "@/models/Perfume";
import s3Client, { uploadToS3 } from "./s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function getPerfumes() {
  try {
    await dbConnect();
    const perfumes = await Perfume.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(perfumes));
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    return [];
  }
}

export async function createPerfume(formData: FormData) {
  try {
    await dbConnect();
  
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const mediaFiles = formData.getAll("media") as File[];
    
    const mediaItems = [];

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

    const perfume = new Perfume({
      title,
      description: description || undefined,
      price: price || undefined,
      media: mediaItems,
    });

    await perfume.save();
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating perfume:", error);
    return { success: false, error: error.message || "Failed to create perfume" };
  }
}

export async function updatePerfume(id: string, formData: FormData) {
  try {
    await dbConnect();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const mediaFiles = formData.getAll("media") as File[];
    const existingMediaRaw = formData.get("existingMedia") as string;
    const keptMedia = existingMediaRaw ? JSON.parse(existingMediaRaw) : [];
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
      media: mediaItems,
    };

    await Perfume.findByIdAndUpdate(id, updateData);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating perfume:", error);
    return { success: false, error: error.message || "Failed to update perfume" };
  }
}

export async function deletePerfume(id: string) {
  try {
    await dbConnect();
    const perfume = await Perfume.findById(id);
    if (!perfume) return { success: false, error: "Perfume not found" };

    if (perfume.media && perfume.media.length > 0) {
      for (const item of perfume.media) {
        if (item.key) {
          await s3Client.send(new DeleteObjectCommand({ 
            Bucket: process.env.AWS_S3_BUCKET!, 
            Key: item.key 
          }));
        }
      }
    }

    await Perfume.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting perfume:", error);
    return { success: false, error: error.message || "Failed to delete perfume" };
  }
}
