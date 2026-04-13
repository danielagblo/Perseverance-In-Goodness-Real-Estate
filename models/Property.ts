import mongoose, { Schema, model, models } from 'mongoose';

export interface IMedia {
  url: string;
  type: 'image' | 'video';
}

export interface IProperty {
  _id?: mongoose.Types.ObjectId;
  title?: string;
  description?: string;
  price?: string;
  location?: string;
  media?: IMedia[];
  specs?: {
    beds?: number;
    baths?: number;
    area?: string;
    [key: string]: any;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: false },
    description: { type: String, required: false },
    price: { type: String, required: false },
    location: { type: String, required: false },
    media: [
      {
        url: { type: String, required: false },
        type: { type: String, enum: ['image', 'video'], required: false },
      },
    ],
    specs: {
      type: Map,
      of: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Property || model<IProperty>('Property', PropertySchema);
