import express from "express";
const router = express.Router();

import {
  uploadLaptops,
  updateLaptop,
  addLaptop,
  getAllLaptops,
} from "../controllers/laptopController.js";

router.route("/laptop").post(addLaptop).get(getAllLaptops);
router.route("/laptop/:id").patch(updateLaptop);
router.route("/upload").post(uploadLaptops);

export default router;
