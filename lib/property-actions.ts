"use server";

import dbConnect from "./mongodb";
import Property from "@/models/Property";
import { uploadToS3 } from "./s3";
import { revalidatePath } from "next/cache";

export async function createProperty(formData: FormData) {
  await dbConnect();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const location = formData.get("location") as string;
  const mediaFiles = formData.getAll("media") as File[];
  
  const beds = formData.get("beds") ? Number(formData.get("beds")) : undefined;
  const baths = formData.get("baths") ? Number(formData.get("baths")) : undefined;
  const area = formData.get("area") as string;

  const mediaUrls = [];

  for (const file of mediaFiles) {
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadToS3(buffer, file.name, file.type);
      mediaUrls.push({
        url,
        type: file.type.startsWith("video") ? "video" : "image",
      });
    }
  }

  const propertyData = {
    title: title || undefined,
    description: description || undefined,
    price: price || undefined,
    location: location || undefined,
    media: mediaUrls,
    specs: {
      beds,
      baths,
      area: area || undefined,
    },
  };

  try {
    const property = await Property.create(propertyData);
    revalidatePath("/");
    return { success: true, id: property._id.toString() };
  } catch (error) {
    console.error("Error creating property:", error);
    return { success: false, error: "Failed to create property" };
  }
}

export async function getProperties() {
  await dbConnect();
  const properties = await Property.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(properties));
}

export async function deleteProperty(id: string) {
  await dbConnect();
  try {
    await Property.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false };
  }
}
