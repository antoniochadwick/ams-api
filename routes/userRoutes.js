import express from "express";
const router = express.Router();

import {
  uploadUser,
  updateUser,
  addUser,
  getAllUser,
} from "../controllers/userController.js";

router.route("/laptop").post(addUser).get(getAllUser);
router.route("/laptop/:id").patch(updateUser);
router.route("/upload").post(uploadUser);

export default router;
