const express = require("express");
const router = express.Router();
const {
  saveSearch,
  getSearchHistory
} = require("../controllers/searchController");


router.post("/", saveSearch);
router.get("/", getSearchHistory);


module.exports = router;
