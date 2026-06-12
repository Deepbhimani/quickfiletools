import express from "express";
import { body, validationResult } from "express-validator";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { User } from "../models/User.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const router = express.Router();

// POST /api/auth/register — called after Firebase signup to sync profile to MongoDB
router.post("/register", authLimiter, authenticate,
  [body("name").trim().notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { name } = req.body;

      // Upsert: create if not exists, return existing if already there
      const existing = await User.findOne({ uid: req.user.uid });
      if (existing) return res.json(existing);

      const user = await User.create({
        uid:   req.user.uid,
        email: req.user.email,
        name,
      });

      await sendWelcomeEmail(req.user.email, name).catch(() => {});
      res.status(201).json(user);
    } catch (err) { next(err); }
  }
);

// GET /api/auth/profile — auto-creates user in MongoDB if they don't exist yet
router.get("/profile", authenticate, async (req, res, next) => {
  try {
    // Try to find existing user
    let user = await User.findOne({ uid: req.user.uid }).select("-__v");

    // Auto-create if not found (handles users who logged in via Firebase but never called /register)
    if (!user) {
      const name =
        req.user.name ||
        req.user.email?.split("@")[0] ||
        "User";

      user = await User.create({
        uid:          req.user.uid,
        email:        req.user.email,
        name,
        photoURL:     req.user.picture || null,
        emailVerified: req.user.email_verified || false,
      });

      // Send welcome email in background — don't block the response
      sendWelcomeEmail(req.user.email, name).catch(() => {});

      console.log(`[auth] Auto-created user: ${req.user.email}`);
    }

    res.json(user);
  } catch (err) { next(err); }
});

// PUT /api/auth/profile
router.put("/profile", authenticate,
  [body("name").optional().trim().notEmpty()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const allowed = ["name", "photoURL"];
      const updates = Object.fromEntries(
        Object.entries(req.body).filter(([k]) => allowed.includes(k))
      );
      const user = await User.findOneAndUpdate(
        { uid: req.user.uid },
        updates,
        { new: true }
      );
      res.json(user);
    } catch (err) { next(err); }
  }
);

// DELETE /api/auth/account
router.delete("/account", authenticate, async (req, res, next) => {
  try {
    await User.findOneAndDelete({ uid: req.user.uid });
    res.json({ message: "Account deleted" });
  } catch (err) { next(err); }
});

export default router;