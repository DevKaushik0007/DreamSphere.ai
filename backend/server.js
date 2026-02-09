// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const contactRoute = require("./routes/contact.route");
// const webSearchRoutes = require("./routes/webSearch");



// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use("/api/ai", require("./routes/aiRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/search", require("./routes/searchRoutes"));
// app.use("/api/search", require("./routes/search"));

// app.use("/api", contactRoute);
// app.use("/api/search", webSearchRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const contactRoute = require("./routes/contact.route");
const webSearchRoutes = require("./routes/webSearch");

const app = express();
connectDB();

// ✅ Middlewares first
app.use(
  cors({
    origin: [
      "https://dream-sphere-ai.vercel.app", // your Vercel frontend
      "http://localhost:5173",              // local dev (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Connect DB AFTER dotenv loaded

// Routes
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// existing search/history routes (DO NOT TOUCH)
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/search", require("./routes/search"));

app.use("/api", contactRoute);

// DuckDuckGo web search
app.use("/api/web-search", webSearchRoutes);

// Railway PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

