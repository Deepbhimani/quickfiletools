import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB }      from "./config/db.js";
import { globalLimiter }  from "./middleware/rateLimiter.js";
import errorHandler        from "./middleware/errorHandler.js";

// ── Routes ────────────────────────────────────────────────────────────────────
import toolsRoutes    from "./routes/tools.js";
import blogRoutes     from "./routes/blog.js";
import contactRoutes  from "./routes/contact.js";

// ── PRO VERSION ROUTES (commented out for free version) ──────────────────────
// import authRoutes      from "./routes/auth.js";
// import paymentsRoutes  from "./routes/payments.js";
// import analyticsRoutes from "./routes/analytics.js";
// import adminRoutes     from "./routes/admin.js";
// ─────────────────────────────────────────────────────────────────────────────

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(globalLimiter);

// ── Active routes ─────────────────────────────────────────────────────────────
app.use("/api/tools",   toolsRoutes);
app.use("/api/blog",    blogRoutes);
app.use("/api/contact", contactRoutes);

// ── PRO VERSION ROUTE REGISTRATIONS (commented out) ──────────────────────────
// app.use("/api/auth",      authRoutes);
// app.use("/api/payments",  paymentsRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/admin",     adminRoutes);
// ─────────────────────────────────────────────────────────────────────────────

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Keep-alive ping for Render free tier (pings itself every 14 min)
if (process.env.NODE_ENV === "production" && process.env.BACKEND_URL) {
  setInterval(() => {
    fetch(`${process.env.BACKEND_URL}/api/health`).catch(() => {});
  }, 14 * 60 * 1000);
}

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