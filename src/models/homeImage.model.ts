import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeImage extends Document {
  title: string;
  description: string;
  image: {
    data: Buffer;
    contentType: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HomeImageSchema = new Schema<IHomeImage>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IHomeImage>('HomeImage', HomeImageSchema);