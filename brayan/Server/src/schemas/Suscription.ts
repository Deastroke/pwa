import mongoose from "mongoose";
const { Schema } = mongoose;

const Subscription = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, ref: "User", required: true},
    endpoint: { type: String, required: true },
    expirationTime: { type: Date, default: null },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { collection: "Subscription" }
);

export default mongoose.model("Subscription", Subscription);