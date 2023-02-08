import express from "express";
const router = express.Router();

import { addHistory, deleteHistory } from "../controllers/historyController.js";

router.route("/").post(addHistory).get;
router.route("/:id").delete(deleteHistory);

export default router;
