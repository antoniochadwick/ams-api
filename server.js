import connectDB from "./db/connect.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

//routes imports
import laptopRoutes from "./routes/laptopRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

//routes
app.use("/laptop", laptopRoutes);
app.use("/history", historyRoutes);

app.use("/", (req, res) => {
  res.send("Hello from server side");
});

const start = () => {
  //db connections
  connectDB(process.env.MONGO_STRING);
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};
start();
