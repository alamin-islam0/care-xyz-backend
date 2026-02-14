import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String,
      required: true
    },
    longDescription: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    chargePerHour: {
      type: Number,
      required: true
    },
    chargePerDay: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);
