const express = require("express");
const {
  saveSearch,
  getSearchHistory
} = require("../controllers/searchController");

const router = express.Router();

router.post("/", saveSearch);
router.get("/", getSearchHistory);


module.exports = router;
