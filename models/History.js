import mongoose from "mongoose";

const History = new mongoose.Schema({
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  date_updated: {
    type: Date,
    default: Date.now,
  },
  property: {
    type: String,
    required: true,
  },
  old_value: {
    type: String,
    required: true,
  },
  new_value: {
    type: String,
    required: true,
  },
});

export default mongoose.model("History", History);
