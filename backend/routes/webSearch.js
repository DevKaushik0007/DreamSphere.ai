const express = require("express");
const { webSearch } = require("../controllers/webSearchController");

const router = express.Router();

router.get("/", webSearch);

module.exports = router;
