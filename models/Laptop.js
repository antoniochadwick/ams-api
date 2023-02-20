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
  serial_number: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  date_added: {
    type: Date,
    required: true,
  },
  assign_date: {
    type: Date,
  },
  current_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
      required: true,
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
