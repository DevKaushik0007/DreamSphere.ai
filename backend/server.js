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

/* =========================
   ✅ DATABASE
========================= */
connectDB();

/* =========================
   ✅ MIDDLEWARES (ORDER MATTERS)
========================= */
app.use(express.json());

// ✅ CORS – PRODUCTION SAFE
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://dream-sphere-ai.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // allow requests with no origin (Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ MUST be before routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 THIS FIXES PREFLIGHT ERRORS

/* =========================
   ✅ ROUTES
========================= */
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// search / history (unchanged)
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/search", require("./routes/search"));

// contact
app.use("/api", contactRoute);

// web search
app.use("/api/web-search", webSearchRoutes);

/* =========================
   ✅ HEALTH CHECK (IMPORTANT)
========================= */
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running 🚀" });
});

/* =========================
   ✅ SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



