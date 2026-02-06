const express = require("express");
const router = express.Router();
const { webSearch } = require("../controllers/webSearchController");


router.get("/", webSearch);

module.exports = router;
