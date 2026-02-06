const { duckDuckGoSearch } = require("../services/duckduckgo");

async function webSearch(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const results = await duckDuckGoSearch(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Web search failed" });
  }
}

module.exports = { webSearch };
