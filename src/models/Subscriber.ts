import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const SubscriberSchema: Schema = new Schema({

    email: { type: String, required: true, unique: true },
}, {
  timestamps: true
});
 
export default mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

