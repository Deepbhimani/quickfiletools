import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { ToolUsage } from "../models/ToolUsage.js";
import { Payment } from "../models/Payment.js";

const router = express.Router();

// POST /api/analytics/event — track frontend events
router.post("/event", async (req, res) => {
  // Lightweight event sink — extend with GA4 Measurement Protocol if needed
  res.json({ ok: true });
});

// GET /api/analytics/dashboard — admin only
router.get("/dashboard", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const now       = new Date();
    const todayStart= new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, proUsers, activeToday, filesProcessed, revenueData, toolStats] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "premium" }),
      ToolUsage.distinct("userId", { createdAt: { $gte: todayStart } }).then((r) => r.length),
      ToolUsage.countDocuments({ success: true }),
      Payment.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      ToolUsage.aggregate([
        { $group: { _id: "$tool", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({
      totalUsers,
      proUsers,
      activeToday,
      filesProcessed,
      totalRevenue: ((revenueData[0]?.total || 0) / 100).toFixed(2),
      popularTool:  toolStats[0]?._id || "—",
      toolStats,
    });
  } catch (err) { next(err); }
});

export default router;
