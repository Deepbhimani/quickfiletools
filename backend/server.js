import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

// Routes
import authRoutes      from "./routes/auth.js";
import toolsRoutes     from "./routes/tools.js";
import paymentsRoutes  from "./routes/payments.js";
import blogRoutes      from "./routes/blog.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes     from "./routes/admin.js";
import contactRoutes   from "./routes/contact.js";

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
// ✅ With this
const allowedOrigins = [
  "https://quickfiletools.xyz",
  "https://www.quickfiletools.xyz",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(globalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/tools",     toolsRoutes);
app.use("/api/payments",  paymentsRoutes);
app.use("/api/blog",      blogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/contact",   contactRoutes);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// ── Error handling ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
  );
}).catch((err) => {
  console.error("Failed to connect to DB:", err.message);
  process.exit(1);
});

export default app;