const AiOutput = require("../models/AiOutput");

exports.saveAiOutput = async (req, res) => {
  try {
    const { prompt, response, tool } = req.body;

    await AiOutput.create({
      userId: req.user,
      prompt,
      response,
      tool
    });

    res.json({ message: "AI output saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAiHistory = async (req, res) => {
  const data = await AiOutput.find({ userId: req.user }).sort({ createdAt: -1 });
  res.json(data);
};
