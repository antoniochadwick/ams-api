import mongoose from "mongoose";

const History = new mongoose.Schema({
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  assigned_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date_updated: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("History", History);
