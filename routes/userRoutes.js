import express from "express";
const router = express.Router();

import {
  uploadUsers,
  updateUser,
  addUser,
  getAllUser,
  assignUser,
} from "../controllers/userController.js";

router.route("/add").patch(assignUser);
router.route("/").post(addUser).get(getAllUser);
router.route("/:id").patch(updateUser);
router.route("/upload").post(uploadUsers);

export default router;
