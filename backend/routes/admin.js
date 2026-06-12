import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Payment, Subscription } from "../models/Payment.js";
import { ToolUsage } from "../models/ToolUsage.js";

const router = express.Router();

// All admin routes require admin role
router.use(authenticate, requireRole("admin"));

// GET /api/admin/users
router.get("/users", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    if (role)   filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).select("-__v"),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH /api/admin/users/:uid/role
router.patch("/users/:uid/role", async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user","premium","admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });
    const user = await User.findOneAndUpdate({ uid: req.params.uid }, { role }, { new: true });
    res.json(user);
  } catch (err) { next(err); }
});

// GET /api/admin/payments
router.get("/payments", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [payments, total] = await Promise.all([
      Payment.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Payment.countDocuments(),
    ]);
    res.json({ payments, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/admin/tool-stats
router.get("/tool-stats", async (req, res, next) => {
  try {
    const stats = await ToolUsage.aggregate([
      { $group: { _id: "$tool", count: { $sum: 1 }, avgDuration: { $avg: "$duration" }, failures: { $sum: { $cond: ["$success", 0, 1] } } } },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (err) { next(err); }
});

export default router;
