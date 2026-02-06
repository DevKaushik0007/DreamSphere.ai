const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  saveAiOutput,
  getAiHistory
} = require("../controllers/aiController");

const router = express.Router();

router.post("/", auth, saveAiOutput);
router.get("/", auth, getAiHistory);

module.exports = router;
