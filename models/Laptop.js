import mongoose from "mongoose";

const Laptop = new mongoose.Schema({
  computerName: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  current_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  history: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assigned_from: {
        type: Date,
        default: Date.now,
      },
      assigned_to: Date,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

export default mongoose.model("Laptop", Laptop);