import express from "express";
const router = express.Router();

import {
  uploadLaptops,
  updateLaptop,
  addLaptop,
  getAllLaptops,
} from "../controllers/laptopController.js";

router.route("/").post(addLaptop).get(getAllLaptops);
router.route("/:id").patch(updateLaptop);
router.route("/upload").post(uploadLaptops);

export default router;
