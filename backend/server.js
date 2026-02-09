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

const app = express();

/* -------------------- DB -------------------- */
connectDB();

/* ------------------ MIDDLEWARE ------------------ */
app.use(express.json());
app.use(
  cors({
    origin: "*",   // 🔥 OPEN CORS (stable)
  })
);

/* ------------------ ROUTES ------------------ */
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// 🔹 SEARCH (WORKING BEFORE)
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/search", require("./routes/search"));

// 🔹 CONTACT
app.use("/api", require("./routes/contact.route"));

// 🔹 WEB SEARCH
app.use("/api/web-search", require("./routes/webSearch"));

/* ------------------ HEALTH CHECK ------------------ */
app.get("/", (req, res) => {
  res.send("DreamSphere backend running 🚀");
});

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

