import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User", // Make sure "User" matches the actual model name
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } 
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
