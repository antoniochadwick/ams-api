import mongoose from "mongoose";

const Comment = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laptop",
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export default Comment;
