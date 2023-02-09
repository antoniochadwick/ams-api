import express from "express";
const router = express.Router();

import {
  uploadUsers,
  updateUser,
  addUser,
  getAllUser,
} from "../controllers/userController.js";

router.route("/").post(addUser).get(getAllUser);
router.route("/:id").patch(updateUser);
router.route("/upload").post(uploadUsers);

export default router;
