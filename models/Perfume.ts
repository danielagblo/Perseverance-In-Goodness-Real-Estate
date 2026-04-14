import mongoose, { Schema, Document, models } from "mongoose";

export interface IPerfume extends Document {
  title: string;
  price?: string;
  description?: string;
  media: {
    url: string;
    key: string;
    type: string;
  }[];
  createdAt: Date;
}

const PerfumeSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String },
    description: { type: String },
    media: [
      {
        url: String,
        key: String,
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Perfume = models.Perfume || mongoose.model<IPerfume>("Perfume", PerfumeSchema);
