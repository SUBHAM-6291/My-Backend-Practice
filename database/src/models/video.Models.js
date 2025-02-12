import mongoose, { Schema } from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const VideoSchema = new Schema(
  {
    videoFile: {
      type: String, // Fixed type
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: { // Fixed spelling
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Ensure this matches the user model's name
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);
VideoSchema.plugin(aggregatePaginate)
export const Video = mongoose.model("Video", VideoSchema);
