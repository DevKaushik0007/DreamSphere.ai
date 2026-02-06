const express = require("express");
const { saveSearch, getSearchHistory } = require("../controllers/searchController");

const router = express.Router();

router.post("/", saveSearch);       // 👈 NO auth middleware
router.get("/", getSearchHistory);  // 👈 optional

module.exports = router;
