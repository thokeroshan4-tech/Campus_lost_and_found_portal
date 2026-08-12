import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, default: null },

    // open -> pending (claim submitted) -> approved (claim approved,
    // awaiting manual close) -> resolved (manually closed, removed from listings)
    status: {
      type: String,
      enum: ["open", "pending", "approved", "resolved"],
      default: "open",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Speeds up the browse/filter page (type + category + status queries)
itemSchema.index({ type: 1, category: 1, status: 1 });

// Enables keyword search on title/description
itemSchema.index({ title: "text", description: "text" });

const Item = mongoose.model("Item", itemSchema);
export default Item;
