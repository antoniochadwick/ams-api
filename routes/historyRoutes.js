import express from "express";
const router = express.Router();

import { addHistory, deleteHistory } from "../controllers/laptopController.js";

router.route("/").get(addHistory);
router.route("/:id").delete(deleteHistory);

export default router;
