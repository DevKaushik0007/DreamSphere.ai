// const { duckDuckGoSearch } = require("../services/duckduckgo");

// async function webSearch(req, res) {
//   const query = req.query.q;

//   if (!query) {
//     return res.status(400).json({ error: "Query is required" });
//   }

//   try {
//     const results = await duckDuckGoSearch(query);
//     res.json(results);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Web search failed" });
//   }
// }

// module.exports = { webSearch };


const { duckDuckGoSearch } = require("../services/duckduckgo");

exports.webSearch = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const results = await duckDuckGoSearch(q);
    res.status(200).json(results);
  } catch (err) {
    console.error("❌ Web search error:", err);
    res.status(500).json({ error: "Web search failed" });
  }
};
