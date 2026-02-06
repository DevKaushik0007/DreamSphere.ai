const Search = require("../models/Search");

/**
 * SAVE SEARCH (called from frontend)
 */
exports.saveSearch = async (req, res) => {
  try {
    const { query, platform, result, userId } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const search = await Search.create({
      userId: userId || null, // 👈 from frontend
      query,
      platform,
      result: result || null,
    });

    res.status(201).json(search);
  } catch (err) {
    console.error("Save search error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SEARCH HISTORY (optional, later)
 */
exports.getSearchHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    const data = await Search.find({ userId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
